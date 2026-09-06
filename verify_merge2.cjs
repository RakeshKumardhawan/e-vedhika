const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

let startIndex = content.indexOf('activeSubTab === "staff_management"');
let rbacIndex = content.indexOf('id="rbac-matrix"');
console.log(content.substring(rbacIndex - 500, rbacIndex + 1000));
