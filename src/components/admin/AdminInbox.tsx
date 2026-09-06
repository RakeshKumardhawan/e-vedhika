import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Mail, CheckCircle, Clock, AlertCircle, Send, MessageSquare } from 'lucide-react';

export function AdminInbox({ user }: any) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "support_tickets"), orderBy("updatedAt", "desc"));
    return onSnapshot(q, (snap) => {
      setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      if (selectedTicket.status === "new") {
        updateDoc(doc(db, "support_tickets", selectedTicket.id), { status: "read" });
      }
      const q = query(collection(db, "support_tickets", selectedTicket.id, "messages"), orderBy("time", "asc"));
      return onSnapshot(q, (snap) => {
        setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    }
  }, [selectedTicket]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    try {
      await addDoc(collection(db, "support_tickets", selectedTicket.id, "messages"), {
        senderId: user.uid,
        senderName: "e-Vedika Team",
        text: replyText,
        time: Date.now()
      });
      await updateDoc(doc(db, "support_tickets", selectedTicket.id), {
        status: "pending",
        updatedAt: Date.now()
      });
      setReplyText("");
    } catch (e) {
      console.error(e);
    }
  };

  const updateStatus = async (status: string) => {
    if (!selectedTicket) return;
    await updateDoc(doc(db, "support_tickets", selectedTicket.id), { status });
    setSelectedTicket({ ...selectedTicket, status });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "new": return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">కొత్తవి (New)</span>;
      case "read": return <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold">చదివినవి (Read)</span>;
      case "pending": return <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">పెండింగ్ (Pending)</span>;
      case "resolved": return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">పరిష్కరించబడినవి (Resolved)</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <Mail className="text-blue-600" /> Admin Inbox
      </h2>
      
      <div className="flex flex-col md:flex-row gap-6 h-[600px]">
        {/* Ticket List */}
        <div className="w-full md:w-1/3 border-r border-slate-100 overflow-y-auto pr-4 space-y-3">
          {tickets.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-10">No messages found.</p>
          ) : (
            tickets.map(t => (
              <div 
                key={t.id} 
                onClick={() => setSelectedTicket(t)}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedTicket?.id === t.id ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 line-clamp-1">{t.subject}</h4>
                  {getStatusBadge(t.status)}
                </div>
                <p className="text-xs text-slate-500">From: {t.userName}</p>
                <p className="text-[10px] text-slate-400 mt-1">{new Date(t.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>

        {/* Ticket Details & Chat */}
        <div className="w-full md:w-2/3 flex flex-col h-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Header */}
              <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-slate-800">{selectedTicket.subject}</h3>
                  <p className="text-xs text-slate-500">User: {selectedTicket.userName}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus("pending")} className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold hover:bg-amber-200">Mark Pending</button>
                  <button onClick={() => updateStatus("resolved")} className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold hover:bg-emerald-200">Resolve</button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.senderId === user.uid ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 ${m.senderId === user.uid ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none shadow-sm border border-slate-100'}`}>
                      <p className="text-xs font-bold mb-1 opacity-70">{m.senderName}</p>
                      <p className="text-sm leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-slate-200 flex gap-2">
                <input 
                  type="text" 
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type a professional response..."
                  className="flex-1 px-4 py-2 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                />
                <button onClick={handleSendReply} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-2">
              <MessageSquare size={48} className="opacity-20" />
              <p>Select a ticket to view and reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
