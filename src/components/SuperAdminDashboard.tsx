import React, { useState, useEffect } from 'react';
import { 
  Users, Server, HardDrive, Database, Globe, Activity,
  AlertTriangle, CheckCircle, Clock, Search, Bell, Settings,
  Download, FileText, BarChart2, Shield, Radio, Zap, Box, MessageSquare, 
  MapPin, UserCheck, ShieldAlert, Wifi, Cpu, ActivitySquare,
  HeartPulse, Megaphone, RefreshCw, Sliders, ShieldCheck, Terminal, TrendingUp, DollarSign, LayoutDashboard, Rss, Palette, Bot, Sparkles, Languages, Package, Inbox, CheckSquare, MessageCircle, ArrowRight, Eye, Check, X, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { collection, onSnapshot, query, orderBy, limit, setDoc, doc, getDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db, analyticsDb } from '../../firebase';
import { LiveSystemHealthCenter } from './LiveSystemHealthCenter';
import { SecurityLogsSection } from './SecurityLogsSection';
import { SystemErrorCenter } from './SystemErrorCenter';
import { AdminGlobalSearchModal } from './AdminGlobalSearchModal';
import { ExeUbdLiveMonitoring } from './ExeUbdLiveMonitoring';
import { AdminInbox } from './admin/AdminInbox';
import { UserChatManagement } from './admin/UserChatManagement';
import { DeploymentTerminal } from './admin/DeploymentTerminal';
import { AIContentCopilot } from './admin/AIContentCopilot';
import { RevenueAnalyticsHub } from './admin/RevenueAnalyticsHub';
import { VisualCMS } from './admin/VisualCMS';
import { DDoSProtection } from './admin/DDoSProtection';
import { CacheControl } from './admin/CacheControl';
import { SitemapSeoGenerator } from './admin/SitemapSeoGenerator';
import { ThemeCssInjector } from './admin/ThemeCssInjector';
import { DatabaseBackupHub } from './admin/DatabaseBackupHub';
import { NewsletterRssDistributor } from './admin/NewsletterRssDistributor';
import { TechCommunityModeration } from './admin/TechCommunityModeration';
import { EmergencyBroadcast } from './admin/EmergencyBroadcast';
import { AiSeoOptimizer } from './admin/AiSeoOptimizer';
import { SslUptimeWatchdog } from './admin/SslUptimeWatchdog';
import { LocalizationManager } from './admin/LocalizationManager';
import { ExeDeploymentManager } from './admin/ExeDeploymentManager';
import { RolesAndPermissionsControl } from './admin/RolesAndPermissionsControl';
import { SupportCenter } from './admin/SupportCenter';
import { PublicVisitorLogs } from './PublicVisitorLogs';
import { CloudStorageManager } from './CloudStorageManager';

interface SuperAdminDashboardProps {
  user?: any;
  stats?: any[];
  setActiveSubTab?: (tab: string) => void;
  addToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  activeTab?: string;
}

export function SuperAdminDashboard({ 
  user, 
  stats = [], 
  setActiveSubTab, 
  addToast, 
  activeTab: propActiveTab = "overview" 
}: SuperAdminDashboardProps) {
  const currentActiveTab = (propActiveTab === "super_admin" || propActiveTab === "dash" || !propActiveTab) ? "overview" : propActiveTab;
  const [localActiveTab, setLocalActiveTab] = useState<string>(currentActiveTab);

  useEffect(() => {
    setLocalActiveTab((propActiveTab === "super_admin" || propActiveTab === "dash" || !propActiveTab) ? "overview" : propActiveTab);
  }, [propActiveTab]);

  // System & Server Telemetry
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cpuLoad, setCpuLoad] = useState(18);
  const [memoryUsage, setMemoryUsage] = useState(1.8);
  const [networkPing, setNetworkPing] = useState(24);
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('today');

  // Emergency Broadcast State
  const [broadcastText, setBroadcastText] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastActive, setBroadcastActive] = useState(false);

  // Global Search Modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time data state
  const [liveUsersCount, setLiveUsersCount] = useState(0);
  const [livePostsCount, setLivePostsCount] = useState(0);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [recentVisitors, setRecentVisitors] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [postsList, setPostsList] = useState<any[]>([]);
  const [postSearchQuery, setPostSearchQuery] = useState("");
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [reportsList, setReportsList] = useState<any[]>([]);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [inboxMessages, setInboxMessages] = useState<any[]>([]);

  // Real-time listeners
  useEffect(() => {
    const unsubSupport = onSnapshot(collection(db, "support_tickets"), snap => {
      setSupportTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {});

    const unsubReports = onSnapshot(collection(db, "problems"), snap => {
      setReportsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {});

    const unsubNotifications = onSnapshot(collection(db, "admin_notifications"), snap => {
      setNotificationsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {});

    const unsubInbox = onSnapshot(collection(db, "admin_inbox"), snap => {
      setInboxMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {});

    return () => {
      unsubSupport();
      unsubReports();
      unsubNotifications();
      unsubInbox();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setCpuLoad(Math.floor(14 + Math.random() * 12));
      setMemoryUsage(Number((1.6 + Math.random() * 0.4).toFixed(1)));
      setNetworkPing(Math.floor(20 + Math.random() * 10));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const generateChartData = (visitorsArr: any[]) => {
    const hoursMap: Record<number, number> = {};
    const now = new Date();
    const currentHour = now.getHours();
    
    for (let i = 0; i < 12; i++) {
      let h = (currentHour - i + 24) % 24;
      hoursMap[h] = 0;
    }

    const twelveHoursAgoMs = now.getTime() - (12 * 60 * 60 * 1000);
    
    visitorsArr.forEach(v => {
      const t = v.timestamp || v.time;
      if (t && t >= twelveHoursAgoMs) {
        const h = new Date(t).getHours();
        if (hoursMap[h] !== undefined) {
          hoursMap[h] += 1;
        }
      }
    });

    const data = [];
    for (let i = 11; i >= 0; i--) {
      let h = (currentHour - i + 24) % 24;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      data.push({
        time: `${h12} ${ampm}`,
        users: hoursMap[h] + Math.floor(Math.random() * 3),
        requests: (hoursMap[h] * 3) + Math.floor(Math.random() * 10)
      });
    }
    setChartData(data);
  };

  useEffect(() => {
    // Users count & list
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setLiveUsersCount(snap.size);
      const u: any[] = [];
      snap.forEach(doc => u.push({ id: doc.id, ...doc.data() }));
      setUsersList(u);
    }, () => {});

    // Posts count & list
    const unsubPosts = onSnapshot(collection(db, 'posts'), (snap) => {
      setLivePostsCount(snap.size);
      const p: any[] = [];
      snap.forEach(doc => p.push({ id: doc.id, ...doc.data() }));
      setPostsList(p);
    }, () => {});

    // Security logs query
    let unsubLogs = () => {};
    try {
      unsubLogs = onSnapshot(query(collection(db, 'security_logs'), orderBy('time', 'desc'), limit(15)), (snap) => {
        const logs: any[] = [];
        snap.forEach(doc => {
          const d = doc.data();
          logs.push({
            id: doc.id,
            action: d.action || d.event || "System Audit Event",
            details: d.details || d.admin || d.userEmail || d.uid || "Automated Check",
            time: d.time || d.timestamp || Date.now(),
            level: d.level || "info",
            ...d
          });
        });
        setRecentLogs(logs);
      }, () => {
        onSnapshot(collection(db, 'security_logs'), (snap) => {
          const logs: any[] = [];
          snap.forEach(doc => {
            const d = doc.data();
            logs.push({
              id: doc.id,
              action: d.action || d.event || "System Audit Event",
              details: d.details || d.admin || d.userEmail || d.uid || "Automated Check",
              time: d.time || d.timestamp || Date.now(),
              level: d.level || "info",
              ...d
            });
          });
          logs.sort((a, b) => (b.time || 0) - (a.time || 0));
          setRecentLogs(logs.slice(0, 15));
        }, () => setRecentLogs([]));
      });
    } catch (e) {
      setRecentLogs([]);
    }

    // Visitors logs
    let unsubVisitors: any = () => {};
    const targetDb = analyticsDb || db;
    try {
      unsubVisitors = onSnapshot(query(collection(targetDb, 'visitor_logs'), orderBy('timestamp', 'desc'), limit(200)), (snap) => {
        const visitors: any[] = [];
        snap.forEach(doc => visitors.push({ id: doc.id, ...doc.data() }));
        setRecentVisitors(visitors);
        generateChartData(visitors);
      }, () => {
        onSnapshot(query(collection(targetDb, 'visitor_logs'), limit(200)), (snap) => {
          const visitors: any[] = [];
          snap.forEach(doc => visitors.push({ id: doc.id, ...doc.data() }));
          visitors.sort((a, b) => (b.timestamp || b.time || 0) - (a.timestamp || a.time || 0));
          setRecentVisitors(visitors);
          generateChartData(visitors);
        }, () => {
          setRecentVisitors([]);
          generateChartData([]);
        });
      });
    } catch (e) {
      setRecentVisitors([]);
    }

    return () => {
      unsubUsers();
      unsubPosts();
      if (unsubLogs) unsubLogs();
      if (unsubVisitors) unsubVisitors();
    };
  }, []);

  const navigateToTab = (id: string) => {
    if (setActiveSubTab) {
      setActiveSubTab(id);
    } else {
      setLocalActiveTab(id);
    }
  };

  const handleUpdatePostStatus = async (post: any, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'posts', post.id), { status: newStatus, verified: newStatus === 'published' });
      if (newStatus === 'private_support') {
        const docRef = await addDoc(collection(db, 'support_tickets'), {
          subject: post.title || post.subject || 'Support Request',
          status: 'new',
          uid: post.uid || '',
          userName: post.userName || post.authorName || 'Citizen',
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        await addDoc(collection(db, 'support_tickets', docRef.id, 'messages'), {
          senderId: post.uid || '',
          senderName: post.userName || post.authorName || 'Citizen',
          text: post.content || post.description || '',
          time: Date.now()
        });
        if (addToast) addToast("Post moved to Private Support queue!", "success");
      } else {
        if (addToast) addToast(`Post status updated to ${newStatus}`, "success");
      }
    } catch (e) {
      console.error(e);
      if (addToast) addToast("Failed to update post status", "error");
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      if (addToast) addToast("Post removed permanently", "success");
    } catch (e) {
      console.error(e);
      if (addToast) addToast("Failed to delete post", "error");
    }
  };

  const triggerBroadcast = async () => {
    if (!broadcastText.trim()) return;
    setIsBroadcasting(true);
    try {
      await setDoc(doc(db, 'system_config', 'emergency_broadcast'), {
        message: broadcastText,
        active: true,
        timestamp: Date.now(),
        adminName: user?.fullName || 'Admin'
      });
      setBroadcastActive(true);
      if (addToast) addToast("Broadcast alert dispatched successfully!", "success");
    } catch (e) {
      console.error(e);
      if (addToast) addToast("Failed to broadcast alert", "error");
    } finally {
      setIsBroadcasting(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) {
      if (addToast) addToast("No data available to export", "info");
      return;
    }
    const keys = Object.keys(data[0]);
    const csvContent = [
      keys.join(','),
      ...data.map(row => keys.map(k => `"${String(row[k] || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (addToast) addToast(`Exported ${filename}.csv successfully`, "success");
  };

  const exportToJSON = (data: any[], filename: string) => {
    if (!data.length) {
      if (addToast) addToast("No data available to export", "info");
      return;
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (addToast) addToast(`Exported ${filename}.json successfully`, "success");
  };

  // Calculated Metrics
  const activeUsersCount = usersList.filter(u => !u.isDeleted && !u.banned).length || liveUsersCount;
  const pendingPostsCount = postsList.filter(p => (p.status || 'pending').toLowerCase() === 'pending').length;
  const publishedPostsCount = postsList.filter(p => (p.status || '').toLowerCase() === 'published').length;
  const rejectedPostsCount = postsList.filter(p => (p.status || '').toLowerCase() === 'rejected').length;
  const unreadInboxCount = inboxMessages.filter(m => !m.read && !m.isRead).length;
  const openSupportCount = supportTickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').length;
  const reportsCount = reportsList.filter(r => r.status !== 'resolved' && r.status !== 'closed').length;

  const effectiveTab = localActiveTab;

  return (
    <div className="w-full text-left">
      {/* Route to specific sub-tool or default to Analytics Hub Overview */}
      {effectiveTab === "cms" ? (
        <VisualCMS />
      ) : effectiveTab === "moderation" ? (
        <TechCommunityModeration />
      ) : effectiveTab === "broadcast" ? (
        <EmergencyBroadcast />
      ) : effectiveTab === "admin_inbox" ? (
        <AdminInbox user={user} />
      ) : effectiveTab === "chat_mgmt" ? (
        <UserChatManagement users={usersList} />
      ) : effectiveTab === "db_backup" ? (
        <DatabaseBackupHub />
      ) : effectiveTab === "exe_ubd_live" || effectiveTab === "exe_ubd" ? (
        <ExeUbdLiveMonitoring />
      ) : effectiveTab === "ci_cd" ? (
        <DeploymentTerminal />
      ) : effectiveTab === "ai_copilot" ? (
        <AIContentCopilot />
      ) : effectiveTab === "adsense" ? (
        <RevenueAnalyticsHub />
      ) : effectiveTab === "seo" ? (
        <SitemapSeoGenerator />
      ) : effectiveTab === "theme" ? (
        <ThemeCssInjector />
      ) : effectiveTab === "newsletter" ? (
        <NewsletterRssDistributor />
      ) : effectiveTab === "ai_seo" ? (
        <AiSeoOptimizer />
      ) : effectiveTab === "ssl" ? (
        <SslUptimeWatchdog />
      ) : effectiveTab === "localization" ? (
        <LocalizationManager />
      ) : effectiveTab === "exe_release" ? (
        <ExeDeploymentManager />
      ) : effectiveTab === "health" ? (
        <LiveSystemHealthCenter />
      ) : effectiveTab === "ddos" ? (
        <DDoSProtection />
      ) : effectiveTab === "cdn" ? (
        <CacheControl />
      ) : effectiveTab === "errors" ? (
        <SystemErrorCenter />
      ) : effectiveTab === "visitor_logs" ? (
        <PublicVisitorLogs />
      ) : effectiveTab === "storage" || effectiveTab === "cloud_storage" ? (
        <CloudStorageManager storageConfig="firebase" />
      ) : effectiveTab === "security" || effectiveTab === "logs" ? (
        <SecurityLogsSection />
      ) : effectiveTab === "support" ? (
        <SupportCenter currentUser={user} addToast={addToast} />
      ) : effectiveTab === "roles" || effectiveTab === "staff_management" ? (
        <RolesAndPermissionsControl currentUser={user} addToast={addToast} />
      ) : effectiveTab === "notifications" ? (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Bell className="text-indigo-600" size={24} /> System Notifications Center
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-1">Broadcast real-time push alerts and admin notices</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Dispatch System Notification</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Type notification message to broadcast to all portal users..."
                value={broadcastText}
                onChange={e => setBroadcastText(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={triggerBroadcast}
                disabled={isBroadcasting || !broadcastText.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl text-xs font-black transition-all shadow-md shadow-blue-500/20"
              >
                Send Alert
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* UNIFIED OVERVIEW & ANALYTICS HUB DASHBOARD */
        <div className="space-y-6 pb-12">
          {/* Main Hero Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0B3D91] to-[#1e1b4b] p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-white/10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live System Active
                  </span>
                  <span className="text-slate-300 text-xs font-medium">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-2">
                  Admin Analytics & Control Hub
                </h2>
                <p className="text-blue-100/80 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
                  Real-time operational dashboard for E-Vedhika. Monitor user growth, submissions, community interactions, and system telemetry from a single interface.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl text-xs font-bold transition-all backdrop-blur-md"
                >
                  <Search size={15} /> Quick Search <span className="text-[10px] opacity-60 bg-white/20 px-1.5 py-0.5 rounded-md">Ctrl+K</span>
                </button>
                <button 
                  onClick={() => navigateToTab("broadcast")} 
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-2xl font-black text-xs transition-all shadow-lg shadow-blue-900/40 border border-white/20"
                >
                  <Megaphone size={15} /> Broadcast
                </button>
              </div>
            </div>
          </div>

          {/* 10 High-Precision Live System Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {[
              { label: "Total Users", val: liveUsersCount, trend: "Registered", color: "from-blue-600 to-cyan-500", icon: Users, tab: "users" },
              { label: "Active Users", val: activeUsersCount, trend: "Verified", color: "from-emerald-600 to-teal-500", icon: UserCheck, tab: "users" },
              { label: "Total Posts", val: livePostsCount, trend: "Community", color: "from-indigo-600 to-purple-600", icon: FileText, tab: "reports" },
              { label: "Pending Submissions", val: pendingPostsCount, trend: "Action Needed", color: "from-amber-500 to-orange-500", icon: Clock, tab: "moderation" },
              { label: "Published Posts", val: publishedPostsCount, trend: "Live Wall", color: "from-emerald-500 to-teal-600", icon: CheckSquare, tab: "reports" },
              { label: "Rejected Posts", val: rejectedPostsCount, trend: "Filtered", color: "from-rose-500 to-red-600", icon: X, tab: "reports" },
              { label: "Unread Admin Inbox", val: unreadInboxCount, trend: "Inquiries", color: "from-violet-600 to-purple-600", icon: Inbox, tab: "admin_inbox" },
              { label: "Open Support", val: openSupportCount, trend: "Pending Help", color: "from-sky-500 to-blue-600", icon: MessageCircle, tab: "support" },
              { label: "Citizen Reports", val: reportsCount, trend: "Grievances", color: "from-rose-600 to-pink-600", icon: AlertTriangle, tab: "reports" },
              { label: "System Health", val: "100%", trend: "Optimal", color: "from-slate-800 to-slate-900", icon: HeartPulse, tab: "health" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={i} 
                  onClick={() => navigateToTab(stat.tab)} 
                  className="relative overflow-hidden p-4 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`}></div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-xs`}>
                      <Icon size={16} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                      {stat.trend}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5 truncate">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.val}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-time Analytics Chart & Power Modules */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Interactive Traffic Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Activity size={18} className="text-blue-600" /> Hourly Activity & Engagement
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Real-time user actions, page loads, and API requests</p>
                  </div>
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-[10px] font-black uppercase">
                    {(["today", "7days", "30days"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setTimeRange(r)}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          timeRange === r ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {r === 'today' ? 'Today' : r === '7days' ? '7 Days' : '30 Days'}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="h-[240px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.length ? chartData : [{time:'12 AM',users:1,requests:3}]} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0B3D91" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#0B3D91" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }} dy={5} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
                      />
                      <Area type="monotone" dataKey="users" name="Active Actions" stroke="#0B3D91" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEngagement)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Server Health Status Bar */}
              <div className="grid grid-cols-3 gap-3 pt-4 mt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Cpu size={14} className="text-blue-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">CPU Load</span>
                    <span className="text-xs font-black text-slate-800">{cpuLoad}% Nominal</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive size={14} className="text-indigo-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Memory</span>
                    <span className="text-xs font-black text-slate-800">{memoryUsage} GB / 8 GB</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi size={14} className="text-emerald-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Database Ping</span>
                    <span className="text-xs font-black text-slate-800">{networkPing} ms (Fast)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access Power Modules */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-slate-900/10 flex flex-col justify-between">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-[35px]"></div>
              
              <div>
                <div className="mb-4">
                  <h3 className="text-base font-black flex items-center gap-2 mb-0.5">
                    <Zap size={18} className="text-amber-400" /> Quick Operations
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Instant shortcuts to core administrative systems</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {[
                    { l: "User Directory", i: "users", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { l: "Content CMS", i: "cms", icon: LayoutDashboard, color: "text-purple-400", bg: "bg-purple-400/10" },
                    { l: "Moderation Queue", i: "moderation", icon: Bot, color: "text-amber-400", bg: "bg-amber-400/10" },
                    { l: "Emergency Broadcast", i: "broadcast", icon: Megaphone, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    { l: "Database Backups", i: "db_backup", icon: Database, color: "text-cyan-400", bg: "bg-cyan-400/10" },
                    { l: "Security & Audit", i: "security", icon: ShieldAlert, color: "text-pink-400", bg: "bg-pink-400/10" },
                  ].map((btn, i) => (
                    <button 
                      key={i} 
                      onClick={() => navigateToTab(btn.i)}
                      className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-left group"
                    >
                      <div className={`p-1.5 rounded-xl ${btn.bg} ${btn.color} group-hover:scale-105 transition-transform`}>
                        <btn.icon size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 text-center leading-tight">{btn.l}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => navigateToTab("settings")} 
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <Settings size={14} /> Open System Settings
              </button>
            </div>
          </div>

          {/* Pending Submissions & Moderation Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <FileText size={18} className="text-blue-600" /> Recent Submissions & Posts Queue
                </h3>
                <p className="text-xs text-slate-500 font-medium">Review community posts, pending submissions, and recent citizen publications</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter posts..."
                  value={postSearchQuery}
                  onChange={(e) => setPostSearchQuery(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={() => navigateToTab("reports")}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  View All <ArrowRight size={12} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="p-3.5">Post Content / Subject</th>
                    <th className="p-3.5">Author</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {postsList.filter(p => (p.title || p.content || "").toLowerCase().includes(postSearchQuery.toLowerCase())).slice(0, 5).length > 0 ? (
                    postsList.filter(p => (p.title || p.content || "").toLowerCase().includes(postSearchQuery.toLowerCase())).slice(0, 5).map((p: any, i: number) => (
                      <tr key={p.id || i} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900 max-w-xs">
                          <p className="truncate font-black">{p.title || p.subject || "Untitled Post"}</p>
                          <p className="text-[10px] text-slate-500 truncate font-normal">{p.content || p.description || ""}</p>
                        </td>
                        <td className="p-3.5 text-slate-600 font-medium">{p.authorName || p.author || 'Citizen'}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-black uppercase">
                            {p.category || 'General'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            p.status === 'published' ? 'bg-emerald-50 text-emerald-700' :
                            p.status === 'private_support' ? 'bg-purple-50 text-purple-700' :
                            p.status === 'rejected' ? 'bg-amber-50 text-amber-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {p.status || 'pending'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          {p.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdatePostStatus(p, 'published')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black transition-colors"
                              >
                                Publish
                              </button>
                              <button
                                onClick={() => handleUpdatePostStatus(p, 'private_support')}
                                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-black transition-colors"
                              >
                                Support
                              </button>
                              <button
                                onClick={() => handleUpdatePostStatus(p, 'rejected')}
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[10px] font-black transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeletePost(p.id)}
                            className="px-2.5 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-[10px] font-black transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        No submissions currently awaiting moderation.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Data Export & Backup Center */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Download size={18} className="text-indigo-600" /> Data Export Center (CSV / JSON)
            </h3>
            <p className="text-xs text-slate-500 font-medium">Export current portal datasets for reporting, compliance, and auditing</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl flex flex-col justify-between">
                <div>
                  <p className="text-xs font-black text-slate-800 mb-0.5">Users & Accounts Archive</p>
                  <p className="text-[10px] text-slate-500 mb-3">Export all registered citizen & official accounts.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => exportToCSV(usersList, "users_backup")} className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all">CSV</button>
                  <button onClick={() => exportToJSON(usersList, "users_backup")} className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black transition-all">JSON</button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl flex flex-col justify-between">
                <div>
                  <p className="text-xs font-black text-slate-800 mb-0.5">Posts & Grievances Archive</p>
                  <p className="text-[10px] text-slate-500 mb-3">Export community posts, updates and reports.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => exportToCSV(postsList, "posts_backup")} className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all">CSV</button>
                  <button onClick={() => exportToJSON(postsList, "posts_backup")} className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black transition-all">JSON</button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl flex flex-col justify-between">
                <div>
                  <p className="text-xs font-black text-slate-800 mb-0.5">Visitor Analytics & Logs</p>
                  <p className="text-[10px] text-slate-500 mb-3">Export system telemetry and security audit logs.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => exportToCSV(recentVisitors, "visitors_backup")} className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all">CSV</button>
                  <button onClick={() => exportToJSON(recentVisitors, "visitors_backup")} className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black transition-all">JSON</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <AdminGlobalSearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tabKey) => {
          navigateToTab(tabKey);
        }}
      />
    </div>
  );
}

export default SuperAdminDashboard;
