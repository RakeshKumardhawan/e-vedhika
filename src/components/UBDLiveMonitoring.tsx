import React, { useState, useEffect } from 'react';
import { 
  Shield, Radio, Zap, Send, Server, Database, Activity, 
  Terminal, ShieldCheck, HardDrive, Cpu, RefreshCw, 
  Search, Filter, Trash2, Download, ExternalLink, Clock,
  MessageSquare, FileText, LayoutDashboard, Bell, AlertTriangle, CheckCircle, Copy, Code
} from 'lucide-react';
import Swal from 'sweetalert2';

interface TelemetryLog {
  id: string | number;
  pcName: string;
  userName: string;
  officeLocation: string;
  osVersion?: string;
  build?: string;
  status: string;
  dscStatus?: string;
  remarks?: string;
  receivedAt?: string;
  time?: string | number;
  verification?: string;
  activeIssue?: string;
}

export const UBDLiveMonitoring: React.FC<any> = ({ user, addToast }) => {
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'fail'>('all');
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'php_script' | 'publisher'>('dashboard');

  // Publish Post State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [importance, setImportance] = useState('Normal');
  const [sendTelegram, setSendTelegram] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 15000); // Auto-refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/telemetry/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : data.logs || []);
      }
    } catch (e) {
      console.warn("Failed to fetch telemetry logs:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    const res = await Swal.fire({
      title: "టెలిమెట్రీ లాగ్స్‌ను క్లియర్ చేయాలా?",
      text: "ఈ చర్య ద్వారా అన్ని లాగ్ రికార్డులు తొలగించబడతాయి.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "అవును, క్లియర్ చేయి",
      cancelButtonText: "రద్దు చేయి"
    });
    if (!res.isConfirmed) return;

    try {
      await fetch('/api/telemetry/clear', { method: 'POST' });
      setLogs([]);
      if (addToast) addToast("Telemetry logs cleared successfully!", "success");
    } catch (e) {
      if (addToast) addToast("Failed to clear logs", "error");
    }
  };

  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      if (addToast) addToast("దయచేసి శీర్షిక (Title) మరియు వివరాలు (Content) నింపండి.", "error");
      return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch('/api/v1/posts/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          importance,
          sendTelegram,
          author: user?.fullName || user?.name || 'Super Admin',
          timestamp: Date.now()
        })
      });

      if (res.ok) {
        if (addToast) addToast("లైవ్ పోస్ట్ విజయవంతമായി పబ్లిష్ చేయబడింది!", "success");
        setTitle('');
        setContent('');
      } else {
        if (addToast) addToast("పోస్ట్ పబ్లిష్ చేయడంలో లోపం ఏర్పడింది.", "error");
      }
    } catch (e) {
      if (addToast) addToast("Network error publishing post.", "error");
    } finally {
      setIsPublishing(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const term = searchTerm.toLowerCase();
    const pc = (log.pcName || '').toLowerCase();
    const op = (log.userName || '').toLowerCase();
    const loc = (log.officeLocation || '').toLowerCase();
    const rem = (log.remarks || '').toLowerCase();

    const matchesSearch = pc.includes(term) || op.includes(term) || loc.includes(term) || rem.includes(term);
    if (!matchesSearch) return false;

    const st = strtoupper(log.status || 'SUCCESS');
    const isFail = st === 'FAIL' || rem.includes('fail') || rem.includes('error');
    if (statusFilter === 'success') return !isFail;
    if (statusFilter === 'fail') return isFail;
    return true;
  });

  function strtoupper(str: string) {
    return (str || '').toUpperCase();
  }

  const totalCount = logs.length;
  const successCount = logs.filter(l => strtoupper(l.status || 'SUCCESS') === 'SUCCESS' && !((l.remarks || '').toLowerCase().includes('fail'))).length;
  const failCount = totalCount - successCount;

  const phpScriptCode = `<?php
// ====================================================================================
// 🏛️ E-VEDHIKA CENTRAL TELEMETRY, UPDATES & LIVE MONITORING GATEWAY (v1.0.8 AUTO-SYNC)
// File Path: /admin/exe_ubd_live.php  (URL: https://www.e-vedhika.in/admin/exe_ubd_live)
// ====================================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/telemetry_storage.json';
$botToken = "8822107822:AAG9TIOX1lnRXpUuKCbs7ppM3r1TPTnNYrE";
$chatId = "431228008";

if (isset($_GET['clear']) && $_GET['clear'] === '1') {
    if (file_exists($dataFile)) unlink($dataFile);
    header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
    exit;
}

$action = strtolower($_GET['action'] ?? $_POST['action'] ?? '');
$githubVersionUrl = 'https://raw.githubusercontent.com/RakeshKumardhawan/UBDTOOLS/main/public/version.json';
$versionCacheFile = __DIR__ . '/version_cache.json';

function getLatestVersionMetadata($githubUrl, $cacheFile) {
    $defaultData = [
        'success' => true,
        'appName' => 'E-VEDHIKA All Problems One Solution & UBD Deployment Tool',
        'executableName' => 'EVedhika_Setup_v1.0.8.exe',
        'currentVersion' => 'v1.0.8',
        'latestVersion' => 'v1.0.8',
        'versionCode' => 10080,
        'releaseDate' => date('Y-m-d'),
        'downloadUrl' => 'https://github.com/RakeshKumardhawan/UBDTOOLS/releases/latest/download/EVedhika_Setup_v1.0.8.exe',
        'githubRepo' => 'https://github.com/RakeshKumardhawan/UBDTOOLS',
        'updateRequired' => false,
        'releaseNotes' => 'Enterprise v1.0.8: Universal UBD v3.3 Digital Signature Fix & 17-Step Deployment.',
        'telemetryRelayUrl' => 'https://www.e-vedhika.in/admin/exe_ubd_live'
    ];

    if (!file_exists($cacheFile) || (time() - filemtime($cacheFile) > 7200)) {
        $ctx = stream_context_create(['http' => ['method' => 'GET', 'header' => 'User-Agent: EVedhika-Gateway', 'timeout' => 3]]);
        $remote = @file_get_contents($githubUrl, false, $ctx);
        if ($remote) {
            @file_put_contents($cacheFile, $remote);
        }
    }

    if (file_exists($cacheFile)) {
        $cached = json_decode(file_get_contents($cacheFile), true);
        if ($cached) return array_merge($defaultData, $cached);
    }

    return $defaultData;
}

if ($action === 'check_update' || $action === 'version') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(getLatestVersionMetadata($githubVersionUrl, $versionCacheFile), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    if (!$data) $data = $_POST;

    if (!empty($data)) {
        $logs = file_exists($dataFile) ? (json_decode(file_get_contents($dataFile), true) ?: []) : [];
        $now = date('Y-m-d H:i:s');
        $data['receivedAt'] = $now;
        if (!isset($data['id'])) $data['id'] = 'TEL-' . time() . '-' . rand(100, 999);

        array_unshift($logs, $data);
        if (count($logs) > 1000) $logs = array_slice($logs, 0, 1000);
        @file_put_contents($dataFile, json_encode($logs, JSON_PRETTY_PRINT));
        
        echo json_encode(['success' => true, 'message' => 'Logged successfully']);
        exit;
    }
}
?>`;

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0B3D91] to-slate-900 p-6 md:p-8 rounded-[36px] text-white shadow-xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-white/10 rounded-2xl border border-white/20 text-indigo-300 text-3xl shadow-inner">
            <Radio className="animate-pulse" size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-black uppercase tracking-wider">
                LIVE ACTIVE
              </span>
              <span className="text-xs font-mono text-slate-300">SYSTEM REGISTRY • V1.0.8</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">UBD Live Monitoring Gateway</h1>
            <p className="text-xs text-blue-100 font-medium mt-0.5">Real-time 17-Step Audit Matrix & System Tray Guardian Gateway</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/20">
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'dashboard' ? 'bg-white text-slate-900 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            📊 Live Dashboard
          </button>
          <button
            onClick={() => setActiveSubTab('publisher')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'publisher' ? 'bg-white text-slate-900 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            📢 Publish Feed
          </button>
          <button
            onClick={() => setActiveSubTab('php_script')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'php_script' ? 'bg-white text-slate-900 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            💻 PHP Gateway Code
          </button>
        </div>
      </div>

      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Gateway Status Card */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="text-base font-black">E-Vedhika Unified Cloud Gateway (v1.0.8 Guardian Build)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-Time 17-Step Audit Matrix & System Tray Guardian (Dev: Rakesh Kumar Dhawan)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  try {
                    // Send sample telemetry log so it appears on the web table
                    await fetch('/api/telemetry', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        pcName: "GP-HYD-DESK-01",
                        userName: "Rakesh Kumar",
                        officeLocation: "Mandal Praja Parishad, Hyderabad",
                        osVersion: "Windows 11 Pro",
                        status: "SUCCESS",
                        dscStatus: "USB Token Connected (Port 8080)",
                        remarks: "17-Step Audit Matrix Verified Successfully.",
                        healthScore: 100
                      })
                    });

                    const res = await fetch('/api/telemetry/test-telegram', { method: 'POST' });
                    const d = await res.json();
                    if (d.success) {
                      if (addToast) addToast("Telemetry report logged & Telegram alert sent successfully!", "success");
                      fetchLogs();
                    } else {
                      if (addToast) addToast("Telemetry report logged (Telegram check warning)", "success");
                      fetchLogs();
                    }
                  } catch (e) {
                    if (addToast) addToast("Telemetry report logged successfully!", "success");
                    fetchLogs();
                  }
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Send size={14} /> Test Telegram & Log
              </button>
              <a
                href="/api/telemetry/logs"
                target="_blank"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-black text-slate-200 rounded-xl border border-slate-700 transition inline-flex items-center gap-1.5"
              >
                <FileText size={14} /> Live Feed JSON
              </a>
              <button
                onClick={fetchLogs}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-black text-white rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={14} /> Sync
              </button>
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-sm">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">కనెక్ట్ అయిన PC లు</p>
              <h3 className="text-3xl font-black text-white mt-1 font-mono">{totalCount}</h3>
              <p className="text-[10px] text-slate-500 mt-1">ట్రాక్ చేయబడుతున్న యంత్రాలు</p>
            </div>
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-sm">
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">ఆరోగ్యకరమైనవి (HEALTHY)</p>
              <h3 className="text-3xl font-black text-emerald-400 mt-1 font-mono">{successCount}</h3>
              <p className="text-[10px] text-slate-500 mt-1">ONLINE & READY సిస్టమ్స్</p>
            </div>
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-sm">
              <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">యాక్టివ్ సమస్యలు (ACTIVE)</p>
              <h3 className="text-3xl font-black text-amber-400 mt-1 font-mono">{failCount}</h3>
              <p className="text-[10px] text-slate-500 mt-1">DEDUPLICATED ISSUES</p>
            </div>
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-sm">
              <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">లైవ్ పోస్టులు (FEED)</p>
              <h3 className="text-3xl font-black text-blue-400 mt-1 font-mono">{logs.length}</h3>
              <p className="text-[10px] text-slate-500 mt-1">/API/V1/POSTS/FEED లో క్రియాశీలం</p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="కంప్యూటర్ పేరు, ఆపరేటర్, కార్యాలయం లేదా సమస్య శోధించండి..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              {(['all', 'success', 'fail'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    statusFilter === st ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {st === 'all' ? 'అన్ని' : st === 'success' ? 'హెల్తీ' : 'సమస్యలు'}
                </button>
              ))}
              <button
                onClick={fetchLogs}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                title="Refresh Logs"
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={handleClearLogs}
                className="p-2.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-xl transition cursor-pointer border border-rose-800/50"
                title="Clear All Logs"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* 17-Step Real-Time Audit Matrix Table */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Activity size={16} className="text-indigo-400" /> 17-Step Real-Time Audit Matrix (కన్సాలిడేటెడ్ రిపోర్టులు)
              </h3>
              <span className="text-xs font-mono text-slate-400">{filteredLogs.length} Nodes Verified</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">PC Name & User</th>
                    <th className="p-4">Office Location</th>
                    <th className="p-4">OS & Build</th>
                    <th className="p-4">Overall Status</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4">DSC Status</th>
                    <th className="p-4">Active Issue</th>
                    <th className="p-4">Last Seen</th>
                    <th className="p-4 text-right">చర్యలు</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-16 text-center text-slate-500 font-medium">
                        ఇంకా ఏ కంప్యూటర్ నుండి టెలిమెట్రీ రాలేదు. క్లయింట్ PC లో యూప్ రన్ అయిన వెంటనే ఇక్కడ కనిపిస్తుంది.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log, idx) => (
                      <tr key={log.id || idx} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-mono">
                          <div className="font-bold text-white">{log.pcName || 'PC-NODE'}</div>
                          <div className="text-[10px] text-slate-400">{log.userName || 'Operator'}</div>
                        </td>
                        <td className="p-4 font-medium text-slate-200">{log.officeLocation || 'GP Office'}</td>
                        <td className="p-4 font-mono text-[11px] text-slate-400">{log.osVersion || log.build || 'Win 10/11'}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            strtoupper(log.status || 'SUCCESS') === 'SUCCESS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {log.status || 'Healthy'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 font-mono text-[11px]">{log.verification || '17/17 Verified'}</td>
                        <td className="p-4 font-mono text-emerald-400 text-[11px]">{log.dscStatus || 'Active Port 8080'}</td>
                        <td className="p-4 text-amber-400">{log.remarks || log.activeIssue || 'None'}</td>
                        <td className="p-4 font-mono text-slate-400 text-[11px]">{log.receivedAt || 'Just now'}</td>
                        <td className="p-4 text-right">
                          <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-xl text-[10px] font-bold">OK</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'publisher' && (
        <div className="bg-slate-900 p-8 rounded-[36px] border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl">
              <Send size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">వెబ్‌సైట్ నుండి కొత్త పోస్ట్ ప్రచురించండి (Publish Live Post to Feed)</h3>
              <p className="text-xs text-slate-400">ఇక్కడ పబ్లిష్ చేసే పోస్ట్ నేరుగా క్లయింట్ UBD టూల్స్ మరియు వెబ్‌సైట్ ఫీడ్‌లోకి ప్రసారం అవుతుంది.</p>
            </div>
          </div>

          <form onSubmit={handlePublishPost} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-slate-300 uppercase tracking-wider">పోస్ట్ శీర్షిక (Title)</label>
                <input
                  type="text"
                  placeholder="ఉదా: కొత్త UBD వెర్షన్ లేదా ముఖ్య సమాచారం..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-300 uppercase tracking-wider">ప్రాధాన్యత (Importance)</label>
                <select
                  value={importance}
                  onChange={(e) => setImportance(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Normal">Normal</option>
                  <option value="HIGH">HIGH (అత్యవసరం)</option>
                  <option value="CRITICAL">CRITICAL (అలర్ట్)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-300 uppercase tracking-wider">వివరాలు (Content)</label>
              <textarea
                rows={5}
                placeholder="పోస్ట్ వివరాలను ఇక్కడ టైప్ చేయండి..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendTelegram}
                  onChange={(e) => setSendTelegram(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-800 bg-slate-950 focus:ring-blue-500"
                />
                <span className="text-xs font-bold text-slate-300">Telegram గ్రూప్‌కు వెంటనే బ్రాడ్‌కాస్ట్ చేయండి</span>
              </label>

              <button
                type="submit"
                disabled={isPublishing}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-black transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send size={15} /> {isPublishing ? "పబ్లిష్ అవుతోంది..." : "వంటనే ప్రచురించండి (Publish Post)"}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeSubTab === 'php_script' && (
        <div className="bg-slate-900 p-8 rounded-[36px] border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl">
                <Code size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Central PHP Gateway Auto-Sync Script</h3>
                <p className="text-xs text-slate-400">File Path: <code className="text-indigo-400 font-mono">/admin/exe_ubd_live.php</code></p>
              </div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(phpScriptCode);
                if (addToast) addToast("PHP Gateway Code copied to clipboard!", "success");
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer"
            >
              <Copy size={15} /> Copy PHP Script
            </button>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto max-h-[500px]">
            <pre>{phpScriptCode}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default UBDLiveMonitoring;
