const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const searchStart = code.indexOf('{currentTab === "home" && (');
let searchEnd = -1;
if (searchStart !== -1) {
    searchEnd = code.indexOf('{/* HORIZONTAL NAVIGATION MENU IN TRIGGER BAR */}', searchStart);
    if (searchEnd !== -1) {
        const toRemove = code.substring(searchStart, searchEnd);
        code = code.replace(toRemove, '');
        fs.writeFileSync('src/App.tsx', code);
        console.log("Removed search bar");
    }
}
