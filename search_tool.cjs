const fs = require('fs');
const path = require('path');

function searchDir(dir, pattern) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'dist') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath, pattern);
    } else {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (pattern.test(content)) {
          console.log(`Found in: ${fullPath}`);
        }
      } catch (e) {}
    }
  }
}

console.log("Searching for EVedhikaUBDDeploymentTool...");
searchDir('.', /EVedhikaUBDDeploymentTool/i);

console.log("Searching for E-Vedhika UBD Tool...");
searchDir('.', /E-Vedhika UBD Tool/i);

console.log("Searching for Inno Setup or .iss...");
searchDir('.', /Inno Setup|\[Setup\]|\[Files\]/i);
