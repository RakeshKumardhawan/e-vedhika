import React, { useState, useEffect, useRef } from 'react';
import { 
  Laptop, CheckCircle2, AlertTriangle, RefreshCw, 
  Trash2, Download, Search, ShieldCheck, ExternalLink, Globe,
  X, AlertCircle, Cpu
} from 'lucide-react';

export const UBDLiveMonitoringTable: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<'all' | 'ts' | 'ap'>('all');

  // 1. Critical Toasts కోసం స్టేట్ & రియల్-టైమ్ స్కానింగ్
  const [criticalToasts, setCriticalToasts] = useState<any[]>([]);
  const seenFailuresRef = useRef<Set<string>>(new Set());

  // లైవ్ టెలిమెట్రీని సర్వర్ నుండి ఫెచ్ చేయడం
  const fetchTelemetry = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/telemetry');
      const data = await res.json();
      const rawLogs = data.telemetry || data.logs;
      if (data.success && Array.isArray(rawLogs)) {
        setLogs(rawLogs);

        // 2. ప్రతి పోలింగ్ లోనూ క్రిటికల్ ఇష్యూస్ ని తనిఖీ చేస్తుంది
        rawLogs.forEach(l => {
          const dscFail = String(l.dscStatus || '').toLowerCase().includes('disconnected') || 
                          String(l.dscStatus || '').toLowerCase().includes('not found') || 
                          String(l.dscStatus || '').toLowerCase().includes('missing');
          const ieFail = String(l.edgeIeMode || '').toLowerCase().includes('disabled') || 
                         String(l.edgeIeMode || '').toLowerCase().includes('error');
          const isFailedStatus = String(l.status || '').toUpperCase().includes('FAIL') || 
                                 String(l.status || '').toUpperCase().includes('ERROR') || 
                                 (l.healthScore !== undefined && Number(l.healthScore) < 85);

          if (dscFail || ieFail || isFailedStatus) {
            const logId = l.id || `${l.pcName}-${l.time || ''}-${l.date || ''}`;
            if (!seenFailuresRef.current.has(logId)) {
              seenFailuresRef.current.add(logId);
              
              const errorType = dscFail 
                ? '🔌 DSC Token Disconnected' 
                : (ieFail ? '🌐 IE Mode Settings Error' : '❌ Critical Deployment Failure');
              
              const details = dscFail 
                ? 'Digital Signature USB token was unplugged or smart card driver was missing.' 
                : (ieFail ? 'Enterprise Edge Site List zone is inactive or policy is missing.' : '15/15 UBD verification failed.');

              // అడ్మిన్ స్క్రీన్ పైకి వెంటనే టోస్ట్ ని తోస్తుంది!
              setCriticalToasts(prev => [
                {
                  id: logId,
                  pcId: l.pcId || `EVD-TS-${String(l.id || '').slice(-6).toUpperCase()}`,
                  pcName: l.pcName || 'GP-COMPUTER',
                  officeLocation: l.officeLocation || 'Grama Panchayat Office',
                  errorType,
                  details,
                  timestamp: l.time || new Date().toLocaleTimeString()
                },
                ...prev
              ]);
            }
          }
        });
      }
    } catch (err) {
      console.error("Telemetry fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ప్రతి 5 సెకన్లకు ఆటోమేటిక్ రిఫ్రెష్ (Live Real-Time Monitoring)
  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  const dismissCriticalToast = (toastId: string) => {
    setCriticalToasts(prev => prev.filter(t => t.id !== toastId));
  };

  // సింగిల్ రికార్డ్ డిలీట్ చేయడం
  const handleDelete = async (id: string) => {
    if (!confirm('ఈ రికార్డును డిలీట్ చేయాలనుకుంటున్నారా?')) return;
    try {
      await fetch('/api/telemetry/delete-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      setLogs(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  // CSV ఎగుమతి (Export to Excel/CSV)
  const exportCSV = () => {
    const headers = ["Hardware ID (pcId)", "PC Name", "User", "Office Location", "Presence", "Timestamp", "Status", "DSC Token", "Edge IE Mode", "Health Score", "IP Address", "Remarks"];
    const rows = logs.map(l => [
      `"${l.pcId || ''}"`, `"${l.pcName || ''}"`, `"${l.userName || ''}"`, `"${l.officeLocation || ''}"`,
      `"${l.livePresence || 'ONLINE'}"`, `"${l.timestamp || l.date || ''}"`,
      `"${l.status || ''}"`, `"${l.dscStatus || ''}"`, `"${l.edgeIeMode || ''}"`, `"${l.healthScore || 100}%"`,
      `"${l.networkIp || l.ipAddress || ''}"`, `"${l.remarks || ''}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `UBD_Live_Monitoring_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // సెర్చ్ & స్టేట్ ఫిల్టరింగ్ లాజిక్
  const filteredLogs = logs.filter(l => {
    const loc = (l.officeLocation || '').toLowerCase();
    const st = (l.state || '').toUpperCase();
    const isAP = loc.includes('ap') || loc.includes('andhra') || st === 'AP';
    const isTS = loc.includes('ts') || loc.includes('telangana') || st === 'TS';
    if (regionFilter === 'ap' && !isAP) return false;
    if (regionFilter === 'ts' && !isTS) return false;

    const q = search.toLowerCase();
    return (l.pcId || '').toLowerCase().includes(q) ||
           (l.pcName || '').toLowerCase().includes(q) || 
           (l.userName || '').toLowerCase().includes(q) || 
           (l.officeLocation || '').toLowerCase().includes(q) ||
           (l.status || '').toLowerCase().includes(q);
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4 relative">
      {/* Real-Time Critical Failure Toast Notifications */}
      {criticalToasts.length > 0 && (
        <div className="space-y-2">
          {criticalToasts.slice(0, 3).map((toast) => (
            <div 
              key={toast.id}
              className="p-3.5 bg-gradient-to-r from-rose-950/90 to-slate-900 border-l-4 border-rose-500 border border-rose-800/60 rounded-xl shadow-xl flex items-start justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0 animate-pulse" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-300">{toast.errorType}</span>
                    <span className="bg-rose-900/60 text-rose-200 px-1.5 py-0.5 rounded font-mono text-[10px] border border-rose-700/50">
                      {toast.pcId}
                    </span>
                    <span className="text-[10px] text-slate-400">({toast.pcName})</span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5">{toast.details}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    📍 {toast.officeLocation} • ⏰ {toast.timestamp}
                  </p>
                </div>
              </div>
              <button
                onClick={() => dismissCriticalToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 cursor-pointer"
                title="మూసివేయండి"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            📡 EXE & UBD Live Monitoring Hub
          </h3>
          <p className="text-xs text-slate-400">
            తెలంగాణ & ఆంధ్రప్రదేశ్ గ్రామ పంచాయతీల కంప్యూటర్ల నుండి లైవ్ 15/15 రిపోర్ట్లు (మొత్తం: {logs.length} PCs)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={fetchTelemetry}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>రిఫ్రెష్</span>
          </button>
          <button 
            onClick={exportCSV}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel/CSV డౌన్లోడ్</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="హార్డ్‌వేర్ ID (EVD-...), కంప్యూటర్ పేరు, ఆఫీస్ లేదా యూజర్ పేరుతో వెతకండి..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button 
            onClick={() => setRegionFilter('all')}
            className={`px-3 py-1 rounded-lg ${regionFilter === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
          >
            అన్నీ ({logs.length})
          </button>
          <button 
            onClick={() => setRegionFilter('ts')}
            className={`px-3 py-1 rounded-lg ${regionFilter === 'ts' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'}`}
          >
            తెలంగాణ (TS)
          </button>
          <button 
            onClick={() => setRegionFilter('ap')}
            className={`px-3 py-1 rounded-lg ${regionFilter === 'ap' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
          >
            ఆంధ్రప్రదేశ్ (AP)
          </button>
        </div>
      </div>

      {/* 16-Column Telemetry Table with Hardware ID & Live Presence */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
              <th className="p-3">#</th>
              <th className="p-3">HARDWARE ID (PC ID)</th>
              <th className="p-3">PC NAME</th>
              <th className="p-3">OFFICE LOCATION</th>
              <th className="p-3">PRESENCE</th>
              <th className="p-3">TIMESTAMP</th>
              <th className="p-3">STATUS</th>
              <th className="p-3">DSC TOKEN</th>
              <th className="p-3">IE MODE</th>
              <th className="p-3">HEALTH</th>
              <th className="p-3">IP ADDRESS</th>
              <th className="p-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={12} className="p-8 text-center text-slate-500 font-sans">
                  ఎలాంటి రిపోర్టులు లభించలేదు. C# టూల్ రన్ చేయగానే ఇక్కడ కనిపిస్తాయి.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, idx) => (
                <tr key={log.id || idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-slate-500 font-sans">{idx + 1}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-indigo-950/80 text-indigo-300 font-bold rounded border border-indigo-700/50 text-[11px] flex items-center gap-1 w-fit">
                      <Cpu className="w-3 h-3 text-indigo-400" />
                      <span>{log.pcId || `EVD-TS-${String(log.id || '').slice(-6).toUpperCase()}`}</span>
                    </span>
                  </td>
                  <td className="p-3 font-bold text-cyan-300 font-sans flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-slate-400" />
                    <span>{log.pcName}</span>
                  </td>
                  <td className="p-3 font-sans text-slate-200">
                    <div>{log.officeLocation}</div>
                    <div className="text-[10px] text-slate-400">{log.userName}</div>
                  </td>
                  <td className="p-3 font-sans">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>{log.livePresence || 'ONLINE'}</span>
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 text-[11px] font-sans">{log.timestamp || log.time || 'Just now'}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[10px]">
                      {log.status || 'SUCCESS'} ({log.verification || 'Passed (15/15)'})
                    </span>
                  </td>
                  <td className="p-3 text-sky-300 font-sans text-[11px]">{log.dscStatus || 'Active (ProxKey/ePass2003)'}</td>
                  <td className="p-3 text-amber-300 font-sans text-[11px]">{log.edgeIeMode || 'IE5 Quirks Mode Enabled'}</td>
                  <td className="p-3 font-bold text-emerald-400 font-sans">{log.healthScore || 100}%</td>
                  <td className="p-3 text-slate-400 text-[11px]">{log.networkIp || log.ipAddress || '192.168.1.10'}</td>
                  <td className="p-3 font-sans">
                    <button 
                      onClick={() => handleDelete(log.id)}
                      className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-red-500/10 cursor-pointer"
                      title="డిలీట్ చేయండి"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
