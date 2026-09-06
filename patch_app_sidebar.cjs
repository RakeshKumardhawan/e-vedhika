const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The items we want to KEEP for App.tsx (Super Admin Master Controls)
const keepItemsApp = `[
                      { id: "super_admin", label: "Master Dashboard", icon: ShieldAlert, highlight: true },
                      { id: "users", icon: Users, label: "User Directory & Roles" },
                      { id: "cms", icon: LayoutDashboard, label: "Visual CMS Manager" },
                      { id: "moderation", icon: Bot, label: "Community Moderation" },
                      { id: "broadcast", icon: Megaphone, label: "Emergency Broadcasts" },
                      { id: "exe_ubd", icon: Radio, label: "EXE & UBD Monitoring" },
                      { id: "db_backup", icon: Database, label: "Database Backups" },
                      { id: "reports", icon: FileText, label: "Grievances & Reports" },
                      { id: "security", icon: ShieldAlert, label: "System Audit Logs" },
                      { id: "settings", icon: Settings, label: "Master Settings" },
                    ]`;

const appRegex = /\[\s*{\s*id:\s*"super_admin",[\s\S]*?\]\.map/m;
content = content.replace(appRegex, `${keepItemsApp}.map`);

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log("Successfully updated App.tsx features.");
