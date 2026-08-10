const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const broken = `                  </div>
                </div>
              <CodeManager addToast={addToast} />
            )}`;

const fixed = `                  </div>
                </div>
              </div>
            )}
            {activeSubTab === "code_manager" && (
              <CodeManager addToast={addToast} />
            )}`;

content = content.replace(broken, fixed);
fs.writeFileSync('src/App.tsx', content);
