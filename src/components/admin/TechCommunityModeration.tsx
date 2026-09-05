import React, { useState } from 'react';
import { MessageSquare, Shield, CheckCircle, Trash2, Bot, AlertTriangle } from 'lucide-react';

export function TechCommunityModeration() {
  const [comments, setComments] = useState([
    { id: 1, user: 'Pavan', content: 'This React tutorial is very helpful!', spamScore: 2, status: 'pending' },
    { id: 2, user: 'CryptoBot', content: 'Earn $1000 daily! Click here: http://spam.link', spamScore: 98, status: 'pending' },
    { id: 3, user: 'Anusha', content: 'Can you explain the useMemo hook?', spamScore: 5, status: 'pending' },
  ]);

  const handleAction = (id: number, action: 'approve' | 'reject') => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, status: action } : c));
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Shield size={20} className="text-indigo-600" /> Community Moderation & AI Spam Blocker
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Review user comments and forum posts. High AI Spam Score implies automated spam.</p>
        </div>
      </div>

      <div className="border border-slate-100 rounded-xl overflow-hidden flex flex-col flex-1">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare size={14} /> Pending Review
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-500">
                <th className="p-3">User</th>
                <th className="p-3">Content</th>
                <th className="p-3">AI Spam Score</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {comments.filter(c => c.status === 'pending').map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-800">{item.user}</td>
                  <td className="p-3 text-slate-600 max-w-xs truncate">{item.content}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 w-fit ${
                      item.spamScore > 80 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      <Bot size={12} /> {item.spamScore}%
                    </span>
                  </td>
                  <td className="p-3 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleAction(item.id, 'approve')}
                      className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors tooltip-trigger" title="Approve"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button 
                      onClick={() => handleAction(item.id, 'reject')}
                      className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors tooltip-trigger" title="Reject / Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {comments.filter(c => c.status === 'pending').length === 0 && (
                 <tr>
                   <td colSpan={4} className="p-8 text-center text-slate-400">
                     <CheckCircle size={24} className="mx-auto mb-2 opacity-20" />
                     <p className="text-xs font-bold">All caught up! No pending comments.</p>
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
