const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace all instances of:
// onClick={() => {
//   setActiveAdminSubTab(item.id);
//   if (window.innerWidth < 1024) setSidebarOpen(false);
// }}
// with the fixed version

const target = `onClick={() => {
                          setActiveAdminSubTab(item.id);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}`;

const newCode = `onClick={() => {
                          setActiveAdminSubTab(item.id);
                          setCurrentTab("admin");
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}`;

code = code.split(target).join(newCode);

fs.writeFileSync(file, code);
console.log("Fixed sidebar clicks");
