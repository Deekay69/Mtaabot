import { Router } from 'express';
import { Webhook } from 'svix';
import { prisma } from '../utils/prisma.js';

const router = Router();

// Clerk Webhook Secret (from Clerk Dashboard)
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET || '';

router.post('/clerk', async (req, res) => {
    if (!WEBHOOK_SECRET) {
        console.error('Missing CLERK_WEBHOOK_SECRET');
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    // req.body is a Buffer because of express.raw() in index.ts
    const payload = req.body.toString();
    const headers = req.headers;

    const svix_id = headers["svix-id"] as string;
    const svix_timestamp = headers["svix-timestamp"] as string;
    const svix_signature = headers["svix-signature"] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({ error: 'Missing svix headers' });
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: any;

    try {
        evt = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error('Webhook verification failed:', err);
        return res.status(400).json({ error: 'Verification failed' });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Clerk Webhook Received: ${eventType}`);

    try {
        // 1. Organization Events -> Sync to Business
        if (eventType === 'organization.created' || eventType === 'organization.updated') {
            const { name, slug } = evt.data;
            await prisma.business.upsert({
                where: { id },
                update: { name },
                create: {
                    id, // Using Clerk Org ID as our Business ID
                    name,
                    location: 'Nairobi', // Default for now
                    type: 'Fashion'
                }
            });
        }

        // 2. User Events -> Sync to User
        if (eventType === 'user.created' || eventType === 'user.updated') {
            const { email_addresses, primary_email_address_id } = evt.data;
            const email = email_addresses.find((e: any) => e.id === primary_email_address_id)?.email_address;

            if (email) {
                // Note: Users might not have a businessId until they join an org
                // This handles loose users if needed, though they usually join orgs.
                await prisma.user.upsert({
                    where: { id },
                    update: { email },
                    create: {
                        id,
                        email,
                        businessId: 'pending' // Placeholder or handle accordingly
                    }
                });
            }
        }

        // 3. Membership Events -> Link User to Business
        if (eventType === 'organizationMembership.created') {
            const { organization, public_user_data, role } = evt.data;
            const businessId = organization.id;
            const userId = public_user_data.user_id;

            await prisma.user.update({
                where: { id: userId },
                data: {
                    businessId,
                    role: role === 'admin' ? 'ADMIN' : 'STAFF'
                }
            });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Prisma Sync Error:', error);
        res.status(500).json({ error: 'Database sync failed' });
    }
});

// --- WHATSAPP WEBHOOK HANDLERS ---

// 4. WhatsApp Verification (GET)
router.get('/whatsapp', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        console.log('WhatsApp Webhook Verified');
        return res.status(200).send(challenge);
    }
    res.sendStatus(403);
});

// 5. WhatsApp Message Handler (POST)
router.post('/whatsapp', async (req, res) => {
    // WhatsApp sends JSON, usually doesn't require raw body signature verification 
    // for simple integrations, but we'll use the parsed body from express.json() 
    // if index.ts routes it correctly.
    // However, index.ts uses express.raw() for /api/webhooks, so we must manually parse it.

    let body;
    try {
        body = JSON.parse(req.body.toString());
    } catch (e) {
        console.error('Failed to parse WhatsApp webhook body');
        return res.sendStatus(400);
    }

    if (body.object === 'whatsapp_business_account') {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];

        if (message) {
            const customerPhone = message.from;
            const text = message.text?.body;
            const whatsappPhoneId = value.metadata?.phone_number_id;

            console.log(`WhatsApp Msg from ${customerPhone} to PhoneID ${whatsappPhoneId}: ${text}`);

            if (text && whatsappPhoneId) {
                try {
                    // 1. Identify Tenant (Business)
                    const business = await prisma.business.findUnique({
                        where: { whatsappPhoneId },
                        include: { products: true }
                    });

                    if (!business) {
                        console.error(`Business not found for PhoneID: ${whatsappPhoneId}`);
                        return res.sendStatus(200); // Must return 200 to Meta
                    }

                    // 2. Persist Incoming Message
                    await prisma.message.create({
                        data: {
                            businessId: business.id,
                            sender: customerPhone,
                            text: text,
                            language: 'unknown', // Gemini will detect
                        }
                    });

                    // 3. Fetch Recent History (Last 5 messages)
                    const history = await prisma.message.findMany({
                        where: {
                            businessId: business.id,
                            sender: customerPhone,
                        },
                        orderBy: { createdAt: 'desc' },
                        take: 10
                    });

                    const mappedHistory = history.reverse().map((m: any) => ({
                        role: m.sender === 'bot' ? 'bot' as const : 'user' as const,
                        text: m.text
                    }));

                    // 4. Generate AI Response
                    const { geminiService } = await import('../services/geminiService.js');
                    const aiResponse = await geminiService.generateResponse(
                        text,
                        {
                            name: business.name,
                            location: business.location || 'Kenya',
                            tone: business.tone as any,
                            whatsappNumber: business.whatsappNumber || '',
                            type: business.type || 'SME'
                        },
                        business.products,
                        mappedHistory
                    );

                    // 5. Send WhatsApp Message
                    const url = `https://graph.facebook.com/v21.0/${whatsappPhoneId}/messages`;
                    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

                    await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            messaging_product: 'whatsapp',
                            to: customerPhone,
                            type: 'text',
                            text: { body: aiResponse.text }
                        })
                    });

                    // 6. Persist Outbound Message
                    await prisma.message.create({
                        data: {
                            businessId: business.id,
                            sender: 'bot',
                            text: aiResponse.text,
                            language: aiResponse.language || 'sw',
                        }
                    });

                } catch (error) {
                    console.error('WhatsApp Processing Error:', error);
                }
            }
        }
        return res.sendStatus(200);
    }
    res.sendStatus(404);
});

export default router;
