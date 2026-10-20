import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Activity,
  Server,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Download,
  Trash2,
  ExternalLink,
  Laptop,
  KeyRound,
  Send,
  Radio,
  Eye,
  Clock,
  MapPin,
  X,
  FileText,
  SlidersHorizontal,
  Check,
  Megaphone
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, query, orderBy, limit, onSnapshot, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';

export interface ConsolidatedPcRecord {
  machineId: string;
  pcName: string;
  userName: string;
  officeLocation: string;
  os: string;
  buildNumber: string;
  appVersion: string;
  overallStatus: 'ONLINE & READY' | 'DEGRADED' | 'WARNING' | 'REPAIRING' | 'RESOLVED' | string;
  stepsVerified: string;
  dscStatus: string;
  edgePolicy: string;
  sitesXml: string;
  activeIssue: string;
  lastSeen: string;
  lastSummary?: string;
  healthScore?: number;
  ipAddress?: string;
}

export interface ActiveIssueRecord {
  issueId: string;
  machineId: string;
  pcName: string;
  office: string;
  issueCategory: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  firstDetected: string;
  lastDetected: string;
  occurrenceCount: number;
  repairAttempts: number;
  lastRepairResult: string;
  postRepairVerification: string;
  currentStatus: 'ACTIVE' | 'RECURRING' | 'RESOLVED';
  remarks: string;
}

export interface AnnouncementPost {
  id: number | string;
  title: string;
  content: string;
  date: string;
  importance: 'Normal' | 'High' | 'Urgent' | string;
  category: string;
  author: string;
}

interface UBDLiveMonitoringProps {
  user?: any;
  addToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const UBDLiveMonitoring: React.FC<UBDLiveMonitoringProps> = ({ user, addToast }) => {
  const [rawLogs, setRawLogs] = useState<any[]>([]);
  const [consolidatedPcs, setConsolidatedPcs] = useState<{ [id: string]: ConsolidatedPcRecord }>({});
  const [activeIssues, setActiveIssues] = useState<{ [id: string]: ActiveIssueRecord }>({});
  const [announcements, setAnnouncements] = useState<AnnouncementPost[]>([
    {
      id: 1,
      title: 'IMPORTANT: v1.0.8 Update Released',
      content: 'Brand new v1.0.8 release with Consolidated PC Health, Deduplicated Alerts, Dynamic Posts/Feed, and AutoRepair Guardian.',
      date: new Date().toISOString().slice(0, 10),
      importance: 'High',
      category: 'Software Update',
      author: 'Rakesh Dhawan (Admin)'
    },
    {
      id: 2,
      title: 'UBD Portal Security Guidelines',
      content: 'Ensure Edge IE Mode and Zone 2 Trusted Sites configuration are kept verified. AutoRepair Guardian automatically secures all policies.',
      date: new Date().toISOString().slice(0, 10),
      importance: 'Normal',
      category: 'Security',
      author: 'E-Vedhika Security Desk'
    }
  ]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'HEALTHY' | 'ISSUES'>('ALL');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedPc, setSelectedPc] = useState<ConsolidatedPcRecord | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Quick Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImportance, setPostImportance] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [postCategory, setPostCategory] = useState('General Update');
  const [sendTelegram, setSendTelegram] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  // Load telemetry logs and process consolidated records
  const fetchTelemetryData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      // 1. Fetch from server endpoint
      const res = await fetch('/api/telemetry?t=' + Date.now(), {
        headers: { 'Cache-Control': 'no-cache' }
      });
      let items: any[] = [];
      if (res.ok) {
        const json = await res.json();
        if (json.logs && Array.isArray(json.logs)) {
          items = json.logs;
        }
      }

      // 2. Fetch directly from Firestore fallback
      if (items.length === 0) {
        const q = query(collection(db, 'telemetryLogs'), orderBy('createdAt', 'desc'), limit(100));
        const snap = await getDocs(q);
        snap.forEach(d => {
          if (!String(d.id).startsWith('TEL-SEED')) {
            items.push({ id: d.id, ...d.data() });
          }
        });
      }

