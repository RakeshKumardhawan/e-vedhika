const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

content = content.replace('<UserChatManagement />', '<UserChatManagement users={usersList} />');

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content, 'utf8');
