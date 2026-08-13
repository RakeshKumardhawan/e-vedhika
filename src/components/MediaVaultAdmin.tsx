import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { Copy, ExternalLink, HardDrive, FileText, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function MediaVaultAdmin({ addToast }: { addToast: (s: string) => void }) {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "media_vault"), orderBy("uploadedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setMedia(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold">లోడింగ్ అవుతోంది (Loading)...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <HardDrive className="text-blue-500" />
            Media Vault (శాశ్వత గ్యాలరీ)
          </h2>
          <p className="text-slate-500 mt-1 font-medium text-sm flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            అప్డేట్ చేసిన ప్రతి ఫైల్ జీవితంలో ఎప్పుడూ పోకుండా ఇక్కడ భద్రపరచబడుతుంది.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-600 font-black px-4 py-2 rounded-xl text-sm">
          Total Files: {media.length}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all flex flex-col"
          >
            <div className="aspect-video bg-slate-50 relative border-b border-slate-100 flex items-center justify-center overflow-hidden">
              {item.type?.startsWith("image") || /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(item.url || "") ? (
                <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : item.type?.startsWith("video") ? (
                <video src={item.url} className="w-full h-full object-cover" />
              ) : (
                <FileText size={48} className="text-slate-300" />
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-slate-800 text-xs truncate" title={item.name}>{item.name || "Unknown File"}</h3>
              <p className="text-[10px] text-slate-400 mt-1 flex justify-between">
                <span className="truncate max-w-[50%]">{item.uploaderName}</span>
                <span>{item.uploadedAt?.seconds ? new Date(item.uploadedAt.seconds * 1000).toLocaleDateString() : "Just now"}</span>
              </p>
              <div className="mt-auto pt-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(item.url);
                    addToast("లింక్ కాపీ చేయబడింది! (Link Copied!)");
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase transition-colors"
                >
                  <Copy size={12} /> Copy Link
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                  title="Open/Download"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {media.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[32px] border border-slate-100">
          <HardDrive size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-bold">ఎలాంటి ఫైల్స్ ఇంకా భద్రపరచబడలేదు.</p>
        </div>
      )}
    </div>
  );
}
