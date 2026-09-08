const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `{/* Header Search Bar (Desktop/Tablet) */}
          <div className="hidden lg:flex items-center justify-center shrink-0">
            <div className="relative flex items-center w-44 xl:w-60">
              <span className="absolute left-3 text-slate-400 pointer-events-none">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="పోస్ట్స్, డాక్యుమెంట్స్ వెతకండి..."
                className="w-full bg-[#071a30] text-white placeholder-slate-400 text-xs font-bold pl-9 pr-7 py-2 rounded-full border border-white/15 focus:outline-none focus:border-[#fbe947] focus:ring-1 focus:ring-[#fbe947] transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 text-slate-400 hover:text-white cursor-pointer"
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>`;

if(code.includes(target)) {
    code = code.replace(target, "");
    fs.writeFileSync(file, code);
    console.log("Search bar removed successfully.");
} else {
    console.log("Target not found!");
}
