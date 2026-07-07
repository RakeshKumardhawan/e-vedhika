import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// replace simple setCurrentTab calls
content = content.replace(
  /setCurrentTab\("([^"]+)"\);\n\s*setSidebarOpen\(false\);/g,
  `startTransition(() => { setCurrentTab("$1"); });\n                    setSidebarOpen(false);`
);

content = content.replace(
  /setCurrentTab\(\`custom_menu_\$\{menu\.id\}\`\);\n\s*setSidebarOpen\(false\);/g,
  `startTransition(() => { setCurrentTab(\`custom_menu_\$\{menu.id\}\`); });\n                          setSidebarOpen(false);`
);

content = content.replace(
  /onClick=\{\(\) => setCurrentTab\("([^"]+)"\)\}/g,
  `onClick={() => startTransition(() => setCurrentTab("$1"))}`
);

fs.writeFileSync('src/App.tsx', content);
