const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

const regexDesktop = /\{\/\* Desktop Sidebar \*\/\}[\s\S]*?(?=\{\/\* Main Content \*\/)/;

const newDesktop = `{/* Desktop Sidebar */}
        <div className="hidden md:flex w-64 border-r border-slate-200/60 bg-white/60 backdrop-blur-md sticky top-[57px] h-[calc(100vh-57px)] p-4 flex-col gap-1 overflow-y-auto custom-scrollbar">
          
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 mt-2">Dashboard</div>
          {[
            { id: "overview", icon: Activity, label: "Overview & Charts" },
            { id: "exe_ubd", icon: Radio, label: "EXE & UBD Monitoring" },
          ].map((item) => (
            <button key={item.id} onClick={() => handleTabClick(item.id)} className={\`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all \${activeTab === item.id ? 'bg-[#0B3D91] text-white shadow-md shadow-blue-900/15' : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'}\`}>
              <item.icon size={16} className={activeTab === item.id ? "text-blue-200" : "text-slate-400"} />
              {item.label}
            </button>
          ))}
          
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 mt-4">Content</div>
          {[
            { id: "cms", icon: LayoutDashboard, label: "Posts" },
            { id: "moderation", icon: Bot, label: "Pending Submissions" },
          ].map((item) => (
            <button key={item.id} onClick={() => handleTabClick(item.id)} className={\`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all \${activeTab === item.id ? 'bg-[#0B3D91] text-white shadow-md shadow-blue-900/15' : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'}\`}>
              <item.icon size={16} className={activeTab === item.id ? "text-blue-200" : "text-slate-400"} />
              {item.label}
            </button>
          ))}

          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 mt-4">Communication</div>
          {[
            { id: "admin_inbox", icon: FileText, label: "Admin Inbox" },
            { id: "support", icon: Shield, label: "Support" },
            { id: "chat_mgmt", icon: MessageSquare, label: "User Chat Management" },
            { id: "broadcast", icon: Megaphone, label: "Broadcast Messages" },
          ].map((item) => (
            <button key={item.id} onClick={() => handleTabClick(item.id)} className={\`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all \${activeTab === item.id ? 'bg-[#0B3D91] text-white shadow-md shadow-blue-900/15' : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'}\`}>
              <item.icon size={16} className={activeTab === item.id ? "text-blue-200" : "text-slate-400"} />
              {item.label}
            </button>
          ))}

          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 mt-4">Users</div>
          {[
            { id: "users", icon: Users, label: "User Management" },
            { id: "reports", icon: AlertTriangle, label: "Reports" },
          ].map((item) => (
            <button key={item.id} onClick={() => handleTabClick(item.id)} className={\`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all \${activeTab === item.id ? 'bg-[#0B3D91] text-white shadow-md shadow-blue-900/15' : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'}\`}>
              <item.icon size={16} className={activeTab === item.id ? "text-blue-200" : "text-slate-400"} />
              {item.label}
            </button>
          ))}

          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 mt-4">System</div>
          {[
            { id: "notifications", icon: Bell, label: "Notifications" },
            { id: "security", icon: ShieldAlert, label: "Audit Logs" },
            { id: "roles", icon: ShieldCheck, label: "Roles & Permissions" },
            { id: "db_backup", icon: Database, label: "Database Backups" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map((item) => (
            <button key={item.id} onClick={() => handleTabClick(item.id)} className={\`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all \${activeTab === item.id ? 'bg-[#0B3D91] text-white shadow-md shadow-blue-900/15' : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'}\`}>
              <item.icon size={16} className={activeTab === item.id ? "text-blue-200" : "text-slate-400"} />
              {item.label}
            </button>
          ))}
          
        </div>
`;

content = content.replace(regexDesktop, newDesktop);

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content, 'utf8');
