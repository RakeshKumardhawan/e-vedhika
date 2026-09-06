const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

// print context around Global Search Modal
const lines = content.split('\n');
const lineIndex = lines.findIndex(l => l.includes('Global Search Modal'));
if (lineIndex !== -1) {
    for(let i = lineIndex - 15; i <= lineIndex + 5; i++) {
        console.log(i + ": " + lines[i]);
    }
}
