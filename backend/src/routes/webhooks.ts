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

export default router;
