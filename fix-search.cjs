const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/const \[searchQuery, setSearchQuery\] = useState\(""\);\n/, '');
code = code.replace(/const q = searchQuery\.toLowerCase\(\)\.trim\(\);\n/, 'const q = "";\n');
fs.writeFileSync('src/App.tsx', code);
