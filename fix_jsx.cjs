const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the specific trailing sequence
const target = `                      />
                    </div>
                  </div>
                </div>
                
                </div>
              </div>
            )}`;

const replace = `                      />
                    </div>
                  </div>
                </div>
              </div>
            )}`;

content = content.replace(target, replace);
fs.writeFileSync('src/App.tsx', content, 'utf8');
