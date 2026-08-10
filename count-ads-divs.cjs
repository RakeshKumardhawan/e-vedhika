const fs = require('fs');
const content = fs.readFileSync('ads-block.tsx', 'utf-8');

const opens = (content.match(/<div[^>]*>/g) || []).length;
const closes = (content.match(/<\/div>/g) || []).length;
console.log('Open:', opens, 'Close:', closes);
