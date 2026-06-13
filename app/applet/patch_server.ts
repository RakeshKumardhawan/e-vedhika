import fs from 'fs';

const file = 'server.ts';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `const firestoreResp = await fetchObj(firestoreUrl);`;
const replacementStr = `const firestoreResp = await fetchObj(firestoreUrl, { headers: { "Referer": "https://e-vedhika.online/" } });`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(file, content, 'utf8');
