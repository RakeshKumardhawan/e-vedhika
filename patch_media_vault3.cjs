const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /if \(\!response\.ok\) throw new Error\(data\.error \|\| 'Cloudflare R2 upload failed'\);\n\n\s*setUploadProgress\(100\);\n\s*resolve\(\{/g,
  `if (!response.ok) throw new Error(data.error || 'Cloudflare R2 upload failed');\n                await saveToMediaVault(data.url, file, auth.currentUser);\n                setUploadProgress(100);\n                resolve({`
);

fs.writeFileSync('src/App.tsx', code);
