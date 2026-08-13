const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Also make sure the right pane wrapper is strictly bounded
content = content.replace(
  /className=\{`flex-1 min-w-0 bg-\[#efeae2\] flex flex-col h-full overflow-hidden relative \$\{!activeDmUser \? 'hidden sm:flex' : 'flex'\}`\}/g,
  'className={`flex-1 min-w-0 w-full sm:w-auto bg-[#efeae2] flex flex-col h-full overflow-hidden relative ${!activeDmUser ? \'hidden sm:flex\' : \'flex\'}`}'
);

fs.writeFileSync('src/App.tsx', content);
