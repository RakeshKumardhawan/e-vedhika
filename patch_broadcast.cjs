const fs = require('fs');
let content = fs.readFileSync('src/components/admin/EmergencyBroadcast.tsx', 'utf8');

const replacement = `import React, { useState } from 'react';
import { Megaphone, AlertOctagon, Send, X, Activity, Users, User } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Swal from 'sweetalert2';

export function EmergencyBroadcast() {
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState('info');
  const [targetType, setTargetType] = useState('all'); // 'all', 'individual'
  const [targetUid, setTargetUid] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBroadcast = async () => {
    if (!message.trim()) return;
    if (targetType === 'individual' && !targetUid.trim()) {
      Swal.fire("Error", "Please enter a User ID", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "notifications"), {
        uid: targetType === 'all' ? 'all' : targetUid,
        title: "📢 Official Broadcast",
        message: message,
        type: "broadcast",
        senderName: "e-Vedika Team",
        read: false,
        time: Date.now()
      });

      // Audit Log
      await addDoc(collection(db, "audit_logs"), {
        action: "Broadcast Message Sent",
        target: targetType === 'all' ? 'All Users' : targetUid,
        timestamp: Date.now(),
        actor: "Admin"
      });

      Swal.fire("Success", "Broadcast message sent successfully", "success");
      setMessage('');
      setTargetUid('');
    } catch (e: any) {
      console.error(e);
      Swal.fire("Error", "Failed to send broadcast", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Megaphone size={20} className="text-rose-600" /> Broadcast Messages
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Send official announcements to users from the e-Vedika Team.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setTargetType('all')}
                className={\`flex-1 py-2 rounded-xl text-xs font-bold transition-all border \${targetType === 'all' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'}\`}
              >
                <Users size={14} className="inline mr-1" /> All Users
              </button>
              <button 
                onClick={() => setTargetType('individual')}
                className={\`flex-1 py-2 rounded-xl text-xs font-bold transition-all border \${targetType === 'individual' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'}\`}
              >
                <User size={14} className="inline mr-1" /> Specific User
              </button>
            </div>
          </div>

          {targetType === 'individual' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">User ID</label>
              <input 
                type="text"
                value={targetUid}
                onChange={e => setTargetUid(e.target.value)}
                placeholder="Enter User ID"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Broadcast Message</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your official announcement here..."
              className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button 
            onClick={handleBroadcast}
            disabled={!message.trim() || isSubmitting}
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send size={16} /> {isSubmitting ? 'Sending...' : 'Send Broadcast'}
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
           <h4 className="absolute top-4 left-4 text-[10px] font-black uppercase text-slate-400">Live Preview (Notification)</h4>
           {message ? (
             <div className="w-full p-4 rounded-xl flex items-start gap-3 shadow-sm bg-white border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Megaphone size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">📢 Official Broadcast</h4>
                  <p className="text-xs text-slate-600 mt-1">{message}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold">From: e-Vedika Team</p>
                </div>
             </div>
           ) : (
             <p className="text-xs text-slate-400 font-bold">Type a message to see preview</p>
           )}
        </div>
      </div>
    </div>
  );
}`;

content = replacement;
fs.writeFileSync('src/components/admin/EmergencyBroadcast.tsx', content, 'utf8');
