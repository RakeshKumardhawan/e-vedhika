const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<MaintenancePage/g, '<MaintenancePage isAdmin={isAdmin}');

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for MaintenancePage");
