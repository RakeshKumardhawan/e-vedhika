const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(
  '      const postData: any = {\n        title,\n        content,\n        category: selectedCategories[0],',
  '      const postData: any = {\n        slug: displaySlug,\n        title,\n        content,\n        category: selectedCategories[0],'
);
fs.writeFileSync(file, code);
