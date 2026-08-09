const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Modify AdsenseUnit to record impression
content = content.replace(
    /function AdsenseUnit\(\{\n  client,\n  slot,\n  className,\n\}: \{\n  client\?: string;\n  slot\?: string;\n  className\?: string;\n\}\) \{\n  useEffect\(\(\) => \{\n    try \{\n      if \(typeof window !== "undefined"\) \{\n        \(\(window as any\)\.adsbygoogle = \(window as any\)\.adsbygoogle \|\| \[\]\)\.push\(\n          \{\},\n        \);\n      \}\n    \} catch \(e\) \{\n      console\.error\("AdSense error:", e\);\n    \}\n  \}, \[\]\);/g,
    `function AdsenseUnit({
  client,
  slot,
  className,
}: {
  client?: string;
  slot?: string;
  className?: string;
}) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        recordAdImpression();
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          {},
        );
      }
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);`
);

fs.writeFileSync('src/App.tsx', content);
