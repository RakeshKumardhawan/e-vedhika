const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(
  /<span className="side-btn-emoji">[^<]*<\/span>\s*<span className="text-sm tracking-tight font-bold">\s*Farmer Registry Live Verification\s*<\/span>/g,
  '<Wheat size={20} className={currentTab === "farmer_registry" ? "text-white" : "text-slate-500"} strokeWidth={currentTab === "farmer_registry" ? 2.5 : 2} />\n                  <span className="text-sm tracking-tight font-bold">\n                    Farmer Registry Live Verification\n                  </span>'
);

fs.writeFileSync('src/App.tsx', c);
console.log('Fixed Farmer Registry');
