const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const search = `                            />
                          </div>

                        {/* Unified Banner & Footer Section */}`;

const replace = `                            />
                          </div>
                        </div>

                        {/* Unified Banner & Footer Section */}`;

code = code.replace(search, replace);
fs.writeFileSync('src/App.tsx', code);
