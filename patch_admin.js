const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `  const [logs, setLogs] = useState<any[]>([]);`;
content = content.replace(target1, '');

const target2 = `  const [logsError, setLogsError] = useState(false);`;
content = content.replace(target2, '');

const target3 = `  const [logSearchTerm, setLogSearchTerm] = useState("");`;
content = content.replace(target3, '');

fs.writeFileSync('src/App.tsx', content);
