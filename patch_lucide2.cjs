const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

if (!content.includes('Link2, Filter,')) {
  content = content.replace('ThumbsUp, ImageOff, } from "lucide-react";', 'ThumbsUp, ImageOff, Link2, Filter, } from "lucide-react";');
  fs.writeFileSync('src/App.tsx', content);
  console.log("Added Link2 and Filter");
}
