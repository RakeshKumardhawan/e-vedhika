import React from 'react';
import { Send, CheckCircle2, Clock, ShieldCheck, ExternalLink } from 'lucide-react';

export interface TelegramNotificationCardProps {
  id?: string;
  title?: string;
  message?: string;
  time?: string;
  status?: string;
}

export const TelegramNotificationCard: React.FC<TelegramNotificationCardProps> = ({
  title = "Telegram Alert",
  message = "Notification details...",
  time = "Just now",
  status = "sent"
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-100 rounded-lg">
            <Send className="w-4 h-4 text-sky-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{title}</h4>
            <p className="text-[10px] text-slate-500 font-medium">{time}</p>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase">
          {status}
        </span>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
        {message}
      </p>
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-slate-600 rounded-lg border border-slate-200 transition-all flex items-center justify-center gap-1">
          <ExternalLink size={10} /> View Logs
        </button>
        <button className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white rounded-lg transition-all flex items-center justify-center gap-1">
          <ShieldCheck size={10} /> Verify
        </button>
      </div>
    </div>
  );
};
