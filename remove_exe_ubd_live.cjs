const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /\{currentTab === "exe_ubd_live" && \([\s\S]*?<ExeUbdLiveMonitoring \/>\s*<\/motion\.div>\s*\)\}/;

if(code.match(regex)) {
    code = code.replace(regex, "");
    fs.writeFileSync(file, code);
    console.log("Removed public access to exe_ubd_live");
} else {
    console.log("Could not find regex match!");
}
