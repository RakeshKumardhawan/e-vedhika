const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

let startIndex = content.indexOf('activeSubTab === "rbac"');
if(startIndex !== -1) {
    console.log(content.substring(startIndex, startIndex + 500));
} else {
    console.log("Not found activeSubTab === 'rbac'");
}
