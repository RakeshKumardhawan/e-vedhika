const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\{\["dash", "super_admin", "overview", "adsense", "cms", "ci_cd", "ai_copilot", "seo", "theme", "db_backup", "newsletter", "moderation", "broadcast", "ai_seo", "ssl", "localization", "exe_release", "exe_ubd", "health", "ddos", "cdn", "errors", "timeline", "monitoring", "security", "admin_inbox", "chat_mgmt", "users", "settings"\]\.includes\(activeSubTab\) && \(/g;
const replace = `
            {["dash", "super_admin", "overview", "adsense", "cms", "ci_cd", "ai_copilot", "seo", "theme", "db_backup", "newsletter", "moderation", "broadcast", "ai_seo", "ssl", "localization", "exe_release", "exe_ubd", "health", "ddos", "cdn", "errors", "timeline", "monitoring", "security", "admin_inbox", "chat_mgmt", "users", "settings", "support", "notifications", "roles"].includes(activeSubTab) && (`;

content = content.replace(regex, replace);
fs.writeFileSync('src/App.tsx', content, 'utf8');
