const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const broken = `                      </div>
                    </div>
                  </div>
                {/* Custom Script / HTML Ads */}`;

const fixed = `                      </div>
                    </div>
                  </div>
                </div>
                {/* Custom Script / HTML Ads */}`;

content = content.replace(broken, fixed);
fs.writeFileSync('src/App.tsx', content);
