const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

const duplicateRegex = /\) : activeTab === "broadcast" \? \([\s\S]*?<EmergencyBroadcast \/>/m;

content = content.replace(duplicateRegex, '');
fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content, 'utf8');
