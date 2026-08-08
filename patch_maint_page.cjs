const fs = require('fs');
let code = fs.readFileSync('src/components/MaintenancePage.tsx', 'utf8');

if (!code.includes('isAdmin?: boolean;')) {
    code = code.replace('export interface MaintenancePageProps {', 'export interface MaintenancePageProps {\n  isAdmin?: boolean;');
}

if (!code.includes('isAdmin,')) {
    code = code.replace('export function MaintenancePage({', 'export function MaintenancePage({\n  isAdmin,');
}

const bypassButton = `
          {isAdmin ? (
            <button
              onClick={() => {
                localStorage.setItem("evedhika_admin_override", "true");
                window.location.reload();
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <ShieldAlert size={18} />
              <span>Bypass Maintenance (Admin)</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAdminModal(true)}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl transition-all border border-slate-700 flex items-center justify-center gap-2 text-sm"
            >
              <LogIn size={18} className="text-indigo-400" />
              <span>అడ్మిన్ లాగిన్ (Admin Login Access)</span>
            </button>
          )}
`;

code = code.replace(/<button\s*onClick=\{\(\) => setShowAdminModal\(true\)\}[\s\S]*?<\/button>/, bypassButton);

fs.writeFileSync('src/components/MaintenancePage.tsx', code);
console.log("Patched MaintenancePage");
