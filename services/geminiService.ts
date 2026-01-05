
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPTS } from "../constants";
import { BusinessConfig, Product, BotTone } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateResponse(
    userInput: string,
    config: BusinessConfig,
    products: Product[],
    chatHistory: { role: string; text: string }[]
  ) {
    const tonePrompt = SYSTEM_PROMPTS[config.tone] || SYSTEM_PROMPTS.mtaa;
    const basePrompt = SYSTEM_PROMPTS.BASE(config.name, config.location);

    // Knowledge Injection
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
      4. Detect the language used (Sheng, Swahili, or English) and reply in a matching or requested tone.
      5. If the user changes language, you may adapt but keep the core tone style.
    `;

    try {
      // Normalize roles for Gemini API: 'bot' becomes 'model'
      const normalizedHistory = chatHistory.map(h => ({
        role: h.role === 'bot' ? 'model' : 'user',
        parts: [{ text: h.text }]
      }));

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...normalizedHistory,
          { role: 'user', parts: [{ text: userInput }] }
        ],
        config: {
          systemInstruction: fullSystemInstruction,
          temperature: 0.7,
        }
      });

      return {
        text: response.text || "Pole sana, sijapata hiyo. Naweza kusaidia aje kwingine?",
        confidence: 0.95
      };
    } catch (error) {
      console.error("Gemini Error:", error);
      return { text: "Error connecting to service. Please try again.", confidence: 0 };
    }
  }

  async detectLanguage(text: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Identify if this Kenyan text is SHENG, KISWAHILI, or ENGLISH. Respond with ONLY the word. Text: "${text}"`,
      });
      return response.text?.trim().toUpperCase() || 'UNKNOWN';
    } catch (error) {
      console.error("Language Detection Error:", error);
      return 'UNKNOWN';
    }
  }
}

export const geminiService = new GeminiService();
