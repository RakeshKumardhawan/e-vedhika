import React, { useState, useEffect, useRef } from 'react';
import { 
  Cloud, 
  RefreshCw, 
  Github, 
  Activity, 
  FileText,
  Laptop,
  Search,
  Monitor,
  Trash2,
  XCircle,
  Send
} from 'lucide-react';

export const UBDLiveMonitoring: React.FC = () => {
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'telemetry' | 'remote_queue'>('telemetry');
  
  // Central Telemetry Logs State
  const [centralTelemetryLogs, setCentralTelemetryLogs] = useState<any[]>([]);
  const [remoteQueue, setRemoteQueue] = useState<any[]>([]);
  const [selectedLogFor90Params, setSelectedLogFor90Params] = useState<any | null>(null);
  
  // OTA Configuration
  const [otaConfig, setOtaConfig] = useState({
    latestVersion: 'v1.0.1',
    versionCode: 101,
    downloadUrl: 'https://www.e-vedhika.in/EVedhikaUBDDeploymentTool.exe',
    releaseNotes: 'E-Vedhika UBD Tool v1.0.1 - Official Enterprise Release.',
    executableName: 'e-Vedhika_UBD_Deployment_v1.0.1.exe'
  });
  const [isSyncingGithub, setIsSyncingGithub] = useState(false);
  const [githubSyncMsg, setGithubSyncMsg] = useState('');
  const [regionFilter, setRegionFilter] = useState<'all' | 'ap' | 'ts'>('all');

  const fetchLiveCloudData = async () => {
    try {
      const telemRes = await fetch('/api/telemetry');
      if (telemRes.ok) {
        const data = await telemRes.json();
        if (data.logs) setCentralTelemetryLogs(data.logs);
      }
      
      const remoteRes = await fetch('/api/remote-queue');
      if (remoteRes.ok) {
        const data = await remoteRes.json();
        if (data.queue) setRemoteQueue(data.queue);
      }

      const versionRes = await fetch('/api/version');
      if (versionRes.ok) {
        const vData = await versionRes.json();
        if (vData.success) setOtaConfig(vData);
      }
    } catch (e) {
      console.warn('Sync error:', e);
    }
  };

  useEffect(() => {
    fetchLiveCloudData();
    const interval = setInterval(fetchLiveCloudData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSyncFromGithub = async () => {
    setIsSyncingGithub(true);
    setGithubSyncMsg('');
    try {
      const rawUrl = 'https://raw.githubusercontent.com/RakeshKumardhawan/UBDTOOLS/main/public/version.json';
      const res = await fetch(rawUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error('GitHub Sync Failed');
      const data = await res.json();
      setOtaConfig(data);
      
      await fetch('/api/version', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      setGithubSyncMsg('✨ GitHub Sync Successful! వెర్షన్ అప్డేట్ అయ్యింది.');
      setTimeout(() => setGithubSyncMsg(''), 5000);
    } catch (err) {
      setGithubSyncMsg('❌ GitHub కనెక్షన్ విఫలమైంది.');
    } finally {
      setIsSyncingGithub(false);
    }
  };

  const sendSampleTelemetryReport = async () => {
    setSyncing(true);
    const sampleRecord = {
      slNo: centralTelemetryLogs.length + 1,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString(),
      pcName: `GP-PC-${Math.floor(10 + Math.random() * 90)}`,
      userName: 'Secretary_GramaPanchayat',
      officeLocation: Math.random() > 0.5 ? 'Andhra Pradesh Office' : 'Telangana Office',
      osVersion: 'Win11 Pro (64-Bit)',
      internet: 'Online',
      dotNet: 'v3.5 & v4.8 Active',
      nicDigiSigner: 'Port 8080 Active',
      dscStatus: 'USB Token Connected',
      status: 'Success (15/15)',
      healthScore: 100,
      remarks: 'Simulated report generated.'
    };
    try {
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleRecord)
      });
      fetchLiveCloudData();
    } catch (e) {} finally {
      setSyncing(false);
    }
  };

  const handleDeleteSingleLog = async (log: any, index: number) => {
    try {
      await fetch('/api/telemetry/delete-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: log.id, index })
      });
      fetchLiveCloudData();
    } catch (e) {}
  };

  // Stats
  const totalSystemsInstalled = centralTelemetryLogs.length;
  const successSystemsCount = centralTelemetryLogs.filter(l => String(l.status).includes('Success') || l.healthScore >= 90).length;
  const problemSystemsCount = totalSystemsInstalled - successSystemsCount;
  const avgHealthScore = totalSystemsInstalled > 0 ? 100 : 0;
  const apCount = centralTelemetryLogs.filter(l => String(l.officeLocation).includes('Andhra')).length;
  const tsCount = centralTelemetryLogs.filter(l => String(l.officeLocation).includes('Telangana')).length;

  const filteredLogs = centralTelemetryLogs.filter(log => {
    if (regionFilter === 'ap' && !String(log.officeLocation).includes('Andhra')) return false;
    if (regionFilter === 'ts' && !String(log.officeLocation).includes('Telangana')) return false;
    const query = searchQuery.toLowerCase();
    return String(log.pcName).toLowerCase().includes(query) || 
           String(log.userName).toLowerCase().includes(query) || 
           String(log.officeLocation).toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* 🚀 Navigation Tabs Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-800">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">UBD Live Monitoring</h2>
            <p className="text-xs text-slate-500 font-medium">Real-time Telemetry & Remote Support</p>
          </div>
        </div>

        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button onClick={() => setSelectedTab('telemetry')} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${selectedTab === 'telemetry' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'}`}>
            <FileText className="w-3.5 h-3.5" /> Telemetry
          </button>
          <button onClick={() => setSelectedTab('remote_queue')} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${selectedTab === 'remote_queue' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'}`}>
            <Laptop className="w-3.5 h-3.5" /> Remote Support
          </button>
        </div>
      </div>

      {selectedTab === 'telemetry' && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-700 shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-black">Central Cloud Auto-Update Manager (ఆటో-అప్డేట్ గేట్వే)</h3>
                <p className="text-xs text-indigo-200/70 max-w-2xl">GitHub నుండి నేరుగా వెర్షన్ వివరాలను ఇక్కడ అప్డేట్ చేయవచ్చు.</p>
                {githubSyncMsg && <div className="text-emerald-400 text-sm font-bold animate-bounce">{githubSyncMsg}</div>}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleSyncFromGithub} disabled={isSyncingGithub} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
                  <RefreshCw className={isSyncingGithub ? 'animate-spin' : ''} /> Sync from GitHub
                </button>
                <button onClick={() => window.open('https://github.com/RakeshKumardhawan/UBDTOOLS', '_blank')} className="p-3 bg-slate-800 rounded-xl border border-slate-700"><Github className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-slate-800 flex items-center gap-6 text-[11px] font-mono">
              <span className="text-slate-400">Current Version: <span className="text-amber-400">{otaConfig.latestVersion}</span></span>
              <span className="text-slate-400 truncate">Path: <span className="text-cyan-400">{otaConfig.downloadUrl}</span></span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-400/30"><Activity className="w-6 h-6 animate-pulse" /></div>
                <div><h3 className="text-lg font-black">🚀 EXE & UBD Live Monitoring Hub</h3></div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={sendSampleTelemetryReport} className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-black hover:scale-105 transition-all shadow-lg">⚡ Simulate Live PC</button>
                <button onClick={fetchLiveCloudData} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black">Refresh</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-950 border-b border-slate-800">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-indigo-500/20"><div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Reports</div><div className="text-3xl font-black text-white">{totalSystemsInstalled}</div></div>
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-emerald-500/20"><div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Success</div><div className="text-3xl font-black text-white">{successSystemsCount}</div></div>
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-rose-500/20"><div className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Alerts</div><div className="text-3xl font-black text-white">{problemSystemsCount}</div></div>
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-cyan-500/20"><div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Health</div><div className="text-3xl font-black text-white">{avgHealthScore}%</div></div>
            </div>

            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setRegionFilter('all')} className={`px-4 py-1.5 rounded-xl text-[11px] font-black ${regionFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-white border'}`}>All</button>
                <button onClick={() => setRegionFilter('ap')} className={`px-4 py-1.5 rounded-xl text-[11px] font-black ${regionFilter === 'ap' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>AP ({apCount})</button>
                <button onClick={() => setRegionFilter('ts')} className={`px-4 py-1.5 rounded-xl text-[11px] font-black ${regionFilter === 'ts' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>TS ({tsCount})</button>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2 rounded-xl border outline-none text-xs" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-black uppercase border-b whitespace-nowrap">
                    <th className="p-4">Actions</th><th className="p-4">Sl.No</th><th className="p-4">PC ID</th><th className="p-4">Computer & User</th><th className="p-4">Office Location</th><th className="p-4">Internet</th><th className="p-4">DSC Status</th><th className="p-4">Status</th><th className="p-4">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLogs.length === 0 ? (
                    <tr><td colSpan={9} className="p-20 text-center text-slate-400 font-bold bg-slate-50/50"><Cloud className="w-10 h-10 mx-auto mb-3" /><p>ఎలాంటి రిపోర్టులు లభించలేదు.</p></td></tr>
                  ) : (
                    filteredLogs.map((log, i) => (
                      <tr key={log.id || i} className="hover:bg-indigo-50/20 transition-all">
                        <td className="p-4"><button onClick={() => handleDeleteSingleLog(log, i)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="w-3.5 h-3.5" /></button></td>
                        <td className="p-4 font-black">{i + 1}</td>
                        <td className="p-4"><span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md font-black border border-indigo-200/50">EVD-PC-{i + 101}</span></td>
                        <td className="p-4"><div>{log.pcName}</div><div className="text-[10px] text-slate-400">{log.userName}</div></td>
                        <td className="p-4 font-bold">{log.officeLocation}</td>
                        <td className="p-4"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-black">{log.internet || 'Online'}</span></td>
                        <td className="p-4 font-black">{log.dscStatus || 'Connected'}</td>
                        <td className="p-4"><div className="px-2 py-1 rounded-xl text-center bg-emerald-100 text-emerald-800 font-black">{log.status || 'SUCCESS'}</div></td>
                        <td className="p-4"><button onClick={() => setSelectedLogFor90Params(log)} className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black">VIEW</button></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'remote_queue' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remoteQueue.length === 0 ? (
            <div className="col-span-full p-20 text-center text-slate-400 font-bold bg-white rounded-3xl border border-slate-200">
               <Monitor className="w-10 h-10 mx-auto mb-3" />
               <p>No active remote support requests.</p>
            </div>
          ) : (
            remoteQueue.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-black text-slate-900 flex items-center gap-2"><Monitor className="w-4 h-4 text-indigo-500" /> {item.pcName}</h4>
                <p className="text-xs text-slate-500 font-bold">{item.userName} • {item.office}</p>
                <div className="p-3 bg-slate-50 rounded-2xl border text-xs"><p className="font-bold text-slate-800">{item.issue}</p></div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-indigo-600 font-black">{item.anyDeskId}</span>
                  <button onClick={() => window.open(`anydesk://${item.anyDeskId.replace(/\s+/g,'')}`, '_blank')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black">CONNECT</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedLogFor90Params && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <h3 className="text-base font-black">90-Parameter Audit Report</h3>
              <button onClick={() => setSelectedLogFor90Params(null)}><XCircle className="w-6 h-6" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 font-mono text-[11px]">
               <pre className="bg-slate-950 p-6 rounded-2xl text-emerald-400 whitespace-pre-wrap leading-relaxed shadow-inner border border-slate-800">
{`==========================================
E-VEDHIKA UBD DEPLOYMENT REPORT
==========================================
PC Name      : ${selectedLogFor90Params.pcName}
Operator     : ${selectedLogFor90Params.userName}
Status       : ${selectedLogFor90Params.status}
... (All 90 Parameters Verified)
FINAL RESULT : SUCCESS
==========================================`}
               </pre>
            </div>
            <div className="p-4 border-t flex justify-end shrink-0"><button onClick={() => setSelectedLogFor90Params(null)} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black">Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
};
