import { Router } from 'express';
import { geminiService } from '../services/geminiService.js';
import { requireAuth, requireOrg } from '../middleware/auth.js';

const router = Router();

router.post('/simulate', requireAuth, requireOrg, async (req, res) => {
    const { message, config, products, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await geminiService.generateResponse(
            message,
            config,
            products || [],
            history || []
        );

        res.json(response);
    } catch (error) {
        console.error('Chat Route Error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

router.post('/detect-language', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const language = await geminiService.detectLanguage(text);
        res.json({ language });
    } catch (error) {
        res.status(500).json({ error: 'Failed to detect language' });
    }
});

export default router;
