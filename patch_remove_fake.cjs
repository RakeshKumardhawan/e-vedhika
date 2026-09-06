const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

const telemetryStart = '{/* Live Server Telemetry (Glassmorphic) */}';
const telemetryEnd = '{/* Advanced Analytics & Quick Controls Grid */}';

let tS = content.indexOf(telemetryStart);
let tE = content.indexOf(telemetryEnd);
if(tS !== -1 && tE !== -1) {
    content = content.substring(0, tS) + content.substring(tE);
    console.log("Telemetry removed.");
}

const mtStart = '{/* Admin Maintenance Tools Row */}';
const mtEnd = '              </>\n            )}';

let mS = content.indexOf(mtStart);
let mE = content.indexOf(mtEnd);
if(mS !== -1 && mE !== -1) {
    content = content.substring(0, mS) + content.substring(mE);
    console.log("Maintenance removed.");
}

const ceStart = '<div className="mt-auto p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-blue-100/60">';
const ceEnd = 'Real-time Firestore & Cloud Run sync active.\n            </p>\n          </div>';

let cS = content.indexOf(ceStart);
let cE = content.indexOf(ceEnd);
if(cS !== -1 && cE !== -1) {
    content = content.substring(0, cS) + content.substring(cE + ceEnd.length);
    console.log("Cluster Engine removed.");
}

const badgeStart = '<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-blue-200 mb-4 backdrop-blur-md">';
const badgeEnd = 'System Online & Fully Synchronized\n                        </div>';
let bS = content.indexOf(badgeStart);
let bE = content.indexOf(badgeEnd);
if(bS !== -1 && bE !== -1) {
    content = content.substring(0, bS) + content.substring(bE + badgeEnd.length);
    console.log("Badge removed.");
}

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content, 'utf8');
