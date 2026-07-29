const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldCode = `                              dangerouslySetInnerHTML={{__html: landingPageData.heroSubtitle}}
                            />
                          </div>
                        {/* Unified Banner & Footer Section */}`;
const newCode = `                              dangerouslySetInnerHTML={{__html: landingPageData.heroSubtitle}}
                            />
                          </div>
                        </div>
                        {/* Unified Banner & Footer Section */}`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/App.tsx', code);
