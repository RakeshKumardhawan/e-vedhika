const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'className="flex items-center gap-2 sm:gap-3 flex-1 lg:max-w-xs xl:max-w-md shrink-0 h-[34px] sm:h-[40px] bg-slate-50 border border-slate-200 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500/30 shadow-sm rounded-xl px-3 sm:px-5 transition-all group"',
  'className="flex items-center gap-2 sm:gap-3 w-[120px] sm:w-[200px] lg:w-[280px] shrink-0 h-[34px] sm:h-[40px] bg-slate-50 border border-slate-200 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500/30 shadow-sm rounded-xl px-3 sm:px-5 transition-all group"'
);

fs.writeFileSync('src/App.tsx', code);
