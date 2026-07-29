const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(
  'height: var(--nav-h);',
  'min-height: var(--nav-h);\n  height: auto;\n  padding: 4px 0;'
);

fs.writeFileSync('src/index.css', css);

let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<div className="h-full w-full max-w-7xl mx-auto flex items-center">',
  '<div className="min-h-full w-full max-w-7xl mx-auto flex items-center">'
);

code = code.replace(
  '<div className="flex-1 min-w-0 overflow-x-auto scrollbar-none flex items-center h-full">',
  '<div className="flex-1 w-full flex items-center min-h-full">'
);

code = code.replace(
  '<div className="flex items-center gap-2 sm:gap-3 min-w-max px-2 sm:px-4 h-full">',
  '<div className="flex items-center flex-wrap gap-2 sm:gap-3 px-2 sm:px-4 py-1">'
);

fs.writeFileSync('src/App.tsx', code);
