import React, { useState } from 'react';
import { MessageSquare, Shield, CheckCircle, Trash2, Bot, AlertTriangle, MessageCircle, LifeBuoy, Eye, FileText, User } from 'lucide-react';
import { collection, onSnapshot, query, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Swal from 'sweetalert2';
import { pushPostToSupportSystem } from '../../services/supportTicketService';

export function TechCommunityModeration() {
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [selectedPostDetail, setSelectedPostDetail] = useState<any | null>(null);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts")),
      (snap) => {
        const posts: any[] = [];
        snap.forEach((d) => {
          const data = d.data();
          const st = (data.status || "").toLowerCase();
          if (["pending", "draft", "private_support", "sent to support", "sent-to-support", "support"].includes(st)) {
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
      await addDoc(collection(db, "security_logs"), {
        category: "PERMISSION_CHANGE", title: "Post Published", description: "Post " + id + " was published", admin: "Admin", time: Date.now()
      });
      Swal.fire({ icon: 'success', title: 'పోస్ట్ విజయవంతంగా పబ్లిష్ చేయబడింది!', timer: 1500, showConfirmButton: false });
    } else if (action === 'reject') {
      await updateDoc(doc(db, "posts", id), { status: "rejected" });
      await addDoc(collection(db, "security_logs"), {
        category: "DELETE", title: "Post Rejected", description: "Post " + id + " was rejected", admin: "Admin", time: Date.now()
      });
      Swal.fire({ icon: 'success', title: 'పోస్ట్ తిరస్కరించబడింది (Rejected)', timer: 1500, showConfirmButton: false });
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
                  <span class="text-[10px] text-indigo-500 font-bold block uppercase tracking-wider">యూనిక్ ట్రాకింగ్ నెంబర్ (Tracking Number)</span>
                  <span class="text-lg font-mono font-black text-indigo-700 select-all block mt-0.5">#${res.trackingNumber}</span>
                </div>
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
            <Shield size={20} className="text-indigo-600" /> Pending Submissions & Community Moderation
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Review user submissions with full details, titles, content, categories, and AI spam analysis.</p>
        </div>
      </div>

      <div className="border border-slate-100 rounded-xl overflow-hidden flex flex-col flex-1">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare size={14} /> Pending Review Submissions ({pendingPosts.length})
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-500">
                <th className="p-3">User / Author</th>
                <th className="p-3">Full Title & Content Details</th>
                <th className="p-3">Category & Date</th>
                <th className="p-3">AI Spam Score</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {pendingPosts.map((item) => {
                const authorName = item.userName || item.authorName || item.author || item.user || "Citizen User";
                const authorEmail = item.userEmail || "user@e-vedhika.in";
                const title = item.title || item.subject || "Untitled Submission";
                const desc = item.desc || item.content || item.problem || item.text || "No description provided.";
                const category = item.category || "General";
                const dateStr = item.createdAt || item.time ? new Date(item.createdAt || item.time).toLocaleDateString() : "Recent";
                const spamScore = item.spamScore !== undefined ? item.spamScore : 2;

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {authorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{authorName}</p>
                          <p className="text-[10px] text-slate-400">{authorEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 max-w-xs">
                      <p className="font-bold text-slate-900 mb-0.5">{title}</p>
                      <p className="text-slate-600 line-clamp-2 text-[11px]">{desc}</p>
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold block w-fit mb-1">{category}</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400">{dateStr}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          (item.status || "").toLowerCase() === "private_support" || (item.status || "").toLowerCase().includes("support")
                            ? "bg-purple-100 text-purple-700"
                            : "bg-indigo-100 text-indigo-700"
                        }`}>
                          {item.trackingNumber ? `#${item.trackingNumber}` : (item.status || "Pending")}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 w-fit ${
                        spamScore > 80 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        <Bot size={12} /> {spamScore}% Safe
                      </span>
                    </td>
                    <td className="p-3 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedPostDetail(item)}
                        className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="పూర్తి వివరాలు చూడండి (View Full Details)"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleAction(item.id, 'approve')}
                        className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="ప్రచురించు (Publish)"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button 
                        onClick={() => handleAction(item.id, 'private_support')}
                        className="p-1.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-purple-700 hover:bg-purple-100 rounded-lg transition-all flex items-center gap-1 font-bold text-[10px]" 
                        title="పుష్ టు సపోర్ట్"
                      >
                        <LifeBuoy size={14} className="text-purple-600" />
                        <span className="hidden sm:inline">సపోర్ట్</span>
                      </button>
                      <button 
                        onClick={() => handleAction(item.id, 'reject')}
                        className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors" title="తిరస్కరించు (Reject)"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {pendingPosts.length === 0 && (
                 <tr>
                   <td colSpan={5} className="p-8 text-center text-slate-400">
                     <CheckCircle size={24} className="mx-auto mb-2 opacity-20" />
                     <p className="text-xs font-bold">All caught up! No pending submissions.</p>
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Details Modal */}
      {selectedPostDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-2xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">Pending Submission Full Details</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">{selectedPostDetail.title || selectedPostDetail.subject}</h3>
              </div>
              <button onClick={() => setSelectedPostDetail(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Author / User</span>
                <span className="font-black text-slate-800">{selectedPostDetail.userName || selectedPostDetail.authorName || selectedPostDetail.author || "Citizen"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Category</span>
                <span className="font-black text-slate-800">{selectedPostDetail.category || "General"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">District / Mandal</span>
                <span className="font-black text-slate-800">{selectedPostDetail.district || "N/A"} / {selectedPostDetail.mandal || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Submission Date</span>
                <span className="font-black text-slate-800">{selectedPostDetail.createdAt ? new Date(selectedPostDetail.createdAt).toLocaleString() : "Recent"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Full Content Description</h4>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                {selectedPostDetail.desc || selectedPostDetail.content || selectedPostDetail.problem || selectedPostDetail.text || "No description."}
              </div>
            </div>

            {selectedPostDetail.fileUrl && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Attachment / Media</h4>
                <a href={selectedPostDetail.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold text-xs block">
                  View Attached File 📎
                </a>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                onClick={() => { handleAction(selectedPostDetail.id, 'approve'); setSelectedPostDetail(null); }}
                className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 shadow-sm"
              >
                Approve & Publish
              </button>
              <button 
                onClick={() => { handleAction(selectedPostDetail.id, 'private_support'); setSelectedPostDetail(null); }}
                className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 shadow-sm"
              >
                Push to Support
              </button>
              <button 
                onClick={() => setSelectedPostDetail(null)}
                className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