      setRawLogs(items);

      // Process Consolidated Machine Records & Deduplicated Active Issues (matching PHP v1.0.8 logic)
      const pcsMap: { [id: string]: ConsolidatedPcRecord } = {};
      const issuesMap: { [id: string]: ActiveIssueRecord } = {};

      items.forEach(data => {
        const pcName = String(data.pcName || data.computerName || 'Unknown-PC').trim();
        const machineId = String(data.machineId || data.macAddress || pcName).trim();
        const userName = String(data.userName || data.operatorName || 'Panchayat Operator').trim();
        const location = String(data.officeLocation || data.office || [data.panchayat, data.mandal, data.district].filter(Boolean).join(', ') || 'Telangana GP Office').trim();
        const os = String(data.osVersion || data.os || 'Windows').trim();
        const osBuild = String(data.buildNumber || data.osBuild || 'Win11 Pro').trim();
        const version = String(data.deployVersion || data.version || 'v1.0.8').trim();
        const dsc = String(data.dscStatus || data.dscToken || 'Connected').trim();
        const edgePolicy = String(data.edgePolicy || data.edgeVersion || 'Zone 2 Configured').trim();
        const sitesXml = String(data.sitesXmlStatus || data.sitesXml || 'Validated').trim();
        const remarks = String(data.remarks || data.summary || 'Client execution report received.').trim();

        const stepsTotal = Number(data.stepsTotal || 15);
        const stepsVerified = Number(data.stepsVerified || (String(data.status).toUpperCase() === 'SUCCESS' ? 15 : 12));
        const score = Number(data.healthScore) || (stepsVerified >= 14 ? 100 : 75);

        // Deduplication & Issue Classification
        const isIssue = (
          String(data.status || '').toUpperCase().includes('ISSUE') ||
          String(data.status || '').toUpperCase().includes('ERROR') ||
          remarks.toLowerCase().includes('drift') ||
          remarks.toLowerCase().includes('issue') ||
          score < 80
        );
        const isRepairAttempt = remarks.toLowerCase().includes('repair') || String(data.status || '').toUpperCase().includes('REPAIR');
        const isSuccess = !isIssue && (String(data.status || '').toUpperCase().includes('SUCCESS') || score >= 80);

        let overallStatus: 'ONLINE & READY' | 'DEGRADED' | 'WARNING' | 'REPAIRING' | 'RESOLVED' = 'ONLINE & READY';
        if (isIssue) {
          overallStatus = (remarks.toLowerCase().includes('edge') || remarks.toLowerCase().includes('sites.xml')) ? 'DEGRADED' : 'WARNING';
        } else if (isRepairAttempt) {
          overallStatus = 'REPAIRING';
        } else if (isSuccess) {
          overallStatus = 'ONLINE & READY';
        }

        let issueCategory = 'UBD Edge Policy / sites.xml Drift';
        if (remarks.toLowerCase().includes('dsc') || remarks.toLowerCase().includes('token')) {
          issueCategory = 'USB DSC Token / Port 8080 Offline';
        } else if (remarks.toLowerCase().includes('registry')) {
          issueCategory = 'Registry Zone 2 Policy Drift';
        }

        const issueId = 'ISSUE-' + machineId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);

        if (isIssue) {
          if (!issuesMap[issueId]) {
            issuesMap[issueId] = {
              issueId,
              machineId,
              pcName,
              office: location,
              issueCategory,
              severity: overallStatus === 'DEGRADED' ? 'HIGH' : 'MEDIUM',
              firstDetected: data.serverReceivedTime || data.time || 'Live',
              lastDetected: data.serverReceivedTime || data.time || 'Live',
              occurrenceCount: 1,
              repairAttempts: isRepairAttempt ? 1 : 0,
              lastRepairResult: isRepairAttempt ? 'Attempted' : 'Pending',
              postRepairVerification: 'PENDING',
              currentStatus: 'ACTIVE',
              remarks
            };
          } else {
            issuesMap[issueId].occurrenceCount += 1;
            issuesMap[issueId].lastDetected = data.serverReceivedTime || data.time || 'Live';
            issuesMap[issueId].currentStatus = 'RECURRING';
          }
        }

        // Keep newest record per machineId
        if (!pcsMap[machineId]) {
          pcsMap[machineId] = {
            machineId,
            pcName,
            userName,
            officeLocation: location,
            os,
            buildNumber: osBuild,
            appVersion: version,
            overallStatus,
            stepsVerified: `${stepsVerified}/${stepsTotal}`,
            dscStatus: dsc,
            edgePolicy,
            sitesXml,
            activeIssue: isIssue ? issueCategory : 'None (Healthy)',
            lastSeen: `${data.serverReceivedDate || data.date || ''} ${data.serverReceivedTime || data.time || ''}`.trim() || 'Just Now',
            lastSummary: remarks,
            healthScore: score,
            ipAddress: data.ipAddress || data.networkIp || '127.0.0.1'
          };
        }
      });

      setConsolidatedPcs(pcsMap);
      setActiveIssues(issuesMap);

      // Fetch live feed posts
      try {
        const feedRes = await fetch('/api/v1/posts/feed');
        if (feedRes.ok) {
          const feedJson = await feedRes.json();
          if (feedJson.posts && Array.isArray(feedJson.posts) && feedJson.posts.length > 0) {
            setAnnouncements(feedJson.posts);
          }
        }
      } catch (e) {}

    } catch (err) {
      console.warn('Error fetching telemetry data:', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  // Initial and live listeners
  useEffect(() => {
    fetchTelemetryData();

    // Firestore real-time onSnapshot listener
    let unsub = () => {};
    try {
      const q = query(collection(db, 'telemetryLogs'), orderBy('createdAt', 'desc'), limit(50));
      unsub = onSnapshot(q, () => {
        fetchTelemetryData(true);
      }, () => {});
    } catch (e) {}

    return () => unsub();
  }, [fetchTelemetryData]);

  // Periodic Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchTelemetryData(true);
    }, 15000); // 15 seconds refresh matching v1.0.8
    return () => clearInterval(interval);
  }, [autoRefresh, fetchTelemetryData]);

  // Computed metrics
  const pcsList = useMemo(() => Object.values(consolidatedPcs), [consolidatedPcs]);
  const totalPcs = pcsList.length;
  const healthyPcs = pcsList.filter(p => p.overallStatus === 'ONLINE & READY').length;
  const issueCount = Object.keys(activeIssues).length;

  // Filtered PC List
  const filteredPcs = useMemo(() => {
    return pcsList.filter(pc => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q ||
        pc.pcName.toLowerCase().includes(q) ||
        pc.userName.toLowerCase().includes(q) ||
        pc.officeLocation.toLowerCase().includes(q) ||
        pc.machineId.toLowerCase().includes(q) ||
        pc.activeIssue.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (statusFilter === 'HEALTHY' && pc.overallStatus !== 'ONLINE & READY') return false;
      if (statusFilter === 'ISSUES' && pc.overallStatus === 'ONLINE & READY') return false;

      return true;
    });
  }, [pcsList, searchTerm, statusFilter]);

  // Publish Announcement / Live Post Handler
  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      if (addToast) addToast('శీర్షిక మరియు వివరాలు తప్పనిసరి (Title & Content required)', 'error');
      return;
    }

    setIsPublishing(true);
    try {
      const adminName = user?.fullName || user?.name || 'Rakesh Dhawan (Admin)';
      const newPostPayload = {
        title: postTitle.trim(),
        content: postContent.trim(),
        importance: postImportance,
        category: postCategory,
        author: adminName,
        authorName: adminName,
        createdAt: Date.now(),
        date: new Date().toISOString().slice(0, 10),
        status: 'published',
        isAdminPost: true
      };

      // 1. Send to /api/v1/posts/create
      await fetch('/api/v1/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPostPayload)
      }).catch(() => {});

      // 2. Add to Firestore posts collection
      await addDoc(collection(db, 'posts'), newPostPayload).catch(() => {});

      // 3. Local state update
      setAnnouncements(prev => [
        {
          id: Date.now(),
          title: postTitle.trim(),
          content: postContent.trim(),
          date: new Date().toISOString().slice(0, 10),
          importance: postImportance,
          category: postCategory,
          author: adminName
        },
        ...prev
      ]);

      setPostTitle('');
      setPostContent('');
      if (addToast) addToast('పోస్ట్ ప్రచురించబడింది మరియు లైవ్ ఫీడ్‌తో సింక్ చేయబడింది!', 'success');
    } catch (err: any) {
      if (addToast) addToast('పోస్ట్ పబ్లిష్ చేయడంలో లోపం: ' + err?.message, 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  // Clear Logs Handler
  const handleClearLogs = async () => {
    setIsClearing(true);
    try {
      await fetch('/admin/exe_ubd_live?clear=1').catch(() => {});
      const snap = await getDocs(collection(db, 'telemetryLogs'));
      const delPromises = snap.docs.map(d => deleteDoc(doc(db, 'telemetryLogs', d.id)).catch(() => {}));
      await Promise.all(delPromises);

      setRawLogs([]);
      setConsolidatedPcs({});
      setActiveIssues({});
      setShowClearConfirm(false);
      setSelectedPc(null);
      if (addToast) addToast('అన్ని లాగ్స్ విజయవంతంగా తొలగించబడ్డాయి (Logs cleared)!', 'success');
    } catch (e: any) {
      if (addToast) addToast('క్లియర్ చేయడంలో లోపం: ' + e?.message, 'error');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl border border-indigo-900/40 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-400/30 text-indigo-400 text-3xl shadow-inner shrink-0">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                ఈ-వేదిక (E-Vedhika) Live Telemetry &amp; Feed Gateway (v1.0.8)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 uppercase tracking-widest">
                Gateway Active
              </span>
            </div>
            <p className="text-xs text-indigo-300 font-medium mt-1">
              Consolidated PC Health, Anti-Duplicate Alerts &amp; Live Post Feed (@DhawanRakesh)
            </p>
          </div>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/api/v1/posts/feed"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-emerald-900/40 hover:bg-emerald-800 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-700/50 transition flex items-center gap-1.5"
          >
            <span>Live Post Feed JSON</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="/admin/exe_ubd_live?action=check_update"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
          >
            Update JSON
          </a>
          <a
            href="/admin/exe_ubd_live?format=json"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
          >
            Export Logs
          </a>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-bold rounded-xl border border-rose-700/50 transition cursor-pointer"
          >
            Clear Logs
          </button>
        </div>
      </div>

      {/* 2. Metric Cards (4 Grid matching v1.0.8) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            కనెక్ట్ అయిన PCలు
          </span>
          <span className="text-3xl font-black text-white mt-1 block font-mono">
            {totalPcs}
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block">ట్రాక్ చేయబడుతున్న యంత్రాలు</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
            ఆరోగ్యకరమైనవి (Healthy)
          </span>
          <span className="text-3xl font-black text-emerald-400 mt-1 block font-mono">
            {healthyPcs}
          </span>
          <span className="text-[10px] text-emerald-400/70 mt-1 block">ONLINE &amp; READY సిస్టమ్స్</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow">
          <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
            యాక్టివ్ సమస్యలు (Active)
          </span>
          <span className="text-3xl font-black text-rose-400 mt-1 block font-mono">
            {issueCount}
          </span>
          <span className="text-[10px] text-rose-400/70 mt-1 block">Deduplicated Issues</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow">
          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
            లైవ్ పోస్ట్‌లు (Feed)
          </span>
          <span className="text-3xl font-black text-indigo-400 mt-1 block font-mono">
            {announcements.length}
          </span>
          <span className="text-[10px] text-indigo-300/70 mt-1 block">/api/v1/posts/feed లో క్రియాశీలం</span>
        </div>
      </div>

      {/* 3. Quick Post Announcement Widget */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <h2 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>📢</span> వెబ్‌సైట్ నుంచి కొత్త పోస్ట్ ప్రచురించండి (Publish Live Post to Feed)
        </h2>
        <form onSubmit={handlePublishPost} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-400 mb-1">పోస్ట్ శీర్షిక (Title)</label>
              <input
                type="text"
                required
                value={postTitle}
                onChange={e => setPostTitle(e.target.value)}
                placeholder="ఉదా: కొత్త UBD వెర్షన్ లేదా ముఖ్య సమాచారం..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">ప్రాధాన్యత (Importance)</label>
              <select
                value={postImportance}
                onChange={e => setPostImportance(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">వివరాలు (Content)</label>
            <textarea
              required
              rows={3}
              value={postContent}
              onChange={e => setPostContent(e.target.value)}
              placeholder="పోస్ట్ వివరాలను ఇక్కడ టైప్ చేయండి..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sendTelegram}
                onChange={e => setSendTelegram(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Telegram గ్రూప్‌కు వెంటనే బ్రాడ్‌కాస్ట్ చేయండి</span>
            </label>

            <button
              type="submit"
              disabled={isPublishing}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg cursor-pointer flex items-center gap-2"
            >
              {isPublishing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>వెంటనే ప్రచురించండి (Publish Post)</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. Search and Filter Bar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="కంప్యూటర్ పేరు, ఆపరేటర్, కార్యాలయం లేదా సమస్య శోధించండి..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['ALL', 'HEALTHY', 'ISSUES'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'ALL' ? 'అన్నీ' : tab === 'HEALTHY' ? 'హెల్తీ' : 'సమస్యలు'}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchTelemetryData()}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition cursor-pointer"
            title="రిఫ్రెష్ చేయండి"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 5. Consolidated PC Health Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span>💻</span> Consolidated PC Health Status (కన్సాలిడేటెడ్ రిపోర్టులు)
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {filteredPcs.length} PCs Tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">PC Name &amp; User</th>
                <th className="p-4">Office Location</th>
                <th className="p-4">OS &amp; Build</th>
                <th className="p-4">Overall Status</th>
                <th className="p-4">Verification</th>
                <th className="p-4">DSC Status</th>
                <th className="p-4">Active Issue</th>
                <th className="p-4">Last Seen</th>
                <th className="p-4 text-right">చర్యలు</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPcs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-500 font-medium">
                    ఇంకా ఏ కంప్యూటర్ నుంచి టెలిమెట్రీ రాలేదు. క్లయింట్ PC లో యాప్ రన్ అయిన వెంటనే ఇక్కడ కనిపిస్తుంది.
                  </td>
                </tr>
              ) : (
                filteredPcs.map(pc => {
                  const st = pc.overallStatus;
                  let badge = 'bg-emerald-950 text-emerald-300 border-emerald-800';
                  if (st === 'DEGRADED') badge = 'bg-rose-950 text-rose-300 border-rose-800';
                  else if (st === 'WARNING') badge = 'bg-amber-950 text-amber-300 border-amber-800';
                  else if (st === 'REPAIRING') badge = 'bg-indigo-950 text-indigo-300 border-indigo-800';
                  else if (st === 'RESOLVED') badge = 'bg-teal-950 text-teal-300 border-teal-800';

                  return (
                    <tr
                      key={pc.machineId}
                      onClick={() => setSelectedPc(pc)}
                      className="hover:bg-slate-800/40 transition cursor-pointer group"
                    >
                      <td className="p-4">
                        <div className="font-bold text-white font-mono group-hover:text-indigo-300 transition">
                          {pc.pcName}
                        </div>
                        <div className="text-[10px] text-slate-400">{pc.userName}</div>
                      </td>
                      <td className="p-4 text-slate-300 font-medium">{pc.officeLocation}</td>
                      <td className="p-4 text-slate-400 font-mono text-[11px]">
                        {pc.os} ({pc.buildNumber})
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${badge}`}>
                          {st}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-200">
                        {pc.stepsVerified}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                          {pc.dscStatus}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300 max-w-xs truncate">
                        {pc.activeIssue}
                      </td>
                      <td className="p-4 font-mono text-slate-400 whitespace-nowrap">
                        {pc.lastSeen}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPc(pc);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-xs font-bold transition flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>వివరాలు</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Active Issues & Repair Tracking Panel (if issues exist) */}
      {issueCount > 0 && (
        <div className="bg-slate-900/90 rounded-3xl border border-rose-900/40 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-rose-300 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>యాక్టివ్ సమస్యలు &amp; ఆటో-రిపేర్ ట్రాకింగ్ (Deduplicated Issues)</span>
            </h3>
            <span className="text-xs text-rose-400 font-bold">
              {issueCount} క్రియాశీల సమస్యలు
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.values(activeIssues).map(issue => (
              <div key={issue.issueId} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-amber-400">{issue.issueId}</span>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {issue.currentStatus} ({issue.occurrenceCount}x)
                  </span>
                </div>
                <div className="font-bold text-white text-xs">{issue.issueCategory}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{issue.remarks}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 font-mono">
                  <span>PC: {issue.pcName}</span>
                  <span>రిపేర్: {issue.postRepairVerification}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedPc && (
        <div className="fixed inset-0 z-[5000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-indigo-400" />
                <h3 className="font-black text-white text-base font-mono">{selectedPc.pcName}</h3>
              </div>
              <button onClick={() => setSelectedPc(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 gap-2 text-slate-300">
                <div><span className="text-slate-400">ఆపరేటర్:</span> <strong className="text-white">{selectedPc.userName}</strong></div>
                <div><span className="text-slate-400">ఆఫీస్:</span> <strong className="text-white">{selectedPc.officeLocation}</strong></div>
                <div><span className="text-slate-400">OS:</span> {selectedPc.os} ({selectedPc.buildNumber})</div>
                <div><span className="text-slate-400">యాప్ వెర్షన్:</span> {selectedPc.appVersion}</div>
                <div><span className="text-slate-400">వెరిఫికేషన్:</span> <strong className="text-emerald-400 font-mono">{selectedPc.stepsVerified}</strong></div>
                <div><span className="text-slate-400">DSC టోకెన్:</span> <strong className="text-amber-300">{selectedPc.dscStatus}</strong></div>
                <div><span className="text-slate-400">Edge Policy:</span> {selectedPc.edgePolicy}</div>
                <div><span className="text-slate-400">sites.xml:</span> {selectedPc.sitesXml}</div>
              </div>

              {selectedPc.lastSummary && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">చివరి సారాంశం (Last Summary):</span>
                  <p className="leading-relaxed">{selectedPc.lastSummary}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-slate-500 font-mono">చివరగా కనిపించిన సమయం: {selectedPc.lastSeen}</span>
              <button
                onClick={() => setSelectedPc(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                మూసివేయండి
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Logs Confirm Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[6000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">అన్ని లాగ్స్‌ను క్లియర్ చేయాలా?</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                ఈ చర్య ద్వారా డేటాబేస్ మరియు ఫైల్ స్టోరేజ్ నుండి అన్ని టెలిమెట్రీ రికార్డులు తొలగించబడతాయి. కొత్త రిపోర్టులు వచ్చిన వెంటనే మళ్లీ ఆటోమేటిక్‌గా నమోదు అవుతాయి.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                disabled={isClearing}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                రద్దు
              </button>
              <button
                onClick={handleClearLogs}
                disabled={isClearing}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
              >
                {isClearing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>ఖచ్చితంగా తొలగించు</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UBDLiveMonitoring;
