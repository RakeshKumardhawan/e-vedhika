const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The main Right Pane layout is:
// <div className={`flex-1 min-w-0 w-full sm:w-auto bg-[#efeae2] flex flex-col h-full overflow-hidden relative ${!activeDmUser ? 'hidden sm:flex' : 'flex'}`}>

// Let's make sure the width is absolutely constrained by its parent
content = content.replace(
  /className=\{`flex-1 min-w-0 w-full sm:w-auto bg-\[#efeae2\] flex flex-col h-full overflow-hidden relative/g,
  'className={`flex-1 min-w-0 w-full sm:w-auto bg-[#efeae2] flex flex-col h-full overflow-hidden relative max-w-full'
);

fs.writeFileSync('src/App.tsx', content);
