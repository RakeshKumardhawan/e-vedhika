const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/if \\(isMaintActive && !isAdmin && !isDevEmail && !hasAdminOverride\\) \\{/, 'if (isMaintActive && !hasAdminOverride) {');

const target2 = `                            if (!isMaintenance) {
                              localStorage.removeItem("evedhika_admin_override");
                            } else {
                              localStorage.setItem("evedhika_admin_override", "true");
                            }`;
const repl2 = `                            if (!isMaintenance) {
                              localStorage.removeItem("evedhika_admin_override");
                            }`;

code = code.replace(target2, repl2);
fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx maintenance logic");
