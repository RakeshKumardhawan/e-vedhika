const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const monetagUnit = `
function MonetagUnit({ zoneId, id, className }: { zoneId: string, id: string, className?: string }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    recordAdImpression();
    
    // Inject script if not present
    if (!document.querySelector('script[src="https://quge5.com/88/tag.min.js"]')) {
        const script = document.createElement("script");
        script.src = "https://quge5.com/88/tag.min.js";
        script.async = true;
        script.setAttribute("data-zone", zoneId);
        script.setAttribute("data-cfasync", "false");
        document.head.appendChild(script);
    }
  }, [zoneId]);
  
  return <div id={id} className={\`w-full empty:hidden flex justify-center items-center \${className || ""}\`} data-zone={zoneId}></div>;
}
`;

content = content.replace(
    /function AdsenseUnit/,
    monetagUnit + "\nfunction AdsenseUnit"
);

content = content.replace(
    /<div id="in-article-ad-slot"[^>]*data-zone=\{siteConfig\.ads\.monetagZoneIdInArticle\}><\/div>/g,
    "<MonetagUnit id=\"in-article-ad-slot\" zoneId={siteConfig.ads.monetagZoneIdInArticle} className=\"my-4\" />"
);

content = content.replace(
    /<div id="monetag-ad-sidebar"[^>]*data-zone=\{siteConfig\.ads\.monetagZoneIdSidebar\}><\/div>/g,
    "<MonetagUnit id=\"monetag-ad-sidebar\" zoneId={siteConfig.ads.monetagZoneIdSidebar} />"
);

fs.writeFileSync('src/App.tsx', content);
