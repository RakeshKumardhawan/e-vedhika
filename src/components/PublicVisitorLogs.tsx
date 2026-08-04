import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, getDocs, limit, startAfter, Timestamp } from 'firebase/firestore';
import { analyticsDb } from '../../firebase';
import { Clock, Globe, Laptop, Smartphone, Monitor, Search, RefreshCw, Download, User, Activity, AlertCircle } from 'lucide-react';

export function PublicVisitorLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    setLoading(true);
    if (!analyticsDb) {
      setError(true);
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(
      query(collection(analyticsDb, "visitor_logs"), orderBy("timestamp", "desc"), limit(100)),
      (snap) => {
        const rawLogs: any[] = [];
        snap.forEach((doc) => {
          rawLogs.push({ id: doc.id, ...doc.data() });
        });
        setLogs(rawLogs);
        setError(false);
        setLoading(false);
      },
      (err) => {
        console.error("Visitor logs snapshot error:", err);
        setError(true);
        setLoading(false);
      }
    );
    return () => unsub();
  };

  const filteredLogs = logs.filter(log => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (log.email || "").toLowerCase().includes(term) ||
      (log.ip || "").toLowerCase().includes(term) ||
      (log.path || "").toLowerCase().includes(term) ||
      (log.os || "").toLowerCase().includes(term) ||
      (log.browser || "").toLowerCase().includes(term)
    );
  });

  const exportCSV = () => {
    const headers = ["Timestamp", "Date", "User", "IP", "Path", "Browser", "OS", "Device", "Resolution"];
    const rows = filteredLogs.map(l => {
      const dateObj = new Date(l.timestamp);
      return [
        l.timestamp,
        dateObj.toLocaleString("en-IN"),
        `"${(l.email === 'anonymous' ? 'Anonymous Visitor' : l.email).replace(/"/g, '""')}"`,
        `"${(l.ip || 'Unknown').replace(/"/g, '""')}"`,
        `"${(l.path || '/').replace(/"/g, '""')}"`,
        `"${(l.browser || '').replace(/"/g, '""')}"`,
        `"${(l.os || '').replace(/"/g, '""')}"`,
        `"${(l.device || '').replace(/"/g, '""')}"`,
        `"${(l.resolution || '').replace(/"/g, '""')}"`
      ];
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `public_visitor_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getDeviceIcon = (deviceType: string) => {
    const dt = (deviceType || "").toLowerCase();
    if (dt.includes("mobile") || dt.includes("phone")) return <Smartphone size={16} />;
    if (dt.includes("tablet")) return <Monitor size={16} />; // Fallback icon
    return <Laptop size={16} />;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-br from-indigo-900 to-indigo-800 p-6 md:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Globe size={180} />
        </div>
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-indigo-100 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-white/10 mb-2">
            <Activity size={14} className="text-indigo-300" /> Public Tracking
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Public Visitor Logs (పబ్లిక్ లాగ్లు)</h2>
          <p className="text-indigo-200 text-sm max-w-xl leading-relaxed">
            రియల్ టైమ్ వెబ్‌సైట్ సందర్శకుల యాక్టివిటీ, బ్రౌజర్, ఆపరేటింగ్ సిస్టమ్ మరియు IP ట్రాకింగ్ వివరాలు.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={fetchLogs}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white rounded-xl font-bold text-sm backdrop-blur-md border border-white/20 whitespace-nowrap"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            రిఫ్రెష్ (Refresh)
          </button>
          <button 
            onClick={exportCSV}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-500 hover:bg-indigo-400 active:scale-95 transition-all text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-500/20 whitespace-nowrap"
          >
            <Download size={18} />
            CSV డౌన్‌లోడ్
          </button>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            placeholder="Search by IP, Email, Path, OS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-lg">
          చూపిస్తున్నవి: <span className="text-indigo-600">{filteredLogs.length}</span> లాగ్స్
        </div>
      </div>

      {/* Table Area */}
      {error ? (
        <div className="p-12 text-center bg-rose-50 border border-rose-200 rounded-3xl">
          <AlertCircle size={36} className="text-rose-500 mx-auto mb-2" />
          <h4 className="text-base font-bold text-rose-900">Database Access Error</h4>
          <p className="text-xs text-rose-600 mt-1">Unable to load visitor logs. Please check analyticsDb configuration or rules.</p>
        </div>
      ) : loading && logs.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl">
          <RefreshCw size={30} className="animate-spin text-indigo-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-500">లోడ్ అవుతోంది (Loading)...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
          <Clock size={40} className="text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No visitors found</h4>
          <p className="text-xs text-slate-500">Try changing your search filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                <tr>
                  <th className="p-4 pl-6 whitespace-nowrap">Time & IP</th>
                  <th className="p-4 whitespace-nowrap">User</th>
                  <th className="p-4 whitespace-nowrap">Path Visited</th>
                  <th className="p-4 whitespace-nowrap">Device Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredLogs.map((log, i) => {
                  const dateObj = new Date(log.timestamp);
                  const isAnon = log.email === "anonymous" || !log.email;
                  
                  return (
                    <tr key={log.id || i} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-4 pl-6 align-top">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-[11px] font-bold text-slate-800">
                            {dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                          <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-1 bg-slate-100 rounded text-[10px] font-mono text-slate-600 w-fit">
                            <Globe size={10} />
                            {log.ip || "Unknown IP"}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAnon ? 'bg-slate-100 text-slate-400' : 'bg-indigo-100 text-indigo-600'}`}>
                            <User size={14} />
                          </div>
                          <div>
                            <p className={`text-[13px] font-bold ${isAnon ? 'text-slate-500' : 'text-slate-800'}`}>
                              {isAnon ? "Anonymous Visitor" : log.email}
                            </p>
                            {!isAnon && log.uid && (
                              <p className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">ID: {log.uid}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="bg-slate-100/50 p-2.5 rounded-lg border border-slate-200/60 font-mono text-[11px] text-slate-600 max-w-[200px] sm:max-w-xs break-all line-clamp-3" title={log.path}>
                          {log.path || "/"}
                        </div>
                      </td>
                      <td className="p-4 pr-6 align-top">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 px-2 py-1.5 rounded-md border border-slate-100 w-fit">
                            <span className="text-slate-400">{getDeviceIcon(log.device)}</span>
                            <span className="font-semibold">{log.os || "Unknown OS"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            {log.browser || "Unknown Browser"}
                          </div>
                          {log.resolution && (
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                              {log.resolution}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
