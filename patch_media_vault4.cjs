const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /if \(\!response\.ok\) throw new Error\(data\.error \|\| 'Cloudflare R2 upload failed'\);\n\s*setUploadProgress/g,
  `if (!response.ok) throw new Error(data.error || 'Cloudflare R2 upload failed');\n                await saveToMediaVault(data.url, file, auth.currentUser);\n                setUploadProgress`
);

fs.writeFileSync('src/App.tsx', code);
