const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Fix Notification interface
content = content.replace(
  `interface Notification {
  id: string;
  uid: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  time: number;
  readBy?: string[];
}`,
  `interface Notification {
  id: string;
  uid: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  time: number;
  readBy?: string[];
  senderUid?: string;
}`
);

// 2. Add CustomAdUnit if missing
if (!content.includes('function CustomAdUnit(')) {
  content = content.replace(
    `function AdBanner({ slotId = "5641797386" }: { slotId?: string }) {
  return null;
}`,
    `function AdBanner({ slotId = "5641797386" }: { slotId?: string }) {
  return null;
}

function CustomAdUnit({ id, code, className }: { id: string; code?: string; className?: string }) {
  if (!code) return null;
  return (
    <div id={id} className={className} dangerouslySetInnerHTML={{ __html: code }} />
  );
}`
  );
}

fs.writeFileSync('src/App.tsx', content);
