
import { geminiService } from './geminiService';
import { BusinessConfig, Product } from '../types';

export const simulateWebhookLifecycle = async (
  message: string, 
  config: BusinessConfig, 
  products: Product[]
) => {
  console.group("🚀 MtaaBot Webhook Lifecycle");
  
  console.log("1. [META] Incoming POST Request received.");
  console.log("2. [AUTH] Validating Meta-Signature-256 header...");
  
  const lang = await geminiService.detectLanguage(message);
  console.log(`3. [AI] Language Analysis complete. Detected: ${lang}`);
  
  console.log("4. [RAG] Fetching SME Knowledge Base from Vector DB...");
  const searchResults = products.filter(p => 
    message.toLowerCase().includes(p.name.toLowerCase())
  );
  console.log(`   Found ${searchResults.length} context matches.`);
  
  console.log("5. [LLM] Executing Gemini-3-flash with Kenyan Prompt Context...");
  const aiResponse = await geminiService.generateResponse(message, config, products, []);
  
  console.log("6. [META] Response payload ready. Calling /messages endpoint.");
  console.log("7. [OUTBOUND] Success: 200 OK. Message delivered to customer.");
  
  console.groupEnd();
  
  return aiResponse;
};
