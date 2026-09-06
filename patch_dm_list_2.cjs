const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `const filteredUsers = allUsers
      .filter(u => u.id !== user.uid)
      .map(u => {
        const conv = conversations.get(u.id);
        return {
          ...u,
          lastMessageAt: conv ? conv.lastMessageAt : 0,
          lastMessageText: conv ? conv.lastMessageText : "",
          lastMessageSender: conv ? conv.lastMessageSender : "",
          lastMessageRead: conv ? conv.lastMessageRead : false,
          unreadCount: conv ? conv.unread : 0
        };
      });`;

const replacement = targetStr + `
      
    if (officialConv) {
      filteredUsers.unshift(officialUser);
    }
`;

content = content.replace(targetStr, replacement);
fs.writeFileSync('src/App.tsx', content, 'utf8');
