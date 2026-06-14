const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/<ManaBot currentTab=\{currentTab\} userName=\{userProfile\?\.name\} \/>/g, '');
code = code.replace(/import \{ ManaBot \} from "\.\/components\/ManaBot";/g, '');
fs.writeFileSync('src/App.tsx', code);
