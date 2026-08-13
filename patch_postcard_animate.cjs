const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /animate=\{commentPulse \? \{ scale: \[1, 1\.02, 1\], opacity: 1, y: 0 \} : \{ scale: 1, opacity: 1, y: 0 \}\}/g,
  `animate={commentPulse ? { scale: [1, 1.02, 1] } : { scale: 1 }}`
);

fs.writeFileSync('src/App.tsx', code);
