const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import \{([^}]+)\} from "lucide-react";/, (match, p1) => {
    return `import { DollarSign, ${p1} } from "lucide-react";`;
});

fs.writeFileSync('src/App.tsx', code);
console.log("Added DollarSign correctly");
