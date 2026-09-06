const fs = require('fs');
let content = fs.readFileSync('src/components/admin/UserChatManagement.tsx', 'utf8');

const regex = /const filtered = chats\.filter\(c =>/;
const replacement = `const filtered = chats.filter(c => c.senderId !== "e-vedika-official" && c.uid !== "e-vedika-official").filter(c =>`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/admin/UserChatManagement.tsx', content, 'utf8');
