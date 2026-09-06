const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<button\s+onClick=\{\(\) => \{\s*setShowProfileModal\(true\);\s*setSidebarOpen\(false\);\s*\}\}\s+className="w-full flex items-center gap-3 p-2\.5 rounded-xl hover:bg-slate-100 transition-colors text-left group"\s*>\s*<div className=\{\`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-200\/80 text-slate-600\`\}>\s*<Settings size=\{16\} \/>\s*<\/div>\s*<div className="flex flex-col">\s*<span className="text-\[13px\] font-bold">Edit Profile<\/span>\s*<\/div>\s*<\/button>/m;

const newBtn = `<button
                                      onClick={() => {
                                        setShowContactAdmin(true);
                                        setSidebarOpen(false);
                                      }}
                                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-left group"
                                    >
                                      <div className={\`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-purple-100 text-purple-600\`}>
                                        <Mail size={16} />
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[13px] font-bold">Message Admin</span>
                                      </div>
                                    </button>
                                    $&`;

content = content.replace(regex, newBtn);
fs.writeFileSync('src/App.tsx', content, 'utf8');
