const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

let startIndex = content.indexOf('activeSubTab === "staff_management"');
console.log(content.substring(startIndex, startIndex + 2000));
