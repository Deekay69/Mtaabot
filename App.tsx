import React, { useState, useEffect, useRef } from 'react';
import { SignedIn, SignedOut, SignIn, UserButton, useAuth, useOrganization } from '@clerk/clerk-react';
import { ICONS, COLORS } from './constants';
import { BotTone, BusinessConfig, Product, ChatLog } from './types';
// Remove direct gemini service import on frontend for security
// import { geminiService } from './services/geminiService';

// --- Sub-Components ---

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const menuItems = [
    { id: 'overview', icon: ICONS.Analytics, label: 'Overview' },
    { id: 'whatsapp', icon: ICONS.WhatsApp, label: 'Conversations' },
    { id: 'knowledge', icon: ICONS.Files, label: 'Knowledge Base' },
    { id: 'bot', icon: ICONS.Bot, label: 'MtaaBot Config' },
    { id: 'dev', icon: ICONS.Code, label: 'Developers' },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col text-white fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-green-500">Mtaa</span>Bot
        </h1>
        <p className="text-xs text-slate-400 mt-1">Smart Kenyan Business AI</p>
      </div>
      <nav className="flex-1 mt-6">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-6 py-4 transition-colors ${activeTab === item.id ? 'bg-green-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <item.icon />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">Mama Mboga Ltd</p>
            <p className="text-xs text-slate-500">Pro Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeveloperTools = () => {
  const [apiKey, setApiKey] = useState('mb_live_2a98f107c...882');
  const [showKey, setShowKey] = useState(false);
  const [viewSource, setViewSource] = useState(false);

  const webhookSource = `
export const handleIncomingMessage = async (req: any, res: any) => {
  const { from, text } = parseMetaPayload(req.body);
  const aiResponse = await gemini.generateResponse(text, smeConfig);
  await sendWhatsApp(from, aiResponse.text);
  res.sendStatus(200);
};`.trim();

  const schemaTables = [
    { name: 'businesses', fields: ['id', 'name', 'location', 'tone', 'status'] },
    { name: 'products', fields: ['id', 'biz_id', 'name', 'price', 'is_available', 'vector_id'] },
    { name: 'messages', fields: ['id', 'conv_id', 'role', 'content', 'lang', 'confidence'] },
    { name: 'subscriptions', fields: ['id', 'biz_id', 'tier', 'ends_at', 'mpesa_ref'] },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold">API & Webhook Configuration</h3>
          <button
            onClick={() => setViewSource(!viewSource)}
            className="text-xs font-bold text-green-600 border border-green-200 px-3 py-1 rounded hover:bg-green-50"
          >
            {viewSource ? 'Hide Code' : 'View Source'}
          </button>
        </div>

        {viewSource ? (
          <div className="mb-6 animate-in slide-in-from-top duration-300">
            <label className="block text-sm font-bold text-slate-700 mb-2">Production Webhook Logic (Node.js)</label>
            <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg text-xs font-mono overflow-x-auto">
              {webhookSource}
            </pre>
          </div>
        ) : null}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Your Webhook URL</label>
            <div className="flex gap-2">
              <input
                readOnly
                value="https://api.mtaabot.co.ke/v1/webhook/whatsapp/mama-mboga-123"
                className="flex-1 p-3 bg-slate-50 border rounded-lg font-mono text-sm text-slate-600 outline-none"
              />
              <button className="bg-slate-100 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200">Copy</button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Paste this into your Meta Business App Dashboard to connect WhatsApp.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">MtaaBot API Key</label>
            <div className="flex gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                readOnly
                value={apiKey}
                className="flex-1 p-3 bg-slate-50 border rounded-lg font-mono text-sm text-slate-600 outline-none"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="bg-slate-100 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-4">Relational Data Model</h3>
        <p className="text-sm text-slate-500 mb-6">Core database tables used in the MtaaBot production environment.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {schemaTables.map((table, i) => (
            <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 font-bold text-xs uppercase text-slate-600 border-b">
                {table.name}
              </div>
              <div className="p-4 space-y-1">
                {table.fields.map((f, j) => (
                  <div key={j} className="text-xs font-mono text-slate-500 flex justify-between">
                    <span>{f}</span>
                    {f === 'id' && <span className="text-[10px] bg-slate-200 text-slate-700 px-1 rounded">PK</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 text-slate-300 p-8 rounded-xl shadow-lg border border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-white">Endpoint Health</h4>
          <span className="text-xs bg-green-900 text-green-400 px-2 py-1 rounded-full font-bold">ALL SYSTEMS UP</span>
        </div>
        <div className="space-y-3">
          {[
            { name: 'WhatsApp Ingestion', status: '200 OK', lat: '42ms' },
            { name: 'Gemini Logic Layer', status: '200 OK', lat: '158ms' },
            { name: 'RAG Retrieval', status: '200 OK', lat: '84ms' },
            { name: 'M-Pesa Gateway', status: '200 OK', lat: '110ms' },
          ].map((sys, idx) => (
            <div key={idx} className="flex justify-between text-xs py-2 border-b border-slate-800 last:border-0">
              <span>{sys.name}</span>
              <div className="flex gap-4">
                <span className="text-green-500 font-mono">{sys.status}</span>
                <span className="text-slate-500 font-mono">{sys.lat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DashboardOverview = () => {
  const stats = [
    { label: 'Total Queries', value: '1,284', change: '+12%', color: 'text-green-500' },
    { label: 'AI Resolution Rate', value: '88%', change: '+5%', color: 'text-blue-500' },
    { label: 'Human Escalations', value: '42', change: '-8%', color: 'text-orange-500' },
    { label: 'Language: Sheng', value: '62%', change: '+15%', color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-slate-500 text-sm font-medium">{s.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-3xl font-bold">{s.value}</h3>
              <span className={`text-xs font-bold ${s.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {s.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-4">Production Blueprint: MtaaBot Architecture</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm leading-relaxed">
          <div className="space-y-3">
            <h4 className="font-bold text-green-700">1. Ingestion</h4>
            <p className="text-slate-600">WhatsApp Webhook receives JSON &rarr; API Gateway validates &rarr; Queues message for processing.</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-blue-700">2. Intelligence</h4>
            <p className="text-slate-600">Gemini detects language + Sheng dialect. RAG pulls local context from Pinecone Vector DB.</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-orange-700">3. Delivery</h4>
            <p className="text-slate-600">Response generated via Prompt Orchestrator. Final message pushed back to Meta API.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BotSimulator = ({ products, config }: { products: Product[], config: BusinessConfig }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string; language?: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsgText = input;
    setInput('');

    // Add user message to history
    const updatedMessages = [...messages, { role: 'user' as const, text: userMsgText }];
    setMessages(updatedMessages);

    setIsTyping(true);

    try {
      const token = await getToken();
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      const response = await fetch(`${baseUrl}/api/chat/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMsgText,
          config,
          products,
          history: updatedMessages.map(m => ({ role: m.role, text: m.text }))
        })
      });

      if (!response.ok) throw new Error('Backend failed');

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'bot',
        text: data.text,
        language: data.language
      }]);
    } catch (error) {
      console.error("Simulation error:", error);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "Pole sana, kuna tatizo kidogo. Hebu jaribu tena baada ya kitambo."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-[#E5DDD5] h-[600px] rounded-xl flex flex-col shadow-inner border-[12px] border-slate-800 overflow-hidden max-w-md mx-auto relative">
      <div className="bg-[#075E54] p-4 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-800 font-bold">MB</div>
        <div>
          <h4 className="font-bold text-sm">MtaaBot - {config.name}</h4>
          <p className="text-[10px] opacity-80">Online • Typically replies in seconds</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-4 space-y-3 overflow-y-auto">
        <div className="bg-[#D9FDD3] p-3 rounded-lg text-xs shadow-sm max-w-[85%] self-start border border-green-100">
          Karibu! Unaweza kuuliza maswali kuhusu bei au bidhaa zetu. Tuko hapa kukusaidia!
        </div>

        {messages.map((m, idx) => (
          <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`p-3 rounded-lg text-sm shadow-sm max-w-[85%] ${m.role === 'user' ? 'bg-white rounded-tr-none' : 'bg-[#D9FDD3] rounded-tl-none border border-green-100'}`}>
              {m.text}
              {m.language && m.role === 'bot' && (
                <div className="mt-1 text-[8px] text-slate-500 font-bold uppercase tracking-widest border-t pt-1 border-green-200">
                  Detected: {m.language}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="bg-[#D9FDD3] p-2 rounded-lg text-xs shadow-sm w-fit">
            Typing...
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-50 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message (Sheng/Eng/Swah)..."
          className="flex-1 bg-white px-4 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button onClick={handleSend} className="bg-[#128C7E] text-white p-2 rounded-full hover:opacity-90 transition-opacity">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </button>
      </div>
    </div>
  );
};

const KnowledgeBase = ({ products, setProducts }: { products: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>> }) => {
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const addProduct = () => {
    if (!newName || !newPrice) return;
    const p: Product = {
      id: Date.now().toString(),
      name: newName,
      price: parseInt(newPrice),
      availability: true,
      description: 'Standard inventory item'
    };
    setProducts(prev => [...prev, p]);
    setNewName('');
    setNewPrice('');
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Product Catalog</h3>
          <p className="text-sm text-slate-500">Items MtaaBot knows about</p>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Item name"
            className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <input
            placeholder="Price (KES)"
            type="number"
            className="px-3 py-2 border rounded-lg text-sm w-32 focus:ring-2 focus:ring-green-500 outline-none"
            value={newPrice}
            onChange={e => setNewPrice(e.target.value)}
          />
          <button
            onClick={addProduct}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Product Name</th>
              <th className="px-6 py-3">Price (KES)</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4">{p.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold">AVAILABLE</span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => removeProduct(p.id)} className="text-red-500 hover:text-red-700 font-bold text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No products uploaded. AI will use general business knowledge.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BotSettings = ({ config, setConfig }: { config: BusinessConfig, setConfig: React.Dispatch<React.SetStateAction<BusinessConfig>> }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-6 animate-in fade-in duration-500">
      <h3 className="text-xl font-bold">MtaaBot Configuration</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Business Name</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={config.name}
            onChange={e => setConfig({ ...config, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={config.location}
            onChange={e => setConfig({ ...config, location: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Response Tone</label>
          <select
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
            value={config.tone}
            onChange={e => setConfig({ ...config, tone: e.target.value as BotTone })}
          >
            <option value={BotTone.MTAA}>Sheng / Mtaa (Informal)</option>
            <option value={BotTone.RAFIKI}>Friendly Swahili</option>
            <option value={BotTone.KAZI}>Business Professional</option>
            <option value={BotTone.SANA}>Mixed Sheng-English (Trendy)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">WhatsApp Number</label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="+254 7XX XXX XXX"
            value={config.whatsappNumber}
            onChange={e => setConfig({ ...config, whatsappNumber: e.target.value })}
          />
        </div>
      </div>
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
        <strong>Pro-tip:</strong> Nairobi-based youth shops perform best with <em>Sheng / Mtaa</em> tone, while Coastal businesses often prefer <em>Friendly Swahili</em>.
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Original Levi Jeans', price: 2500, availability: true, description: 'Direct from US' },
    { id: '2', name: 'Nike Air Max', price: 6000, availability: true, description: 'Limited Edition' },
    { id: '3', name: 'Cargo Pants', price: 1800, availability: true, description: 'All sizes' },
  ]);
  const [config, setConfig] = useState<BusinessConfig>({
    name: "Mtaa Fashion Hub",
    location: "Nairobi, Eastlands",
    tone: BotTone.MTAA,
    whatsappNumber: "+254700000000",
    type: "Fashion"
  });

  return (
    <>
      <SignedIn>
        <div className="min-h-screen flex bg-slate-50">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="flex-1 ml-64 p-10">
            <header className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900">
                  {activeTab === 'overview' && 'Dashboard Overview'}
                  {activeTab === 'whatsapp' && 'Live Bot Simulator'}
                  {activeTab === 'knowledge' && 'Knowledge Center'}
                  {activeTab === 'bot' && 'Bot Customization'}
                  {activeTab === 'dev' && 'Developer & API'}
                </h2>
                <p className="text-slate-500">Managing MtaaBot for {config.name}</p>
              </div>
              <button className="bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-all active:scale-95">
                Sync to WhatsApp
              </button>
            </header>

            {activeTab === 'overview' && <DashboardOverview />}

            {activeTab === 'whatsapp' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold mb-2">Simulate Customer Journey</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Test your bot's responses in real-time. Try asking in Sheng (e.g., "Niaje, raba ni ngapi?") or English.
                      This uses the Gemini-Powered Kenyan Core logic with full multi-turn memory.
                    </p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <h4 className="font-bold text-green-800 text-sm mb-2">System Health</h4>
                    <div className="flex items-center gap-2 text-xs text-green-700">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Webhook Active (whatsapp-webhook-v1)
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-700 mt-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Gemini API Connection: Stable (Latency 180ms)
                    </div>
                  </div>
                </div>
                <BotSimulator products={products} config={config} />
              </div>
            )}

            {activeTab === 'knowledge' && <KnowledgeBase products={products} setProducts={setProducts} />}

            {activeTab === 'bot' && <BotSettings config={config} setConfig={setConfig} />}

            {activeTab === 'dev' && <DeveloperTools />}

            <footer className="mt-20 pt-10 border-t border-slate-200 text-slate-400 text-xs flex justify-between">
              <p>© 2024 MtaaBot Technologies Ltd. Designed for Kenyan Biasharas.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-green-600">Privacy Policy</a>
                <a href="#" className="hover:text-green-600">Merchant Agreement</a>
                <a href="#" className="hover:text-green-600">Help Center</a>
              </div>
            </footer>
          </main>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <div className="max-w-md w-full">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="text-green-500">Mtaa</span>Bot
              </h1>
              <p className="text-slate-400 text-sm">Empowering Kenyan Businesses with AI</p>
            </div>
            <div className="bg-white p-2 rounded-2xl shadow-2xl">
              <SignIn routing="hash" />
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
}
