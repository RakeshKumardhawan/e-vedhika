const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<div className="flex-1 flex items-center h-full w-full min-w-0 px-1 sm:px-2">',
  '<div className="flex-1 flex items-center h-full w-full min-w-0 px-0 sm:px-0">'
);
code = code.replace(
  '<div className="flex-1 min-w-0 overflow-x-auto scrollbar-none flex items-center h-full ml-2 relative">',
  '<div className="flex-1 min-w-0 overflow-x-auto scrollbar-none flex items-center h-full relative">'
);

fs.writeFileSync('src/App.tsx', code);
