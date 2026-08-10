const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const searchStr = `                </div>
              </div>
            )}

            {activeSubTab === "code_manager" && (`;

console.log('Occurrences:', content.split(searchStr).length - 1);
