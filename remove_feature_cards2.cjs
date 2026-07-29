const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startIdx = code.indexOf('{el.type === "Feature Cards" && (');
if (startIdx !== -1) {
  const endMarker = '                                )}';
  const endIdx = code.indexOf(endMarker, startIdx);
  if (endIdx !== -1) {
    code = code.substring(0, startIdx) + code.substring(endIdx + endMarker.length);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Feature Cards removed successfully.");
  } else {
    console.log("Could not find end of Feature Cards block");
  }
} else {
  console.log("Could not find start of Feature Cards block");
}
