const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<nav className="nav-trigger-bar sticky z-[1000] px-2 sm:px-4">',
  '<nav className="nav-trigger-bar sticky z-[1000]">'
);
code = code.replace(
  '<div className="flex items-center gap-2 sm:gap-3 min-w-max">',
  '<div className="flex items-center gap-2 sm:gap-3 min-w-max px-2 sm:px-4 py-2">'
);

fs.writeFileSync('src/App.tsx', code);
