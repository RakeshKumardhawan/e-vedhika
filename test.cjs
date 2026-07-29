const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const i = code.indexOf('<SystemLiveClock');
console.log(code.substring(i - 200, i + 50));
