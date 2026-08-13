#!/bin/bash
sed -i 's/className={`\${className} \${allowLightbox ? "cursor-pointer" : ""}`}/className={`\${className} transition-all duration-500 \${isLoading ? "bg-slate-200 animate-pulse blur-[2px]" : "bg-transparent blur-0"} \${allowLightbox ? "cursor-pointer" : ""}`}/g' src/App.tsx
sed -i 's/onError={handleError}/onError={handleError}\n      onLoad={() => setIsLoading(false)}/g' src/App.tsx
