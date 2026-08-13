const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /onKeyDown=\{\(e\) => e\.key === 'Enter' && handleSaveEdit\(\)\}/g,
  `onKeyDown={(e) => (e.ctrlKey || e.metaKey) && e.key === 'Enter' && handleSaveEdit()}`
);

fs.writeFileSync('src/App.tsx', code);
