const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

console.log("Found modal container:", content.includes('className="w-full max-w-6xl w-[calc(100vw-32px)] bg-white sm:rounded-[24px] rounded-2xl shadow-2xl overflow-hidden flex flex-row h-[85vh] max-h-[900px]"'));
console.log("Found right pane:", content.includes('className={`flex-1 min-w-0 w-full sm:w-auto bg-[#efeae2] flex flex-col h-full overflow-hidden relative max-w-full ${!activeDmUser ? \'hidden sm:flex\' : \'flex\'}`}'));
console.log("Found quick replies:", content.includes('className="px-4 py-2 bg-[#f0f2f5] flex gap-1.5 overflow-x-auto scrollbar-none shrink-0 border-t border-slate-200 w-full min-w-0 max-w-full"'));
console.log("Found form wrapper:", content.includes('className="p-3 bg-[#f0f2f5] flex gap-2 items-end shrink-0 w-full min-w-0 max-w-full"'));
console.log("Found textarea:", content.includes('className="flex-1 min-w-0 w-full bg-white border-none px-4 py-3 rounded-2xl'));
