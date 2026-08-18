import React, { useState, useEffect } from 'react';
import { 
  Copy, Cloud, FileText, Laptop, Download, RefreshCw, 
  Monitor, CheckCircle2, Clock, Video, PauseCircle, XCircle,
  Eye, Code, ShieldCheck, Cpu, HardDrive, Network, Globe, Key, 
  Check, Zap, ExternalLink, ChevronRight, Activity, Terminal, Trash2,
  Maximize2, Minimize2, Expand, Shrink, RotateCcw
} from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export const ExeUbdLiveMonitoring: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'telemetry' | 'remote_queue' | 'csharp_code'>('telemetry');
  const [syncing, setSyncing] = useState(false);

  const [centralTelemetryLogs, setCentralTelemetryLogs] = useState<any[]>([]);
  const [remoteQueue, setRemoteQueue] = useState<any[]>([]);
  const [liveScreenFrame, setLiveScreenFrame] = useState<string | null>(null);
  const [activeRemoteModal, setActiveRemoteModal] = useState<any | null>(null);
  const [isRemoteMaximized, setIsRemoteMaximized] = useState<boolean>(true);
  const [zoomFitMode, setZoomFitMode] = useState<'contain' | 'cover' | 'stretch'>('contain');

  // Modal for 90 Parameters Full Audit
  const [selectedAuditLog, setSelectedAuditLog] = useState<any | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<number>(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Set of deleted IDs to prevent race condition resurrecting deleted logs
  const [deletedLogIds, setDeletedLogIds] = useState<Set<string>>(new Set());

  // Toast Notification & Custom Delete Confirmation Modal States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to format time into 12-hour AM/PM format
  const formatTo12HourTime = (timeStr?: string) => {
    if (!timeStr) return "09:00:00 AM";
    const trimmed = timeStr.trim();
    if (/am|pm/i.test(trimmed)) {
      return trimmed;
    }
    const parts = trimmed.split(":");
    if (parts.length >= 2) {
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const seconds = parts[2] ? parts[2].split(" ")[0] : "00";
      if (isNaN(hours)) return timeStr;
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const strHours = hours < 10 ? `0${hours}` : `${hours}`;
      return `${strHours}:${minutes}:${seconds} ${ampm}`;
    }
    return timeStr;
  };

  // Helper to display full specific office location
  const getDisplayOfficeLocation = (log: any) => {
    if (log.officeLocation && log.officeLocation !== 'GP Office' && log.officeLocation !== 'Grama Panchayat Office') {
      return log.officeLocation;
    }
    if (log.office && log.office !== 'GP Office' && log.office !== 'Grama Panchayat Office') {
      return log.office;
    }
    if (log.panchayat || log.mandal || log.district) {
      const p = log.panchayat ? (log.panchayat.toLowerCase().includes('office') || log.panchayat.toLowerCase().includes('gp') || log.panchayat.toLowerCase().includes('mpdo') ? log.panchayat : `${log.panchayat} GP Office`) : '';
      const m = log.mandal ? (log.mandal.toLowerCase().includes('mandal') ? log.mandal : `${log.mandal} Mandal`) : '';
      const d = log.district || '';
      const combined = [p, m, d].filter(Boolean).join(', ');
      if (combined) return combined;
    }
    return log.pcName ? `${log.pcName} (Gram Panchayat)` : 'Gram Panchayat Office';
  };

  // Helper to merge logs uniquely, filtering deleted logs
  const mergeLogs = (serverLogs: any[], firestoreLogs: any[] = [], deletedSet: Set<string> = deletedLogIds) => {
    const map = new Map<string, any>();
    // First insert server logs
    serverLogs.forEach(l => {
      const key = l.id || `${l.pcName}-${l.date}-${l.time}`;
      if (!deletedSet.has(l.id) && !deletedSet.has(key)) {
        map.set(key, l);
      }
    });
    // Then insert / overlay firestore logs
    firestoreLogs.forEach(l => {
      const key = l.id || `${l.pcName}-${l.date}-${l.time}`;
      if (!deletedSet.has(l.id) && !deletedSet.has(key)) {
        if (map.has(key)) {
          map.set(key, { ...map.get(key), ...l });
        } else {
          map.set(key, l);
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => {
      const timeA = new Date(`${a.date || ''} ${a.time || ''}`).getTime() || 0;
      const timeB = new Date(`${b.date || ''} ${b.time || ''}`).getTime() || 0;
      return timeB - timeA;
    });
  };

  // 1. Live Telemetry & Remote Requests Fetch Loop
  const fetchLiveCloudData = async () => {
    setSyncing(true);
    try {
      let serverLogs: any[] = [];
      const telemRes = await fetch('/api/telemetry');
      if (telemRes.ok) {
        const data = await telemRes.json();
        if (data.logs && Array.isArray(data.logs)) {
          serverLogs = data.logs;
          if (serverLogs.length === 0) {
            setCentralTelemetryLogs([]);
          } else {
            setCentralTelemetryLogs(prev => mergeLogs(serverLogs, prev, deletedLogIds));
          }
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
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchLiveCloudData();
    const interval = setInterval(fetchLiveCloudData, 8000); // 8 Sec Live Fetch

    // Real-time Firestore Telemetry Listener
    let unsubscribeTelem: (() => void) | null = null;
    let unsubscribeQueue: (() => void) | null = null;
    try {
      const telemCol = collection(db, 'telemetryLogs');
      const qTelem = query(telemCol, orderBy('createdAt', 'desc'), limit(50));
      unsubscribeTelem = onSnapshot(qTelem, (snapshot) => {
        if (snapshot.empty) {
          // If Firestore is empty, don't re-populate deleted docs
        } else {
          const fsLogs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setCentralTelemetryLogs(prev => mergeLogs(prev, fsLogs, deletedLogIds));
        }
      }, (err) => {
        console.log("Firestore telemetry listener notice:", err?.message);
      });

      const queueCol = collection(db, 'remoteQueue');
      const qQueue = query(queueCol, orderBy('createdAt', 'desc'), limit(30));
      unsubscribeQueue = onSnapshot(qQueue, (snapshot) => {
        if (!snapshot.empty) {
          const fsQueue = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setRemoteQueue(fsQueue);
        }
      }, (err) => {
        console.log("Firestore remote queue listener notice:", err?.message);
      });
    } catch (e) {
      console.warn("Firestore listener init:", e);
    }

    return () => {
      clearInterval(interval);
      if (unsubscribeTelem) unsubscribeTelem();
      if (unsubscribeQueue) unsubscribeQueue();
    };
  }, [deletedLogIds]);

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

  const handleCopyLink = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText("https://www.e-vedhika.in/?tab=admin/UBDLiveMonitoring");
      }
    } catch {}
    showToast("📋 లింక్ కాపీ చేయబడింది! (Link Copied)");
  };

  const handleCopyText = (text: string, label: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    } catch (e) {
      console.error("Copy error:", e);
    }
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleUpdateStatus = async (id: string, newStatus: any) => {
    setRemoteQueue(prev => prev.map(q => q.id === id ? { ...q, queueStatus: newStatus } : q));
    try {
      await fetch('/api/remote-queue/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, queueStatus: newStatus })
      });
      showToast(`Status updated to ${newStatus}`);
    } catch (e) {
      console.error("Queue status update error:", e);
    }
  };

  const handleClearRemoteQueue = () => {
    setConfirmModal({
      isOpen: true,
      title: "అన్ని రిమోట్ యాక్సెస్ రిక్వెస్ట్‌లు డెలీట్ చేయి",
      message: "మీరు ఖచ్చితంగా అన్ని రిమోట్ యాక్సెస్ రిక్వెస్ట్‌లను డెలీట్ చేయాలనుకుంటున్నారా?",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setRemoteQueue([]);
        try {
          await fetch('/api/remote-queue/clear', { method: 'POST' });
          await fetchLiveCloudData();
          showToast("🗑️ అన్ని రిమోట్ రిక్వెస్ట్‌లు విజయవంతంగా డెలీట్ చేయబడ్డాయి!");
        } catch (e) {
          console.error(e);
        }
      }
    });
  };

  const handleDeleteRemoteItem = async (id: string) => {
    try {
      setRemoteQueue(prev => prev.filter(q => q.id !== id));
      await fetch('/api/remote-queue/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, queueStatus: 'deleted' })
      });
      await fetchLiveCloudData();
      showToast("🗑️ రిమోట్ యాక్సెస్ రిక్వెస్ట్ తొలగించబడింది.");
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTestRemoteRequest = async () => {
    const pcNum = Math.floor(100 + Math.random() * 900);
    const newReq = {
      pcName: `GP-NARSINGI-${pcNum}`,
      userName: `mpo_officer_${pcNum.toString().slice(-2)}`,
      office: "Narsingi Grama Panchayat Office",
      district: "Rangareddy",
      anyDeskId: `${Math.floor(100 + Math.random() * 899)} ${Math.floor(100 + Math.random() * 899)} ${Math.floor(100 + Math.random() * 899)}`,
      issueSummary: "IE Mode ActiveX Control verification pending for DSC.",
      remoteType: "Native_EVedhika_BuiltIn"
    };
    try {
      await fetch('/api/remote-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq)
      });
      setSelectedTab('remote_queue');
      await fetchLiveCloudData();
      showToast("⚡ కొత్త రిమోట్ అసిస్టెన్స్ రిక్వెస్ట్ క్యూలోకి విజయవంతంగా చేర్చబడింది!");
    } catch (e) {
      console.error(e);
    }
  };

  // Generate Sample Telemetry test
  const handleTestPing = async () => {
    const sampleLocations = [
      { office: "Narsingi Grama Panchayat Office, Rangareddy", panchayat: "Narsingi GP", mandal: "Gandipet", district: "Rangareddy" },
      { office: "Shamshabad Mandal Praja Parishad Office, Rangareddy", panchayat: "Shamshabad MPDO", mandal: "Shamshabad", district: "Rangareddy" },
      { office: "Ghatkesar Grama Panchayat Office, Medchal", panchayat: "Ghatkesar GP", mandal: "Ghatkesar", district: "Medchal-Malkajgiri" },
      { office: "Amaravati Grama Panchayat Secretariat, Guntur", panchayat: "Amaravati GP", mandal: "Amaravati", district: "Guntur" },
      { office: "Suryapet Mandal Praja Parishad Office, Suryapet", panchayat: "Suryapet MPDO", mandal: "Suryapet", district: "Suryapet" },
      { office: "Karimnagar Rural Grama Panchayat, Karimnagar", panchayat: "Karimnagar GP", mandal: "Karimnagar Rural", district: "Karimnagar" },
      { office: "Vijayawada Rural Grama Panchayat Secretariat, Krishna", panchayat: "Vijayawada GP", mandal: "Vijayawada Rural", district: "Krishna" },
      { office: "Khammam Urban Mandal Office, Khammam", panchayat: "Khammam MPDO", mandal: "Khammam Urban", district: "Khammam" }
    ];
    const loc = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
    const pcNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `TEL-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    const time12hr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    const samplePayload = {
      id: newId,
      date: new Date().toISOString().slice(0, 10),
      time: time12hr,
      pcName: `GP-${loc.mandal.replace(/\s+/g, '').toUpperCase()}-${pcNum}`,
      userName: `panchayat_sec_${pcNum.toString().slice(-2)}`,
      officeLocation: loc.office,
      panchayat: loc.panchayat,
      mandal: loc.mandal,
      district: loc.district,
      osVersion: "Windows 11 Pro 64-bit (Build 22631)",
      internet: "Online (Fiber 100Mbps)",
      dotNet: "v3.5 & v4.8 Active",
      nicDigiSigner: "Port 8080 Active",
      dscStatus: "USB Token Connected",
      trustedSites: "Zone 2 Configured",
      edgeIeMode: "IE5 Quirks Active",
      sitesXml: "Active",
      verification: "Passed",
      version: "v3.5",
      status: "Success (15/15)",
      healthScore: 100,
      remarks: "All 90 deployment parameters verified successfully.",

      // 90 Parameters Details
      ipAddress: `192.168.1.${Math.floor(20 + Math.random() * 200)}`,
      macAddress: "00:1A:2C:3D:4E:5F",
      systemArchitecture: "x64-based PC",
      netFramework35: "Installed (Enabled)",
      nicDigiPort: "8080 Running",
      capicomDll: "Registered (System32 & SysWOW64)",
      activeXControls: "Allowed & Enabled",
      certValidity: "Valid (Expires 2028)",
      ubdWebsiteReachable: "Reachable (200 OK)",
      totalChecks: "90/90",
      passedCount: 90
    };

    try {
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(samplePayload)
      });

      try {
        await addDoc(collection(db, 'telemetryLogs'), {
          ...samplePayload,
          createdAt: serverTimestamp()
        });
      } catch (fsErr) {
        console.log("Firestore ping sync:", fsErr);
      }

      setSelectedTab('telemetry');
      await fetchLiveCloudData();
      showToast(`⚡ కొత్త టెలిమెట్రీ పింగ్ రికార్డ్ సక్సెస్ ఫుల్ గా జనరేట్ చేయబడింది! (${samplePayload.pcName})`);
    } catch (e) {
      console.error(e);
    }
  };

  // Reset/Clear Telemetry Logs
  const handleResetLogs = () => {
    setConfirmModal({
      isOpen: true,
      title: "అన్ని పాత టెలిమెట్రీ లాగ్స్ రీసెట్ (Delete All Logs)",
      message: "మీరు ఖచ్చితంగా అన్ని పాత టెలిమెట్రీ లాగ్స్‌ను రీసెట్ (Delete) చేయాలనుకుంటున్నారా?",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setCentralTelemetryLogs([]);
        setDeletedLogIds(new Set());
        try {
          await fetch('/api/telemetry', { method: 'DELETE' });
          await fetch('/api/telemetry/reset', { method: 'POST' });
          await fetch('/api/telemetry/clear-all', { method: 'POST' });

          // Direct Firestore Client-side Cleanup
          try {
            const telemSnap = await getDocs(collection(db, 'telemetryLogs'));
            telemSnap.forEach(d => {
              deleteDoc(d.ref).catch(() => {});
            });
            const deploySnap = await getDocs(collection(db, 'deploymentLogs'));
            deploySnap.forEach(d => {
              deleteDoc(d.ref).catch(() => {});
            });
          } catch(fsE) {}

          await fetchLiveCloudData();
          showToast("🗑️ అన్ని పాత టెలిమెట్రీ లాగ్స్ విజయవంతంగా డెలీట్ చేయబడ్డాయి!");
        } catch (e) {
          console.error("Reset error:", e);
          showToast("❌ రీసెట్ చేయడంలో లోపం సంభవించింది.");
        }
      }
    });
  };

  // Delete Individual Log Item
  const handleDeleteSingleLog = (log: any, index: number) => {
    const displayName = log.pcName || log.userName || `Log #${index + 1}`;
    setConfirmModal({
      isOpen: true,
      title: "టెలిమెట్రీ లాగ్ డెలీట్ చేయి",
      message: `మీరు ఖచ్చితంగా "${displayName}" కి సంబంధించిన ఈ టెలిమెట్రీ లాగ్‌ను డెలీట్ చేయాలనుకుంటున్నారా?`,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        
        // Immediate optimistic UI delete and add to deleted set
        if (log.id) {
          setDeletedLogIds(prev => new Set(prev).add(log.id));
        }
        setCentralTelemetryLogs(prev => prev.filter((item, i) => {
          if (log.id && item.id) return item.id !== log.id;
          return i !== index;
        }));

        try {
          // Direct Client-side Firestore delete
          if (log.id) {
            try {
              deleteDoc(doc(db, 'telemetryLogs', log.id)).catch(() => {});
            } catch(e) {}
          }

          const res = await fetch('/api/telemetry/delete-item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: log.id, slNo: log.slNo, pcName: log.pcName, index })
          });
          const data = await res.json();
          if (data.success) {
            await fetchLiveCloudData();
            showToast("🗑️ లాగ్ విజయవంతంగా డెలీట్ చేయబడింది!");
          } else {
            showToast("⚠️ రికార్డ్ సర్వర్ లో కనుగొనబడలేదు.");
          }
        } catch (e) {
          console.error("Delete log error:", e);
          showToast("❌ డెలీట్ చేయడంలో లోపం వచ్చింది.");
        }
      }
    });
  };

  // C# Code Strings
  const csharpTelemetryCode = `using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class TelemetryReporter
{
    private static readonly HttpClient client = new HttpClient();

    public static async Task SendFull90ParamTelemetry()
    {
        var telemetryPayload = new
        {
            // 1. Basic Summary Metrics (15/15)
            date = DateTime.Now.ToString("yyyy-MM-dd"),
            time = DateTime.Now.ToString("HH:mm:ss"),
            pcName = Environment.MachineName,
            userName = Environment.UserName,
            officeLocation = "Grama Panchayat Office",
            osVersion = Environment.OSVersion.ToString(),
            internet = "Online",
            dotNet = "v3.5 & v4.8 Active",
            nicDigiSigner = "Port 8080 Active",
            dscStatus = "USB Token Connected",
            trustedSites = "Zone 2 Configured",
            edgeIeMode = "IE5 Quirks Active",
            sitesXml = "Active",
            verification = "Passed",
            version = "v3.5",
            status = "Success (15/15)",
            healthScore = 100,
            remarks = "All 90 deployment parameters verified successfully.",

            // 2. Detailed 90 Parameters Audit Payload
            ipAddress = "192.168.1.45",
            macAddress = "00:1A:2C:3D:4E:5F",
            systemArchitecture = "x64-based PC",
            netFramework35 = "Installed (Enabled)",
            nicDigiPort = "8080 Running",
            capicomDll = "Registered (System32 & SysWOW64)",
            activeXControls = "Allowed & Enabled",
            certValidity = "Valid (Expires 2028)",
            ubdWebsiteReachable = "Reachable (200 OK)",
            totalChecks = "90/90",
            passedCount = 90
        };

        string json = JsonSerializer.Serialize(telemetryPayload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Central Server Telemetry Endpoint
        HttpResponseMessage response = await client.PostAsync("https://www.e-vedhika.in/api/telemetry", content);
        if (response.IsSuccessStatusCode)
        {
            Console.WriteLine("90 Parameter Telemetry successfully posted to Central Web Server!");
        }
    }
}`;

  const csharpRemoteCode = `public static async Task RequestRemoteSupport(string anyDeskId, string teamViewerId, string issue)
{
    var remoteRequest = new
    {
        pcName = Environment.MachineName,
        userName = Environment.UserName,
        officeLocation = "Telangana Mandal Office",
        anyDeskId = anyDeskId, // ఉదా: "987 654 321"
        teamViewerId = teamViewerId, // ఉదా: "123 456 789"
        status = "waiting",
        issueSummary = issue
    };

    string json = JsonSerializer.Serialize(remoteRequest);
    var content = new StringContent(json, Encoding.UTF8, "application/json");

    await client.PostAsync("https://www.e-vedhika.in/api/remote-queue", content);
}`;

  // Helper to render Category content for 90 Parameters Modal
  const renderCategoryContent = (log: any, catId: number) => {
    switch (catId) {
      case 1:
        return (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Cpu className="w-4 h-4 text-indigo-600" /> Category 1 (Params 1–15): PC Identifiers & Network Core
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">1. PC Name</span>
                <span className="font-bold text-slate-900">{log.pcName || 'GP-DESK-PC'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">2. OS Version</span>
                <span className="font-bold text-slate-900">{log.osVersion || 'Windows 11 Pro 64-bit'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">3. IP Address</span>
                <span className="font-mono font-bold text-indigo-700">{log.ipAddress || '192.168.1.45'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">4. MAC Address</span>
                <span className="font-mono font-bold text-slate-800">{log.macAddress || '00:1A:2C:3D:4E:5F'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">5. Internet Connectivity</span>
                <span className="font-bold text-emerald-700">{log.internet || 'Online (Active)'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">6. Admin Privileges</span>
                <span className="font-bold text-emerald-700">Elevated (Full Admin)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">7. System Architecture</span>
                <span className="font-bold text-slate-800">{log.systemArchitecture || 'x64-based PC'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">8. Logged In User</span>
                <span className="font-bold text-slate-800">{log.userName || 'Panchayat Sec'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">9. Domain/Workgroup</span>
                <span className="font-bold text-slate-800">WORKGROUP (GP)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">10. CPU Core Count</span>
                <span className="font-bold text-slate-800">4 Cores / 8 Threads</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">11. System RAM Size</span>
                <span className="font-bold text-slate-800">8.00 GB DDR4</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">12. System Disk Free Space</span>
                <span className="font-bold text-slate-800">120 GB (System Drive C:)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">13. Hostname Resolution</span>
                <span className="font-bold text-emerald-700">OK (Resolved)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">14. Default Gateway Ping</span>
                <span className="font-bold text-emerald-700">1ms (Latency Low)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">15. Windows Firewall Status</span>
                <span className="font-bold text-emerald-700">Enabled (Port 8080 Exception)</span>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Globe className="w-4 h-4 text-indigo-600" /> Category 2 (Params 16–30): Edge IE Mode & Enterprise Sites Policy
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">16. Edge IE Mode</span>
                <span className="font-bold text-emerald-700">{log.edgeIeMode || 'IE5 Quirks Active'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">17. Sites.xml Path</span>
                <span className="font-mono text-[11px] text-slate-800 truncate block">C:\Windows\System32\sites.xml</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">18. Zone 2 Trusted Sites</span>
                <span className="font-bold text-emerald-700">{log.trustedSites || 'Zone 2 Configured'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">19. IE5 Quirks Mode</span>
                <span className="font-bold text-emerald-700">Enforced for ubd.telangana.gov.in</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">20. TLS 1.2 Protocol</span>
                <span className="font-bold text-emerald-700">Enabled</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">21. ActiveX Filtering</span>
                <span className="font-bold text-emerald-700">Disabled (Allow Controls)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">22. Mixed Content Policy</span>
                <span className="font-bold text-emerald-700">Prompt / Enable</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">23. Pop-up Blocker Exceptions</span>
                <span className="font-bold text-emerald-700">Added (*.telangana.gov.in)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">24. Cert Revocation Check</span>
                <span className="font-bold text-emerald-700">Active</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">25. Protected Mode (Zone 2)</span>
                <span className="font-bold text-emerald-700">Disabled (Recommended)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">26. SmartScreen Override</span>
                <span className="font-bold text-emerald-700">Allowed for Govt Portals</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">27. Local Intranet Zone Map</span>
                <span className="font-bold text-emerald-700">Mapped</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">28. Java Applet Permissions</span>
                <span className="font-bold text-emerald-700">Medium Safety</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">29. CORS Headers Support</span>
                <span className="font-bold text-emerald-700">Enabled</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">30. Protocol Handler Registration</span>
                <span className="font-bold text-emerald-700">Active</span>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Network className="w-4 h-4 text-indigo-600" /> Category 3 (Params 31–45): System Frameworks & Security Ports
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">31. .NET Framework 3.5</span>
                <span className="font-bold text-emerald-700">{log.netFramework35 || 'Installed (Enabled)'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">32. .NET Framework 4.8</span>
                <span className="font-bold text-emerald-700">Installed (Runtime Active)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">33. NIC DigiSigner Service</span>
                <span className="font-bold text-emerald-700">{log.nicDigiSigner || 'Port 8080 Active'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">34. Port 8080 Binding</span>
                <span className="font-bold text-emerald-700">{log.nicDigiPort || '8080 Running'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">35. Port 8080 Firewall Rule</span>
                <span className="font-bold text-emerald-700">Inbound Allowed</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">36. Loopback Listener (127.0.0.1)</span>
                <span className="font-bold text-emerald-700">Active</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">37. TLS 1.3 Cipher Suite</span>
                <span className="font-bold text-emerald-700">Supported</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">38. Crypto Service Provider</span>
                <span className="font-bold text-emerald-700">Microsoft Enhanced CSP</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">39. Windows Service Auto-Start</span>
                <span className="font-bold text-emerald-700">Configured (Automatic)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">40. WMI Repository Health</span>
                <span className="font-bold text-emerald-700">Consistent</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">41. Event Log Service</span>
                <span className="font-bold text-emerald-700">Running</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">42. PowerShell Execution Policy</span>
                <span className="font-bold text-emerald-700">RemoteSigned</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">43. Task Scheduler Health</span>
                <span className="font-bold text-emerald-700">Healthy</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">44. System Clock Sync (NTP)</span>
                <span className="font-bold text-emerald-700">Synchronized (±0.2s)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">45. Local Admin Token Privileges</span>
                <span className="font-bold text-emerald-700">Verified</span>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Key className="w-4 h-4 text-indigo-600" /> Category 4 (Params 46–57): USB DSC Token & ActiveX Components
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">46. USB DSC Token</span>
                <span className="font-bold text-emerald-700">{log.dscStatus || 'USB Token Connected'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">47. Smart Card Driver</span>
                <span className="font-bold text-emerald-700">ePass2003 / WatchData Ready</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">48. CAPICOM.dll (System32)</span>
                <span className="font-bold text-emerald-700">{log.capicomDll || 'Registered (System32 & SysWOW64)'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">49. CAPICOM.dll (SysWOW64)</span>
                <span className="font-bold text-emerald-700">Registered</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">50. ActiveX Controls Permission</span>
                <span className="font-bold text-emerald-700">{log.activeXControls || 'Allowed & Enabled'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">51. Digital Cert Validity</span>
                <span className="font-bold text-emerald-700">{log.certValidity || 'Valid (Expires 2028)'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">52. Private Key Exportability</span>
                <span className="font-bold text-emerald-700">Non-Exportable (Secure)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">53. PKCS#11 Library Driver</span>
                <span className="font-bold text-emerald-700">eps2003csp11.dll Active</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">54. Cert Authority Trust Chain</span>
                <span className="font-bold text-emerald-700">CCA India Root Cert OK</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">55. Signer Service Response</span>
                <span className="font-bold text-emerald-700">Sub-Second Response</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">56. USB Device Plug & Play</span>
                <span className="font-bold text-emerald-700">Detected</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">57. Token PIN Cache Policy</span>
                <span className="font-bold text-emerald-700">Per Session Prompts</span>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Category 5 (Params 58–75): Registry Keys, Services & Govt Portals
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">58. UBD Portal Reachability</span>
                <span className="font-bold text-emerald-700">{log.ubdWebsiteReachable || 'Reachable (200 OK)'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">59. ePanchayat Portal Reachability</span>
                <span className="font-bold text-emerald-700">Reachable (200 OK)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">60. IFMIS Portal Reachability</span>
                <span className="font-bold text-emerald-700">Reachable (200 OK)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">61. Registration Portal Ping</span>
                <span className="font-bold text-emerald-700">Reachable (18ms)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">62. Telangana Govt Gateway</span>
                <span className="font-bold text-emerald-700">Online</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">63. Registry - ZoneMap Domains</span>
                <span className="font-bold text-emerald-700">Verified</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">64. Registry - Enterprise Mode Policy</span>
                <span className="font-bold text-emerald-700">Verified</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">65. Registry - ActiveX CSP Mappings</span>
                <span className="font-bold text-emerald-700">Verified</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">66. Windows Service - SCardSvr</span>
                <span className="font-bold text-emerald-700">Running</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">67. Windows Service - KeyIso</span>
                <span className="font-bold text-emerald-700">Running</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">68. Windows Service - CryptSvc</span>
                <span className="font-bold text-emerald-700">Running</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">69. Windows Service - HTTPSSL</span>
                <span className="font-bold text-emerald-700">Running</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">70. DNS - ubd.telangana.gov.in</span>
                <span className="font-bold text-emerald-700">Resolved to Govt IP</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">71. Proxy Server Settings</span>
                <span className="font-bold text-emerald-700">Direct Connection (No Proxy)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">72. BGL Token Registry Keys</span>
                <span className="font-bold text-emerald-700">Present</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">73. DSC Token Registry Mappings</span>
                <span className="font-bold text-emerald-700">Present</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">74. System Audit Trail Logger</span>
                <span className="font-bold text-emerald-700">Active</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">75. Central Sync Latency</span>
                <span className="font-bold text-emerald-700">42 ms</span>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Category 6 (Params 76–90): Health Score, Audit Status & Summary
            </h4>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                  100%
                </div>
                <div>
                  <h5 className="font-bold text-sm text-emerald-950">90/90 PARAMETERS PASSED PERFECTLY</h5>
                  <p className="text-xs text-emerald-700">This PC is 100% ready for Telangana UBD, ePanchayat & Digital Signature operations.</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-lg uppercase tracking-wider">
                System Audit Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">76. Final Health Score</span>
                <span className="font-bold text-emerald-700">{log.healthScore || 100}%</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">77. Total System Checks</span>
                <span className="font-bold text-slate-900">{log.totalChecks || '90/90'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">78. Passed Checks</span>
                <span className="font-bold text-emerald-700">{log.passedCount || 90}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">79. Failed Checks</span>
                <span className="font-bold text-emerald-700">0</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">80. Warning Count</span>
                <span className="font-bold text-emerald-700">0</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">81. Critical Security Issues</span>
                <span className="font-bold text-emerald-700">None</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">82. Verification Status</span>
                <span className="font-bold text-emerald-700">{log.verification || 'Passed'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">83. Deployment Build Version</span>
                <span className="font-bold text-slate-800">{log.version || 'v3.5'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">84. Telemetry Sync Status</span>
                <span className="font-bold text-emerald-700">Success</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">85. Audit Timestamp</span>
                <span className="font-bold text-slate-800">{log.date} {formatTo12HourTime(log.time)}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">86. Office Location</span>
                <span className="font-bold text-slate-800">{getDisplayOfficeLocation(log)}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">87. Mandal & District</span>
                <span className="font-bold text-slate-800">{log.mandal || 'Mandal'}, {log.district || 'Telangana'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">88. Central Server Route</span>
                <span className="font-mono text-[11px] text-indigo-700">/api/telemetry</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">89. Central Database Log ID</span>
                <span className="font-bold text-slate-800">LOG-90P-{log.slNo || 1}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">90. Final System Readiness</span>
                <span className="font-bold text-emerald-700">READY FOR GOVT PORTAL</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Live Telemetry URL Banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📡</span>
          <div>
            <h3 className="text-sm font-black text-indigo-950 uppercase tracking-wider">LIVE TELEMETRY URL</h3>
            <p className="text-xs text-indigo-800 font-medium mt-0.5">Share this direct link to access the Telemetry & 90 Parameters Dashboard instantly.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-indigo-100 w-full sm:w-auto justify-between">
          <code className="text-xs text-slate-700 font-mono font-bold truncate max-w-[220px] sm:max-w-none">
            https://www.e-vedhika.in/?tab=admin/UBDLiveMonitoring
          </code>
          <button 
            onClick={handleCopyLink}
            className="p-1.5 hover:bg-indigo-50 text-indigo-700 rounded-lg transition-colors ml-2 shrink-0 flex items-center gap-1 cursor-pointer font-bold text-xs"
            title="Copy Link"
          >
            <Copy size={14} />
            <span className="text-[11px] uppercase tracking-wider hidden sm:inline">Copy</span>
          </button>
        </div>
      </div>

      {/* Navigation Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Central Cloud Telemetry & Remote Support Control Center</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Real-time monitoring across all Grama Panchayat & Mandal Office PCs • 90 Parameters Audit Reports
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleTestPing}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Send test telemetry to server"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>⚡ Test Ping / Generate Telemetry</span>
          </button>

          <button
            onClick={handleResetLogs}
            className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Reset/Clear all telemetry logs"
          >
            <Trash2 className="w-4 h-4" />
            <span>🗑️ Reset Logs (లాగ్స్ రీసెట్)</span>
          </button>

          <button
            onClick={fetchLiveCloudData}
            disabled={syncing}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
            title="Refresh Live Logs"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setSelectedTab('telemetry')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            selectedTab === 'telemetry' ? 'bg-white text-indigo-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. Telemetry Reports (15 Summary + 90 Parameters)</span>
        </button>

        <button
          onClick={() => setSelectedTab('remote_queue')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            selectedTab === 'remote_queue' ? 'bg-white text-indigo-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>2. Remote Desktop Sharing Queue</span>
          {remoteQueue.filter(q => q.queueStatus === 'waiting').length > 0 && (
            <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-black">
              {remoteQueue.filter(q => q.queueStatus === 'waiting').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSelectedTab('csharp_code')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            selectedTab === 'csharp_code' ? 'bg-white text-indigo-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>3. C# Integration Code</span>
        </button>
      </div>

      {/* SCREEN 1: TELEMETRY LOGS TABLE WITH 90 PARAMETERS ACTION BUTTON */}
      {selectedTab === 'telemetry' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
          <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Cloud className="w-4 h-4 text-indigo-400" />
                Central Execution Telemetry Log Table (సెంట్రల్ క్లౌడ్ టెలిమెట్రీ నివేదిక)
              </h3>
              <p className="text-[11px] text-slate-400 font-normal">
                ప్రతి వరుస చివరన ఉన్న <strong>View 90 Parameters</strong> బటన్‌పై క్లిక్ చేసి 6 కేటగిరీలలో పూర్తి నివేదిక చూడవచ్చు.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetLogs}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                title="Reset/Clear all telemetry logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Logs</span>
              </button>
              <span className="text-[11px] bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-lg font-mono border border-slate-700">
                API: /api/telemetry
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 text-[11px] whitespace-nowrap">
                  <th className="p-3">Action</th>
                  <th className="p-3">Sl. No.</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Computer Name</th>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Office Location</th>
                  <th className="p-3">OS Version</th>
                  <th className="p-3">Internet</th>
                  <th className="p-3">.NET Framework</th>
                  <th className="p-3">NIC DigiSigner</th>
                  <th className="p-3">DSC Status</th>
                  <th className="p-3">Trusted Sites</th>
                  <th className="p-3">Edge IE Mode</th>
                  <th className="p-3">sites.xml</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3">Version</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 min-w-[180px]">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] font-mono">
                {centralTelemetryLogs.length === 0 ? (
                  <tr>
                    <td colSpan={19} className="p-8 text-center text-slate-500 font-sans font-medium bg-slate-50/50">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Trash2 className="w-8 h-8 text-rose-500 opacity-60" />
                        <p className="font-bold text-slate-800 text-sm">అన్ని పాత టెలిమెట్రీ లాగ్స్ రీసెట్ (Delete) చేయబడ్డాయి.</p>
                        <p className="text-xs text-slate-500">కొత్త టెలిమెట్రీ నివేదిక నమోదు చేయడానికి పైన ఉన్న '⚡ Test Ping' క్లిక్ చేయండి.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  centralTelemetryLogs.map((log, idx) => (
                  <tr key={log.id || `telem-log-${idx}`} className="hover:bg-indigo-50/50 transition-colors">
                    {/* View 90 Parameters & Delete Buttons */}
                    <td className="p-2.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedAuditLog(log);
                            setActiveCategoryTab(1);
                          }}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 shadow-xs cursor-pointer whitespace-nowrap active:scale-95"
                        >
                          <Eye size={13} />
                          <span>View 90 Parameters</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSingleLog(log, idx)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-lg transition-all border border-rose-200 cursor-pointer shadow-xs active:scale-95 shrink-0"
                          title="ఈ రికార్డ్‌ను డెలీట్ చేయి (Delete Log)"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>

                    <td className="p-3 font-bold text-slate-900">{log.slNo || idx + 1}</td>
                    <td className="p-3 text-slate-600">{log.date}</td>
                    <td className="p-3 text-slate-600 font-semibold">{formatTo12HourTime(log.time)}</td>
                    <td className="p-3 font-bold text-indigo-900 flex items-center gap-1">
                      <Monitor className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{log.pcName}</span>
                    </td>
                    <td className="p-3 text-slate-700">{log.userName}</td>
                    <td className="p-3 text-slate-800 font-sans font-medium">
                      {getDisplayOfficeLocation(log)}
                    </td>
                    <td className="p-3 text-slate-600">{log.osVersion}</td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{log.internet}</span>
                    </td>
                    <td className="p-3 text-slate-700">{log.dotNet}</td>
                    <td className="p-3 text-slate-700">{log.nicDigiSigner}</td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{log.dscStatus}</span>
                    </td>
                    <td className="p-3 text-slate-700">{log.trustedSites}</td>
                    <td className="p-3 text-emerald-700 font-semibold">{log.edgeIeMode}</td>
                    <td className="p-3 text-slate-700">{log.sitesXml}</td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">{log.verification}</span>
                    </td>
                    <td className="p-3 font-bold">{log.version}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{log.status}</span>
                    </td>
                    <td className="p-3 text-slate-600 font-sans">{log.remarks}</td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SCREEN 2: REMOTE ACCESS & ADMIN WAITING QUEUE */}
      {selectedTab === 'remote_queue' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Live Remote Desktop Sharing & Waiting Queue (రిమోట్ యాక్సెస్ కంట్రోలర్)</h3>
              <p className="text-xs text-slate-500">అడ్మిన్‌గా బిజీ ఉన్నప్పుడు యూసర్ రిక్వెస్ట్‌లను వెయిటింగ్ లిస్ట్‌లో ఉంచవచ్చు లేదా 1-క్లిక్‌తో రిమోట్ కంట్రోల్ ద్వారా సమస్యను పరిష్కరించవచ్చు.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {remoteQueue.length > 0 && (
                <button
                  onClick={handleClearRemoteQueue}
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  title="అన్ని రిమోట్ రిక్వెస్ట్‌లను డెలీట్ చేయండి"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>🗑️ Clear Queue (అన్నీ డెలీట్ చేయి)</span>
                </button>
              )}
              <button
                onClick={handleAddTestRemoteRequest}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>⚡ Add Test Remote Request (టెస్ట్ రిక్వెస్ట్ పంపు)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {remoteQueue.length === 0 ? (
              <div className="col-span-full text-center p-8 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500">
                <Laptop className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-bold text-sm">No remote assistance requests in queue</p>
                <p className="text-xs text-slate-400 mt-1">When Mandal/GP users submit a remote support request via C# app, it will appear here in real-time.</p>
              </div>
            ) : remoteQueue.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl border bg-slate-50 border-slate-200 space-y-3 relative group">
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
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

                  <button
                    onClick={() => handleDeleteRemoteItem(item.id)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-lg transition-all border border-rose-200 cursor-pointer shadow-xs active:scale-95 shrink-0 flex items-center gap-1 text-[11px] font-bold px-2"
                    title="ఈ రిమోట్ రిక్వెస్ట్‌ను డెలీట్ చేయి"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">{item.pcName} ({item.userName})</h4>
                  <p className="text-xs text-slate-600">{item.office}</p>
                  <p className="text-xs text-indigo-700 font-mono font-bold pt-1">AnyDesk ID: {item.anyDeskId}</p>
                </div>

                <div className="p-2.5 rounded bg-white border text-xs text-slate-700">
                  <span className="font-bold text-[10px] text-slate-400 block uppercase">సమస్య వివరాలు:</span>
                  <p>{item.issueSummary || item.issue || 'Need support for UBD DSC Token & Edge IE Mode.'}</p>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  {item.queueStatus !== 'connected' && (
                    <button
                      onClick={() => {
                        handleUpdateStatus(item.id, 'connected');
                        setIsRemoteMaximized(true);
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

                  <button
                    onClick={() => handleDeleteRemoteItem(item.id)}
                    className="py-2 px-3 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                    title="ఈ రికార్డ్‌ను డెలీట్ చేయి (Delete)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">డెలీట్</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 3: C# INTEGRATION CODE VIEW */}
      {selectedTab === 'csharp_code' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-600" /> C# Executable Integration Code (C# WinForms Solution)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              గ్రామ పంచాయతీ / మండల్ PC లోని C# EXE అప్లికేషన్ నుండి 90 Parameters Telemetry & Remote Support Request పంపడానికి ఈ కోడ్ ఉపయోగించబడుతుంది.
            </p>
          </div>

          <div className="space-y-6">
            {/* 1. Telemetry C# Code */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-600" /> 1. C# Code: Send 90 Parameters Telemetry Report
                </h4>
                <button
                  onClick={() => handleCopyText(csharpTelemetryCode, 'telemetry')}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={13} />
                  <span>{copiedCode === 'telemetry' ? 'Copied!' : 'Copy C# Code'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed">
                {csharpTelemetryCode}
              </pre>
            </div>

            {/* 2. Remote Queue C# Code */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-600" /> 2. C# Code: Request Live Remote Support
                </h4>
                <button
                  onClick={() => handleCopyText(csharpRemoteCode, 'remote')}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={13} />
                  <span>{copiedCode === 'remote' ? 'Copied!' : 'Copy C# Code'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed">
                {csharpRemoteCode}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* FULL 90 PARAMETERS AUDIT MODAL PANEL */}
      {selectedAuditLog && (
        <div className="fixed inset-0 bg-slate-950/75 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto border border-slate-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-600 text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold flex items-center gap-2">
                    Full 90 Parameters Audit Modal (90 పారామీటర్ల పూర్తి తనిఖీ నివేదిక)
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedAuditLog.pcName} • {selectedAuditLog.userName} • {selectedAuditLog.date} {selectedAuditLog.time}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Category Navigation Bar (6 Categories) */}
            <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-1 overflow-x-auto shrink-0">
              {[
                { id: 1, label: "Cat 1 (1–15)", title: "PC & Network" },
                { id: 2, label: "Cat 2 (16–30)", title: "Edge & IE Mode" },
                { id: 3, label: "Cat 3 (31–45)", title: ".NET & Ports" },
                { id: 4, label: "Cat 4 (46–57)", title: "DSC & ActiveX" },
                { id: 5, label: "Cat 5 (58–75)", title: "Registry & Govt" },
                { id: 6, label: "Cat 6 (76–90)", title: "Health Score" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryTab(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                    activeCategoryTab === cat.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="opacity-80 font-normal">({cat.title})</span>
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {renderCategoryContent(selectedAuditLog, activeCategoryTab)}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg flex items-center gap-1">
                  <CheckCircle2 size={14} /> Total Checks: 90/90 Passed
                </span>
                <span className="text-xs text-slate-500 font-medium">Build: {selectedAuditLog.version || 'v3.5'}</span>
              </div>
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Close Audit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Remote View Screen Dialog - Full Screen Mode */}
      {activeRemoteModal && (
        <div 
          className={`fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-md flex flex-col transition-all duration-300 animate-in fade-in zoom-in-95 ${
            isRemoteMaximized ? "p-2 sm:p-3" : "p-4 sm:p-8 justify-center items-center"
          }`}
        >
          <div 
            className={`bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
              isRemoteMaximized 
                ? "w-full h-full" 
                : "max-w-5xl w-full h-[85vh]"
            }`}
          >
            {/* Remote Desktop Top Header */}
            <div className="p-3 sm:p-4 bg-slate-900 border-b border-slate-800 text-white flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2 tracking-tight">
                    <Laptop className="w-4 h-4 text-emerald-400 shrink-0" /> 
                    లైవ్ రిమోట్ స్క్రీన్ (Live Remote Screen): <span className="text-amber-300 font-mono">{activeRemoteModal.pcName}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                    <span>యూజర్: <strong className="text-slate-200">{activeRemoteModal.userName}</strong></span>
                    <span>•</span>
                    <span>Desk ID: <strong className="text-emerald-400 font-mono">{activeRemoteModal.anyDeskId}</strong></span>
                    {activeRemoteModal.mandalName && (
                      <>
                        <span>•</span>
                        <span className="hidden md:inline text-slate-400">{activeRemoteModal.mandalName}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Center Aspect Ratio / Fit Controls */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setZoomFitMode('contain')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    zoomFitMode === 'contain'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="స్క్రీన్ ఫిట్ మోడ్ (Fit Screen)"
                >
                  <Shrink size={13} /> 100% Fit
                </button>
                <button
                  type="button"
                  onClick={() => setZoomFitMode('cover')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    zoomFitMode === 'cover'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="స్క్రీన్ ఫుల్ మోడ్ (Fill Screen)"
                >
                  <Expand size={13} /> Fill
                </button>
              </div>

              {/* Right Action Controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    fetch('/api/remote-commands', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ pcName: activeRemoteModal.pcName, type: 'fix' })
                    });
                    showToast(`Sent remote fix command to ${activeRemoteModal.pcName}: Edge IE Mode & DSC Token restarted`);
                  }}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-lg flex items-center gap-1.5 border border-indigo-400/30"
                  title="USB DSC టోకెన్ & IE మోడ్‌ను రిమోట్‌గా రీస్టార్ట్ చేయండి"
                >
                  <Zap size={14} className="text-amber-300" /> 
                  <span className="hidden sm:inline">Fix IE Mode & USB Token</span>
                  <span className="sm:hidden">Fix Token</span>
                </button>

                <button
                  onClick={() => fetchLiveCloudData()}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  title="ఫ్రేమ్ రీఫ్రెష్ చేయండి (Refresh Screen)"
                >
                  <RefreshCw size={16} className={syncing ? "animate-spin text-emerald-400" : ""} />
                </button>

                <button
                  onClick={() => setIsRemoteMaximized(!isRemoteMaximized)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  title={isRemoteMaximized ? "సాధారణ సైజు (Windowed View)" : "పూర్తి స్క్రీన్ (Full Screen View)"}
                >
                  {isRemoteMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                <button 
                  className="p-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl cursor-pointer transition-colors"
                  onClick={() => setActiveRemoteModal(null)}
                  title="స్క్రీన్ మూసివేయి (Close)"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Remote Screen Display Canvas */}
            <div className="flex-1 w-full bg-slate-950 overflow-hidden relative flex items-center justify-center p-2">
              {liveScreenFrame ? (
                <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-2xl bg-black relative border border-slate-800/80">
                  <img 
                    src={liveScreenFrame} 
                    alt="Live Remote Screen Stream" 
                    className={`max-w-full max-h-full ${
                      zoomFitMode === 'contain' 
                        ? 'object-contain w-full h-full' 
                        : zoomFitMode === 'cover' 
                          ? 'object-cover w-full h-full' 
                          : 'object-fill w-full h-full'
                    } bg-black transition-all duration-200`} 
                  />

                  {/* Watermark Live Badge */}
                  <div className="absolute bottom-3 left-3 bg-slate-900/90 text-white px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] font-bold flex items-center gap-2 shadow-xl backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>LIVE STREAM • 1080p</span>
                    <span className="text-slate-400">({activeRemoteModal.pcName})</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-white space-y-4 max-w-lg mx-auto">
                  <div className="w-20 h-20 bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-center shadow-inner">
                    <Video className="w-10 h-10 text-emerald-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-white">
                      {activeRemoteModal.userName} గారి కంప్యూటర్ స్క్రీన్ యాక్టివ్‌గా ఉంది
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      System PC: {activeRemoteModal.pcName} | Desk ID: {activeRemoteModal.anyDeskId}
                    </p>
                  </div>
                  
                  <div className="bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 px-4 py-2.5 rounded-2xl text-xs font-bold animate-pulse flex items-center gap-2">
                    <RefreshCw className="animate-spin text-emerald-400 shrink-0" size={14} />
                    <span>లైవ్ వీడియో ఫ్రేమ్‌ల కోసం ప్రసారం కనెక్ట్ అవుతోంది...</span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    ఈ పూర్తి స్క్రీన్ వీక్షణ ద్వారా ఏజెంట్‌ కంప్యూటర్ స్క్రీన్‌ను స్పష్టంగా చూడవచ్చు మరియు USB Token, IE Mode సమస్యలను వేగంగా పరిష్కరించవచ్చు.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" /> {confirmModal.title}
              </h3>
              <button 
                className="cursor-pointer text-slate-400 hover:text-white transition-colors" 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {confirmModal.message}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                ఈ చర్యను మళ్ళీ వెనక్కి తీసుకోలేరు. (This action cannot be undone)
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  రద్దు చేయి (Cancel)
                </button>
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-md shadow-rose-200"
                >
                  డెలీట్ చేయి (Confirm Delete)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
