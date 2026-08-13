const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldMap = `const conversations = new Map<string, { lastMessageAt: number, unread: number, lastMessageText: string, lastMessageSender: string }>();`;
const newMap = `const conversations = new Map<string, { lastMessageAt: number, unread: number, lastMessageText: string, lastMessageSender: string, lastMessageRead: boolean }>();`;
content = content.replace(oldMap, newMap);

const oldCurrent = `const current = conversations.get(otherId) || { lastMessageAt: 0, unread: 0, lastMessageText: "", lastMessageSender: "" };`;
const newCurrent = `const current = conversations.get(otherId) || { lastMessageAt: 0, unread: 0, lastMessageText: "", lastMessageSender: "", lastMessageRead: false };`;
content = content.replace(oldCurrent, newCurrent);

const oldAssign = `          current.lastMessageAt = m.createdAt;
          current.lastMessageText = m.text;
          current.lastMessageSender = m.senderId;
        }`;
const newAssign = `          current.lastMessageAt = m.createdAt;
          current.lastMessageText = m.text;
          current.lastMessageSender = m.senderId;
          current.lastMessageRead = !!m.read;
        }`;
content = content.replace(oldAssign, newAssign);

const oldMapReturn = `          lastMessageText: conv ? conv.lastMessageText : "",
          lastMessageSender: conv ? conv.lastMessageSender : "",
          unreadCount: conv ? conv.unread : 0
        };`;
const newMapReturn = `          lastMessageText: conv ? conv.lastMessageText : "",
          lastMessageSender: conv ? conv.lastMessageSender : "",
          lastMessageRead: conv ? conv.lastMessageRead : false,
          unreadCount: conv ? conv.unread : 0
        };`;
content = content.replace(oldMapReturn, newMapReturn);

// Also change the sidebar tick to be dynamic based on read
const oldSidebarTick = `{(u as any).lastMessageSender === user.uid && <CheckCheck size={12} className="text-slate-400" />}`;
const newSidebarTick = `{(u as any).lastMessageSender === user.uid && ( (u as any).lastMessageRead ? <CheckCheck size={12} className="text-blue-500" /> : <Check size={12} className="text-slate-400" /> )}`;
content = content.replace(oldSidebarTick, newSidebarTick);

fs.writeFileSync('src/App.tsx', content);
