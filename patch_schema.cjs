const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetStr = `interface Post {
  id: string;
  slug?: string;`;

const newStr = `interface Post {
  id: string;
  status?: "draft" | "published";
  slug?: string;`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
  console.log("Schema updated");
}

fs.writeFileSync(file, code);
