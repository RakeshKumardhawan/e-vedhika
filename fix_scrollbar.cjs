const fs = require('fs');

// Update index.css
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(
  /\.custom-scrollbar::-webkit-scrollbar\s*\{\s*height:\s*4px;\s*\}/g,
  '.custom-scrollbar::-webkit-scrollbar {\n  height: 4px;\n  width: 5px;\n}'
);
fs.writeFileSync('src/index.css', css);

// Update App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
const oldLine = '<div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#efeae2] w-full min-w-0">';
const newLine = '<div id="direct-chat-messages" className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#efeae2] w-full min-w-0 custom-scrollbar">';
app = app.replace(oldLine, newLine);
fs.writeFileSync('src/App.tsx', app);
