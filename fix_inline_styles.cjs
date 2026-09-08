const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetInline = `<h2 
            className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight"
            style={{
              fontSize: "20px",
              lineHeight: "34px"
            }}
          >`;

const newInline = `<h2 
            className="text-[20px] md:text-3xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug md:leading-tight"
          >`;

if (code.includes(targetInline)) {
  code = code.replace(targetInline, newInline);
  console.log("Fixed hero title inline styles");
} else {
  console.log("hero title inline styles not found");
}

fs.writeFileSync(file, code);
