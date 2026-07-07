const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const exportRegex = /  const exportLogsToCSV = \(\) => \{[\s\S]*?addToast\("Logs exported as CSV"\);\n  \};\n/g;
content = content.replace(exportRegex, '');

fs.writeFileSync('src/App.tsx', content);
