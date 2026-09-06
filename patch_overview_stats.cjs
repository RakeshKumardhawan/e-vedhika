const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

// Add states for support tickets and reports
const stateRegex = /const \[trendData, setTrendData\] = useState<any\[\]>\(\[/;
const newStates = `const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [reportsCount, setReportsCount] = useState(0);
  
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "support_tickets"), snap => {
      setSupportTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const [trendData, setTrendData] = useState<any[]>([`;

content = content.replace(stateRegex, newStates);

// Now patch the grid section
const gridRegex = /<div className="grid grid-cols-2 md:grid-cols-5 gap-4">[\s\S]*?\{\/\* Quick Action Buttons \*\/\}/;

const newGrid = `<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                      { label: "Total Users", value: usersList.length, trend: "Registered", color: "from-blue-500 to-cyan-400", onClick: () => handleTabClick("users") },
                      { label: "Active Users", value: usersList.filter(u => Date.now() - (u.lastActive || 0) < 24 * 60 * 60 * 1000).length, trend: "24h Activity", color: "from-sky-500 to-blue-400", onClick: () => handleTabClick("users") },
                      { label: "Total Posts", value: postsList.length, trend: "All Time", color: "from-indigo-500 to-purple-500", onClick: () => handleTabClick("cms") },
                      { label: "Published", value: postsList.filter(p => p.status === "published" || p.status === "Approved").length, trend: "Live Content", color: "from-emerald-500 to-teal-400", onClick: () => handleTabClick("cms") },
                      { label: "Pending", value: postsList.filter(p => p.status === "pending" || p.status === "Pending").length, trend: "Needs Review", color: "from-amber-500 to-orange-400", onClick: () => handleTabClick("moderation") },
                      { label: "Rejected", value: postsList.filter(p => p.status === "rejected").length, trend: "Archived", color: "from-rose-500 to-pink-500", onClick: () => handleTabClick("moderation") },
                      { label: "Unread Inbox", value: supportTickets.filter(t => t.status === "new").length, trend: "Messages", color: "from-fuchsia-500 to-rose-400", onClick: () => handleTabClick("admin_inbox") },
                      { label: "Open Support", value: supportTickets.filter(t => t.status !== "resolved").length, trend: "Tickets", color: "from-violet-500 to-fuchsia-400", onClick: () => handleTabClick("admin_inbox") },
                      { label: "Reports", value: reportsCount, trend: "Content", color: "from-red-500 to-rose-600", onClick: () => handleTabClick("reports") },
                      { label: "Recent Activity", value: recentLogs.length, trend: "Audit Logs", color: "from-slate-700 to-slate-900", onClick: () => handleTabClick("security") },
                    ].map((stat: any, i: number) => {
                      let Icon = ActivitySquare;
                      if (stat.label.includes('User')) Icon = Users;
                      if (stat.label.includes('Support') || stat.label.includes('Inbox')) Icon = Mail;
                      if (stat.label.includes('Post') || stat.label.includes('Published') || stat.label.includes('Pending') || stat.label.includes('Rejected')) Icon = FileText;
                      if (stat.label.includes('Report')) Icon = AlertTriangle;
                      if (stat.label.includes('Activity')) Icon = ShieldCheck;
                      
                      return (
                        <div key={i} onClick={stat.onClick} className="relative overflow-hidden p-5 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                          <div className={\`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r \${stat.color}\`}></div>
                          <div className="flex justify-between items-start mb-3">
                            <div className={\`p-2.5 rounded-2xl bg-gradient-to-br \${stat.color} text-white shadow-lg\`}>
                              <Icon size={18} />
                            </div>
                            <span className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-wider rounded-lg border border-slate-100">{stat.trend}</span>
                          </div>
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                            <h4 className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Action Buttons */}`;

content = content.replace(gridRegex, newGrid);
content = content.replace("import { Megaphone, Activity, Users, Settings, Database, Cloud, Shield, Bell, CheckCircle, Search, Clock, Zap, MapPin, Smartphone, Share2, Globe, HeartPulse, ActivitySquare, AlertTriangle, FileText, ChevronDown, ChevronRight, Download, Server, Cpu, Filter, Eye, PenTool } from 'lucide-react';", "import { Megaphone, Activity, Users, Settings, Database, Cloud, Shield, Bell, CheckCircle, Search, Clock, Zap, MapPin, Smartphone, Share2, Globe, HeartPulse, ActivitySquare, AlertTriangle, FileText, ChevronDown, ChevronRight, Download, Server, Cpu, Filter, Eye, PenTool, Mail, ShieldCheck } from 'lucide-react';");

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content, 'utf8');
