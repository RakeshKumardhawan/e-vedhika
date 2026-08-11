const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// replace AdsenseUnit
let start = content.indexOf('function AdsenseUnit({');
if (start > 0) {
  let end = content.indexOf('function HomeAds({', start);
  if (end > 0) {
    let newAdsense = `function AdsenseUnit({
  client,
  slot,
  className,
}: {
  client?: string;
  slot?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isPushed = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !client || !slot) return;
    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [client, slot]);

  useEffect(() => {
    if (!isVisible) return;
    if (isPushed.current) return;
    const timer = setTimeout(() => {
      try {
        if (typeof window !== "undefined") {
          recordAdImpression();
          ((window as any).adsbygoogle = ((window as any).adsbygoogle || [])).push({});
          isPushed.current = true;
        }
      } catch (e) {
        console.error("AdSense error:", e);
        setHasError(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!client || !slot) return null;

  return (
    <div
      ref={containerRef}
      className={\`adsense-unit w-full my-4 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 flex flex-col justify-center items-center text-center transition-all overflow-hidden \${className || ""}\`}
    >
      <span className="text-[9px] font-extrabold tracking-widest text-slate-400 uppercase select-none mb-1">
        📢 ప్రకటన • ADVERTISEMENT
      </span>
      {isVisible ? (
        <ins
          className="adsbygoogle w-full"
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      ) : (
        <div className="h-10 w-full animate-pulse bg-slate-100/80 rounded flex items-center justify-center text-[10px] text-slate-400 font-bold">
          Loading advertisement...
        </div>
      )}
      {hasError && (
        <span className="text-[10px] font-medium text-slate-400/90 mt-1">
          (Ad unavailable / blocked by browser)
        </span>
      )}
    </div>
  );
}

`;
    content = content.substring(0, start) + newAdsense + content.substring(end);
    console.log("Patched AdsenseUnit");
  } else { console.log("HomeAds not found after AdsenseUnit"); }
} else { console.log("AdsenseUnit not found"); }

fs.writeFileSync('src/App.tsx', content);
