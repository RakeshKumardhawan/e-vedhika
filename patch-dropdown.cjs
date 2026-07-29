const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /{item.hasDropdown && \(\s*<div className="absolute.*?<\/div>\s*\)\s*}/s;

if (regex.test(code)) {
    code = code.replace(regex, ''); // Remove the absolute dropdown
    // Now replace the onClick for priority_services
    code = code.replace(
        /if \(item.id === "priority_services"\) \{\s*\/\/[^\n]*\n\s*\}/,
        `if (item.id === "priority_services") {\n                              setIsPriorityOpen(true);\n                            }`
    );
    
    // We need to render a modal if isPriorityOpen is true.
    // Let's inject a modal just before the closing </div> of the app container.
    // The app container ends with </div>
    // Let's inject it before the last </div>
    
    const modalCode = `
      {/* Priority Services Modal */}
      <AnimatePresence>
        {isPriorityOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsPriorityOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Target size={16} />
                  </div>
                  <h3 className="font-bold text-slate-800">Priority Services</h3>
                </div>
                <button onClick={() => setIsPriorityOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <button
                  onClick={() => { startTransition(() => { setCurrentTab("emergency"); }); setIsPriorityOpen(false); }}
                  className={\`flex items-center gap-3 w-full p-3 rounded-xl transition-colors border \${currentTab === 'emergency' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700 hover:border-slate-200'}\`}
                >
                  <div className={\`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 \${currentTab === 'emergency' ? 'bg-red-100 text-red-600' : 'bg-red-50 text-red-500'}\`}>
                    <AlertTriangle size={20} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[14px] font-bold">Emergency Contacts</span>
                    <span className="text-[11px] text-slate-500 font-medium">Quick access to emergency numbers</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    if (!user) requireLoginAlert();
                    else { startTransition(() => { setCurrentTab("my_activity"); }); setIsPriorityOpen(false); }
                  }}
                  className={\`flex items-center gap-3 w-full p-3 rounded-xl transition-colors border \${currentTab === 'my_activity' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700 hover:border-slate-200'}\`}
                >
                  <div className={\`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 \${currentTab === 'my_activity' ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-50 text-emerald-500'}\`}>
                    <Activity size={20} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[14px] font-bold">My Activity & Reports</span>
                    <span className="text-[11px] text-slate-500 font-medium">View your recent actions</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    if (!user) requireLoginAlert();
                    else { setShowProfileModal(true); setIsPriorityOpen(false); }
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-xl transition-colors border bg-white border-slate-100 hover:bg-slate-50 text-slate-700 hover:border-slate-200"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-slate-50 text-slate-500">
                    <Settings size={20} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[14px] font-bold">Edit Profile</span>
                    <span className="text-[11px] text-slate-500 font-medium">Update your account details</span>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

    // Replace the very last </div>\n  );\n}
    code = code.replace(/<\/div>\s*\n\s*\);\s*\n\s*}\s*$/, modalCode);
    
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched Priority Services dropdown to a modal.");
} else {
    console.log("Could not find dropdown regex.");
}
