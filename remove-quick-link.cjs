const fs = require('fs');
const path = require('path');
let content = fs.readFileSync(path.join(__dirname, 'src/App.tsx'), 'utf8');

const targetStr = `{/* Quick Access Tools */}
                        {(isAdmin || isDevEmail || isEditorMode) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button
                              onClick={() => {
                                startTransition(() => {
                                  setCurrentTab("exe_ubd_live");
                                });
                              }}
                              className="group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-3xl shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all border border-indigo-400/50"
                            >
                              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Radio size={24} className="text-white" />
                              </div>
                              <h3 className="font-black text-base text-center tracking-tight">EXE & UBD Live Monitoring</h3>
                              <p className="text-indigo-100 text-[10px] uppercase tracking-widest text-center mt-2 font-bold">Live Telemetry</p>
                            </button>
                          </div>
                        )}`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, "");
  fs.writeFileSync(path.join(__dirname, 'src/App.tsx'), content);
  console.log('Removed quick link.');
} else {
  console.log('Target string not found.');
}
