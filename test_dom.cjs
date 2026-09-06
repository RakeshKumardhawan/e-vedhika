const fs = require('fs');

let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');
let lines = content.split('\n');
for(let i=0; i<lines.length; i++) {
    if (lines[i].includes("PREMIUM COMMAND CENTER - OVERVIEW")) {
        for(let j=i; j<i+60; j++) {
            console.log(j + ": " + lines[j]);
        }
        break;
    }
}
