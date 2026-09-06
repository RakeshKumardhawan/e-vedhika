const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "const { collection, addDoc, updateDoc, doc } = require('firebase/firestore');",
  ""
);

fs.writeFileSync('src/App.tsx', content, 'utf8');
