import React, { useState } from 'react';
import { Send, Mail, Rss, MessageCircle, Twitter, CheckCircle2, RefreshCw } from 'lucide-react';

export function NewsletterRssDistributor() {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleBroadcast = () => {
    setIsSending(true);
    setSent(false);
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Rss size={20} className="text-orange-500" /> Automated Newsletter & RSS Feed Distributor
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Broadcast new tech articles directly to Telegram, X (Twitter), Email lists, and RSS endpoints.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connected Channels */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Connected Channels</h4>
          
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-[#229ED9]/10 text-[#229ED9] flex items-center justify-center">
                 <MessageCircle size={16} />
               </div>
               <div>
                 <h5 className="text-sm font-bold text-slate-800">Telegram Channel</h5>
                 <p className="text-[10px] text-slate-500 font-medium">@e_vedhika_updates</p>
               </div>
             </div>
             <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center">
                 <Twitter size={16} />
               </div>
               <div>
                 <h5 className="text-sm font-bold text-slate-800">X (Twitter) API</h5>
                 <p className="text-[10px] text-slate-500 font-medium">@EVedhika</p>
               </div>
             </div>
             <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                 <Mail size={16} />
               </div>
               <div>
                 <h5 className="text-sm font-bold text-slate-800">Mailchimp Sync</h5>
                 <p className="text-[10px] text-slate-500 font-medium">4,250 Subscribers</p>
               </div>
             </div>
             <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
              <span className="text-xs font-bold text-slate-700">Auto-post upon publishing new articles</span>
            </label>
          </div>
        </div>

        {/* Compose Broadcast */}
        <div className="lg:col-span-2 border border-slate-100 rounded-xl p-5 flex flex-col">
           <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Send size={16} className="text-blue-600" /> Compose Manual Broadcast
           </h4>
           
           <div className="space-y-4 flex-1 flex flex-col">
             <input 
               type="text" 
               placeholder="Broadcast Title or URL..."
               className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
             <textarea 
               placeholder="Write your custom message for social media and newsletters..."
               className="w-full flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
             />
             
             <div className="flex items-center justify-between pt-2">
                {sent ? (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <CheckCircle2 size={18} /> Broadcast Sent to All Channels
                  </div>
                ) : (
                  <div></div>
                )}
                <button 
                  onClick={handleBroadcast}
                  disabled={isSending}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-black transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isSending ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />} 
                  {isSending ? 'Sending to APIs...' : 'Send Broadcast Now'}
                </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
