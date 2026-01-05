
# MtaaBot: Hyper-Local WhatsApp AI Strategy

## 1. LLM Strategy: Gemini First
We use Gemini-3-flash-preview as the primary engine for its superior multilingual capabilities, specifically its ability to grasp the nuances of East African dialects (Sheng/Swahili) without extensive fine-tuning.

### Sheng Preservation
- **Detection**: We use a classifier prompt to detect "Slang Density".
- **Dynamic Context**: We maintain a "Slang Dictionary" in our RAG layer that updates based on trending Nairobi terms (e.g., "Gidhaa" vs "Time").

## 2. RAG Implementation
- **Chunking**: Product lists are chunked by Item + Description.
- **Embeddings**: Text-embedding-004.
- **Vector DB**: Pinecone (Serverless) for scalability.
- **Pipeline**: Query -> Context Retrieval -> Prompt Injection -> Gemini -> Output.

## 3. 30-Day MVP Plan

| Week | Goal | Tasks |
|------|------|-------|
| 1 | Infrastructure | Set up WhatsApp Business API, AWS Lambda/Vercel, Pinecone DB. |
| 2 | AI Core | Implement Gemini Prompt Orchestrator + Sheng Detection logic. |
| 3 | SME Dashboard | Build the React Dashboard for product uploads and log viewing. |
| 4 | Testing & Beta | Pilot with 5 Nairobi shops (Hardware, Fashion, Salon). |

## 4. Monetization (KES)
- **Lite (KES 750/mo)**: 500 messages, Basic RAG.
- **Pro (KES 2,500/mo)**: 5,000 messages, Advanced Analytics, Human-in-the-loop escalation.
- **Enterprise**: Custom pricing for franchises.
