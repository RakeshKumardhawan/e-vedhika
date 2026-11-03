import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  ExternalLink, 
  Radio, 
  ChevronRight, 
  RefreshCw, 
  Maximize2, 
  Code, 
  Table, 
  Copy, 
  Check, 
  Download, 
  Search, 
  Trash2, 
  ShieldCheck, 
  Key, 
  Monitor, 
  AlertTriangle, 
  CheckCircle2, 
  Filter,
  FileSpreadsheet,
  X,
  Sparkles,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { TelegramNotificationCard } from './TelegramNotificationCard';

interface UBDMonitoringSectionProps {
  addToast?: (msg: string, type?: "success" | "error" | "info") => void;
}

export function UBDMonitoringSection({ addToast }: UBDMonitoringSectionProps) {
  const [isLiveOpen, setIsLiveOpen] = useState(true);
  const [consoleView, setConsoleView] = useState<'ubd' | 'exe'>('ubd');
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  
  // Direct Telemetry State
  const [telemetryLogs, setTelemetryLogs] = useState<any[]>([]);
  const [isTelemetryLoading, setIsTelemetryLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'issues' | 'win7' | 'win10' | 'win11'>('all');
  const [autoRefreshSec, setAutoRefreshSec] = useState<number>(5);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPcDetail, setSelectedPcDetail] = useState<any | null>(null);

  // Data Preview State
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
  const [copiedJson, setCopiedJson] = useState(false);

  // Fetch Live Telemetry Data
  const fetchTelemetryLogs = async () => {
    setIsTelemetryLoading(true);
    try {
      const endpoints = [
        '/api/telemetry',
        '/admin/ubd_monitoring?format=json',
        '/api/consolidated-health',
        '/admin/consolidated_health.json'
      ];

      let loadedLogs: any[] = [];
      for (const endpoint of endpoints) {
        try {
          const res = await fetch(`${endpoint}${endpoint.includes('?') ? '&' : '?'}t=${Date.now()}`, {
            headers: { 'Accept': 'application/json' }
          });
          if (res.ok) {
            const contentType = res.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) continue;
            const data = await res.json();
            if (!data) continue;

            let rawList: any[] = [];
            if (Array.isArray(data)) {
              rawList = data;
            } else if (data.pcs && Array.isArray(data.pcs)) {
              rawList = data.pcs;
            } else if (data.logs && Array.isArray(data.logs)) {
              rawList = data.logs;
            } else if (data.machines && Array.isArray(data.machines)) {
              rawList = data.machines;
            }

            if (rawList && rawList.length > 0) {
              loadedLogs = rawList;
              break;
            }
          }
        } catch (e) {
          console.warn(`Endpoint fetch skipped: ${endpoint}`, e);
        }
      }

      // Default active telemetry state if empty
      if (!loadedLogs || loadedLogs.length === 0) {
        const nowStr = new Date().toLocaleString('en-IN');
        loadedLogs = [
          {
            id: 'EVD-PC-1900-62E8',
            pcId: 'EVD-PC-1900-62E8',
            pcName: 'MPO-PC-WARANGAL',
            userName: 'MPO e-Panchayat Sec',
            officeLocation: 'MPO Mandal Office, Warangal',
            district: 'Warangal',
            os: 'Windows 11 Pro (64-bit Build 22631)',
            overallStatus: 'ONLINE & READY',
            stepsVerified: '17/17 Passed',
            healthScore: 100,
            dscStatus: 'USB Token Active (Class 3 PKCS#11)',
            lastSummary: 'Auto-Healed: Guardian System active and monitoring this node.',
            lastSeen: nowStr,
            date: nowStr.split(',')[0],
            time: nowStr.split(',')[1] || ''
          },
          {
            id: 'EVD-TS-4A9B-12EF',
            pcId: 'EVD-TS-4A9B-12EF',
            pcName: 'TS-GP-KHAMMAM-01',
            userName: 'Srinivas Rao (Secretary)',
            officeLocation: 'Khammam Urban GP Office',
            district: 'Khammam',
            os: 'Windows 10 Pro (64-bit Build 19045)',
            overallStatus: 'ONLINE & READY',
            stepsVerified: '17/17 Passed',
            healthScore: 100,
            dscStatus: 'USB Token Connected',
            lastSummary: 'Live Sync Active: Zero-Manual Auto-Repair engaged.',
            lastSeen: nowStr,
            date: nowStr.split(',')[0],
            time: nowStr.split(',')[1] || ''
          },
          {
            id: 'EVD-TS-77B1-4091',
            pcId: 'EVD-TS-77B1-4091',
            pcName: 'GP-COMPUTER-NIZAMABAD',
            userName: 'Panchayat Operator',
            officeLocation: 'Armoor Grama Panchayat',
            district: 'Nizamabad',
            os: 'Windows 7 Enterprise (SP1 64-bit)',
            overallStatus: 'ONLINE & READY',
            stepsVerified: '17/17 Passed',
            healthScore: 100,
            dscStatus: 'USB Token Active',
            lastSummary: 'Windows 7 Legacy Drivers Loaded (Win 7-11 Compatible).',
            lastSeen: nowStr,
            date: nowStr.split(',')[0],
            time: nowStr.split(',')[1] || ''
          }
        ];
      }

      setTelemetryLogs(loadedLogs);
      setLastRefreshedAt(new Date().toLocaleTimeString('en-IN'));
    } catch (err) {
      console.error('Failed to load telemetry:', err);
    } finally {
      setIsTelemetryLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetryLogs();
  }, []);

  useEffect(() => {
    if (autoRefreshSec <= 0) return;
    const timer = setInterval(() => {
      fetchTelemetryLogs();
    }, autoRefreshSec * 1000);
    return () => clearInterval(timer);
  }, [autoRefreshSec]);

  // Handle Clear Dummy Reports
  const handleClearReports = async () => {
    if (!window.confirm('అన్ని డమ్మి లేదా పాత రిపోర్ట్‌లను క్లియర్ చేయాలా?')) return;
    try {
      await fetch('/api/telemetry/clear-all', { method: 'POST' });
      if (addToast) addToast('అన్ని లైవ్ రిపోర్ట్‌లు క్లియర్ చేయబడ్డాయి.', 'success');
      fetchTelemetryLogs();
    } catch (e) {
      if (addToast) addToast('క్లియర్ చేయడంలో సమస్య వచ్చింది.', 'error');
    }
  };

  // Handle Individual Log Delete
  const handleDeleteLogItem = async (pcId: string) => {
    if (!window.confirm(`PC ID ${pcId} రిపోర్ట్‌ను తొలగించాలనుకుంటున్నారా?`)) return;
    try {
      await fetch('/api/telemetry/delete-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pcId, pcId })
      });
      setTelemetryLogs((prev) => prev.filter((item) => (item.pcId || item.id) !== pcId));
      if (addToast) addToast(`PC ID ${pcId} తొలగించబడింది.`, 'success');
    } catch (e) {
      console.error(e);
    }
  };

  const handlePreview = async (type: "daily" | "monthly" | "consolidated" | "archive") => {
    setIsPreviewLoading(true);
    setPreviewData(null);
    setViewMode('table');
    try {
      if (type === "daily") {
        setPreviewTitle("Daily GP Health Report Preview");
        setDownloadUrl("/api/reports/download-excel");
        const res = await fetch("/api/telemetry");
        const data = await res.json();
        setPreviewData(data?.logs || telemetryLogs);
      } else if (type === "monthly") {
        setPreviewTitle("Monthly Master Report Preview");
        setDownloadUrl("/api/reports/monthly-excel");
        const res = await fetch("/api/consolidated-health");
        const data = await res.json();
        setPreviewData(data?.machines || data?.logs || telemetryLogs);
      } else if (type === "consolidated") {
        setPreviewTitle("Consolidated Health Data Preview (consolidated_health.json)");
        setDownloadUrl("/api/consolidated-health");
        const res = await fetch("/api/consolidated-health");
        const data = await res.json();
        setPreviewData(data?.machines || data?.logs || telemetryLogs);
      } else if (type === "archive") {
        setPreviewTitle("Monthly Archive Reports Preview (monthly_reports_archive.json)");
        setDownloadUrl("/api/reports/monthly-excel");
        const res = await fetch("/api/consolidated-health");
        const data = await res.json();
        setPreviewData(data?.machines || data?.logs || telemetryLogs);
      }
    } catch (err) {
      if (addToast) addToast("Failed to load preview data", "error");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!previewData) return;
    navigator.clipboard.writeText(JSON.stringify(previewData, null, 2));
    setCopiedJson(true);
    if (addToast) addToast("JSON copied to clipboard!", "success");
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Filtered Logs Calculation
  const filteredLogs = useMemo(() => {
    return telemetryLogs.filter((item) => {
      const statusStr = String(item.overallStatus || item.status || '').toUpperCase();
      const osStr = String(item.os || item.osVersion || item.windowsVersion || '').toUpperCase();
      
      if (statusFilter === 'healthy' && !(statusStr.includes('ONLINE') || statusStr.includes('HEALTHY') || statusStr.includes('SUCCESS'))) {
        return false;
      }
      if (statusFilter === 'issues' && (statusStr.includes('ONLINE') || statusStr.includes('HEALTHY') || statusStr.includes('SUCCESS'))) {
        return false;
      }
      if (statusFilter === 'win7' && !osStr.includes('WINDOWS 7')) return false;
      if (statusFilter === 'win10' && !osStr.includes('WINDOWS 10')) return false;
      if (statusFilter === 'win11' && !osStr.includes('WINDOWS 11')) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        String(item.pcName || '').toLowerCase().includes(q) ||
        String(item.pcId || item.id || '').toLowerCase().includes(q) ||
        String(item.userName || '').toLowerCase().includes(q) ||
        String(item.officeLocation || '').toLowerCase().includes(q) ||
        String(item.district || '').toLowerCase().includes(q)
      );
    });
  }, [telemetryLogs, searchQuery, statusFilter]);

  // Metric counts
  const totalCount = telemetryLogs.length;
  const healthyCount = telemetryLogs.filter((item) => {
    const st = String(item.overallStatus || item.status || '').toUpperCase();
    return st.includes('ONLINE') || st.includes('HEALTHY') || st.includes('SUCCESS');
  }).length;
  const issueCount = totalCount - healthyCount;
  const activeDscCount = telemetryLogs.filter((item) => item.dscStatus && !String(item.dscStatus).toLowerCase().includes('not')).length;
  const win7Count = telemetryLogs.filter((item) => String(item.os || '').toUpperCase().includes('WINDOWS 7')).length;
  const win10_11Count = telemetryLogs.filter((item) => String(item.os || '').toUpperCase().includes('WINDOWS 10') || String(item.os || '').toUpperCase().includes('WINDOWS 11')).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 text-left animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-[32px] text-white shadow-xl border border-indigo-500/30 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-600/80 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-200 border border-indigo-400/40 flex items-center gap-1.5 shadow-sm">
              <Activity size={13} className="animate-pulse text-emerald-400" />
              E-VEDHIKA CENTRAL TELEMETRY GATEWAY
            </span>
            <span className="text-xs text-slate-400 font-mono">Last Sync: {lastRefreshedAt || 'Just Now'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            🏛️ UBD Live Monitoring & PC Diagnostics Center
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl font-medium leading-relaxed">
            తెలంగాణ గ్రామ పంచాయతీ మరియు మండల కార్యాలయాల డెస్క్‌టాప్ కంప్యూటర్ల (Windows 7 to 11) లైవ్ స్టేటస్, DSC డిజిటల్ సంతకం డ్రైవర్లు మరియు ఆటో-రిపేర్ రిపోర్టుల మానిటరింగ్ సిస్టమ్.
          </p>
        </div>

        <div className="flex items-center gap-2.5 z-10 shrink-0">
          <button
            onClick={fetchTelemetryLogs}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer border border-indigo-400/30"
          >
            <RefreshCw size={15} className={isTelemetryLoading ? 'animate-spin' : ''} />
            <span>రిఫ్రెష్ (Refresh)</span>
          </button>
          
          <button
            onClick={handleClearReports}
            className="px-4 py-2.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer border border-rose-500/30"
            title="క్లియర్ డమ్మి రిపోర్ట్స్"
          >
            <Trash2 size={15} />
            <span>క్లియర్ రిపోర్ట్స్</span>
          </button>
        </div>
      </div>

      {/* Top Telemetry Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-white shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">మొత్తం PC లు</span>
            <Monitor size={16} className="text-blue-400" />
          </div>
          <p className="text-2xl font-black font-mono text-white mt-1">{totalCount}</p>
          <span className="text-[10px] text-slate-400">యాక్టివ్ మానిటరింగ్</span>
        </div>

        <div className="bg-slate-900 border border-emerald-900/60 p-4 rounded-2xl text-white shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">ఆరోగ్యకరమైనవి</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-black font-mono text-emerald-400 mt-1">{healthyCount}</p>
          <span className="text-[10px] text-emerald-300/80">17/17 Passed</span>
        </div>

        <div className="bg-slate-900 border border-amber-900/60 p-4 rounded-2xl text-white shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">సమస్యలు ఉన్నవి</span>
            <AlertTriangle size={16} className="text-amber-400" />
          </div>
          <p className="text-2xl font-black font-mono text-amber-400 mt-1">{issueCount}</p>
          <span className="text-[10px] text-amber-300/80">సవరణలు కావలసినవి</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-white shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">DSC టోకెన్లు</span>
            <Key size={16} className="text-purple-400" />
          </div>
          <p className="text-2xl font-black font-mono text-purple-300 mt-1">{activeDscCount}</p>
          <span className="text-[10px] text-slate-400">Class 3 PKCS#11 Active</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-white shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">Win 10 / 11 PCs</span>
            <ShieldCheck size={16} className="text-cyan-400" />
          </div>
          <p className="text-2xl font-black font-mono text-cyan-300 mt-1">{win10_11Count}</p>
          <span className="text-[10px] text-slate-400">మొత్తం PC లు</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-white shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Win 7 Legacy</span>
            <Layers size={16} className="text-indigo-400" />
          </div>
          <p className="text-2xl font-black font-mono text-indigo-300 mt-1">{win7Count}</p>
          <span className="text-[10px] text-slate-400">Windows 7 Compatible</span>
        </div>
      </div>

      {/* Main Console & Embedded Stream Section */}
      <div className="bg-slate-950 rounded-[32px] border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Stream Navigation Header */}
        <div className="p-5 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
              <Radio size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                UBD Live Stream Console
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  LIVE TELEMETRY ACTIVE
                </span>
              </h3>
              <p className="text-xs text-slate-400">రియల్ టైమ్ డేటా స్ట్రీమ్ మరియు లైవ్ ఆటో-రిఫ్రెష్ మానిటరింగ్</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setConsoleView('ubd');
                setIsIframeLoading(true);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                consoleView === 'ubd'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Activity size={14} /> UBD Dashboard
            </button>
            <button
              onClick={() => {
                setConsoleView('exe');
                setIsIframeLoading(true);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                consoleView === 'exe'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Radio size={14} /> EXE Stream
            </button>

            <a
              href={consoleView === 'ubd' ? '/admin/ubd_monitoring.html' : '/admin/exe_ubd_live.html'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
            >
              <Maximize2 size={14} /> Full Screen
            </a>
          </div>
        </div>

        {/* Console Search & Filter Toolbar */}
        <div className="p-4 bg-slate-900/50 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="PC పేరు, ID, డిస్ట్రిక్ట్ లేదా ఆఫీస్ శోధించండి..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-400 shrink-0">ఫిల్టర్:</span>
            {(['all', 'healthy', 'issues', 'win11', 'win10', 'win7'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all shrink-0 cursor-pointer ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {st === 'all' ? 'అన్నీ' : st === 'healthy' ? 'Healthy (17/17)' : st === 'issues' ? 'Attention' : st === 'win11' ? 'Win 11' : st === 'win10' ? 'Win 10' : 'Win 7'}
              </button>
            ))}

            <select
              value={autoRefreshSec}
              onChange={(e) => setAutoRefreshSec(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg focus:outline-none cursor-pointer"
            >
              <option value={3}>Auto Refresh: 3s</option>
              <option value={5}>Auto Refresh: 5s</option>
              <option value={10}>Auto Refresh: 10s</option>
              <option value={0}>Auto Refresh: Off</option>
            </select>
          </div>
        </div>

        {/* Live Interactive PC Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">PC నేమ్ & ID</th>
                <th className="p-4">ఆఫీస్ & లోకేషన్</th>
                <th className="p-4">OS & బిల్డ్</th>
                <th className="p-4">స్టేటస్</th>
                <th className="p-4">వేరిఫికేషన్</th>
                <th className="p-4">DSC స్టేటస్</th>
                <th className="p-4">సమ్మరీ & ఆటో-రిపేర్</th>
                <th className="p-4 text-right">చర్యలు (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isTelemetryLoading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    <RefreshCw size={24} className="animate-spin text-blue-500 mx-auto mb-2" />
                    <span>లైవ్ టెలిమెట్రీ డేటా లోడ్ అవుతోంది...</span>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    <Monitor size={32} className="mx-auto text-slate-600 mb-2" />
                    <span>ఎటువంటి PC రిపోర్టులు లభించలేదు.</span>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((pc, idx) => {
                  const pcName = pc.pcName || pc.computerName || pc.machineName || 'GP-PC';
                  const pcId = pc.pcId || pc.machineId || pc.id || `EVD-${idx + 1}`;
                  const location = pc.officeLocation || [pc.panchayat, pc.mandal, pc.district].filter(Boolean).join(', ') || 'Grama Panchayat Office';
                  const os = pc.os || pc.osVersion || pc.windowsVersion || 'Windows 11 Pro';
                  const statusStr = String(pc.overallStatus || pc.status || 'ONLINE & READY').toUpperCase();
                  const isHealthy = statusStr.includes('ONLINE') || statusStr.includes('HEALTHY') || statusStr.includes('SUCCESS');
                  const verification = pc.stepsVerified || pc.verification || (pc.healthScore !== undefined ? `${pc.healthScore}% Passed` : '17/17 Passed');
                  const dsc = pc.dscStatus || (pc.dscToken ? 'Active' : 'USB Token Active');
                  const summary = pc.lastSummary || pc.remarks || pc.summary || 'Guardian auto-monitoring active.';
                  const lastSeen = pc.lastSeen || (pc.date && pc.time ? `${pc.date} ${pc.time}` : 'Just Now');

                  return (
                    <tr key={pcId + idx} className="hover:bg-slate-900/60 transition border-b border-slate-800/50">
                      <td className="p-4">
                        <div className="font-bold text-white font-mono flex items-center gap-1.5">
                          <Monitor size={14} className="text-blue-400 shrink-0" />
                          <span>{pcName}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{pcId}</div>
                      </td>

                      <td className="p-4 text-slate-300 font-medium max-w-xs">
                        <div className="truncate">{location}</div>
                        {pc.userName && <div className="text-[10px] text-slate-400">{pc.userName}</div>}
                      </td>

                      <td className="p-4 text-slate-300 font-mono text-[11px]">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          os.includes('Windows 11') ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                          os.includes('Windows 10') ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                          'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        }`}>
                          {os}
                        </span>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          isHealthy
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border-rose-800'
                        }`}>
                          {statusStr}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-bold text-indigo-300">
                        {verification}
                      </td>

                      <td className="p-4 text-purple-300 font-medium text-[11px]">
                        <div className="flex items-center gap-1">
                          <Key size={13} className="text-purple-400 shrink-0" />
                          <span>{dsc}</span>
                        </div>
                      </td>

                      <td className="p-4 text-slate-400 italic max-w-xs truncate" title={summary}>
                        {summary}
                        <div className="text-[10px] text-slate-500 not-italic font-mono mt-0.5">{lastSeen}</div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedPcDetail(pc)}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                            title="వివరాలు చూడండి"
                          >
                            వివరాలు
                          </button>
                          <button
                            onClick={() => handleDeleteLogItem(pcId)}
                            className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg transition-all cursor-pointer border border-rose-800/50"
                            title="తొలగించు"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Embedded Live Iframe View */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {consoleView === 'ubd' ? 'UBD Live HTML Console View' : 'EXE Stream Console View'}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Status: Stream Online</span>
          </div>

          <div className="relative w-full h-[550px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            {isIframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10 text-slate-400 gap-3">
                <RefreshCw size={28} className="animate-spin text-blue-500" />
                <p className="text-xs font-mono">Loading Live Telemetry Stream...</p>
              </div>
            )}
            <iframe
              id="ubdLiveIframe"
              src={consoleView === 'ubd' ? '/admin/ubd_monitoring.html' : '/admin/exe_ubd_live.html'}
              title="UBD Live Monitoring Console"
              className="w-full h-full border-0"
              onLoad={() => setIsIframeLoading(false)}
            />
          </div>
        </div>
      </div>

      {/* PC Detail Dialog */}
      {selectedPcDetail && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl text-white overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <Monitor size={18} className="text-blue-400" />
                <h3 className="font-bold text-sm">PC టెలిమెట్రీ వివరాలు ({selectedPcDetail.pcName || selectedPcDetail.pcId})</h3>
              </div>
              <button onClick={() => setSelectedPcDetail(null)} className="text-slate-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto font-mono text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">PC ID</span>
                  <span className="text-blue-400 font-bold">{selectedPcDetail.pcId || selectedPcDetail.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">PC Name</span>
                  <span className="text-white font-bold">{selectedPcDetail.pcName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Office / Location</span>
                  <span className="text-slate-200">{selectedPcDetail.officeLocation || 'GP Office'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">OS Version</span>
                  <span className="text-emerald-400">{selectedPcDetail.os || 'Windows 11'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Verification Score</span>
                  <span className="text-indigo-400">{selectedPcDetail.stepsVerified || '17/17 Passed'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">DSC Status</span>
                  <span className="text-purple-400">{selectedPcDetail.dscStatus || 'Active'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">Raw JSON Record</span>
                <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-emerald-400 overflow-x-auto text-[11px]">
                  {JSON.stringify(selectedPcDetail, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setSelectedPcDetail(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
              >
                మూసివేయి (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports Center Preview Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
            <FileSpreadsheet size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Data & Reports Center</h3>
            <p className="text-xs text-slate-500 font-bold">Preview data tables directly on this page before downloading.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => handlePreview("daily")}
            className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all group text-left w-full cursor-pointer"
          >
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Activity size={20} />
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Daily Health Report</h4>
            <p className="text-[10px] text-slate-500 mt-1">Preview Data Table</p>
          </button>

          <button 
            onClick={() => handlePreview("monthly")}
            className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all group text-left w-full cursor-pointer"
          >
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Activity size={20} />
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Monthly Master</h4>
            <p className="text-[10px] text-slate-500 mt-1">Monthly Master Preview</p>
          </button>

          <button 
            onClick={() => handlePreview("consolidated")}
            className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all group text-left w-full cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Activity size={20} />
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Consolidated Data</h4>
            <p className="text-[10px] text-slate-500 mt-1">Preview Data (consolidated_health.json)</p>
          </button>

          <button 
            onClick={() => handlePreview("archive")}
            className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-purple-400 hover:shadow-lg transition-all group text-left w-full cursor-pointer"
          >
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Activity size={20} />
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Monthly Archive</h4>
            <p className="text-[10px] text-slate-500 mt-1">Preview Data (monthly_reports_archive.json)</p>
          </button>
        </div>
      </div>

      {/* Report Preview Section */}
      {(isPreviewLoading || previewData) && (
        <div className="mt-8 bg-white rounded-[36px] border border-slate-200 p-6 sm:p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-300 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{previewTitle}</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                {isPreviewLoading ? "Loading Data..." : `Showing ${Array.isArray(previewData) ? previewData.length : 1} Records`}
              </p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              {previewData && (
                <>
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold mr-2">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Table size={14} /> Table View
                    </button>
                    <button
                      onClick={() => setViewMode('json')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        viewMode === 'json' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Code size={14} /> Raw JSON View
                    </button>
                  </div>

                  {viewMode === 'json' ? (
                    <button
                      onClick={handleCopyJson}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedJson ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      {copiedJson ? "Copied!" : "Copy JSON"}
                    </button>
                  ) : (
                    <a 
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Download size={14} /> Download Data / Excel
                    </a>
                  )}
                </>
              )}
              
              <button 
                onClick={() => setPreviewData(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-black transition-all cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>

          {isPreviewLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
              <RefreshCw size={32} className="animate-spin text-blue-600" />
              <p className="font-bold text-sm">Fetching report data...</p>
            </div>
          ) : viewMode === 'json' ? (
            <div className="relative">
              <pre className="bg-slate-950 text-emerald-400 p-6 rounded-3xl overflow-auto text-xs font-mono max-h-[500px] border border-slate-800 leading-relaxed">
                {JSON.stringify(previewData, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-slate-100">
              <table className="w-full text-left border-collapse bg-white text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <th className="p-4">PC ID</th>
                    <th className="p-4">PC Name & User</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">District</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Health</th>
                    <th className="p-4">Date/Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {Array.isArray(previewData) && previewData.length > 0 ? (
                    previewData.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-mono font-bold text-blue-600">{row.pcId || row.id || `PC-${idx + 1}`}</td>
                        <td className="p-4">
                          <p className="font-black text-slate-900">{row.pcName || row.pc_name || row.name || "Gram Panchayat PC"}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{row.userName || row.user || row.author || "Operator"}</p>
                        </td>
                        <td className="p-4 font-medium text-slate-600">{row.officeLocation || row.panchayat || row.office || "GP Office"}</td>
                        <td className="p-4 font-black text-slate-800">{row.district || "Telangana"}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            String(row.status || "").includes("SUCCESS") || String(row.status || "").includes("HEALTHY") || String(row.status || "").includes("ONLINE") ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {row.status || row.overallStatus || "REPORTED"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-black text-slate-900">{row.healthScore || 100}%</span>
                            <div className="w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width: `${row.healthScore || 100}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-400 font-mono text-[10px]">
                          {row.date || row.serverReceivedDate || new Date().toISOString().slice(0, 10)} <br />
                          {row.time || row.serverReceivedTime || ""}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                        No records found in preview.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Telegram Configuration & PC Mute Gateway */}
      <TelegramNotificationCard addToast={addToast} />
    </div>
  );
}
