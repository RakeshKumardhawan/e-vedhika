import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { MessageSquare, Search, Trash2, Ban } from 'lucide-react';
import Swal from 'sweetalert2';

export function UserChatManagement({ users }: { users?: any[] }) {
  const [chats, setChats] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  
  const getUserName = (c: any) => {
    let name = c.userName || c.senderName;
    if (name && name.trim() !== "") return name;
    let uid = c.uid || c.senderId;
    if (users && uid) {
      const u = users.find(user => user.id === uid);
      if (u) return u.username || u.name || u.email || uid;
    }
    return uid || "Unknown User";
  };

  useEffect(() => {
    // We get all chat messages to monitor user-to-user interactions
    const q = query(collection(db, "chat"));
    return onSnapshot(q, (snap) => {
      setChats(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a:any, b:any) => (b.time || b.createdAt || 0) - (a.time || a.createdAt || 0)));
    });
  }, []);

  
  const handleBlockUser = async (uid: string) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to block (suspend) this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, block user"
    });
    
    if(res.isConfirmed) {
      try {
        await updateDoc(doc(db, "users", uid), { role: "suspended" });
        Swal.fire("Suspended", "User has been suspended.", "success");
      } catch (err: any) {
        Swal.fire("Error", "Failed to block user.", "error");
      }
    }
  };

  const handleDelete = async (id: string) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this message?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it"
    });
    
    if(res.isConfirmed) {
      try {
        await deleteDoc(doc(db, "chat", id));
        Swal.fire("Deleted!", "Message has been deleted.", "success");
      } catch (err: any) {
        Swal.fire("Error", "Failed to delete message.", "error");
      }
    }
  };

  const filtered = chats.filter(c => c.senderId !== "e-vedika-official" && c.uid !== "e-vedika-official").filter(c => 
    (c.text || c.msg || "").toLowerCase().includes(search.toLowerCase()) || 
    (getUserName(c) || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <MessageSquare className="text-blue-600" /> User Chat Management
        </h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search messages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="p-4">Time</th>
              <th className="p-4">Sender</th>
              <th className="p-4">Message</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filtered.slice(0, 100).map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50">
                <td className="p-4 text-xs text-slate-500">{new Date(c.time || c.createdAt).toLocaleString()}</td>
                <td className="p-4 font-bold">{getUserName(c)}</td>
                <td className="p-4 text-slate-700 max-w-md truncate">{c.msg || c.text}</td>
                <td className="p-4">
                  {c.receiverId ? <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-[10px] font-bold">Direct Message</span> : <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold">Global/Public</span>}
                </td>
                <td className="p-4 text-right space-x-2 flex justify-end">
                  <button onClick={() => handleBlockUser(c.uid || c.senderId)} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Block User">
                    <Ban size={16} />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
