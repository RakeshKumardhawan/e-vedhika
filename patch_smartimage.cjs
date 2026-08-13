const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /  const \[currentSrc, setCurrentSrc\] = useState\(directUrl\);\n  const \[attempt, setAttempt\] = useState\(0\);\n  const \[hasError, setHasError\] = useState\(false\);/,
  `  const [currentSrc, setCurrentSrc] = useState(directUrl);\n  const [attempt, setAttempt] = useState(0);\n  const [hasError, setHasError] = useState(false);\n  const [isLoading, setIsLoading] = useState(true);`
);

code = code.replace(
  /      src=\{currentSrc\}\n      alt=\{alt\}\n      loading="lazy"\n      referrerPolicy="no-referrer"\n      className=\{`\$\{className\} \$\{allowLightbox \? "cursor-pointer" : ""\}`\}\n      style=\{style\}\n      onError=\{handleError\}\n      onClick=\{\(e\) => \{/g,
  `      src={currentSrc}\n      alt={alt}\n      loading="lazy"\n      referrerPolicy="no-referrer"\n      className={\`\${className} transition-all duration-500 \${isLoading ? "blur-md opacity-50 scale-[1.02]" : "blur-0 opacity-100 scale-100"} \${allowLightbox ? "cursor-pointer" : ""}\`}\n      style={style}\n      onLoad={() => setIsLoading(false)}\n      onError={handleError}\n      onClick={(e) => {`
);

fs.writeFileSync('src/App.tsx', code);
