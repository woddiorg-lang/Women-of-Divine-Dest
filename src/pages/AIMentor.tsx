import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '../lib/utils';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const CATEGORIES = [
  "Career Guidance", "Business Strategy", "Digital Skills Help", 
  "Financial Planning", "Parenting & Family", "Mental Health & Wellbeing", 
  "Faith & Purpose", "Relationships", "Leadership Development", 
  "Community Impact", "Study & Learning", "Entrepreneurship", 
  "Health & Wellness", "Life Coaching"
];

interface Message {
  role: 'wadi' | 'user';
  text: string;
}

export default function AIMentor() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ai' | 'human'>('ai');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'wadi', text: "Hello! I am WADI, your WODDI AI Digital Intelligence. How can I support you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const chatContents = messages.map(m => ({
        role: m.role === 'wadi' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));
      chatContents.push({ role: 'user', parts: [{ text: userMsg }] });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: chatContents as any,
        config: {
          systemInstruction: "You are WADI — WODDI AI Digital Intelligence. You are a warm, empowering AI mentor for African women on the WODDI Institute platform. You provide guidance across 14 categories: Career, Business, Digital Skills, Finance, Parenting, Mental Health, Faith, Relationships, Leadership, Community, Learning, Entrepreneurship, Health, and Life Coaching. You are culturally aware, speak to African context, and always uplift and empower. Keep your responses concise (under 150 words) and actionable. Do not output 'WADI:' at the beginning of your response.",
        }
      });
      
      const text = response.text || "I'm sorry, I encountered an error. Please try again.";
      setMessages(prev => [...prev, { role: 'wadi', text: text.trim() }]);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.message || "I'm having trouble connecting right now. Please try again in a moment.";
      const displayMessage = errorMessage.includes("API key expired") 
        ? "The Gemini API key has expired. Please navigate to Settings to renew or provide a valid API key."
        : `Connection error: ${errorMessage}`;
      setMessages(prev => [...prev, { role: 'wadi', text: displayMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F0F0F]">
      <div className="bg-white dark:bg-[#1A1A1A] px-4 py-3 flex flex-col space-y-4 border-b border-gray-100 dark:border-zinc-800 shrink-0">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-2 text-[#D4006A] dark:text-[#D4006A]">
            <Bot size={24} />
            <h1 className="text-xl font-display font-bold">WADI <span className="text-gray-900 dark:text-white">— AI Mentor</span></h1>
          </div>
        </div>

        <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('ai')}
            className={cn(
              "flex-1 py-1.5 text-sm font-semibold rounded shadow-sm transition-colors",
              activeTab === 'ai' ? "bg-white dark:bg-[#27272A] dark:text-white" : "text-gray-500 bg-transparent shadow-none"
            )}
          >
            AI Mentor
          </button>
          <button 
            onClick={() => setActiveTab('human')}
            className={cn(
              "flex-1 py-1.5 text-sm font-semibold rounded shadow-sm transition-colors",
              activeTab === 'human' ? "bg-white dark:bg-[#27272A] dark:text-white" : "text-gray-500 bg-transparent shadow-none"
            )}
          >
            Human Mentors
          </button>
        </div>
      </div>

      {activeTab === 'ai' ? (
        <>
          <div className="bg-white dark:bg-[#1A1A1A] border-b border-gray-100 dark:border-zinc-800 py-2 px-1 shrink-0">
            <div className="flex overflow-x-auto no-scrollbar space-x-2 px-3">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setInput(`I need guidance on ${cat}.`)}
                  className="px-3 py-1.5 bg-pink-50 dark:bg-[#D4006A]/10 text-[#D4006A] border border-pink-100 dark:border-[#D4006A]/20 rounded-full text-[10px] font-bold whitespace-nowrap"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] rounded-2xl p-3 text-sm shadow-sm",
                  msg.role === 'user' 
                    ? "bg-[#D4006A] text-white rounded-br-sm" 
                    : "bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-zinc-800 text-gray-800 dark:text-gray-200 rounded-bl-sm"
                )}>
                  {msg.role === 'wadi' && (
                    <div className="flex items-center space-x-2 mb-1.5 text-[#D4006A]">
                      <Bot size={14} />
                      <span className="font-bold text-[10px] uppercase">WADI</span>
                    </div>
                  )}
                  {msg.role === 'wadi' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-zinc-800 rounded-2xl rounded-bl-sm p-3 shadow-sm">
                   <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#D4006A] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#D4006A] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-[#D4006A] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                   </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-white dark:bg-[#1A1A1A] p-4 border-t border-gray-100 dark:border-zinc-800 pb-safe shrink-0">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask WADI anything..." 
                className="w-full pl-4 pr-12 py-3.5 bg-gray-100 dark:bg-zinc-900 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#D4006A] outline-none dark:text-white"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 p-2 bg-[#D4006A] text-white rounded-xl disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center space-y-4">
           {/* Mock empty state for Human Mentors */}
           <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-400">
              <User size={32} />
           </div>
           <h2 className="text-xl font-display font-bold text-center dark:text-white">Human Mentors</h2>
           <p className="text-gray-500 text-center text-sm max-w-xs">
             You haven't requested any human mentors yet. Connect with a WODDI tutor for 1-on-1 guidance.
           </p>
           <button className="py-3 px-6 bg-[#D4006A] text-white rounded-xl font-bold font-sans mt-2 active:scale-95 transition-transform">
             Request a Human Mentor
           </button>
        </div>
      )}
    </div>
  );
}
