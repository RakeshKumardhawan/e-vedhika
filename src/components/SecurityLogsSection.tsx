import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, Search, Lock, User, Trash2, Edit3, Activity, LogIn, LogOut,
  UserPlus, FileText, Lightbulb, Database, RotateCcw, Code, Settings,
  ShieldCheck, Download, Sparkles, Clock, Filter, CheckCircle2, AlertCircle,
  Calendar, PlusCircle, RefreshCw, FileSpreadsheet, Layers, ArrowUpRight
} from "lucide-react";
import { collection, query, orderBy, onSnapshot, getDocs, limit, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";

export type ActivityCategory = 
  | "ALL"
  | "LOGIN"
  | "LOGOUT"
  | "NEW_USER"
  | "POST_CREATED"
  | "SUGGESTION"
  | "BACKUP"
  | "RESTORE"
  | "CODE_CHANGE"
  | "SETTINGS_CHANGE"
  | "PERMISSION_CHANGE"
  | "DELETE"
  | "EXPORT"
  | "AI_USAGE";

export interface TimelineEvent {
  id: string;
  category: ActivityCategory;
  title: string;
  description: string;
  actor: string;
  timestamp: number;
  details?: any;
  status?: "success" | "warning" | "info" | "danger";
  ip?: string;
}

// Utility to record activity from anywhere in the app
export async function logSystemActivity(
  category: ActivityCategory,
  title: string,
  description?: string,
  details?: any,
  status: "success" | "warning" | "info" | "danger" = "info"
) {
  try {
    const actorEmail = auth?.currentUser?.email || auth?.currentUser?.displayName || "System Admin";
    await addDoc(collection(db, "security_logs"), {
      category,
      action: title,
      title,
      description: description || title,
      admin: actorEmail,
      userEmail: actorEmail,
      uid: auth?.currentUser?.uid || "system",
      details: details || null,
      status,
      time: Date.now(),
      timestamp: Date.now(),
      ip: "127.0.0.1 (Cloud Run Proxy)"
    });
  } catch (e) {
    console.warn("Failed to record logSystemActivity:", e);
  }
}

export function SecurityLogsSection() {
  const [logs, setLogs] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsError, setLogsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>("ALL");
  const [viewMode, setViewMode] = useState<"timeline" | "table">("timeline");
  const [showSimulateModal, setShowSimulateModal] = useState(false);

  // Simulation form states
  const [simCategory, setSimCategory] = useState<ActivityCategory>("CODE_CHANGE");
  const [simTitle, setSimTitle] = useState("");
  const [simDesc, setSimDesc] = useState("");

  useEffect(() => {
    fetchAndCombineActivities();
  }, []);

  // Fetch security_logs + synthesize timeline from posts/suggestions/users if logs are low
  const fetchAndCombineActivities = () => {
    setLoading(true);
    const unsubLogs = onSnapshot(
      query(collection(db, "security_logs"), orderBy("time", "desc")),
      async (snap) => {
        const rawLogs: TimelineEvent[] = [];
        snap.forEach((doc) => {
          const d = doc.data();
          const cat = detectCategory(d);
          rawLogs.push({
            id: doc.id,
            category: cat,
            title: d.title || d.action || "System Event",
            description: d.description || d.details?.message || d.action || "No extra detail provided",
            actor: d.admin || d.userEmail || d.user || "System Root",
            timestamp: d.time || d.timestamp || Date.now(),
            details: d.details || null,
            status: d.status || (cat === "DELETE" ? "danger" : cat === "AI_USAGE" ? "info" : "success"),
            ip: d.ip || "Client Session"
          });
        });

        // If security_logs has fewer entries, synthesize from other collections to present a complete history
        if (rawLogs.length < 20) {
          const synthesized = await synthesizeFromCollections();
          // Combine and deduplicate
          const combined = [...rawLogs, ...synthesized];
          combined.sort((a, b) => b.timestamp - a.timestamp);
          setLogs(combined);
        } else {
          rawLogs.sort((a, b) => b.timestamp - a.timestamp);
          setLogs(rawLogs);
        }

        setLogsError(false);
        setLoading(false);
      },
      (err) => {
        console.error("Activity logs snapshot error:", err);
        setLogsError(true);
        setLoading(false);
      }
    );

    return () => unsubLogs();
  };

  // Synthesize events from Users, Posts, Suggestions collections
  const synthesizeFromCollections = async (): Promise<TimelineEvent[]> => {
    const extraEvents: TimelineEvent[] = [];
    try {
      // Users
      const usersSnap = await getDocs(query(collection(db, "users"), limit(20)));
      usersSnap.docs.forEach((d) => {
        const u = d.data();
        const t = typeof u.createdAt === 'number' ? u.createdAt : (u.createdAt?.seconds ? u.createdAt.seconds * 1000 : (u.timestamp || Date.now()));
        extraEvents.push({
          id: `synth_u_${d.id}`,
          category: "NEW_USER",
          title: `కొత్త యూజర్ నమోదు (New Account Created)`,
          description: `User ${u.displayName || u.name || u.email} created account as ${u.role || "Citizen"}`,
          actor: u.email || "System Auth",
          timestamp: t,
          status: "success",
          details: { uid: d.id, district: u.district }
        });
      });

      // Posts
      const postsSnap = await getDocs(query(collection(db, "posts"), limit(20)));
      postsSnap.docs.forEach((d) => {
        const p = d.data();
        const t = typeof p.createdAt === 'number' ? p.createdAt : (p.createdAt?.seconds ? p.createdAt.seconds * 1000 : (p.timestamp || Date.now()));
        extraEvents.push({
          id: `synth_p_${d.id}`,
          category: "POST_CREATED",
          title: `పోస్ట్ సృష్టించబడింది (Community Post Created)`,
          description: p.title ? `Title: "${p.title}"` : p.content ? p.content.substring(0, 80) : "Post created",
          actor: p.author || "Community Member",
          timestamp: t,
          status: "success",
          details: { category: p.category, likes: p.likes }
        });
      });

      // Suggestions
      const suggsSnap = await getDocs(query(collection(db, "suggestions"), limit(20)));
      suggsSnap.docs.forEach((d) => {
        const s = d.data();
        const t = typeof s.createdAt === 'number' ? s.createdAt : (s.createdAt?.seconds ? s.createdAt.seconds * 1000 : (s.timestamp || Date.now()));
        extraEvents.push({
          id: `synth_s_${d.id}`,
          category: "SUGGESTION",
          title: `సలహా నమోదు (New Suggestion Recorded)`,
          description: s.text || s.title || "Public citizen feedback submitted",
          actor: s.author || "Citizen",
          timestamp: t,
          status: "info",
          details: { upvotes: s.upvotes || 0 }
        });
      });
    } catch (e) {
      console.warn("Error synthesizing extra events:", e);
    }
    return extraEvents;
  };

  // Helper to categorize raw string actions if category field isn't set
  const detectCategory = (docData: any): ActivityCategory => {
    if (docData.category) return docData.category as ActivityCategory;
    const act = (docData.action || "").toUpperCase();
    if (act.includes("LOGIN") || act.includes("GOOGLE LOGIN") || act.includes("AUTH")) return "LOGIN";
    if (act.includes("LOGOUT") || act.includes("SIGNOUT")) return "LOGOUT";
    if (act.includes("NEW USER") || act.includes("REGISTER") || act.includes("USER CREATED")) return "NEW_USER";
    if (act.includes("POST") || act.includes("ARTICLE") || act.includes("NEWS")) return "POST_CREATED";
    if (act.includes("SUGGEST") || act.includes("FEEDBACK")) return "SUGGESTION";
    if (act.includes("BACKUP") || act.includes("SNAPSHOT")) return "BACKUP";
    if (act.includes("RESTORE") || act.includes("ROLLBACK")) return "RESTORE";
    if (act.includes("CODE") || act.includes("CSS") || act.includes("HTML") || act.includes("SCRIPT")) return "CODE_CHANGE";
    if (act.includes("SETTINGS") || act.includes("CONFIG") || act.includes("MAINTENANCE")) return "SETTINGS_CHANGE";
    if (act.includes("PERMISSION") || act.includes("ROLE") || act.includes("PIN") || act.includes("RBAC")) return "PERMISSION_CHANGE";
    if (act.includes("DELETE") || act.includes("TRASH") || act.includes("REMOVE") || act.includes("CLEARED")) return "DELETE";
    if (act.includes("EXPORT") || act.includes("DOWNLOAD") || act.includes("CSV") || act.includes("PDF")) return "EXPORT";
    if (act.includes("AI") || act.includes("GEMINI") || act.includes("BOT") || act.includes("SYNTH")) return "AI_USAGE";
    return "SETTINGS_CHANGE";
  };

  // Visual meta for each category
  const getCategoryMeta = (cat: ActivityCategory) => {
    switch (cat) {
      case "LOGIN":
        return { label: "Login", telugu: "లాగిన్", icon: LogIn, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
      case "LOGOUT":
        return { label: "Logout", telugu: "లాగౌట్", icon: LogOut, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
      case "NEW_USER":
        return { label: "New User", telugu: "కొత్త యూజర్", icon: UserPlus, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" };
      case "POST_CREATED":
        return { label: "Post Created", telugu: "పోస్ట్ నమోదు", icon: FileText, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
      case "SUGGESTION":
        return { label: "Suggestion", telugu: "సలహా", icon: Lightbulb, color: "text-amber-700", bg: "bg-amber-100/60", border: "border-amber-300" };
      case "BACKUP":
        return { label: "Backup", telugu: "బ్యాకప్", icon: Database, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" };
      case "RESTORE":
        return { label: "Restore", telugu: "రీస్టోర్", icon: RotateCcw, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200" };
      case "CODE_CHANGE":
        return { label: "Code Change", telugu: "కోడ్ సవరణ", icon: Code, color: "text-emerald-700", bg: "bg-slate-900 text-emerald-400", border: "border-slate-800" };
      case "SETTINGS_CHANGE":
        return { label: "Settings Change", telugu: "సెట్టింగ్‌ల మార్పు", icon: Settings, color: "text-slate-700", bg: "bg-slate-100", border: "border-slate-300" };
      case "PERMISSION_CHANGE":
        return { label: "Permission Change", telugu: "అనుమతుల మార్పు", icon: ShieldCheck, color: "text-indigo-700", bg: "bg-indigo-100/70", border: "border-indigo-300" };
      case "DELETE":
        return { label: "Delete", telugu: "తొలగింపు", icon: Trash2, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" };
      case "EXPORT":
        return { label: "Export", telugu: "ఎగుమతి", icon: Download, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200" };
      case "AI_USAGE":
        return { label: "AI Usage", telugu: "AI వినియోగం", icon: Sparkles, color: "text-fuchsia-600", bg: "bg-fuchsia-50", border: "border-fuchsia-200" };
      default:
        return { label: "Activity", telugu: "యాక్టివిటీ", icon: Activity, color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" };
    }
  };

  // Filter logs by category & search term
  const filteredLogs = logs.filter((log) => {
    const matchesCat = selectedCategory === "ALL" || log.category === selectedCategory;
    if (!matchesCat) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      log.title.toLowerCase().includes(term) ||
      log.description.toLowerCase().includes(term) ||
      log.actor.toLowerCase().includes(term) ||
      log.category.toLowerCase().includes(term)
    );
  });

  // Calculate stats
  const totalCount = logs.length;
  const todayCount = logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length;
  const authCount = logs.filter(l => l.category === "LOGIN" || l.category === "LOGOUT" || l.category === "NEW_USER").length;
  const sysCount = logs.filter(l => l.category === "CODE_CHANGE" || l.category === "SETTINGS_CHANGE" || l.category === "BACKUP").length;

  // Manual trigger to record test action
  const handleSimulateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simTitle) return;
    await logSystemActivity(simCategory, simTitle, simDesc || simTitle, { manualLog: true });
    setSimTitle("");
    setSimDesc("");
    setShowSimulateModal(false);
  };

  // Export CSV
  const exportLogsCSV = () => {
    const headers = ["Timestamp", "Date", "Category", "Action/Title", "Description", "Actor Email"];
    const rows = filteredLogs.map(l => [
      l.timestamp,
      new Date(l.timestamp).toLocaleString("en-IN"),
      l.category,
      `"${l.title.replace(/"/g, '""')}"`,
      `"${l.description.replace(/"/g, '""')}"`,
      `"${l.actor}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `system_activity_timeline_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 rounded-2xl flex items-center justify-center shadow-inner backdrop-blur-md">
              <Clock size={32} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  🔴 Real-time Live Log
                </span>
                <span className="text-slate-400 text-xs">|</span>
                <span className="text-xs font-bold text-slate-300">సిస్టమ్ యాక్టివిటీ టైమ్‌లైన్</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                System Activity Timeline
              </h3>
              <p className="text-xs text-slate-300 font-medium max-w-xl mt-1">
                Comprehensive audit trail tracking Login, Posts, Suggestions, Backups, Code changes, Settings, Permissions, Deletions, and AI interactions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowSimulateModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <PlusCircle size={16} />
              <span>యాక్టివిటీ రికార్డ్ చేయి (Record Activity)</span>
            </button>
            <button
              onClick={exportLogsCSV}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-2"
            >
              <FileSpreadsheet size={16} className="text-emerald-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/60 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/60">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Recorded</p>
            <p className="text-2xl font-black text-white mt-1">{totalCount} <span className="text-xs text-slate-400 font-medium">events</span></p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/60">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Today's Actions</p>
            <p className="text-2xl font-black text-emerald-300 mt-1">{todayCount} <span className="text-xs text-slate-400 font-medium">today</span></p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/60">
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Auth & Users</p>
            <p className="text-2xl font-black text-purple-300 mt-1">{authCount} <span className="text-xs text-slate-400 font-medium">events</span></p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/60">
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">System & Code</p>
            <p className="text-2xl font-black text-amber-300 mt-1">{sysCount} <span className="text-xs text-slate-400 font-medium">changes</span></p>
          </div>
        </div>
      </div>

      {/* Control Filters & Search Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search timeline by keyword, user email, action name, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs hover:text-slate-700">
                Clear
              </button>
            )}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center text-xs font-bold text-slate-600">
              <button
                onClick={() => setViewMode("timeline")}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  viewMode === "timeline" ? "bg-white text-indigo-900 shadow-xs" : "hover:text-slate-900"
                }`}
              >
                <Layers size={14} />
                <span>Timeline View</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  viewMode === "table" ? "bg-white text-indigo-900 shadow-xs" : "hover:text-slate-900"
                }`}
              >
                <FileSpreadsheet size={14} />
                <span>Table View</span>
              </button>
            </div>

            <button
              onClick={fetchAndCombineActivities}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-all border border-slate-200"
              title="Refresh timeline"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 text-xs font-bold text-slate-600">
          {[
            { cat: "ALL", label: "🌐 All Activities", telugu: "అన్నీ" },
            { cat: "LOGIN", label: "🔑 Login", telugu: "లాగిన్" },
            { cat: "LOGOUT", label: "🚪 Logout", telugu: "లాగౌట్" },
            { cat: "NEW_USER", label: "👤 New User", telugu: "కొత్త యూజర్" },
            { cat: "POST_CREATED", label: "📝 Post Created", telugu: "పోస్ట్" },
            { cat: "SUGGESTION", label: "💡 Suggestion", telugu: "సలహా" },
            { cat: "BACKUP", label: "💾 Backup", telugu: "బ్యాకప్" },
            { cat: "RESTORE", label: "🔄 Restore", telugu: "రీస్టోర్" },
            { cat: "CODE_CHANGE", label: "💻 Code Change", telugu: "కోడ్ మార్పు" },
            { cat: "SETTINGS_CHANGE", label: "⚙️ Settings", telugu: "సెట్టింగ్‌లు" },
            { cat: "PERMISSION_CHANGE", label: "🛡️ Permissions", telugu: "అనుమతులు" },
            { cat: "DELETE", label: "🗑️ Delete", telugu: "తొలగింపు" },
            { cat: "EXPORT", label: "📤 Export", telugu: "ఎగుమతి" },
            { cat: "AI_USAGE", label: "🤖 AI Usage", telugu: "AI ప్రాసెసింగ్" }
          ].map((item) => {
            const isSelected = selectedCategory === item.cat;
            return (
              <button
                key={item.cat}
                onClick={() => setSelectedCategory(item.cat as ActivityCategory)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-[#0B3D91] text-white border-[#0B3D91] shadow-xs"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[10px] ml-1 opacity-75 font-normal">({item.telugu})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {logsError ? (
        <div className="p-12 text-center bg-rose-50 border border-rose-200 rounded-3xl">
          <ShieldAlert size={36} className="text-rose-500 mx-auto mb-2" />
          <h4 className="text-base font-bold text-rose-900">Timeline Access Error</h4>
          <p className="text-xs text-rose-600 mt-1">Unable to stream activity logs. Please verify Firestore security rules.</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
          <Clock size={40} className="text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No activity recorded for this criteria</h4>
          <p className="text-xs text-slate-500">Try changing your search term or select a different category filter.</p>
        </div>
      ) : viewMode === "timeline" ? (
        /* VISUAL VERTICAL TIMELINE VIEW */
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 relative">
          <div className="absolute left-[29px] md:left-[37px] top-10 bottom-10 w-0.5 bg-slate-200" />

          <div className="space-y-6 relative">
            {filteredLogs.map((log, index) => {
              const meta = getCategoryMeta(log.category);
              const Icon = meta.icon;
              const dateObj = new Date(log.timestamp);
              const dateStr = dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
              const timeStr = dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

              return (
                <div key={log.id || index} className="flex items-start gap-4 md:gap-6 group">
                  {/* Category Node Icon */}
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 border shadow-xs transition-transform group-hover:scale-105 ${meta.bg} ${meta.color} ${meta.border}`}>
                    <Icon size={20} />
                  </div>

                  {/* Activity Card */}
                  <div className="flex-1 bg-slate-50 hover:bg-slate-100/80 p-4 md:p-5 rounded-2xl border border-slate-200/80 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5 mb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${meta.bg} ${meta.color} ${meta.border}`}>
                          {meta.label} • {meta.telugu}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{log.title}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 shrink-0">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{dateStr}</span>
                        <Clock size={13} className="text-slate-400 ml-1" />
                        <span className="font-bold text-slate-700">{timeStr}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {log.description}
                    </p>

                    {/* Footer Actor & IP Meta */}
                    <div className="flex items-center justify-between gap-2 mt-3 pt-2 text-[10px] font-mono text-slate-400 border-t border-slate-200/40">
                      <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                        <User size={12} className="text-indigo-600" />
                        <span>{log.actor}</span>
                      </div>

                      {log.details && (
                        <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {typeof log.details === "string" ? log.details : JSON.stringify(log.details)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* TABLE VIEW MODE */
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <tr>
                  <th className="p-4 pl-6">Time & Date</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Action / Event Title</th>
                  <th className="p-4">User / Actor</th>
                  <th className="p-4 pr-6">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredLogs.map((log, i) => {
                  const meta = getCategoryMeta(log.category);
                  const Icon = meta.icon;
                  const dateObj = new Date(log.timestamp);

                  return (
                    <tr key={log.id || i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6 font-mono text-[11px] whitespace-nowrap">
                        <div className="font-bold text-slate-800">{dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}</div>
                        <div className="text-[10px] text-slate-400">{dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${meta.bg} ${meta.color} ${meta.border}`}>
                          <Icon size={12} />
                          {meta.label}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        {log.title}
                        <p className="text-[11px] font-normal text-slate-500 line-clamp-1 mt-0.5">{log.description}</p>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {log.actor}
                      </td>
                      <td className="p-4 pr-6 font-mono text-[10px] text-slate-400">
                        {log.details ? JSON.stringify(log.details) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Activity Modal */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-base">
                <PlusCircle size={20} className="text-indigo-600" />
                <h3>Record Activity Entry (యాక్టివిటీ రికార్డ్)</h3>
              </div>
              <button onClick={() => setShowSimulateModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSimulateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Activity Type (వర్గం):</label>
                <select
                  value={simCategory}
                  onChange={(e) => setSimCategory(e.target.value as ActivityCategory)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="LOGIN">🔑 Login (లాగిన్)</option>
                  <option value="LOGOUT">🚪 Logout (లాగౌట్)</option>
                  <option value="NEW_USER">👤 New User (కొత్త యూజర్)</option>
                  <option value="POST_CREATED">📝 Post Created (పోస్ట్ సృష్టి)</option>
                  <option value="SUGGESTION">💡 Suggestion (సలహా)</option>
                  <option value="BACKUP">💾 Backup (సిస్టమ్ బ్యాకప్)</option>
                  <option value="RESTORE">🔄 Restore (రీస్టోర్)</option>
                  <option value="CODE_CHANGE">💻 Code Change (కోడ్ సవరణ)</option>
                  <option value="SETTINGS_CHANGE">⚙️ Settings Change (సెట్టింగ్‌లు)</option>
                  <option value="PERMISSION_CHANGE">🛡️ Permission Change (అనుమతులు)</option>
                  <option value="DELETE">🗑️ Delete (తొలగింపు)</option>
                  <option value="EXPORT">📤 Export (ఎగుమతి)</option>
                  <option value="AI_USAGE">🤖 AI Usage (AI విశ్లేషణ)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Activity Title (శీర్షిక):</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. System Backup Triggered or Live CSS Updated"
                  value={simTitle}
                  onChange={(e) => setSimTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Details (వివరాలు):</label>
                <textarea
                  rows={2}
                  placeholder="Enter details about this activity..."
                  value={simDesc}
                  onChange={(e) => setSimDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B3D91] text-white rounded-xl font-bold hover:bg-blue-900 shadow-md"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
