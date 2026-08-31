const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export default function App() {')) {
    console.log(`App component starts at line: ${i + 1}`);
  }
  if (lines[i].includes('<main')) {
    console.log(`<main found at line: ${i + 1}`);
  }
}
