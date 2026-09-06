const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/"Approved" : "Pending"/g, '"published" : "pending"');
content = content.replace(/status === "Approved"/g, 'status === "published"');

fs.writeFileSync('src/App.tsx', content, 'utf8');
