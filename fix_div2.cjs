const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  /<\/select>\s*<\/div>\s*<\/div>/,
  `</select>
        </div>
        </div>
      </div>`
);

fs.writeFileSync('src/App.tsx', content);
