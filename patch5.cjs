const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/\}[\s]*await logUserActivity\("Liked Post: " \+ post\.id\); else \{/, '} else {');
content = content.replace(/\}[\s]*await logUserActivity\("Shared Post: " \+ post\.id\); else \{/, '} else {');

fs.writeFileSync('src/App.tsx', content);
