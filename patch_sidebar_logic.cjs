const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const saveDraftTarget = `<button type="button" onClick={(e) => { e.preventDefault(); setDraftStatus("draft"); setTimeout(() => document.getElementById("post-form-submit")?.click(), 0); }} className="border border-[#8c8f94] bg-[#f6f7f7] px-3 py-1 rounded-[3px] hover:bg-[#f0f0f1] transition-colors">Save Draft</button>`;

const saveDraftNew = `<button type="button" onClick={(e) => { 
                      e.preventDefault(); 
                      setDraftStatus("draft"); 
                      setTimeout(() => document.getElementById("post-form-submit")?.click(), 0); 
                    }} className="border border-[#8c8f94] bg-[#f6f7f7] px-3 py-1 rounded-[3px] hover:bg-[#f0f0f1] transition-colors text-[13px] text-[#2271b1]">Save Draft</button>`;

if (code.includes(saveDraftTarget)) {
  code = code.replace(saveDraftTarget, saveDraftNew);
  console.log("Save draft button updated");
}

fs.writeFileSync(file, code);
