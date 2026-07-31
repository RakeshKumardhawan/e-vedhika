import React, { useState, useEffect } from 'react';
import { 
  Cloud, FileText, Laptop, Search, Download, RefreshCw, 
  Monitor, CheckCircle2, Clock, Video, Check, PauseCircle, XCircle 
} from 'lucide-react';

export const ExeUbdLiveMonitoring: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'telemetry' | 'remote_queue'>('telemetry');
  const [searchQuery, setSearchQuery] = useState('');
  const [syncing, setSyncing] = useState(false);

  const [centralTelemetryLogs, setCentralTelemetryLogs] = useState<any[]>([]);
  const [remoteQueue, setRemoteQueue] = useState<any[]>([]);
  const [liveScreenFrame, setLiveScreenFrame] = useState<string | null>(null);
  const [activeRemoteModal, setActiveRemoteModal] = useState<typeof remoteQueue[0] | null>(null);

  // 1. Live Telemetry & Remote Requests Fetch Loop
  const fetchLiveCloudData = async () => {
    try {
      const telemRes = await fetch('/api/telemetry');
      if (telemRes.ok) {
        const data = await telemRes.json();
        if (data.logs && Array.isArray(data.logs)) {
          setCentralTelemetryLogs(data.logs);
        }
      }

      const remoteRes = await fetch('/api/remote-queue');
      if (remoteRes.ok) {
        const data = await remoteRes.json();
        if (data.queue && Array.isArray(data.queue)) {
          setRemoteQueue(data.queue);
        }
      }
    } catch (e) {
      console.warn('Syncing error:', e);
    }
  };

  useEffect(() => {
    fetchLiveCloudData();
    const interval = setInterval(fetchLiveCloudData, 10000); // 10 Sec Live Fetch
    return () => clearInterval(interval);
  }, []);

  // 2. Native Remote Desktop Live Screen Stream Rendering Loop
  useEffect(() => {
    let interval: any = null;
    if (activeRemoteModal) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/remote-stream?pcName=${encodeURIComponent(activeRemoteModal.pcName)}`);
          const data = await res.json();
          if (data.success && data.image) {
            setLiveScreenFrame(`data:image/jpeg;base64,${data.image}`);
          }
        } catch { }
      }, 400); // Frame Refresh Rate
    } else {
      setLiveScreenFrame(null);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [activeRemoteModal]);


  const handleUpdateStatus = (id: string, newStatus: any) => {
    setRemoteQueue(prev => prev.map(q => q.id === id ? { ...q, queueStatus: newStatus } : q));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Navigation Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-800">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Central Cloud Telemetry & Remote Support Control Center</h2>
            <p className="text-xs text-slate-500 font-medium">
              Real-time monitoring across all Grama Panchayat & Mandal Office PCs • Live Admin Remote Assistance Queue
            </p>
          </div>
        </div>

        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setSelectedTab('telemetry')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              selectedTab === 'telemetry' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Telemetry Reports (16 Columns)</span>
          </button>

          <button
            onClick={() => setSelectedTab('remote_queue')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              selectedTab === 'remote_queue' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>2. Remote Desktop Sharing Queue</span>
            {remoteQueue.filter(q => q.queueStatus === 'waiting').length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                {remoteQueue.filter(q => q.queueStatus === 'waiting').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* SCREEN 1: TELEMETRY LOGS TABLE WITH ALL 16 COLUMNS */}
      {selectedTab === 'telemetry' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Cloud className="w-4 h-4 text-indigo-400" />
              Central Execution Telemetry Log Table (సెంట్రల్ క్లౌడ్ టెలిమెట్రీ నివేదిక)
            </h3>
            <span className="text-xs text-emerald-400 font-mono">e-vedhika.onrender.com/api/telemetry</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px] whitespace-nowrap">
                  <th className="p-3">Sl. No.</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Computer Name</th>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Office Location (జిల్లా/మండలం/GP)</th>
                  <th className="p-3">OS Version</th>
                  <th className="p-3">Internet</th>
                  <th className="p-3">.NET</th>
                  <th className="p-3">NIC DigiSigner</th>
                  <th className="p-3">DSC Status</th>
                  <th className="p-3">Trusted Sites</th>
                  <th className="p-3">Edge IE Mode</th>
                  <th className="p-3">sites.xml</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3">Version</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 min-w-[200px]">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] font-mono">
                {centralTelemetryLogs.length === 0 ? (
                  <tr>
                    <td colSpan={18} className="p-8 text-center text-slate-500 font-medium bg-white">
                      Waiting for live telemetry reports from Panchayat PCs... (కంప్యూటర్ల నుండి రిపోర్టులు కోసం ఎదురుచూస్తున్నాము)
                    </td>
                  </tr>
                ) : centralTelemetryLogs.map((log) => (
                  <tr key={log.slNo} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{log.slNo}</td>
                    <td className="p-3 text-slate-600">{log.date}</td>
                    <td className="p-3 text-slate-600">{log.time}</td>
                    <td className="p-3 font-bold text-indigo-800 flex items-center gap-1">
                      <Monitor className="w-3.5 h-3.5" />
                      <span>{log.pcName}</span>
                    </td>
                    <td className="p-3 text-slate-700">{log.userName}</td>
                    <td className="p-3 text-slate-700 font-sans">{log.panchayat}, {log.mandal} ({log.district})</td>
                    <td className="p-3 text-slate-600">{log.osVersion}</td>
                    <td className="p-3"><span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{log.internet}</span></td>
                    <td className="p-3 text-slate-700">{log.dotNet}</td>
                    <td className="p-3 text-slate-700">{log.nicDigiSigner}</td>
                    <td className="p-3"><span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{log.dscStatus}</span></td>
                    <td className="p-3 text-slate-700">{log.trustedSites}</td>
                    <td className="p-3 text-emerald-700 font-semibold">{log.edgeIeMode}</td>
                    <td className="p-3 text-slate-700">{log.sitesXml}</td>
                    <td className="p-3"><span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">{log.verification}</span></td>
                    <td className="p-3 font-bold">{log.version}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{log.status}</span></td>
                    <td className="p-3 text-slate-600 font-sans">{log.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SCREEN 2: REMOTE ACCESS & ADMIN WAITING QUEUE */}
      {selectedTab === 'remote_queue' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Live Remote Desktop Sharing & Waiting Queue (రిమోట్ యాక్సెస్ కంట్రోలర్)</h3>
              <p className="text-xs text-slate-500">అడ్మిన్‌గా బిజీ ఉన్నప్పుడు యూసర్ రిక్వెస్ట్‌లను వెయిటింగ్ లిస్ట్‌లో ఉంచవచ్చు లేదా 1-క్లిక్‌తో రిమోట్ కంట్రోల్ ద్వారా సమస్యను పరిష్కరించవచ్చు.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {remoteQueue.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl border bg-slate-50 border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-xs bg-white px-2 py-1 rounded border">{item.id}</span>
                  {item.queueStatus === 'waiting' && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> వెయిటింగ్ లిస్ట్ #{item.queueNumber}
                    </span>
                  )}
                  {item.queueStatus === 'connected' && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <Video className="w-3 h-3" /> లైవ్ కనెక్ట్ అయింది
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">{item.pcName} ({item.userName})</h4>
                  <p className="text-xs text-slate-600">{item.office}</p>
                  <p className="text-xs text-indigo-700 font-mono font-bold pt-1">AnyDesk PIN: {item.anyDeskId}</p>
                </div>

                <div className="p-2.5 rounded bg-white border text-xs text-slate-700">
                  <span className="font-bold text-[10px] text-slate-400 block uppercase">సమస్య వివరాలు:</span>
                  <p>{item.issue}</p>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  {item.queueStatus !== 'connected' && (
                    <button
                      onClick={() => {
                        handleUpdateStatus(item.id, 'connected');
                        setActiveRemoteModal(item);
                      }}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" /> Direct Remote Control
                    </button>
                  )}

                  {item.queueStatus !== 'waiting' && (
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'waiting')}
                      className="py-2 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <PauseCircle className="w-3.5 h-3.5" /> Move to Waiting
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Direct Remote View Screen Dialog */}
      {activeRemoteModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Laptop className="w-4 h-4 text-emerald-400" /> Live Remote Screen: {activeRemoteModal.pcName}
              </h3>
              <button className="cursor-pointer" onClick={() => setActiveRemoteModal(null)}><XCircle className="w-5 h-5 text-slate-400 hover:text-white" /></button>
            </div>
            <div className="p-6 bg-slate-950 text-center text-white space-y-4">
              <div className="aspect-video bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center flex-col p-0 overflow-hidden relative">
                {liveScreenFrame ? (
                  <img src={liveScreenFrame} alt="Live Remote Screen" className="w-full h-full object-contain bg-black" />
                ) : (
                  <>
                    <Video className="w-12 h-12 text-emerald-400 animate-pulse mb-2" />
                    <p className="font-bold text-sm">{activeRemoteModal.userName} గారి కంప్యూటర్ స్క్రీన్ యాక్టివ్‌గా ఉంది</p>
                    <p className="text-xs text-slate-400">Desk ID: {activeRemoteModal.anyDeskId}</p>
                    <p className="text-xs text-emerald-400 mt-2 animate-pulse">Waiting for live video frame from {activeRemoteModal.pcName}...</p>
                  </>
                )}
                
                <div className="absolute bottom-4 right-4">
                  <button 
                    onClick={() => {
                      fetch('/api/remote-commands', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pcName: activeRemoteModal.pcName, type: 'fix' })
                      });
                      alert(`Sent remote fix command to ${activeRemoteModal.pcName}: Edge IE Mode & DSC Token restarted`);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-lg"
                  >
                    Fix IE Mode & USB Token Remotely
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
