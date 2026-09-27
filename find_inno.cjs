const fs = require('fs');
const content = fs.readFileSync('src/components/ExeUbdLiveMonitoring.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('Inno') || line.includes('iss') || line.includes('C:\\') || line.includes('CreateProcess') || line.includes('Setup') || line.includes('DeploymentTool')) {
    console.log(`${i+1}: ${line.trim()}`);
  }
});
