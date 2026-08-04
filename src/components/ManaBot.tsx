import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, X, MessageSquare, Loader2, Sparkles, User, ChevronLeft,
  FileSpreadsheet, FileText, Database, Users, AlertCircle, Lightbulb, Shield
} from 'lucide-react';
import { askMana } from '../services/geminiService';
import { exportExcelReport, exportPdfReport, fetchLiveDatabaseSnapshot, DatabaseSnapshot } from '../services/dbAnalysisService';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
  dbSnapshot?: DatabaseSnapshot;
}

export function ManaBot({ currentTab, userName }: { currentTab: string, userName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: `నమస్కారం ${userName || ''}! నేను E-VEDHIKA AI అసిస్టెంట్‌ని. 

పోర్టల్ డేటాబేస్‌లోని **Users, Reports, Security Logs, Suggestions** గురించి నన్ను అడగవచ్చు లేదా విశ్లేషణ, **Excel/PDF రిపోర్టులు** జనరేట్ చేయమని కోరవచ్చు.

(Hello! I'm E-VEDHIKA AI. Ask me to analyze database users, reports, security logs, community suggestions, or export PDF/Excel reports!)`,
      sender: 'bot',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: promptText,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const context = `The user is currently on the "${currentTab}" tab. The user's name is ${userName || 'Anonymous'}.`;
    const res = await askMana(promptText, context);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: res.text || 'క్షమించాలి, స్పందన నమోదు కాలేదు.',
      sender: 'bot',
      timestamp: Date.now(),
      dbSnapshot: res.dbSnapshot
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleSend = () => {
    handleSendPrompt(input);
  };

  const handleDirectExportExcel = async (snapshot?: DatabaseSnapshot) => {
    let snap = snapshot;
    if (!snap) {
      setIsLoading(true);
      snap = await fetchLiveDatabaseSnapshot();
      setIsLoading(false);
    }
    exportExcelReport(snap, 'E-VEDHIKA_Live_Database_Report');
  };

  const handleDirectExportPdf = async (snapshot?: DatabaseSnapshot) => {
    let snap = snapshot;
    if (!snap) {
      setIsLoading(true);
      snap = await fetchLiveDatabaseSnapshot();
      setIsLoading(false);
    }
    exportPdfReport(snap, 'E-VEDHIKA Database Analytics Report');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[95vw] max-w-[360px] md:w-[420px] md:max-w-none h-[550px] bg-white rounded-[32px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden relative"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight leading-tight flex items-center gap-1.5">
                    E-VEDHIKA AI Assistant
                    <span className="bg-emerald-500/30 text-emerald-200 text-[9px] px-1.5 py-0.5 rounded-full font-mono border border-emerald-400/30">
                      Live DB
                    </span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest leading-none">
                      Connected to Database
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Action Chips Bar */}
            <div className="bg-slate-100/80 px-3 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-bold text-slate-700">
              <button
                onClick={() => handleSendPrompt("డేటాబేస్ లోని Users, Reports, Suggestions, Logs గురించి పూర్తి సమాచారం & విశ్లేషణ ఇవ్వండి.")}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-lg flex items-center gap-1 whitespace-nowrap transition-all shadow-xs"
              >
                <Database size={12} className="text-indigo-600" />
                <span>DB విశ్లేషణ</span>
              </button>
              <button
                onClick={() => handleSendPrompt("పోర్టల్ నందు నమోదైన Reports / Complaints వివరాలు చెప్పండి.")}
                className="px-2.5 py-1 bg-white hover:bg-amber-50 hover:text-amber-700 border border-slate-200 rounded-lg flex items-center gap-1 whitespace-nowrap transition-all shadow-xs"
              >
                <AlertCircle size={12} className="text-amber-600" />
                <span>రిపోర్టులు</span>
              </button>
              <button
                onClick={() => handleSendPrompt("యూజర్లు (Users) మరియు వారి హోదాలు విశ్లేషించండి.")}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg flex items-center gap-1 whitespace-nowrap transition-all shadow-xs"
              >
                <Users size={12} className="text-blue-600" />
                <span>యూజర్లు</span>
              </button>
              <button
                onClick={() => handleSendPrompt("సూచనలు (Suggestions) విశ్లేషించి వివరాలు ఇవ్వండి.")}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-lg flex items-center gap-1 whitespace-nowrap transition-all shadow-xs"
              >
                <Lightbulb size={12} className="text-emerald-600" />
                <span>సూచనలు</span>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth bg-slate-50/50">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[88%] rounded-2xl p-4 text-sm shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                    }`}
                  >
                    <div className="prose prose-sm prose-slate max-w-none prose-headings:text-inherit prose-p:leading-relaxed prose-li:my-0">
                      <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>

                    {/* Export Action Buttons inside Bot Message */}
                    {msg.sender === 'bot' && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleDirectExportExcel(msg.dbSnapshot)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                        >
                          <FileSpreadsheet size={14} className="text-emerald-600" />
                          <span>Export Excel Report</span>
                        </button>

                        <button
                          onClick={() => handleDirectExportPdf(msg.dbSnapshot)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                        >
                          <FileText size={14} className="text-rose-600" />
                          <span>Download PDF Report</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm rounded-tl-none">
                    <Loader2 size={16} className="animate-spin text-indigo-500" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                      డేటాబేస్ విశ్లేషిస్తున్నాను... వేచి ఉండండి
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-100">
              <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about users, reports, logs or request PDF/Excel..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm outline-none font-bold text-slate-700 placeholder:text-slate-400"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-1.5 px-2 leading-tight">
                E-VEDHIKA AI &bull; Database Connected Real-Time Analytics
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-16 h-16 rounded-[24px] shadow-2xl flex items-center justify-center transition-all duration-300 relative group overflow-hidden ${
          isOpen ? 'bg-slate-900 border-4 border-slate-800' : 'bg-indigo-600 border-4 border-indigo-500 hover:rotate-6'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {isOpen ? (
          <X size={28} className="text-white relative z-10" />
        ) : (
          <div className="relative z-10 flex flex-col items-center">
             <Bot size={28} className="text-white drop-shadow-lg" />
             <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-emerald-400 rounded-full border-2 border-indigo-600 animate-ping"></div>
                <div className="w-3 h-3 bg-emerald-400 rounded-full border-2 border-indigo-600 absolute top-0"></div>
             </div>
          </div>
        )}
      </motion.button>
    </div>
  );
}
