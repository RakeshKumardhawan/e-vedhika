const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                          {item.hasDropdown && (
                            <ChevronDown size={14} className={\`ml-0.5 opacity-70 \${themeClasses.text}\`} />
                          )}
                        </button>
                      </div>`;

const replacement = `                          {item.hasDropdown && (
                            <ChevronDown size={14} className={\`ml-0.5 opacity-70 \${themeClasses.text}\`} />
                          )}
                        </button>
                        
                        {item.hasDropdown && (
                          <div className="absolute top-[calc(100%-4px)] left-0 mt-0 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover/navitem:opacity-100 group-hover/navitem:visible group-hover/navitem:mt-2 transition-all duration-200 z-[1050] overflow-hidden">
                            <div className="p-2 flex flex-col gap-1">
                              {item.id === "priority_services" && (
                                <>
                                  <button
                                    onClick={() => { startTransition(() => { setCurrentTab("emergency"); }); setIsPriorityOpen(false); }}
                                    className={\`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors text-left \${currentTab === 'emergency' ? 'bg-red-50 text-red-700' : 'hover:bg-slate-50 text-slate-700'}\`}
                                  >
                                    <div className={\`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 \${currentTab === 'emergency' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}\`}>
                                      <AlertTriangle size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[13px] font-bold">Emergency Contacts</span>
                                    </div>
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (!user) requireLoginAlert();
                                      else { startTransition(() => { setCurrentTab("my_activity"); }); setIsPriorityOpen(false); }
                                    }}
                                    className={\`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors text-left \${currentTab === 'my_activity' ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-slate-700'}\`}
                                  >
                                    <div className={\`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 \${currentTab === 'my_activity' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}\`}>
                                      <Activity size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[13px] font-bold">My Activity</span>
                                    </div>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Hover dropdown added successfully");
} else {
  console.log("Target not found");
}
