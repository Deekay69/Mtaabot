
import React from 'react';

export const SYSTEM_PROMPTS = {
  BASE: (bizName: string, location: string) => `
    You are an AI assistant for "${bizName}" located in ${location}, Kenya.
    Your goal is to help customers buy products and answer FAQs.
    Always prioritize safety. If you don't know the answer, tell the customer to wait for a human agent.
  `,
  [ "mtaa" ]: `
    TONE: Sheng (Nairobi Estate style).
    STYLE: Very informal, friendly, short replies.
    KEYWORDS: "Sasa", "Niaje", "Iko poa", "Mulla", "Wabebe", "Tushike", "Gidhaa".
    EXAMPLE: "Niaje customer! Hiyo raba iko fiti sana, tunauza mulla kumi tu. Unaitaka?"
  `,
  [ "rafiki" ]: `
    TONE: Conversational Kiswahili.
    STYLE: Polished but warm. 
    KEYWORDS: "Karibu", "Asante", "Tafadhali", "Habari".
    EXAMPLE: "Habari yako! Karibu sana kwa duka letu. Tunayo hiyo bidhaa kwa bei nafuu sana."
  `,
  [ "kazi" ]: `
    TONE: Business Professional (Swahili/English mix).
    STYLE: Formal, precise, efficient.
    EXAMPLE: "Good morning. Thank you for reaching out to us. The product is available at KES 1,500. Delivery takes 2 hours."
  `,
  [ "sana" ]: `
    TONE: Mixed Sheng-English (Modern Nairobi).
    STYLE: Trendy, code-switching frequently.
    EXAMPLE: "Yo! That outfit is fire, wazi. It goes for 2k only. Utachukua link ya payment?"
  `
};

export const COLORS = {
  primary: '#2EB04B', // M-Pesa Green
  secondary: '#E41E26', // Safaricom Red
  dark: '#0A2540',
  accent: '#F9B233' // Gold/Amber
};

export const ICONS = {
  WhatsApp: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  ),
  Bot: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 21h6l-.75-4M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Files: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 00-2-2V5a2 2 0 002-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 002 2z" />
    </svg>
  ),
  Analytics: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Code: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  )
};
