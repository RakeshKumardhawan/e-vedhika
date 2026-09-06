const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStart = '                {/* Embedded RBAC Matrix */}';
let sIdx = content.indexOf(targetStart);
if (sIdx !== -1) {
    // We need to find where the duplicate block ends.
    // The previous structure was: 
    //   </div>
    // </div>
    // )}
    // Let's find the first instance of ')}' after the start of this block and maybe some </div>s.
    // Or, we can just replace everything from targetStart up to the next `            {activeSubTab ===` or similar block.
    // Or just look for the end of the table and the wrapping divs.

    let nextBlockIdx = content.indexOf('            {activeSubTab === "settings"', sIdx);
    if(nextBlockIdx === -1) {
        nextBlockIdx = content.indexOf('            {activeSubTab === "profile"', sIdx);
    }
    if (nextBlockIdx === -1) {
        nextBlockIdx = content.indexOf('          </main>', sIdx);
    }
    
    if (nextBlockIdx !== -1) {
        // Let's print what we are about to remove to verify
        // The block should end with a closing div/div/)}
        
        let blockToKeep = content.substring(0, sIdx);
        // Wait, the original staff_management ended with:
        //               </div>
        //             )}
        // We need to make sure the closing tags for staff_management are restored.
        blockToKeep += `                </div>
              </div>
            )}

`;
        content = blockToKeep + content.substring(nextBlockIdx);
        fs.writeFileSync('src/App.tsx', content, 'utf8');
        console.log("Removed duplicate RBAC block.");
    }
}
