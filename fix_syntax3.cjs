const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/onClick=\{\(\) => setCurrentTab\("([^"]+)"\)\)\}/g, 'onClick={() => setCurrentTab("$1")}');
code = code.replace(/onClick=\{\(\) => setCurrentTab\(item\.id\)\)\}/g, 'onClick={() => setCurrentTab(item.id)}');

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed extra parentheses");
