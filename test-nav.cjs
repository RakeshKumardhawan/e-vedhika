const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');
if (code.includes('HORIZONTAL NAVIGATION MENU IN TRIGGER BAR')) {
    console.log("Nav is still there");
} else {
    console.log("Nav is gone!");
}
