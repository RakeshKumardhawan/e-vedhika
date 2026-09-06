const fs = require('fs');
let content = fs.readFileSync('src/components/admin/UserChatManagement.tsx', 'utf8');

content = content.replace('export function UserChatManagement() {', 'export function UserChatManagement({ users }: { users?: any[] }) {');

const helperFunction = `
  const getUserName = (c: any) => {
    let name = c.userName || c.senderName;
    if (name && name.trim() !== "") return name;
    let uid = c.uid || c.senderId;
    if (users && uid) {
      const u = users.find(user => user.id === uid);
      if (u) return u.username || u.name || u.email || uid;
    }
    return uid || "Unknown User";
  };
`;

content = content.replace('useEffect(() => {', helperFunction + '\n  useEffect(() => {');

content = content.replace(
  '<td className="p-4 font-bold">{c.userName || c.senderName || c.uid || c.senderId}</td>',
  '<td className="p-4 font-bold">{getUserName(c)}</td>'
);

const searchRegex = /c\.senderName \|\| c\.userName/g;
content = content.replace(searchRegex, 'getUserName(c)');

fs.writeFileSync('src/components/admin/UserChatManagement.tsx', content, 'utf8');
