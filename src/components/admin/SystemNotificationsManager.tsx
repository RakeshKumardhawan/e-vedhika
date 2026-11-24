import React, { useState, useEffect } from 'react';
import { 
  Bell, Send, Trash2, Users, User, ShieldAlert, CheckCircle2, 
  Clock, Eye, RefreshCw, AlertTriangle, Search, Megaphone, X, 
  Radio, CheckCheck, ShieldCheck, Flame
} from 'lucide-react';
import { 
  collection, addDoc, deleteDoc, doc, onSnapshot, 
  query, orderBy, limit, setDoc, getDoc 
} from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';

interface SystemNotificationsManagerProps {
  currentUser?: any;
  addToast?: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}

export function SystemNotificationsManager({ currentUser, addToast }: SystemNotificationsManagerProps) {
  // New Notification Form States
  const [title, setTitle] = useState("📢 అధికారిక సమాచారం (Official Notice)");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<"info" | "warning" | "critical">("info");
  const [targetType, setTargetType] = useState<"all" | "staff" | "individual">("all");
  const [targetUid, setTargetUid] = useState("");
  const [alsoStickyBanner, setAlsoStickyBanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // History & Live State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "broadcast" | "staff" | "individual">("all");

  // Live Emergency Banner State
  const [emergencyBanner, setEmergencyBanner] = useState<{ active: boolean; message: string; timestamp?: number } | null>(null);

  // Quick Preset Titles
  const quickPresets = [
    "📢 అధికారిక సమాచారం (Official Notice)",
    "⚡ సర్వర్ మెయింటెనెన్స్ అలర్ట్ (Maintenance)",
    "🎉 కొత్త ఫీచర్స్ విడుదలయ్యాయి (New Update)",
    "🚨 అత్యవసర అలర్ట్ (Urgent Notice)"
  ];

  // Real-time listener for Sent Notifications History
  useEffect(() => {
    setIsLoadingHistory(true);
    const q = query(collection(db, "notifications"), orderBy("time", "desc"), limit(60));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(list);
      setIsLoadingHistory(false);
    }, (error) => {
      console.warn("Failed to listen to notifications:", error);
      setIsLoadingHistory(false);
    });

    // Real-time listener for active Emergency Banner
    const unsubBanner = onSnapshot(doc(db, "system_config", "emergency_broadcast"), (docSnap) => {
      if (docSnap.exists()) {
        setEmergencyBanner(docSnap.data() as any);
      } else {
        setEmergencyBanner(null);
      }
    }, (err) => console.warn("Failed to listen to emergency banner:", err));

    return () => {
      unsubscribe();
      unsubBanner();
    };
  }, []);

  // Dispatch Notification Handler
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      if (addToast) addToast("దయచేసి నోటిఫికేషన్ మెసేజ్ టైప్ చేయండి", "warning");
      return;
    }
    if (targetType === "individual" && !targetUid.trim()) {
      if (addToast) addToast("దయచేసి యూజర్ ఐడీ (User UID) నమోదు చేయండి", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const now = Date.now();
      const adminName = currentUser?.fullName || currentUser?.name || currentUser?.displayName || "Super Admin";
      const target = targetType === "all" ? "all" : (targetType === "staff" ? "admin_only" : targetUid.trim());

      // 1. Add notification to Firestore
      await addDoc(collection(db, "notifications"), {
        uid: target,
        title: title.trim(),
        message: message.trim(),
        type: targetType === "all" ? "broadcast" : (targetType === "staff" ? "staff_notice" : "direct_alert"),
        priority: priority,
        senderName: adminName,
        read: false,
        readBy: [],
        time: now
      });

      // 2. If sticky banner is checked or priority is critical, update system_config
      if (alsoStickyBanner || priority === "critical") {
        await setDoc(doc(db, "system_config", "emergency_broadcast"), {
          message: message.trim(),
          active: true,
          timestamp: now,
          adminName: adminName,
          priority: priority
        });
      }

      // 3. Security Audit Log
      await addDoc(collection(db, "security_logs"), {
        category: "BROADCAST_ALERT",
        title: `Sent Notification: ${title.substring(0, 30)}`,
        details: `Dispatched to ${targetType} by ${adminName}`,
        admin: adminName,
        time: now,
        level: priority === "critical" ? "error" : (priority === "warning" ? "warn" : "info")
      }).catch(() => {});

      if (addToast) addToast("నోటిఫికేషన్ విజయవంతంగా విడుదల చేయబడింది!", "success");
      setMessage("");
      setTargetUid("");
      setAlsoStickyBanner(false);
    } catch (err: any) {
      console.error("Failed to send notification:", err);
      if (addToast) addToast("నోటిఫికేషన్ పంపడంలో లోపం: " + (err.message || "Unknown error"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Notification Handler
  const handleDeleteNotification = async (notifId: string, notifTitle: string) => {
    const result = await Swal.fire({
      title: "నోటిఫికేషన్‌ను తొలగించాలా?",
      text: `"${notifTitle || 'ఈ నోటిఫికేషన్'}" యూజర్ల స్క్రీన్ల నుంచి పూర్తిగా తొలగించబడుతుంది.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "అవును, తొలగించు",
      cancelButtonText: "రద్దు చేయి"
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "notifications", notifId));
        if (addToast) addToast("నోటిఫికేషన్ తొలగించబడింది", "success");
      } catch (err: any) {
        console.error("Delete failed:", err);
        if (addToast) addToast("తొలగించడంలో లోపం జరిగింది", "error");
      }
    }
  };

  // Turn off Sticky Emergency Banner
  const handleDeactivateBanner = async () => {
    try {
      await setDoc(doc(db, "system_config", "emergency_broadcast"), {
        active: false,
        message: "",
        timestamp: Date.now()
      });
      if (addToast) addToast("టాప్ ఎమర్జెన్సీ బ్యానర్ తొలగించబడింది", "success");
    } catch (err: any) {
      if (addToast) addToast("బ్యానర్ ఆఫ్ చేయడంలో లోపం", "error");
    }
  };

  // Filtered Notifications List
  const filteredNotifications = notifications.filter(n => {
    if (typeFilter === "broadcast" && n.uid !== "all") return false;
    if (typeFilter === "staff" && n.uid !== "admin_only") return false;
    if (typeFilter === "individual" && (n.uid === "all" || n.uid === "admin_only")) return false;
    
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchTitle = (n.title || "").toLowerCase().includes(q);
      const matchMsg = (n.message || "").toLowerCase().includes(q);
      const matchSender = (n.senderName || "").toLowerCase().includes(q);
      return matchTitle || matchMsg || matchSender;
    }
    return true;
  });

  // Calculate live statistics
  const totalBroadcasts = notifications.length;
  const totalViews = notifications.reduce((acc, curr) => {
    const reads = Array.isArray(curr.readBy) ? curr.readBy.length : (curr.read ? 1 : 0);
    return acc + reads;
  }, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-cyan-300 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 border border-white/10">
              <Radio size={12} className="animate-pulse text-cyan-400" /> Live Push & Broadcast Control
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <Bell className="text-cyan-400" size={26} /> సిస్టమ్ నోటిఫికేషన్ సెంటర్ (Notifications Center)
            </h2>
            <p className="text-xs text-slate-300 font-medium mt-1">
              యూజర్లకు రియల్-టైమ్ పుష్ అలర్ట్‌లు పంపండి, పంపిన హిస్టరీని చూడండి మరియు ఎంతమంది చదివారో లైవ్‌గా ట్రాక్ చేయండి.
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-300">మొత్తం అలర్ట్‌లు</div>
              <div className="text-lg font-black text-white">{totalBroadcasts}</div>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-300">మొత్తం వ్యూస్ (Reads)</div>
              <div className="text-lg font-black text-emerald-400 flex items-center justify-center gap-1">
                <Eye size={14} /> {totalViews}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Active Sticky Emergency Banner Alert (If Active) */}
      {emergencyBanner?.active && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-center justify-between gap-4 shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600 text-white rounded-xl">
              <Flame size={20} />
            </div>
            <div>
              <div className="text-xs font-black text-rose-900 uppercase tracking-wide flex items-center gap-2">
                <span>లైవ్ టాప్ ఎమర్జెన్సీ బ్యానర్ యాక్టివ్‌గా ఉంది</span>
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
              </div>
              <p className="text-xs font-bold text-rose-800 mt-0.5">"{emergencyBanner.message}"</p>
            </div>
          </div>
          <button
            onClick={handleDeactivateBanner}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <X size={14} /> బ్యానర్ ఆఫ్ చేయండి
          </button>
        </div>
      )}

      {/* 3. Dispatch Notification Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Send size={16} className="text-blue-600" /> కొత్త నోటిఫికేషన్ విడుదల చేయండి (Dispatch New Alert)
          </h3>
          <span className="text-[11px] font-bold text-slate-400">వెంటనే అందరికీ డెలివరీ అవుతుంది</span>
        </div>

        <form onSubmit={handleSendNotification} className="space-y-4">
          {/* Quick Preset Title Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">త్వరిత శీర్షికలు (Quick Title Presets):</label>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTitle(preset)}
                  className={`text-[11px] px-3 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                    title === preset 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">నోటిఫికేషన్ టైటిల్ (Title):</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="ఉదా: 📢 అధికారిక సమాచారం"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Target Audience Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ఎవరికి పంపాలి? (Target Audience):</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetType("all")}
                  className={`py-2 px-2 rounded-xl text-xs font-black border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    targetType === "all"
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Users size={13} /> అందరికీ (All)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType("staff")}
                  className={`py-2 px-2 rounded-xl text-xs font-black border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    targetType === "staff"
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck size={13} /> స్టాఫ్ మాత్రమే
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType("individual")}
                  className={`py-2 px-2 rounded-xl text-xs font-black border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    targetType === "individual"
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <User size={13} /> నిర్దిష్ట యూజర్
                </button>
              </div>
            </div>
          </div>

          {/* Individual UID input if selected */}
          {targetType === "individual" && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
              <label className="block text-xs font-bold text-amber-900">యూజర్ ఐడీ నమోదు చేయండి (Target User UID):</label>
              <input
                type="text"
                value={targetUid}
                onChange={e => setTargetUid(e.target.value)}
                placeholder="User UID ఉదా: 4jK9L0mN8pQ..."
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Priority & Sticky Banner Options */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">అలర్ట్ ప్రాధాన్యత (Priority):</span>
              <div className="inline-flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setPriority("info")}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    priority === "info" ? 'bg-blue-600 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  సాధారణ (Info)
                </button>
                <button
                  type="button"
                  onClick={() => setPriority("warning")}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    priority === "warning" ? 'bg-amber-500 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  ముఖ్యమైనది (Warning)
                </button>
                <button
                  type="button"
                  onClick={() => setPriority("critical")}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    priority === "critical" ? 'bg-rose-600 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  అత్యవసరం (Critical)
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={alsoStickyBanner}
                onChange={e => setAlsoStickyBanner(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
              />
              <span>సైట్ పైన ఎమర్జెన్సీ బ్యానర్‌గా కూడా చూపించు (Top Sticky Banner)</span>
            </label>
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">నోటిఫికేషన్ సందేశం (Message):</label>
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="పోర్టల్ యూజర్లందరికీ చేరాల్సిన సందేశాన్ని ఇక్కడ టైప్ చేయండి..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Send Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl text-xs font-black transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Send size={15} />
              {isSubmitting ? "విడుదలవుతోంది..." : "నోటిఫికేషన్ విడుదల చేయండి (Broadcast Now)"}
            </button>
          </div>
        </form>
      </div>

      {/* 4. Sent Notifications History Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-indigo-600" /> పంపిన నోటిఫికేషన్ల హిస్టరీ (Dispatched Notifications History)
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              ఇప్పటివరకు విడుదల చేసిన నోటిఫికేషన్లు, రీడ్ రసీదులు మరియు డిలీట్ కంట్రోల్
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <div className="relative flex-1 sm:w-48">
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="శోధించండి (Search)..."
                className="w-full px-3 py-1.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
            </div>

            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setTypeFilter("all")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${typeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
              >
                అన్నీ ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("broadcast")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${typeFilter === 'broadcast' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-600'}`}
              >
                అందరికీ
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("staff")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${typeFilter === 'staff' ? 'bg-white text-purple-900 shadow-2xs' : 'text-slate-600'}`}
              >
                స్టాఫ్
              </button>
            </div>
          </div>
        </div>

        {/* List of Sent Notifications */}
        {isLoadingHistory ? (
          <div className="py-12 text-center text-slate-400 font-bold text-xs flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-blue-600" />
            <span>నోటిఫికేషన్ల జాబితా లోడ్ అవుతోంది...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-bold text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            ఎలాంటి నోటిఫికేషన్లు కనుగొనబడలేదు.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => {
              const readCount = Array.isArray(notif.readBy) ? notif.readBy.length : (notif.read ? 1 : 0);
              const notifTime = notif.time ? new Date(notif.time).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              }) : 'N/A';

              const isCritical = notif.priority === 'critical';
              const isWarning = notif.priority === 'warning';

              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCritical 
                      ? 'bg-rose-50/50 border-rose-200' 
                      : (isWarning ? 'bg-amber-50/40 border-amber-200' : 'bg-slate-50/70 border-slate-200/90')
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Priority Tag */}
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        isCritical 
                          ? 'bg-rose-600 text-white' 
                          : (isWarning ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white')
                      }`}>
                        {notif.priority || 'info'}
                      </span>

                      {/* Target Audience Tag */}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center gap-1">
                        {notif.uid === 'all' ? (
                          <><Users size={11} className="text-blue-600" /> అందరికీ (All Users)</>
                        ) : notif.uid === 'admin_only' ? (
                          <><ShieldCheck size={11} className="text-purple-600" /> స్టాఫ్ మాత్రమే</>
                        ) : (
                          <><User size={11} className="text-amber-600" /> యూజర్: {notif.uid.substring(0, 8)}...</>
                        )}
                      </span>

                      {/* Timestamp */}
                      <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                        <Clock size={10} /> {notifTime}
                      </span>
                    </div>

                    {/* Notification Title */}
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {notif.title || 'Official Notification'}
                    </h4>

                    {/* Notification Message */}
                    <p className="text-xs text-slate-600 font-medium leading-relaxed break-words">
                      {notif.message}
                    </p>

                    {/* Sender details */}
                    <div className="text-[10px] text-slate-400 font-semibold">
                      విడుదల చేసినవారు: <span className="text-slate-600">{notif.senderName || 'Admin'}</span>
                    </div>
                  </div>

                  {/* Actions & Read Tracking Count */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 shrink-0">
                    {/* Read Receipts Count */}
                    <div 
                      className="px-3 py-1 bg-white rounded-xl border border-slate-200 text-xs font-black text-slate-700 flex items-center gap-1.5 shadow-2xs"
                      title="ఈ అలర్ట్‌ను ఓపెన్ చేసిన యూజర్ల సంఖ్య"
                    >
                      <Eye size={13} className="text-emerald-600" />
                      <span>{readCount} వ్యూస్</span>
                    </div>

                    {/* Delete / Cancel Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteNotification(notif.id, notif.title)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                      title="ఈ అలర్ట్‌ను వెంటనే తొలగించండి"
                    >
                      <Trash2 size={13} />
                      <span>తొలగించు</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
