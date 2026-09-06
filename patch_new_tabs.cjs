const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

const regex = /activeTab === "admin_inbox" \? \(/;

const newCode = `activeTab === "support" ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                  <Shield className="text-blue-600" /> Support
                </h2>
                <p className="text-slate-500">Private Support tracking system (Coming soon)</p>
              </div>
            ) : activeTab === "notifications" ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                  <Bell className="text-blue-600" /> Notifications
                </h2>
                <p className="text-slate-500">System notifications and alerts will appear here.</p>
              </div>
            ) : activeTab === "roles" ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" /> Roles & Permissions
                </h2>
                <p className="text-slate-500">Manage user roles and permissions configuration.</p>
              </div>
            ) : activeTab === "broadcast" ? (
              <EmergencyBroadcast />
            ) : activeTab === "admin_inbox" ? (`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content, 'utf8');
