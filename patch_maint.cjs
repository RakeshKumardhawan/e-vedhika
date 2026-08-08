const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We want to add a banner for admins
const bannerCode = `
      <div className="flex bg-slate-50 min-h-[100dvh] w-full text-slate-800 overflow-x-hidden font-sans relative">
        {isMaintActive && (isAdmin || isDevEmail || hasAdminOverride) && (
          <div className="fixed top-0 left-0 w-full z-[99999] bg-red-600 text-white text-center py-2 px-4 text-sm font-bold shadow-md animate-pulse">
            ⚠️ THE SITE IS CURRENTLY IN MAINTENANCE MODE. (Regular users see the maintenance screen). You are bypassing this because you are an Admin.
          </div>
        )}
`;

code = code.replace('<div className="flex bg-slate-50 min-h-[100dvh] w-full text-slate-800 overflow-x-hidden font-sans relative">', bannerCode);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched maintenance banner");
