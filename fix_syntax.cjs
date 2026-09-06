const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

// Replace the messed up part
content = content.replace(
    '                                </>\n            )}',
    '                </div>\n              </>\n            )}'
);

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content, 'utf8');
console.log("Fixed syntax");
