const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');
content = content.replace('Download, FileText, BarChart2, Shield, Radio, Zap, Box, ', 'Download, FileText, BarChart2, Shield, Radio, Zap, Box, MessageSquare, ');
fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content, 'utf8');
