const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /\{ id: "updates", label: "Flash News", icon: Zap \},/g,
  `{ id: "updates", label: "Flash News", icon: Zap },\n                  { id: "media_vault", label: "Media Vault", icon: HardDrive },`
);

code = code.replace(
  /icon: <Zap size=\{18\} \/>,\n\s*\},\n\s*\]\n\s*: \[\]\),/g,
  `icon: <Zap size={18} />,\n                    },\n                  ]\n                : []),\n              ...(isSuperAdmin || isAdmin ? [{ id: "media_vault", label: "Media Vault (శాశ్వత గ్యాలరీ)", icon: <HardDrive size={18} /> }] : []),`
);

code = code.replace(
  /\{activeSubTab === "trash" && \(/,
  `{activeSubTab === "media_vault" && (\n              <div className="space-y-8 pb-20 fade-in slide-in-from-bottom-4 animate-in duration-500">\n                <MediaVaultAdmin addToast={addToast} />\n              </div>\n            )}\n            {activeSubTab === "trash" && (`
);

fs.writeFileSync('src/App.tsx', code);
