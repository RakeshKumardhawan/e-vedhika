const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetStr = `      const postData: any = {
        slug: displaySlug,
        title,
        content,`;
const newStr = `      const postData: any = {
        status: draftStatus,
        slug: displaySlug,
        title,
        content,`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
  console.log("Submit patched successfully.");
} else {
  console.log("Target string for submit not found.");
}

fs.writeFileSync(file, code);
