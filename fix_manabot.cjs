const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove ManaBot instances
code = code.replace(/<ManaBot[^>]*\/>/g, '');

// Also remove import just in case to avoid unused warning
code = code.replace(/import\s*\{\s*ManaBot\s*\}\s*from\s*['"]\.\/components\/ManaBot['"];?/g, '');

fs.writeFileSync('src/App.tsx', code);
