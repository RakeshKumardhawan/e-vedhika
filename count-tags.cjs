const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf-8');

const getTags = (text) => {
  let open = (text.match(/<div[^>]*>/g) || []).length;
  let close = (text.match(/<\/div>/g) || []).length;
  return { open, close };
};

const lines = content.split('\n');
console.log('Total:', getTags(content));

// We can find the first unmatched div using a simple stack
let stack = [];
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  let opens = line.match(/<([a-zA-Z0-9]+)(?![^>]*\/>)[^>]*>/g) || [];
  let closes = line.match(/<\/([a-zA-Z0-9]+)>/g) || [];
  let selfClosing = line.match(/<([a-zA-Z0-9]+)[^>]*\/>/g) || [];
  
  // This regex is very crude. We should just parse it.
}
