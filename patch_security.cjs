const fs = require('fs');
let content = fs.readFileSync('src/components/SecurityLogsSection.tsx', 'utf8');

content = content.replace('import { db } from "../lib/firebase";', 'import { db } from "../../firebase";');

fs.writeFileSync('src/components/SecurityLogsSection.tsx', content);
