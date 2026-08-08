const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/\{\nsetCurrentTab\("workspace"\);\n\s*\}\);/g, 'setCurrentTab("workspace");');
code = code.replace(/\{\nsetCurrentTab\("gos_formats"\);\n\s*\}\);/g, 'setCurrentTab("gos_formats");');

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed syntax");
