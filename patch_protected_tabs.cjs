const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    const protectedTabs = [
      "admin",
      "editor",
      "my_activity",
    ];`;

const replacement = `    const protectedTabs = [
      "admin",
      "editor",
      "my_activity",
      "logs",
    ];`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
