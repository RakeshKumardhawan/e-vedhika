const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Find the line where syntax error occurs
const lines = content.split('\n');
const errorLineIdx = 15211; // 15212 is 1-indexed

lines.splice(errorLineIdx - 1, 3);
fs.writeFileSync('src/App.tsx', lines.join('\n'));
