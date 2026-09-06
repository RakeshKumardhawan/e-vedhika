const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove "rbac" from the first array (around line 5388)
const rbacArr1 = `{
                          id: "rbac",
                          label: "Role Matrix (RBAC)",
                          icon: Lock,
                        },`;
content = content.replace(rbacArr1, "");

// 2. Remove "rbac" from the second array (around line 10780)
const rbacArr2 = `{
                      id: "rbac",
                      label: "Role Matrix (RBAC)",
                      icon: <Lock size={18} />,
                    },`;
content = content.replace(rbacArr2, "");

// 3. Find the "staff_management" block end and "rbac" block start
// They are likely consecutive
const rbacBlockStart = `{activeSubTab === "rbac" && (isSuperAdmin || isAdmin) && (`;
const staffBlockEnd = `                  </div>
                </div>
              </div>
            )}`;
// Actually, let's just replace the `{activeSubTab === "rbac" && (isSuperAdmin || isAdmin) && (`
// with `<div id="rbac-matrix" className="mt-12">`
// Wait, we need to match it correctly.

let tS = content.indexOf(`{activeSubTab === "rbac" && (isSuperAdmin || isAdmin) && (`);
if(tS !== -1) {
    // Before tS, there should be `</div>\n              </div>\n            )}\n\n` for staff_management
    // Let's replace the ending of staff_management and the start of rbac so they merge.
    const mergeTarget = `                </div>
              </div>
            )}

            {activeSubTab === "rbac" && (isSuperAdmin || isAdmin) && (`;
    
    const mergeReplacement = `                </div>
                
                {/* Embedded RBAC Matrix */}
                <div id="rbac-matrix" className="mt-12 w-full pt-8 border-t border-slate-200">`;
    
    if(content.includes(mergeTarget)) {
        content = content.replace(mergeTarget, mergeReplacement);
        console.log("Merged blocks successfully.");
    } else {
        // Try fallback with regex
        content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\}\)\s*\{\s*activeSubTab === "rbac" && \(isSuperAdmin \|\| isAdmin\) && \(/, 
        `</div>
                
                {/* Embedded RBAC Matrix */}
                <div id="rbac-matrix" className="mt-12 w-full pt-8 border-t border-slate-200">`);
        console.log("Tried regex merge.");
    }
}

fs.writeFileSync('src/App.tsx', content, 'utf8');
