const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

const regexMobile = /\{\/\* Mobile Navigation \(Horizontal Scroll\) \*\/\}([\s\S]*?)<\/div>/;

const newMobile = `{/* Mobile Navigation (Horizontal Scroll) */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto p-3 bg-white border-b border-slate-200/80 custom-scrollbar sticky top-[57px] z-40">
          {[
            { id: "overview", icon: Activity, label: "Overview" },
            { id: "cms", icon: LayoutDashboard, label: "Posts" },
            { id: "moderation", icon: Bot, label: "Pending" },
            { id: "admin_inbox", icon: FileText, label: "Admin Inbox" },
            { id: "support", icon: Shield, label: "Support" },
            { id: "chat_mgmt", icon: MessageSquare, label: "Chat Mgmt" },
            { id: "broadcast", icon: Megaphone, label: "Broadcast" },
            { id: "users", icon: Users, label: "Users" },
            { id: "reports", icon: AlertTriangle, label: "Reports" },
            { id: "notifications", icon: Bell, label: "Notifications" },
            { id: "security", icon: ShieldAlert, label: "Audit Logs" },
            { id: "roles", icon: ShieldCheck, label: "Roles" },
            { id: "db_backup", icon: Database, label: "Backups" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all \${
                activeTab === item.id 
                  ? 'bg-[#0B3D91] text-white shadow-md shadow-blue-900/15' 
                  : 'bg-slate-100 text-slate-600'
              }\`}
            >
              <item.icon size={14} className={activeTab === item.id ? "text-blue-200" : "text-slate-400"} />
              {item.label}
            </button>
          ))}
        </div>`;

content = content.replace(regexMobile, newMobile);
fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content, 'utf8');
