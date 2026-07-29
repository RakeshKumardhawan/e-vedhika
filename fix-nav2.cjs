const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<div className="flex-1 w-full flex items-center min-h-full">',
  '<div className="flex-1 w-full overflow-x-auto flex items-center min-h-full custom-scrollbar">'
);

code = code.replace(
  '<div className="flex items-center flex-wrap gap-2 sm:gap-3 px-2 sm:px-4 py-1">',
  '<div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 min-w-max">'
);

fs.writeFileSync('src/App.tsx', code);

let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('.custom-scrollbar')) {
  css += `
/* Custom Scrollbar for Nav */
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.4);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.6);
}
`;
  fs.writeFileSync('src/index.css', css);
}

