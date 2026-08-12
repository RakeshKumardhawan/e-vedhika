const fs = require('fs');
const acorn = require('acorn');
const jsx = require('acorn-jsx');

const parser = acorn.Parser.extend(jsx());
const code = fs.readFileSync('src/App.tsx', 'utf-8');

try {
  parser.parse(code, { sourceType: 'module', ecmaVersion: 2020 });
  console.log("Syntax is OK");
} catch (e) {
  console.error("Syntax Error:", e);
}
