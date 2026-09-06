const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'const isApproved = ["approved", "active"].includes(pStatus);',
  'const isApproved = ["approved", "active", "published"].includes(pStatus);'
);

fs.writeFileSync('src/App.tsx', content, 'utf8');
