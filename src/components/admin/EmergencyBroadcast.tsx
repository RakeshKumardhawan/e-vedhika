import React, { useState } from 'react';
import { Megaphone, AlertOctagon, Send, Activity, X } from 'lucide-react';

export function EmergencyBroadcast() {
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState<'info' | 'warning' | 'critical'>('warning');

  const handleBroadcast = () => {
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
    setMessage('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Megaphone size={20} className="text-rose-600" /> Emergency Broadcast Alert System
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Trigger site-wide alert banners instantly for maintenance or critical announcements.</p>
        </div>
        {isActive && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold animate-pulse">
            <Activity size={14} /> Broadcast Active
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Broadcast Message</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isActive}
              placeholder="e.g., Scheduled maintenance in 10 minutes..."
              className="w-full h-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Severity Level</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setLevel('info')}
                disabled={isActive}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${level === 'info' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-500'}`}
              >
                Info (Blue)
              </button>
              <button 
                onClick={() => setLevel('warning')}
                disabled={isActive}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${level === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-500'}`}
              >
                Warning (Yellow)
              </button>
              <button 
                onClick={() => setLevel('critical')}
                disabled={isActive}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${level === 'critical' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-slate-200 text-slate-500'}`}
              >
                Critical (Red)
              </button>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            {!isActive ? (
              <button 
                onClick={handleBroadcast}
                disabled={!message.trim()}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={16} /> Broadcast Now
              </button>
            ) : (
              <button 
                onClick={handleStop}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-black transition-all shadow-md flex items-center justify-center gap-2"
              >
                <X size={16} /> Stop Broadcast
              </button>
            )}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
           <h4 className="absolute top-4 left-4 text-[10px] font-black uppercase text-slate-400">Live Preview</h4>
           {message ? (
             <div className={`w-full p-4 rounded-xl flex items-start gap-3 shadow-sm ${
                level === 'critical' ? 'bg-rose-600 text-white' : 
                level === 'warning' ? 'bg-amber-500 text-white' : 
                'bg-blue-600 text-white'
             }`}>
                <AlertOctagon size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm font-bold leading-snug">{message}</p>
             </div>
           ) : (
             <p className="text-xs text-slate-400 font-bold">Type a message to see preview</p>
           )}
        </div>
      </div>
    </div>
  );
}
