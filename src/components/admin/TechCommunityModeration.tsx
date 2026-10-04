import React, { useState } from 'react';
import { MessageSquare, Shield, CheckCircle, Trash2, Bot, AlertTriangle, MessageCircle, LifeBuoy } from 'lucide-react';
import { collection, onSnapshot, query, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Swal from 'sweetalert2';
import { pushPostToSupportSystem } from '../../services/supportTicketService';

export function TechCommunityModeration() {
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);

  React.useEffect(() => {
    // Fetch posts that are pending
    const unsubscribe = onSnapshot(
      query(collection(db, "posts")),
      (snap) => {
        const posts: any[] = [];
        snap.forEach((d) => {
          const data = d.data();
          if (data.status === "Pending" || data.status === "pending") {
            posts.push({ id: d.id, ...data });
          }
        });
        setPendingPosts(posts);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'private_support') => {
    const postDoc = pendingPosts.find(p => p.id === id);
    if (action === 'approve') {
      await updateDoc(doc(db, "posts", id), { status: "published" });
      
      // Audit log
      await addDoc(collection(db, "security_logs"), {
        category: "PERMISSION_CHANGE", title: "Post Published", description: "Post " + id + " was published", admin: "Admin", time: Date.now()
      });
    } else if (action === 'reject') {
      await updateDoc(doc(db, "posts", id), { status: "rejected" });
      
      // Audit log
      await addDoc(collection(db, "security_logs"), {
        category: "DELETE", title: "Post Rejected", description: "Post " + id + " was rejected", admin: "Admin", time: Date.now()
      });
    } else if (action === 'private_support') {
      if (postDoc) {
        const res = await pushPostToSupportSystem(postDoc);
        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'సపోర్ట్ సిస్టమ్‌కు పంపబడింది! (Pushed to Support)',
            html: `
              <div class="text-left text-xs text-slate-600 space-y-2">
                <p>పోస్ట్ విజయవంతంగా సపోర్ట్ సిస్టమ్ / ఇన్క్వైరీస్ లోకి మార్చబడింది.</p>
                <div class="bg-indigo-50 border border-indigo-200 p-3 rounded-xl text-center my-2">
                  <span class="text-[10px] text-indigo-500 font-bold block uppercase tracking-wider">యూనిక్ ట్రాకింగ్ నెంబర్ (Unique Tracking Number)</span>
                  <span class="text-lg font-mono font-black text-indigo-700 select-all block mt-0.5">#${res.trackingNumber}</span>
                </div>
                <p class="text-[11px] text-slate-500">ఈ నెంబర్‌తో యూజర్ ఎప్పుడైనా తమ పోస్ట్ లేదా విజ్ఞప్తి యొక్క లైవ్ స్టేటస్ ట్రాక్ చేయవచ్చు.</p>
              </div>
            `,
            confirmButtonText: 'సరే (OK)',
            confirmButtonColor: '#4f46e5'
          });
        }
      }
    }
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
              {pendingPosts.map((item) => (
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
                      className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors tooltip-trigger" title="పబ్లిక్ పోర్టల్లో ప్రచురించు (Publish General Post)"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button 
                      onClick={() => handleAction(item.id, 'private_support')}
                      className="p-1.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-purple-700 hover:bg-purple-100 rounded-lg transition-all tooltip-trigger flex items-center gap-1 font-bold text-[10px]" 
                      title="పుష్ టు సపోర్ట్ సిస్టమ్ (Push to Support System)"
                    >
                      <LifeBuoy size={14} className="text-purple-600" />
                      <span className="hidden sm:inline">పుష్ టు సపోర్ట్</span>
                    </button>
                    <button 
                      onClick={() => handleAction(item.id, 'reject')}
                      className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors tooltip-trigger" title="తిరస్కరించు (Reject / Delete)"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {pendingPosts.length === 0 && (
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
