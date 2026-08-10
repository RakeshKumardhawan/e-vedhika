const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf-8');

const customAdCode = `
function CustomAdUnit({ code, id, className }: { code?: string, id: string, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isRendered = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !code) return;

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
  }, [code]);

  useEffect(() => {
    if (!isVisible || !code || isRendered.current) return;
    
    // Check if limit reached before rendering this one ad
    if (typeof window !== "undefined") {
       recordAdImpression();
    }
    isRendered.current = true;
    
    if (containerRef.current) {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = code;
      
      const scripts = Array.from(wrapper.querySelectorAll("script"));
      
      // Append non-script elements
      while(wrapper.firstChild) {
         if (wrapper.firstChild.nodeName !== 'SCRIPT') {
            containerRef.current.appendChild(wrapper.firstChild);
         } else {
            wrapper.removeChild(wrapper.firstChild);
         }
      }

      // Re-create and append script elements to force execution
      scripts.forEach(oldScript => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        containerRef.current?.appendChild(newScript);
      });
    }
  }, [isVisible, code]);

  if (!code) return null;

  return (
    <div
      id={id}
      className={\`custom-ad-unit w-full my-4 flex flex-col justify-center items-center overflow-hidden \${className || ""}\`}
    >
      <div className="w-full relative min-h-[50px] flex justify-center items-center" ref={containerRef}>
        {/* Ad will be injected here */}
      </div>
    </div>
  );
}

`;

const newContent = content.replace('function AdsenseUnit({', customAdCode + 'function AdsenseUnit({');
fs.writeFileSync('src/App.tsx', newContent);
