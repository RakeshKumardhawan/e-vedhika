const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

// The issue is likely that the modal's flex-row container isn't constraining its children properly.
// Let's ensure the main motion.div has a constrained width and overflow.

let newContent = content.replace(
  /className="w-full max-w-6xl bg-white sm:rounded-\[24px\] rounded-2xl shadow-2xl overflow-hidden flex flex-row h-\[85vh\] max-h-\[900px\]"/g,
  'className="w-full max-w-6xl bg-white sm:rounded-[24px] rounded-2xl shadow-2xl overflow-hidden flex flex-row h-[85vh] max-h-[900px] max-w-[100vw]"'
);

fs.writeFileSync('src/App.tsx', newContent);
