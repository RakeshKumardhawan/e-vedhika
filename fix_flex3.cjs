const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The red arrow points to the quick reply buttons container extending beyond its boundary.
// Let's make sure the whole form and quick replies area are properly contained.

// Add max-w-full to quick replies wrapper
content = content.replace(
  /className="px-4 py-2 bg-\[#f0f2f5\] flex gap-1.5 overflow-x-auto scrollbar-none shrink-0 border-t border-slate-200 w-full min-w-0"/g,
  'className="px-4 py-2 bg-[#f0f2f5] flex gap-1.5 overflow-x-auto scrollbar-none shrink-0 border-t border-slate-200 w-full min-w-0 max-w-full"'
);

// Add max-w-full to form wrapper
content = content.replace(
  /className="p-3 bg-\[#f0f2f5\] flex gap-2 items-end shrink-0 w-full min-w-0"/g,
  'className="p-3 bg-[#f0f2f5] flex gap-2 items-end shrink-0 w-full min-w-0 max-w-full"'
);

// Let's also check the actual message container bubbles. Sometimes a long unbroken text can cause it.
content = content.replace(
  /className={`max-w-\[80%\] px-3 py-2 rounded-lg text-\[13px\] shadow-sm relative group/g,
  'className={`max-w-[80%] px-3 py-2 rounded-lg text-[13px] shadow-sm relative group break-all sm:break-words'
);

fs.writeFileSync('src/App.tsx', content);
