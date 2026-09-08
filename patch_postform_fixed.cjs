const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetStr = `  if (submissionType === "post") {
    return (
      <form
        onSubmit={onSubmit}
        className="fixed inset-0 z-[5000] bg-[#f1f1f1] w-full h-full text-[#3c434a] font-sans overflow-y-auto custom-scrollbar"
      >`;

const newStr = `  if (submissionType === "post") {
    return (
      <form
        onSubmit={onSubmit}
        className="bg-[#f1f1f1] w-full text-[#3c434a] font-sans"
      >`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
  console.log("PostForm fixed inset removed");
} else {
  console.log("PostForm target not found");
}

fs.writeFileSync(file, code);
