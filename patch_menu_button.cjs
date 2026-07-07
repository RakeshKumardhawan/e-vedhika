const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '      onClick={onClick}\n      style={{ width: "100%", border: "none" }}',
  \`      onClick={() => {
        startTransition(() => {
          onClick();
        });
      }}
      style={{ width: "100%", border: "none" }}\`
);

fs.writeFileSync('src/App.tsx', content);
