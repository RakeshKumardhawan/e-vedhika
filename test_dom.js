const fs = require('fs');

// We don't have JSDOM, let's write a quick node script that reads SuperAdminDashboard.tsx
// Actually, it's easier to just look at the children of "PREMIUM COMMAND CENTER - OVERVIEW" -> <div className="space-y-6">

let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');
let lines = content.split('\n');
let c = 0;
for(let i=0; i<lines.length; i++) {
    if (lines[i].includes("PREMIUM COMMAND CENTER - OVERVIEW")) {
        console.log("Found at line " + i);
        for(let j=i; j<i+60; j++) {
            console.log(j + ": " + lines[j]);
        }
        break;
    }
}
