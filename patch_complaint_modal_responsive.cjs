const fs = require('fs');
const file = 'src/components/ComplaintFormModal.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `<div className="bg-[#f4f5f7] w-full max-w-5xl shadow-2xl relative font-sans animate-in fade-in zoom-in-95 duration-200">`;
const replacement = `<div className="bg-[#f4f5f7] w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl relative font-sans animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("ComplaintFormModal made scrollable");
}

fs.writeFileSync(file, code);
