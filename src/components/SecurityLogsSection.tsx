import React, { useState, useEffect } from "react";
import { ShieldAlert, Search, Lock, User, Trash2, Edit3, Activity } from "lucide-react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase"; // assuming db is exported from here or adjust path

export function SecurityLogsSection() {
  const [logs, setLogs] = useState<any[]>([]);
  const [logsError, setLogsError] = useState(false);
  const [logSearchTerm, setLogSearchTerm] = useState("");

  useEffect(() => {
    const unsubLogs = onSnapshot(
      query(collection(db, "security_logs"), orderBy("time", "desc")),
      (snap) => {
        const lList: any[] = [];
        snap.forEach((d) => lList.push({ id: d.id, ...d.data() }));
        setLogs(lList);
        setLogsError(false);
      },
      (err) => {
        setLogsError(true);
        console.error("Logs error:", err);
      },
    );
    return () => unsubLogs();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-[22px] flex items-center justify-center shadow-sm border border-rose-100/50">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">
              Security Audits
            </h4>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Digital Governance Logs
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-md relative group">
          <Search
            size={16}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Search interactions or admins..."
            className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-50 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:border-rose-200 focus:bg-rose-50/10 transition-all outline-none"
            onChange={(e) => setLogSearchTerm(e.target.value)}
            value={logSearchTerm}
          />
        </div>
      </div>

      {logsError ? (
        <div className="p-16 text-center bg-rose-50 border-2 border-dashed border-rose-100 rounded-[40px] group">
          <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Lock size={32} />
          </div>
          <h5 className="text-lg font-black text-rose-900 mb-2">
            Quantum Restriction
          </h5>
          <p className="text-sm text-rose-600 font-medium max-w-sm mx-auto leading-relaxed">
            Security protocols prevent log retrieval without proper
            synchronization.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="p-6 pl-10">Operator Entity</th>
                  <th className="p-6">Operation Protocol</th>
                  <th className="p-6 text-right pr-10">Temporal Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.filter(
                  (l: any) =>
                    !logSearchTerm ||
                    (l.admin || l.userEmail || l.uid || "")
                      .toLowerCase()
                      .includes(logSearchTerm.toLowerCase()) ||
                    (l.action || "")
                      .toLowerCase()
                      .includes(logSearchTerm.toLowerCase()),
                ).length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-20 text-center text-slate-300 font-bold italic text-sm"
                    >
                      No data packets detected in this sector.
                    </td>
                  </tr>
                ) : (
                  logs
                    .filter(
                      (l: any) =>
                        !logSearchTerm ||
                        (l.admin || l.userEmail || l.uid || "")
                          .toLowerCase()
                          .includes(logSearchTerm.toLowerCase()) ||
                        (l.action || "")
                          .toLowerCase()
                          .includes(logSearchTerm.toLowerCase()),
                    )
                    .map((log: any, i: number) => (
                      <tr
                        key={log.id || i}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="p-6 pl-10">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                              <User size={18} />
                            </div>
                            <div>
                              <div className="text-[14px] font-black text-slate-700 leading-none mb-1.5">
                                {log.admin || log.userEmail || "System Root"}
                              </div>
                              <div className="text-[9px] font-mono text-slate-300 uppercase tracking-widest leading-none">
                                ID: {log.id?.substring(0, 8) || "GENESIS"}{" "}
                                {log.uid && `| UID: ${log.uid.substring(0, 5)}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col gap-1">
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-wider border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-all w-fit">
                              {log.action?.includes("DELETE") ? (
                                <Trash2 size={12} className="text-rose-500" />
                              ) : log.action?.includes("UPDATE") ||
                                log.action?.includes("POST") ? (
                                <Edit3 size={12} className="text-blue-500" />
                              ) : (
                                <Activity
                                  size={12}
                                  className="text-emerald-500"
                                />
                              )}
                              {log.action}
                            </div>
                            {log.details && (
                              <div className="text-[10px] text-slate-400 font-mono mt-1 line-clamp-1 max-w-sm">
                                {JSON.stringify(log.details)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-6 text-right pr-10">
                          <div className="text-[12px] font-black text-slate-800">
                            {new Date(log.time).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {new Date(log.time).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
