const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

// The items we want to KEEP for E-Vedhika Admin
const keepItemsMobile = `[
            { id: "overview", icon: Activity, label: "Overview" },
            { id: "users", icon: Users, label: "Users & Roles" },
            { id: "cms", icon: LayoutDashboard, label: "Content (CMS)" },
            { id: "moderation", icon: Bot, label: "Moderation" },
            { id: "broadcast", icon: Megaphone, label: "Alerts" },
            { id: "exe_ubd", icon: Radio, label: "UBD Tracking" },
            { id: "db_backup", icon: Database, label: "Exports & Backups" },
            { id: "reports", icon: FileText, label: "Grievances" },
            { id: "security", icon: ShieldAlert, label: "Audit Logs" },
            { id: "settings", icon: Settings, label: "Settings" },
          ]`;

const keepItemsDesktop = `[
            { id: "overview", icon: Activity, label: "Live Overview & Charts" },
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

// Find and replace the mobile sidebar array
const mobileRegex = /\[\s*{\s*id:\s*"overview",[\s\S]*?\]\.map/m;
content = content.replace(mobileRegex, `${keepItemsMobile}.map`);

// Find and replace the desktop sidebar array
const desktopRegex = /\[\s*{\s*id:\s*"overview",[\s\S]*?\]\.map/g;

let matches = 0;
content = content.replace(desktopRegex, (match, offset) => {
    // Only replace the second match (desktop) - the first one was already replaced theoretically, but we use regex on the whole content so it might match twice.
    matches++;
    if(matches === 2 || match.includes("Live Overview & Charts")) {
        return `${keepItemsDesktop}.map`;
    }
    return match; // return mobile as is if it matched again
});

// Fix Power Modules in the Premium Dashboard section
const powerModulesRegex = /\[\s*{\s*l:\s*"AI Copilot"[\s\S]*?\]\.map/m;
const newPowerModules = `[
                          { l: "User Directory", i: "users", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
                          { l: "Content CMS", i: "cms", icon: LayoutDashboard, color: "text-purple-400", bg: "bg-purple-400/10" },
                          { l: "Moderation", i: "moderation", icon: Bot, color: "text-amber-400", bg: "bg-amber-400/10" },
                          { l: "Broadcasts", i: "broadcast", icon: Megaphone, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                          { l: "DB Backups", i: "db_backup", icon: Database, color: "text-cyan-400", bg: "bg-cyan-400/10" },
                          { l: "Audit Logs", i: "security", icon: ShieldAlert, color: "text-pink-400", bg: "bg-pink-400/10" },
                        ].map`;

content = content.replace(powerModulesRegex, newPowerModules);

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content, 'utf8');
console.log("Successfully updated dashboard features.");
