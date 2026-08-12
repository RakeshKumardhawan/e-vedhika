const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  /<\/select>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div className="space-y-1.5 pt-2 flex flex-col">/,
  `</select>
                                </div>
                              <div className="space-y-1.5 pt-2 flex flex-col">`
);

fs.writeFileSync('src/App.tsx', content);
