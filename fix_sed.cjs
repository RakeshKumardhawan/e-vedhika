const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix 22140
code = code.replace(
  /<motion\.div\n\s*initial=\{\{ opacity: 0, y: 20 \}\}layoutId="navIndicator"/g,
  `<motion.div layoutId="navIndicator"`
);

// Fix 19129
code = code.replace(
  /<motion\.div\n\s*initial=\{\{ opacity: 0, y: 20 \}\}\n\s*layout /g,
  `<motion.div\n      layout `
);

fs.writeFileSync('src/App.tsx', code);
