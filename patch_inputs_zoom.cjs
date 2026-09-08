const fs = require('fs');
const file = 'src/components/ComplaintFormModal.tsx';
let code = fs.readFileSync(file, 'utf8');

// replace text-[13px] on inputs/selects/textareas with text-[16px] sm:text-[13px]
code = code.replace(/text-\[13px\] rounded-\[2px\] focus:outline-none focus:border-\[#005bb5\] bg-white/g, 
  "text-[16px] sm:text-[13px] rounded-[2px] focus:outline-none focus:border-[#005bb5] bg-white");
  
fs.writeFileSync(file, code);
console.log("Inputs patched for iOS zoom");
