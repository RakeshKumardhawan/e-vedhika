const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// First, make sure CheckCheck is imported from lucide-react
if (!content.includes('CheckCheck')) {
  content = content.replace(/CheckCircle2,\s*CheckCircle,\s*ShieldCheck,\s*Check,/, 'CheckCircle2, CheckCircle, ShieldCheck, Check, CheckCheck,');
}

// 1. Replace the sidebar checkmark
// Old: {(u as any).lastMessageSender === user.uid && <span className="text-blue-500">✓</span>}
// New (using double check for read, single check for delivered):
// Wait, in sidebar we might not have 'read' status easily accessible. Or do we?
// Actually we only store lastMessageSender and lastMessageText, we don't have lastMessageRead. Let's just use <CheckCheck size={12} className="text-slate-400" />
const sidebarTickOld = '{(u as any).lastMessageSender === user.uid && <span className="text-blue-500">✓</span>}';
const sidebarTickNew = '{(u as any).lastMessageSender === user.uid && <CheckCheck size={12} className="text-slate-400" />}';
content = content.replace(sidebarTickOld, sidebarTickNew);

// 2. Replace the message bubble checkmark
const bubbleTickOld = `{m.read ? "✓✓" : "✓"}`;
const bubbleTickNew = `{m.read ? <CheckCheck size={14} className="text-blue-500" /> : <Check size={14} className="text-slate-400" />}`;
content = content.replace(bubbleTickOld, bubbleTickNew);

// Also replace the wrapper class if needed, since the check is an icon now.
const bubbleTickWrapperOld = `<span className={m.read ? "text-blue-500 font-black text-[10px]" : "text-slate-400"}>`;
const bubbleTickWrapperNew = `<span className="ml-1 inline-flex items-center">`;
content = content.replace(bubbleTickWrapperOld, bubbleTickWrapperNew);

fs.writeFileSync('src/App.tsx', content);
