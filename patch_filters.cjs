const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/  const \[logType, setLogType\] = useState<\n    "admin" \| "user" \| "system"\n  >\("admin"\);\n/, '');
content = content.replace(/  const \[logActionFilter, setLogActionFilter\] = useState\(""\);\n/, '');
content = content.replace(/  const \[logAdminFilter, setLogAdminFilter\] = useState\(""\);\n/, '');

fs.writeFileSync('src/App.tsx', content);
