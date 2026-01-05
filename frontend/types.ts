
export enum BotTone {
  MTAA = 'mtaa', // Sheng / Informal
  RAFIKI = 'rafiki', // Friendly Swahili
  KAZI = 'kazi', // Professional Swahili/English
  SANA = 'sana' // Mixed (Sheng-English)
}

export interface Product {
  id: string;
  name: string;
  price: number;
  availability: boolean;
  description: string;
}

export interface ChatLog {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
  language: string;
  confidence: number;
}

export interface BusinessConfig {
  name: string;
  type: string;
  location: string;
  tone: BotTone;
  whatsappNumber: string;
}
