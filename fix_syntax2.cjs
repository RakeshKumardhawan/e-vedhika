const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/\{\nsetCurrentTab\(([^)]+)\);\n\s*\}\);/g, 'setCurrentTab($1);');
code = code.replace(/\{\n\s*setCurrentTab\(([^)]+)\);\n\s*\}\);/g, 'setCurrentTab($1);');
code = code.replace(/\{\n\s*setCurrentTab\(`custom_menu_\$\{menu\.id\}`\);\n\s*\}\);/g, 'setCurrentTab(`custom_menu_${menu.id}`);');

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed syntax 2");
