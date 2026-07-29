const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = '{el.type === "Hero Section" && (';
const startIdx = code.indexOf(targetStr);
if (startIdx !== -1) {
  // Find the end of the Hero Section block
  // The block ends with )} right before {el.type === "Post Grid" && (
  const endTarget = '{el.type === "Post Grid" && (';
  const endIdx = code.indexOf(endTarget);
  if (endIdx !== -1) {
    // We need to cut out from startIdx to just before endTarget
    let toRemove = code.substring(startIdx, endIdx);
    
    // Actually, the block ends with )} 
    // Let's just find the last )} before endTarget
    const lastBraceIdx = toRemove.lastIndexOf(')}');
    if (lastBraceIdx !== -1) {
      toRemove = toRemove.substring(0, lastBraceIdx + 2); // include )} 
      code = code.replace(toRemove, '');
      fs.writeFileSync('src/App.tsx', code);
      console.log("Hero Section removed from render loop");
    }
  }
} else {
  console.log("Hero Section not found in render loop");
}

