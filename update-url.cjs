const fs = require('fs');
const path = require('path');
let content = fs.readFileSync(path.join(__dirname, 'src/App.tsx'), 'utf8');

const target1 = `const resolvedTab = tabFromUrl === "reports" ? "my_activity" : tabFromUrl === "problems" ? "directlinks" : (tabFromUrl === "admin/UBDLiveMonitoring" ? "admin" : tabFromUrl);`;
const replace1 = `const resolvedTab = tabFromUrl === "reports" ? "my_activity" : tabFromUrl === "problems" ? "directlinks" : (tabFromUrl === "admin/UBDLiveMonitoring" ? "exe_ubd_live" : tabFromUrl);`;

const target2 = `    let targetTabParam = currentTab;
    if (currentTab === "admin" && activeAdminSubTab === "exe_ubd_live") {
      targetTabParam = "admin/UBDLiveMonitoring";
    }`;

const replace2 = `    let targetTabParam = currentTab;
    if (currentTab === "exe_ubd_live") {
      targetTabParam = "admin/UBDLiveMonitoring";
    }`;

if (content.includes(target1)) content = content.replace(target1, replace1);
if (content.includes(target2)) content = content.replace(target2, replace2);

fs.writeFileSync(path.join(__dirname, 'src/App.tsx'), content);
console.log("Updated App.tsx");
