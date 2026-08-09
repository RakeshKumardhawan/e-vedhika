const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Modify AdsenseUnit to record impression
content = content.replace(
    /function AdsenseUnit\(\{/,
    "function AdsenseUnit({ client, slot, className }: { client?: string; slot?: string; className?: string; }) {\n  useEffect(() => {\n    try {\n      if (typeof window !== \"undefined\") {\n        recordAdImpression();\n        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});\n      }\n    } catch (e) {\n      console.error(\"AdSense error:\", e);\n    }\n  }, []);\n  if (!client || !slot) return null;\n  return (\n    <div className={`w-full overflow-hidden ${className || \"\"}`}>\n      <ins\n        className=\"adsbygoogle\"\n        style={{ display: \"block\" }}\n        data-ad-client={client}\n        data-ad-slot={slot}\n        data-ad-format=\"auto\"\n        data-full-width-responsive=\"true\"\n      ></ins>\n    </div>\n  );\n}\n\nfunction OldAdsenseUnit({"
);

fs.writeFileSync('src/App.tsx', content);
