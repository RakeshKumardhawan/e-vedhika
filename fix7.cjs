const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const broken = `                  </div>
                </div>
              </div>
            )}
            {activeSubTab === "code_manager" && (`;

const fixed = `                  </div>
                </div>
              </div>
            </div>
            )}
            {activeSubTab === "code_manager" && (`;

content = content.replace(broken, fixed);
fs.writeFileSync('src/App.tsx', content);
