
import React from "react";
import { motion } from "framer-motion";
import { X, Heart } from "lucide-react";
import { UserProfile } from "../types";

export function UsersListModal({
  title,
  uids,
  allUsers,
  onClose,
}: {
  title: string;
  uids: string[];
  allUsers: UserProfile[];
  onClose: () => void;
}) {
  const list = allUsers.filter((u) => uids.includes(u.id));

  return (
    <div className="fixed inset-0 z-[4000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-black text-primary uppercase tracking-tighter">
            {title} ({uids.length})
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {list.length > 0 ? (
            <div className="space-y-3">
              {list.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border border-white">
                    {u.photoURL ? (
                      <img
                        src={u.photoURL}
                        alt={u.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      (u.name || "U").charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-800 text-sm truncate uppercase tracking-tight">
                      {u.name || "Unknown User"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                      {u.designation || u.email || "Member"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 italic text-slate-300">
                <Heart size={32} />
              </div>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                No users found
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
