const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const smStart = content.indexOf('activeSubTab === "staff_management"');
const block = content.substring(smStart, content.indexOf('activeSubTab === "settings"'));

console.log((block.match(/<div/g) || []).length);
console.log((block.match(/<\/div>/g) || []).length);
