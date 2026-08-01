const fs = require('fs');
const path = require('path');
let content = fs.readFileSync(path.join(__dirname, 'src/components/ExeUbdLiveMonitoring.tsx'), 'utf8');

if (!content.includes("import { Copy }")) {
  content = content.replace("import {", "import { Copy,");
}

const copyFunc = `
  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://e-vedhika.onrender.com/?tab=admin/UBDLiveMonitoring");
    alert("Link Copied!");
  };
`;

if (!content.includes("handleCopyLink")) {
  content = content.replace("const handleUpdateStatus", copyFunc + "\n  const handleUpdateStatus");
}

const bannerHtml = `      {/* Live Telemetry URL Banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xl">📡</span>
          <div>
            <h3 className="text-sm font-black text-indigo-900">LIVE TELEMETRY URL</h3>
            <p className="text-xs text-indigo-700 font-medium mt-0.5">Share this direct link to access the Telemetry Dashboard instantly.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-indigo-100 w-full sm:w-auto">
          <code className="text-xs text-slate-600 font-mono truncate max-w-[200px] sm:max-w-none">
            https://e-vedhika.onrender.com/?tab=admin/UBDLiveMonitoring
          </code>
          <button 
            onClick={handleCopyLink}
            className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-md transition-colors ml-2 shrink-0 flex items-center gap-1 cursor-pointer"
            title="Copy Link"
          >
            <Copy size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Copy</span>
          </button>
        </div>
      </div>

`;

if (!content.includes("LIVE TELEMETRY URL")) {
  content = content.replace("{/* Navigation Header */}", bannerHtml + "      {/* Navigation Header */}");
}

fs.writeFileSync(path.join(__dirname, 'src/components/ExeUbdLiveMonitoring.tsx'), content);
console.log("Updated ExeUbdLiveMonitoring.tsx");
