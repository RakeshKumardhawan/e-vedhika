const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  `                                    {suggestionCategories.map((cat, idx) => (
                                      <option key={idx} value={cat}>{cat}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="space-y-1.5 pt-2 flex flex-col">`,
  `                                    {suggestionCategories.map((cat, idx) => (
                                      <option key={idx} value={cat}>{cat}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="space-y-1.5 pt-2 flex flex-col">`
);

fs.writeFileSync('src/App.tsx', content);
