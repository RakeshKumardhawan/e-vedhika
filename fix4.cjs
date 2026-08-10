const fs = require('fs');
const lines = fs.readFileSync('src/App.tsx', 'utf-8').split('\n');

const startIndex = 14900;
const endIndex = 14930;

console.log(lines.slice(startIndex, endIndex + 1).join('\n'));
