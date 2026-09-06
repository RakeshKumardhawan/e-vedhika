const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

const targetStart = `{/* Top Metrics Cards */}`;
const targetEnd = `{/* Global Search Modal */}`;

const startIndex = content.indexOf(targetStart);
const endIndex = content.indexOf(targetEnd);

if (startIndex === -1 || endIndex === -1) {
    console.log("Could not find targets");
    process.exit(1);
}

const premiumContent = `
                {/* PREMIUM COMMAND CENTER - OVERVIEW */}
                <div className="space-y-6">
                  {/* Hero Header */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0B3D91] to-[#1e1b4b] p-8 rounded-3xl text-white shadow-2xl border border-white/10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-blue-200 mb-4 backdrop-blur-md">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          System Online & Fully Synchronized
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Master Control Center</h2>
                        <p className="text-blue-200/80 text-sm max-w-xl font-medium leading-relaxed">
                          Welcome to the E-Vedhika Enterprise Dashboard. Oversee entire portal operations, real-time analytics, user roles, and security infrastructure from a single unified command hub.
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleTabClick("settings")} className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl backdrop-blur-md transition-all shadow-lg hover:shadow-white/5">
                          <Settings size={20} className="text-blue-100" />
                        </button>
                        <button onClick={triggerBroadcast} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-xl font-black text-xs transition-all shadow-lg shadow-blue-900/50 border border-white/10">
                          <Megaphone size={16} /> Broadcast Alert
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* High-End Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {(stats && stats.length > 0 ? stats : [
                      { label: "Total Accounts", value: liveUsersCount, trend: "Live Active", color: "from-blue-500 to-cyan-400", onClick: () => handleTabClick("users") },
                      { label: "Active Content", value: livePostsCount, trend: "Live Verified", color: "from-indigo-500 to-purple-500", onClick: () => handleTabClick("deployments") },
                      { label: "Security Logs", value: recentLogs.length, trend: "Protected", color: "from-emerald-500 to-teal-400", onClick: () => handleTabClick("security") },
                      { label: "Active Visitors", value: recentVisitors.filter((v: any) => (Date.now() - (v.timestamp || v.time || 0)) < 24 * 60 * 60 * 1000).length, trend: "Real-time", color: "from-amber-500 to-orange-400", onClick: () => handleTabClick("monitoring") },
                      { label: "System Health", value: "100%", trend: "Optimal", color: "from-slate-700 to-slate-900", onClick: () => handleTabClick("health") },
                    ]).map((stat: any, i: number) => {
                      let Icon = ActivitySquare;
                      if (stat.label.toLowerCase().includes('user') || stat.label.toLowerCase().includes('citizen') || stat.label.toLowerCase().includes('account')) Icon = Users;
                      if (stat.label.toLowerCase().includes('issue') || stat.label.toLowerCase().includes('problem')) Icon = AlertTriangle;
                      if (stat.label.toLowerCase().includes('post') || stat.label.toLowerCase().includes('content')) Icon = FileText;
                      if (stat.label.toLowerCase().includes('visitor')) Icon = Globe;
                      if (stat.label.toLowerCase().includes('security') || stat.label.toLowerCase().includes('health')) Icon = HeartPulse;
                      
                      return (
                        <div key={i} onClick={() => handleStatClick(stat)} className="relative overflow-hidden p-5 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                          {/* Top accent gradient */}
                          <div className={\`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r \${stat.color || 'from-blue-500 to-indigo-500'}\`}></div>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className={\`p-2.5 rounded-xl bg-gradient-to-br \${stat.color || 'from-blue-500 to-indigo-500'} text-white shadow-md\`}>
                              <Icon size={18} />
                            </div>
                            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                              {stat.trend || 'Real-time'}
                            </span>
                          </div>
                          
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value !== undefined ? stat.value : (stat.val !== undefined ? stat.val : '0')}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Live Server Telemetry (Glassmorphic) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: "CPU Core Load", value: \`\${cpuLoad}%\`, icon: Cpu, progress: cpuLoad * 2, color: "blue" },
                      { label: "Memory RAM Usage", value: \`\${memoryUsage} GB / 4.0 GB\`, icon: Database, progress: (memoryUsage / 4) * 100, color: "indigo" },
                      { label: "Network Latency", value: \`\${networkPing} ms\`, icon: Wifi, color: "emerald", isBadge: true }
                    ].map((metric, i) => (
                      <div key={i} className="bg-white/60 backdrop-blur-xl p-5 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center bg-\${metric.color}-50 text-\${metric.color}-600 shadow-inner border border-\${metric.color}-100\`}>
                            <metric.icon size={22} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{metric.label}</p>
                            <p className="text-xl font-black text-slate-900">{metric.value}</p>
                          </div>
                        </div>
                        {metric.isBadge ? (
                          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-black text-xs rounded-xl border border-emerald-100 shadow-sm">Ultra Fast</span>
                        ) : (
                          <div className="w-24 bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                            <div className={\`bg-\${metric.color}-600 h-full transition-all duration-1000 ease-out\`} style={{ width: \`\${metric.progress}%\` }}></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Advanced Analytics & Quick Controls Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart Area */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full -z-10"></div>
                      
                      <div className="flex items-center justify-between mb-6 flex-wrap gap-4 z-10">
                        <div>
                          <h3 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
                            <Activity size={20} className="text-blue-600" /> Hourly Traffic Telemetry
                          </h3>
                          <p className="text-xs font-medium text-slate-500 mt-1">Real-time engagement velocity from Firestore analytics</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 shadow-inner">
                            {(["today", "7days", "30days"] as const).map((r) => (
                              <button
                                key={r}
                                onClick={() => setTimeRange(r)}
                                className={\`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all \${
                                  timeRange === r ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                                }\`}
                              >
                                {r === 'today' ? 'Today' : r === '7days' ? '7 Days' : '30 Days'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-h-[300px] z-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData.length ? chartData : [{time:'00:00',users:0,requests:0}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0B3D91" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#0B3D91" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                            <RechartsTooltip 
                              contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '12px 16px' }}
                            />
                            <Area type="monotone" dataKey="users" name="Active Users" stroke="#0B3D91" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                            <Area type="monotone" dataKey="requests" name="API Requests" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorReq)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Quick Access Control Panel */}
                    <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-slate-900/20 flex flex-col justify-between">
                      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/30 rounded-full blur-[40px]"></div>
                      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-[40px]"></div>
                      
                      <div className="relative z-10 mb-6">
                        <h3 className="text-lg font-black flex items-center gap-2 mb-1">
                          <Zap size={20} className="text-amber-400" /> Power Modules
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">Instant access to critical operations</p>
                      </div>
                      
                      <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
                        {[
                          { l: "AI Copilot", i: "ai_copilot", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-400/10" },
                          { l: "Revenue Hub", i: "adsense", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                          { l: "Visual CMS", i: "cms", icon: LayoutDashboard, color: "text-blue-400", bg: "bg-blue-400/10" },
                          { l: "Deployments", i: "ci_cd", icon: Terminal, color: "text-amber-400", bg: "bg-amber-400/10" },
                          { l: "Theme Engine", i: "theme", icon: Palette, color: "text-pink-400", bg: "bg-pink-400/10" },
                          { l: "DB Backups", i: "db_backup", icon: Database, color: "text-cyan-400", bg: "bg-cyan-400/10" },
                        ].map((btn, i) => (
                          <button 
                            key={i} 
                            onClick={() => handleTabClick(btn.i)}
                            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group"
                          >
                            <div className={\`p-2 rounded-xl \${btn.bg} \${btn.color} group-hover:scale-110 transition-transform\`}>
                              <btn.icon size={18} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-300 text-center leading-tight">{btn.l}</span>
                          </button>
                        ))}
                      </div>
                      
                      <button onClick={() => handleTabClick("settings")} className="relative z-10 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                        <Settings size={14} /> Open Master Settings
                      </button>
                    </div>
                  </div>

                  {/* Admin Maintenance Tools Row */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                          <Sliders size={20} className="text-indigo-600" /> Maintenance & Diagnostics
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">Advanced system optimizations and cache management</p>
                      </div>
                      <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-wider border border-indigo-100 shadow-sm shrink-0">Super Admin Only</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <button onClick={() => addToast && addToast("System cache flushed successfully!", "success")} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800">Flush Cache</p>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Clear browser memory</p>
                        </div>
                      </button>

                      <button onClick={() => addToast && addToast("Firestore indexes verified!", "success")} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Database size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800">Re-Index DB</p>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Verify schemas</p>
                        </div>
                      </button>

                      <button onClick={() => handleTabClick("reports")} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          <Download size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800">Export Logs</p>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Download telemetry CSV</p>
                        </div>
                      </button>

                      <button onClick={() => handleTabClick("security")} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <ShieldAlert size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800">RBAC Audit</p>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Review access rights</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
`;

const newContent = content.substring(0, startIndex) + premiumContent + "\n" + content.substring(endIndex);

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', newContent, 'utf8');
console.log("Successfully patched dashboard.");
