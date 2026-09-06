const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

content = content.replace("Advanced Moderation Queue (Posts & Comments)", "Pending Submissions & Content Moderation");

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content, 'utf8');
