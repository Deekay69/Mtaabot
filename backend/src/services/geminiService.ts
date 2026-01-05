import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPTS, BotTone } from "../utils/constants.js";

export interface Product {
    id: string;
    name: string;
    price: number;
    availability: boolean;
    description: string;
}

export interface BusinessConfig {
    name: string;
    location: string;
    tone: BotTone;
    whatsappNumber: string;
}

export class GeminiService {
    private genAI: GoogleGenerativeAI;

    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    }

    async generateResponse(
        userInput: string,
        config: BusinessConfig,
        products: Product[],
        chatHistory: { role: string; text: string }[]
    ) {
        const tonePrompt = SYSTEM_PROMPTS[config.tone] || SYSTEM_PROMPTS[BotTone.MTAA];
        const basePrompt = SYSTEM_PROMPTS.BASE(config.name, config.location);

        const productContext = products.length > 0
            ? `AVAILABLE PRODUCTS:\n${products.map(p => `- ${p.name}: KES ${p.price} (${p.availability ? 'Available' : 'Out of Stock'}) - ${p.description}`).join('\n')}`
            : "No product list uploaded yet.";

        const fullSystemInstruction = `
      ${basePrompt}
      ${tonePrompt}
      ${productContext}
      
      CONVERSATION CONTEXT RULES:
      1. You are in a multi-turn conversation. Refer to previous messages to understand user intent.
      2. If a user asks "how much is it?" referring to a product mentioned previously, check the history to identify the product.
      3. Maintain the chosen tone (${config.tone}) throughout the conversation.
      4. Detect the dialect used (Sheng, Swahili, or English) and reply in a matching or requested tone.
    `;

        try {
            const model = this.genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: fullSystemInstruction
            });

            const normalizedHistory = chatHistory.map(h => ({
                role: h.role === 'bot' ? 'model' : 'user',
                parts: [{ text: h.text }]
            }));

            const chat = model.startChat({
                history: normalizedHistory,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                },
            });

            const result = await chat.sendMessage(userInput);
            const response = await result.response;

            return {
                text: response.text() || "Pole sana, sijapata hiyo. Naweza kusaidia aje kwingine?",
                confidence: 0.95
            };
        } catch (error) {
            console.error("Gemini Error:", error);
            return { text: "Error connecting to service. Please try again.", confidence: 0 };
        }
    }

    async detectLanguage(text: string): Promise<string> {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Identify if this Kenyan text is SHENG, KISWAHILI, or ENGLISH. Respond with ONLY the word. Text: "${text}"`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim().toUpperCase() || 'UNKNOWN';
        } catch (error) {
            console.error("Language Detection Error:", error);
            return 'UNKNOWN';
        }
    }
}

export const geminiService = new GeminiService();
