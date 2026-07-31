const fs = require('fs');
const path = require('path');
let content = fs.readFileSync(path.join(__dirname, 'src/components/SuperAdminDashboard.tsx'), 'utf8');

const targetStr = `                    {[
                      { l: "User Directory", i: "users" },
                      { l: "Review Reports", i: "reports" }, 
                      { l: "Page Builder", i: "deployments" },
                      { l: "System Config", i: "settings" }
                    ].map((action, i) => (`;

const newStr = `                    {[
                      { l: "EXE & UBD Live Monitoring", i: "exe_ubd" },
                      { l: "User Directory", i: "users" },
                      { l: "Review Reports", i: "reports" }, 
                      { l: "Page Builder", i: "deployments" },
                      { l: "System Config", i: "settings" }
                    ].map((action, i) => (`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync(path.join(__dirname, 'src/components/SuperAdminDashboard.tsx'), content);
  console.log('Added quick action.');
} else {
  console.log('Target string not found.');
}
