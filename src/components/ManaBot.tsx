import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, Send, X, MessageSquare, Loader2, Key, BookOpen, ShieldCheck,
  FileSpreadsheet, FileText, Database, Users, AlertCircle, Lightbulb, HelpCircle, ExternalLink
} from 'lucide-react';
import { askMana } from '../services/geminiService';
import { exportExcelReport, exportPdfReport, fetchLiveDatabaseSnapshot, DatabaseSnapshot } from '../services/dbAnalysisService';
import { SafeMarkdown as ReactMarkdown } from './SafeMarkdown';
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
  const [showApiKeyGuide, setShowApiKeyGuide] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: `నమస్కారం ${userName || ''}! నేను **E-Vedhika AI Assistant** (ఈ-వేదిక AI అసిస్టెంట్). 

నేను కేవలం E-Vedhika పోర్టల్, పంచాయతీ కార్యదర్శుల విధులు, జీవోలు, UBD ట్రాకర్, రైతు రిజిస్ట్రీ మరియు గ్రామ పంచాయతీ సేవల నాలెడ్జ్ బేస్ నుండి మాత్రమే సమాధానాలు ఇస్తాను.

నన్ను ఏమడిగినా కేవలం E-Vedhika కంటెంట్ నుండి మాత్రమే సమాధానాలు లభిస్తాయి! 👍`,
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

    if (promptText.includes("API Key") || promptText.includes("ఏపీఐ కీ")) {
      setShowApiKeyGuide(true);
    }

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
      {/* API Key Guide Modal */}
      <AnimatePresence>
        {showApiKeyGuide && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[10000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-indigo-700 font-black text-lg">
                  <Key size={22} className="text-amber-500" />
                  <span>GEMINI API Key సెటప్ మార్గదర్శకం</span>
                </div>
                <button 
                  onClick={() => setShowApiKeyGuide(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="py-4 space-y-3 text-sm text-slate-700 leading-relaxed max-h-[70vh] overflow-y-auto pr-1">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-semibold flex items-start gap-2">
                  <ShieldCheck size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>భద్రతా సూచన (Security Rule):</strong> GEMINI_API_KEY ఎప్పుడూ ఫ్రంట్ ఎండ్ కోడ్ లో ఉండకూడదు! కేవలం బ్యాక్ ఎండ్ వాతావరణంలో మాత్రమే సురక్షితంగా సేవ్ చేయాలి.
                  </div>
                </div>

                <p className="font-bold text-slate-900">ఉచితంగా Gemini API Key సృష్టించుకునే విధానం (Step-by-Step):</p>
                <ol className="list-decimal list-inside space-y-2.5 text-xs text-slate-700 font-medium pl-1">
                  <li className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong>స్టెప్ 1:</strong> మొదట Google AI Studio వెబ్‌సైట్‌కి వెళ్ళండి: <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold underline inline-flex items-center gap-1">aistudio.google.com <ExternalLink size={12}/></a>
                  </li>
                  <li className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong>స్టెప్ 2:</strong> మీ గూగుల్ (Gmail) అకౌంట్‌తో లాగిన్ అవ్వండి.
                  </li>
                  <li className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong>స్టెప్ 3:</strong> స్క్రీన్ పైన కనిపించే <strong>'Create API Key'</strong> బటన్‌పై క్లిక్ చేయండి. బిల్లింగ్ లేని ఉచిత ప్రాజెక్ట్‌ను ఎంచుకుని కొత్త API కీ ని జనరేట్ చేయండి.
                  </li>
                  <li className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong>స్టెప్ 4:</strong> ఆ API కీ ని కాపీ చేయండి.
                  </li>
                  <li className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong>స్టెప్ 5:</strong> AI Studio ఇంటర్‌ఫేస్ లోని <strong>Settings Menu &gt; Secrets</strong> విభాగానికి వెళ్ళి <code>GEMINI_API_KEY</code> పేరుతో మీ కీని పేస్ట్ చేసి సేవ్ చేయండి.
                  </li>
                </ol>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-medium">
                  ✨ ఇలా చేయడం వల్ల మీకు రూపాయి కూడా ఛార్జ్ పడదు. ఇది 100% ఉచితంగా లైఫ్‌టైమ్ రన్ అవుతుంది!
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowApiKeyGuide(false)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md"
                >
                  అర్థమైంది (Close)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[95vw] max-w-[360px] md:w-[420px] md:max-w-none h-[560px] bg-white rounded-[32px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden relative"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-700 p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight leading-tight flex items-center gap-1.5">
                    E-Vedhika AI Assistant
                    <span className="bg-emerald-400/30 text-emerald-100 text-[9px] px-1.5 py-0.5 rounded-full font-mono border border-emerald-300/30">
                      Grounded KB
                    </span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold text-teal-100 uppercase tracking-widest leading-none">
                      Free Tier Gemini
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowApiKeyGuide(true)}
                  title="Gemini API Key Setup Guide"
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white text-xs flex items-center gap-1 px-2"
                >
                  <Key size={14} className="text-amber-300" />
                  <span className="text-[10px] font-bold">Key Guide</span>
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Quick Action Chips Bar */}
            <div className="bg-slate-100/90 px-3 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-bold text-slate-700">
              <button
                onClick={() => handleSendPrompt("E-Vedhika పోర్టల్ అంటే ఏమిటి? వివరాలు ఇవ్వండి.")}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-lg flex items-center gap-1 whitespace-nowrap transition-all shadow-xs"
              >
                <BookOpen size={12} className="text-indigo-600" />
                <span>E-Vedhika పరిచయం</span>
              </button>
              <button
                onClick={() => handleSendPrompt("UBD (జనన మరణాల) ట్రాకర్ ఉపయోగించే విధానం ఏమిటి?")}
                className="px-2.5 py-1 bg-white hover:bg-teal-50 hover:text-teal-700 border border-slate-200 rounded-lg flex items-center gap-1 whitespace-nowrap transition-all shadow-xs"
              >
                <AlertCircle size={12} className="text-teal-600" />
                <span>UBD ట్రాకర్</span>
              </button>
              <button
                onClick={() => handleSendPrompt("రైతు రిజిస్ట్రీ & పాస్‌బుక్ వెరిఫికేషన్ వర్క్ ఫ్లో ఏమిటి?")}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-lg flex items-center gap-1 whitespace-nowrap transition-all shadow-xs"
              >
                <Users size={12} className="text-emerald-600" />
                <span>రైతు రిజిస్ట్రీ</span>
              </button>
              <button
                onClick={() => handleSendPrompt("GEMINI_API_KEY ని ఉచితంగా ఎలా పొందాలి?")}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg flex items-center gap-1 whitespace-nowrap transition-all shadow-xs"
              >
                <Key size={12} className="text-amber-600" />
                <span>API Key సెటప్</span>
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
                        ? 'bg-emerald-700 text-white rounded-tr-none' 
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
                    <Loader2 size={16} className="animate-spin text-emerald-600" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                      E-Vedhika నాలెడ్జ్ బేస్ పరిశీలిస్తున్నాను...
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
                  placeholder="E-Vedhika సేవలు, జీవోలు, UBD గురించి అడగండి..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm outline-none font-bold text-slate-700 placeholder:text-slate-400"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-600/20"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5 px-2">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-tight">
                  E-Vedhika AI &bull; Grounded Knowledge Base
                </p>
                <button 
                  onClick={() => setShowApiKeyGuide(true)} 
                  className="text-[9px] text-indigo-600 font-extrabold hover:underline"
                >
                  🔑 API Key Guide
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-16 h-16 rounded-[24px] shadow-2xl flex items-center justify-center transition-all duration-300 relative group overflow-hidden ${
          isOpen ? 'bg-slate-900 border-4 border-slate-800' : 'bg-emerald-600 border-4 border-emerald-500 hover:rotate-6'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {isOpen ? (
          <X size={28} className="text-white relative z-10" />
        ) : (
          <div className="relative z-10 flex flex-col items-center">
             <Bot size={28} className="text-white drop-shadow-lg" />
             <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-teal-300 rounded-full border-2 border-emerald-600 animate-ping"></div>
                <div className="w-3 h-3 bg-teal-300 rounded-full border-2 border-emerald-600 absolute top-0"></div>
             </div>
          </div>
        )}
      </motion.button>
    </div>
  );
}
