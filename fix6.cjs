const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const broken = `                      </div>
                    </div>
                  </div>
                </div>
                {/* Custom Script / HTML Ads */}`;

const fixed = `                      </div>
                    </div>
                  </div>
                </div>
                {/* Custom Script / HTML Ads */}`;

// Let's count divs in the block
const adsMatch = content.match(/{activeSubTab === "ads" && \([\s\S]*?\}             \)\}/); // this regex is tricky
