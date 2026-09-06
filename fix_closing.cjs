const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

const target = `{/* Global Search Modal */}`;
const replaceWith = `
              </>
            )}
          </div>
          {/* Footer */}
          <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold text-slate-400 gap-4">
            <p>E-Vedhika Next-Gen Enterprise Super Admin Center &copy; 2026. All telemetry and graphs are synced live.</p>
          </div>
        </div>
      </div>

      {/* Global Search Modal */}`;

content = content.replace(target, replaceWith);
fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content, 'utf8');
console.log("Fixed closing tags");
