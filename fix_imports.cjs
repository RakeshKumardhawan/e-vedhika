const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import \{ DollarSign, /g, 'import { ');

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed imports");
