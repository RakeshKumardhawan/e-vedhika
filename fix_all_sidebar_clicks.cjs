const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /onClick=\{\(\) => \{\s*setActiveAdminSubTab\(item\.id\);\s*if \(window\.innerWidth < 1024\) setSidebarOpen\(false\);\s*\}\}/g;

const replacement = `onClick={() => {
                          setActiveAdminSubTab(item.id);
                          setCurrentTab("admin");
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}`;

code = code.replace(regex, replacement);

fs.writeFileSync(file, code);
console.log("Fixed ALL sidebar clicks");
