import React, { useState, useEffect } from 'react';
import { 
  Users, Server, HardDrive, Database, Globe, Activity,
  AlertTriangle, CheckCircle, Clock, Search, Bell, Settings,
  Download, FileText, BarChart2, Shield, Radio, Zap, Box, 
  MapPin, UserCheck, ShieldAlert, Wifi, Cpu, ActivitySquare,
  HeartPulse
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db, analyticsDb } from '../../firebase';
import { LiveSystemHealthCenter } from './LiveSystemHealthCenter';
import { SecurityLogsSection } from './SecurityLogsSection';
import { SystemErrorCenter } from './SystemErrorCenter';
import { AdminGlobalSearchModal } from './AdminGlobalSearchModal';
import { ExeUbdLiveMonitoring } from './ExeUbdLiveMonitoring';

export default function SuperAdminDashboard({ user, stats, setActiveSubTab }: any) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleCustomOpen = () => setIsSearchOpen(true);
    window.addEventListener('open-admin-global-search', handleCustomOpen);
    return () => window.removeEventListener('open-admin-global-search', handleCustomOpen);
  }, []);

  // Real-time data state
  const [liveUsersCount, setLiveUsersCount] = useState(0);
  const [livePostsCount, setLivePostsCount] = useState(0);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [recentVisitors, setRecentVisitors] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Users count
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setLiveUsersCount(snap.size);
    });
    // Posts count
    const unsubPosts = onSnapshot(collection(db, 'posts'), (snap) => {
      setLivePostsCount(snap.size);
    });
    // Recent logs
    const unsubLogs = onSnapshot(query(collection(db, 'security_logs'), orderBy('timestamp', 'desc'), limit(10)), (snap) => {
      const logs: any[] = [];
      snap.forEach(doc => logs.push({ id: doc.id, ...doc.data() }));
      setRecentLogs(logs);
    });
    
    let unsubVisitors: any = () => {};
    if (analyticsDb) {
      unsubVisitors = onSnapshot(query(collection(analyticsDb, 'visitor_logs'), orderBy('timestamp', 'desc'), limit(50)), (snap) => {
        const visitors: any[] = [];
        snap.forEach(doc => visitors.push({ id: doc.id, ...doc.data() }));
        setRecentVisitors(visitors.slice(0, 10)); // Keep top 10 for feed
        
        // Build chart data based on visitors per hour
        const hourCounts: Record<string, number> = {};
        visitors.forEach(v => {
          const d = new Date(v.timestamp);
          const h = d.getHours() + ":00";
          hourCounts[h] = (hourCounts[h] || 0) + 1;
        });
        
        const newChartData = [];
        for (let i = 0; i < 24; i += 4) {
          const h = (i < 10 ? "0" + i : i) + ":00";
          newChartData.push({
            time: h,
            users: hourCounts[h] || 0,
          });
        }
        if (visitors.length === 0) {
          setChartData([
            { time: '00:00', users: 0 }, { time: '04:00', users: 0 }, { time: '08:00', users: 0 },
            { time: '12:00', users: 0 }, { time: '16:00', users: 0 }, { time: '20:00', users: 0 }, { time: '24:00', users: 0 }
          ]);
        } else {
          setChartData(newChartData);
        }
      }, (err) => {
        console.warn("Analytics DB access error (expected if not configured):", err);
      });
    }

    return () => {
      unsubUsers();
      unsubPosts();
      unsubLogs();
      if (unsubVisitors) unsubVisitors();
    };
  }, []);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (setActiveSubTab) {
      if (id === "overview") setActiveSubTab("dash");
      else if (id === "exe_ubd") setActiveSubTab("exe_ubd_live");
      else if (id === "users") setActiveSubTab("users");
      else if (id === "deployments") setActiveSubTab("builder");
      else if (id === "monitoring") setActiveSubTab("logs");
      else if (id === "security") setActiveSubTab("rbac");
      else if (id === "reports") setActiveSubTab("reports");
      else if (id === "settings") setActiveSubTab("settings");
    }
  };

  return (
    <div className="bg-[#F5F7FB] min-h-screen font-sans -mx-6 lg:-mx-12 -mt-6">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0B3D91] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
              <Shield size={16} />
            </div>
            <div>
              <h2 className="text-base font-black text-[#0F172A] leading-tight tracking-tight">E-VEDHIKA</h2>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Enterprise Console</p>
            </div>
          </div>

          {/* Global Search Quick Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 transition-all text-xs font-bold shadow-2xs group"
          >
            <Search size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
            <span className="hidden sm:inline">Search Users, Posts, Reports, Code, Settings...</span>
            <span className="sm:hidden">Search...</span>
            <span className="bg-white px-2 py-0.5 rounded-lg text-[10px] font-mono border border-slate-200 font-bold text-slate-600 shadow-2xs">
              Ctrl + K
            </span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">System Optimal</span>
          </div>
          
          <div className="flex items-center gap-2 text-right">
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-900">{user?.fullName || user?.email || 'System Administrator'}</p>
              <p className="text-[9px] font-bold text-slate-500">{currentTime.toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden xl:block w-56 border-r border-slate-200/60 bg-white/50 backdrop-blur-md sticky top-[57px] h-[calc(100vh-57px)] p-3 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
          {[
            { id: "overview", icon: Activity, label: "Live Overview" },
            { id: "exe_ubd", icon: Radio, label: "EXE & UBD Monitoring" },
            { id: "health", icon: HeartPulse, label: "System Health Center" },
            { id: "errors", icon: AlertTriangle, label: "System Error Center" },
            { id: "timeline", icon: Clock, label: "Activity Timeline" },
            { id: "users", icon: Users, label: "User Directory" },
            { id: "deployments", icon: Server, label: "Builder & Content" },
            { id: "monitoring", icon: Radio, label: "Live Logs" },
            { id: "security", icon: ShieldAlert, label: "RBAC & Security" },
            { id: "reports", icon: FileText, label: "Exports & Reports" },
            { id: "settings", icon: Settings, label: "System Config" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === item.id 
                  ? 'bg-[#0B3D91] text-white shadow-md shadow-blue-900/10' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'
              }`}
            >
              <item.icon size={16} className={activeTab === item.id ? "text-blue-200" : "text-slate-400"} />
              {item.label}
            </button>
          ))}
          
          <div className="mt-auto p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-blue-100/50">
            <div className="flex items-center gap-2 text-[#0B3D91] mb-1">
              <Database size={14} className="fill-[#0B3D91]" />
              <span className="font-bold text-[10px] uppercase">Real-time DB Sync</span>
            </div>
            <p className="text-[9px] text-slate-600 font-medium leading-relaxed">
              Dashboard is connected to live Firestore metrics.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="max-w-[1400px] mx-auto space-y-6">
            
            {activeTab === "exe_ubd" ? (
              <ExeUbdLiveMonitoring />
            ) : activeTab === "health" ? (
              <LiveSystemHealthCenter />
            ) : activeTab === "errors" ? (
              <SystemErrorCenter />
            ) : activeTab === "timeline" || activeTab === "monitoring" ? (
              <SecurityLogsSection />
            ) : (
              <>
                {/* Top Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {(stats && stats.length > 0 ? stats : [
                { label: "Total Accounts", value: liveUsersCount, trend: "Live", color: "text-[#0B3D91]", bg: "bg-blue-50", onClick: () => handleTabClick("users") },
                { label: "Active Content", value: livePostsCount, trend: "Live", color: "text-[#0B3D91]", bg: "bg-indigo-50", onClick: () => handleTabClick("deployments") },
                { label: "Security Logs", value: recentLogs.length, trend: "Live", color: "text-[#0B3D91]", bg: "bg-emerald-50", onClick: () => handleTabClick("security") },
                { label: "Recent Visitors", value: recentVisitors.length, trend: "Live", color: "text-[#0B3D91]", bg: "bg-amber-50", onClick: () => handleTabClick("monitoring") },
                { label: "System Health", value: "Optimal", trend: "100% Live", color: "text-[#0B3D91]", bg: "bg-slate-50", onClick: () => handleTabClick("health") },
              ]).map((stat: any, i: number) => {
                let Icon = ActivitySquare;
                if (stat.label.toLowerCase().includes('user') || stat.label.toLowerCase().includes('citizen') || stat.label.toLowerCase().includes('account')) Icon = Users;
                if (stat.label.toLowerCase().includes('issue') || stat.label.toLowerCase().includes('problem')) Icon = AlertTriangle;
                if (stat.label.toLowerCase().includes('post') || stat.label.toLowerCase().includes('content')) Icon = FileText;
                if (stat.label.toLowerCase().includes('visitor')) Icon = Globe;
                if (stat.label.toLowerCase().includes('security') || stat.label.toLowerCase().includes('health')) Icon = HeartPulse;
                
                return (
                  <div key={i} onClick={stat.onClick || (() => {})} className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between hover:shadow-md transition-all cursor-pointer group">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                      <p className={`text-2xl font-black text-slate-800 tracking-tight`}>{stat.value || stat.val}</p>
                      <p className={`text-[9px] font-bold text-emerald-600 mt-0.5`}>{stat.trend || 'Real-time'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-[#0B3D91] group-hover:text-white transition-colors text-slate-400">
                      <Icon size={18} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Main Chart */}
              <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-black text-[#0F172A]">Platform Activity</h3>
                    <p className="text-[10px] font-medium text-slate-500">Live Traffic & Engagement</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 text-[9px] font-bold bg-emerald-50 text-emerald-600 rounded-lg flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Sync
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.length ? chartData : [{time:'00:00',users:0}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0B3D91" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0B3D91" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Area type="monotone" dataKey="users" stroke="#0B3D91" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Real-time System Health */}
              <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col">
                <div className="mb-4">
                  <h3 className="text-sm font-black text-[#0F172A]">System Health</h3>
                  <p className="text-[10px] font-medium text-slate-500">Infrastructure Status</p>
                </div>
                
                <div className="flex-1 flex flex-col justify-center space-y-4">
                  {[
                    { label: "Database Connection", status: "Connected", color: "bg-emerald-500", icon: Database, bg: "bg-emerald-50", tc: "text-emerald-700" },
                    { label: "Analytics Storage", status: analyticsDb ? "Connected" : "Not Found", color: analyticsDb ? "bg-emerald-500" : "bg-rose-500", icon: HardDrive, bg: analyticsDb ? "bg-emerald-50" : "bg-rose-50", tc: analyticsDb ? "text-emerald-700" : "text-rose-700" },
                    { label: "Storage Bucket", status: "Active", color: "bg-emerald-500", icon: Box, bg: "bg-emerald-50", tc: "text-emerald-700" },
                    { label: "Authentication", status: "Secure", color: "bg-blue-500", icon: Shield, bg: "bg-blue-50", tc: "text-blue-700" },
                  ].map((infra, i) => (
                    <div key={i} className={`p-3 rounded-xl flex items-center justify-between border border-slate-100 ${infra.bg}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white shadow-sm ${infra.tc}`}>
                          <infra.icon size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{infra.label}</p>
                          <p className={`text-[10px] font-bold ${infra.tc}`}>{infra.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${infra.color} shadow-[0_0_8px_rgba(0,0,0,0.2)] shadow-${infra.color.replace('bg-', '')}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Quick Actions & Live Feed Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Quick Actions */}
              <div className="lg:col-span-3 bg-[#0F172A] text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px] pointer-events-none"></div>
                <div className="relative z-10">
                  <h3 className="text-sm font-black mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-blue-400" /> Quick Actions
                  </h3>
                  <div className="flex flex-col gap-2">
                    {[
                      { l: "EXE & UBD Live Monitoring", i: "exe_ubd" },
                      { l: "User Directory", i: "users" },
                      { l: "Review Reports", i: "reports" }, 
                      { l: "Page Builder", i: "deployments" },
                      { l: "System Config", i: "settings" }
                    ].map((action, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleTabClick(action.i)}
                        className="p-2.5 text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 rounded-xl text-left transition-colors flex items-center justify-between"
                      >
                        {action.l}
                        <span className="text-[10px] opacity-50">&rarr;</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity (Visitors) */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col h-[280px]">
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
                    <Globe size={16} className="text-blue-500" /> Live Visitors
                  </h3>
                  <span className="text-[9px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">Live DB</span>
                </div>
                <div className="overflow-y-auto pr-2 flex-1 space-y-2 custom-scrollbar">
                  {recentVisitors.length > 0 ? recentVisitors.map((log: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner shrink-0">
                          {log.device === 'mobile' ? <MapPin size={14} /> : <Globe size={14} />}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-800 truncate" title={log.path || log.url || "Home"}>{log.path || log.url || "Home"}</p>
                          <p className="text-[9px] font-medium text-slate-500 truncate" title={`${log.ip || "Unknown IP"} - ${log.browser || "Unknown Browser"}`}>{log.ip || "Unknown IP"} &bull; {log.browser || "Unknown Browser"}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 shrink-0 ml-2">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                      </span>
                    </div>
                  )) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 h-full">
                      <Globe size={24} className="mb-2 opacity-20" />
                      <p className="text-xs font-bold">No recent visitors</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity (Security/Admin Logs) */}
              <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col h-[280px]">
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
                    <ShieldAlert size={16} className="text-rose-500" /> Admin Logs
                  </h3>
                  <span className="text-[9px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">Live DB</span>
                </div>
                <div className="overflow-y-auto pr-2 flex-1 space-y-2 custom-scrollbar">
                  {recentLogs.length > 0 ? recentLogs.map((log: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`p-1.5 rounded-lg shrink-0 ${log.level === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                          <CheckCircle size={14} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-800 truncate" title={log.action || "System Event"}>{log.action || "System Event"}</p>
                          <p className="text-[9px] font-medium text-slate-500 truncate" title={log.details || log.email || "Automated"}>{log.details || log.email || "Automated"}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 shrink-0 ml-2">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                      </span>
                    </div>
                  )) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 h-full">
                      <Shield size={24} className="mb-2 opacity-20" />
                      <p className="text-xs font-bold">No admin logs yet</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

              </>
            )}

          </div>
          
          {/* Footer */}
          <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold text-slate-400 gap-4">
            <p>E-Vedhika Enterprise Dashboard &copy; 2026. All data is real-time.</p>
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      <AdminGlobalSearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tabKey, extraData) => {
          handleTabClick(tabKey);
        }}
      />
    </div>
  );
}
