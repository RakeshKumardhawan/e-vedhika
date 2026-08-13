const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /    <motion\.div\n      layout \n      className={`post-card/g,
  `    <motion.div\n      initial={{ opacity: 0, y: 30 }}\n      whileInView={{ opacity: 1, y: 0 }}\n      viewport={{ once: true, margin: "-50px" }}\n      layout \n      className={\`post-card`
);

fs.writeFileSync('src/App.tsx', code);
