const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

if (!content.includes('Link2,')) {
  content = content.replace('ImageOff,', 'ImageOff, Link2, Filter,');
  fs.writeFileSync('src/App.tsx', content);
  console.log("Added Link2 and Filter to lucide-react imports");
}
