const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update standard items
code = code.replace(
  /className=\{\`flex items-center gap-1\.5 px-3 sm:px-4 py-1\.5 sm:py-2 rounded-\[14px\] whitespace-nowrap transition-all duration-200 shrink-0 border/g,
  'className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl whitespace-nowrap transition-all duration-200 shrink-0 border'
);

code = code.replace(
  /className=\{\`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0/g,
  'className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center shrink-0'
);

code = code.replace(
  /size=\{14\} className="sm:w-4 sm:h-4"/g,
  'size={12} className="sm:w-3.5 sm:h-3.5"'
);

code = code.replace(
  /className=\{\`text-\[12px\] sm:text-\[13px\] tracking-wide/g,
  'className={`text-[11px] sm:text-[12px] tracking-wide'
);

// Update custom menus items
code = code.replace(
  /className=\{\`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 \$\{/g,
  'className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center shrink-0 ${'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated to compact sizes");
