import React, { useState } from 'react';
import { Mail, X, Send } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';

export function ContactAdminModal({ user, userProfile, onClose }: any) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      Swal.fire("Error", "Please fill in all fields", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const ticketRef = await addDoc(collection(db, "support_tickets"), {
        userId: user.uid,
        userEmail: user.email,
        userName: userProfile?.name || userProfile?.username || user.displayName || "Unknown User",
        subject,
        status: "new",
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      await addDoc(collection(db, "support_tickets", ticketRef.id, "messages"), {
        senderId: user.uid,
        senderName: userProfile?.name || userProfile?.username || user.displayName || "Unknown User",
        text: message,
        time: Date.now()
      });

      Swal.fire("Sent!", "Your message has been sent to the admin team.", "success");
      onClose();
    } catch (e: any) {
      console.error(e);
      Swal.fire("Error", "Failed to send message.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Mail size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Message Admin</h2>
              <p className="text-xs text-slate-500 font-medium">Report a problem or request support</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
            <input 
              type="text" 
              placeholder="e.g., Issue with my account" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-700"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
            <textarea 
              placeholder="Describe your problem or request..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-700 min-h-[120px]"
            />
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-black transition-colors disabled:opacity-50 shadow-md shadow-blue-600/20"
          >
            {isSubmitting ? (
              "Sending..."
            ) : (
              <><Send size={18} /> Send Message to Admin</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
