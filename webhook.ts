
/**
 * MtaaBot Production Webhook - Node.js/Express Example
 * This code would typically run on a server (e.g., AWS Lambda, Vercel, or DigitalOcean).
 */

import { geminiService } from './services/geminiService';

// 1. Meta Webhook Verification (GET)
// Meta sends a GET request to your endpoint to verify it's active.
export const verifyWebhook = (req: any, res: any) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // This token must match what you set in the Meta App Dashboard
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};

// 2. Incoming Message Handler (POST)
export const handleIncomingMessage = async (req: any, res: any) => {
  const body = req.body;

  // Basic validation to ensure it's a WhatsApp message
  if (body.object === 'whatsapp_business_account') {
    if (body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const msg = body.entry[0].changes[0].value.messages[0];
      const from = msg.from; // Customer's phone number
      const text = msg.text?.body; // Customer's message
      const businessId = body.entry[0].id;

      if (text) {
        try {
          // --- KNOWLEDGE & TONE FETCHING ---
          // In production, fetch config/products from your DB (e.g. Postgres) using businessId
          const businessConfig = { 
            name: "Mtaa Hub", 
            location: "Nairobi", 
            tone: "mtaa", 
            whatsappNumber: "254..." 
          } as any;
          const products = [] as any; // Fetch from DB

          // --- AI RESPONSE GENERATION ---
          const response = await geminiService.generateResponse(
            text, 
            businessConfig, 
            products, 
            [] // Pass conversation history here
          );

          // --- SENDING RESPONSE TO WHATSAPP ---
          await sendWhatsAppMessage(from, response.text);
        } catch (error) {
          console.error("Failed to process message:", error);
        }
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

// 3. Meta Graph API Helper
async function sendWhatsAppMessage(to: string, message: string) {
  const url = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  
  const payload = {
    messaging_product: "whatsapp",
    to: to,
    type: "text",
    text: { body: message }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return response.json();
}
