const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  /interface Notification \{[\s\S]*?readBy\?: string\[\];\n\}/m,
  (match) => match.replace('}', '  senderUid?: string;\n}')
);

if (!content.includes('function CustomAdUnit(')) {
  content = content.replace(
    /function AdBanner\(\{ slotId = "5641797386" \}: \{ slotId\?: string \}\) \{\n  return null;\n\}/m,
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
