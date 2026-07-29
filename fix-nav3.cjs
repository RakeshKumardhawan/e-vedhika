const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(
  'min-height: var(--nav-h);\n  height: auto;\n  padding: 4px 0;',
  'height: var(--nav-h);'
);

fs.writeFileSync('src/index.css', css);

let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  '<div className="min-h-full w-full max-w-7xl mx-auto flex items-center">',
  '<div className="h-full w-full max-w-7xl mx-auto flex items-center">'
);
code = code.replace(
  '<div className="flex-1 w-full overflow-x-auto flex items-center min-h-full custom-scrollbar">',
  '<div className="flex-1 w-full overflow-x-auto flex items-center h-full custom-scrollbar">'
);
code = code.replace(
  '<div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 min-w-max">',
  '<div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 h-full min-w-max pb-1">'
);

fs.writeFileSync('src/App.tsx', code);
