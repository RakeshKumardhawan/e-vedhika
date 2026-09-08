const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

// Update toolbar buttons
code = code.replace(
  '<button type="button" className="p-1.5 text-[#50575e] hover:text-[#2271b1] hover:bg-white hover:border-[#8c8f94] border border-transparent rounded-[3px] transition-colors"><Bold size={14} strokeWidth={2.5} /></button>',
  '<button type="button" onClick={() => insertFormatting("**", "**")} className="p-1.5 text-[#50575e] hover:text-[#2271b1] hover:bg-white hover:border-[#8c8f94] border border-transparent rounded-[3px] transition-colors"><Bold size={14} strokeWidth={2.5} /></button>'
);
code = code.replace(
  '<button type="button" className="p-1.5 text-[#50575e] hover:text-[#2271b1] hover:bg-white hover:border-[#8c8f94] border border-transparent rounded-[3px] transition-colors"><Italic size={14} strokeWidth={2.5} /></button>',
  '<button type="button" onClick={() => insertFormatting("*", "*")} className="p-1.5 text-[#50575e] hover:text-[#2271b1] hover:bg-white hover:border-[#8c8f94] border border-transparent rounded-[3px] transition-colors"><Italic size={14} strokeWidth={2.5} /></button>'
);
code = code.replace(
  '<button type="button" className="p-1.5 text-[#50575e] hover:text-[#2271b1] hover:bg-white hover:border-[#8c8f94] border border-transparent rounded-[3px] transition-colors"><Link2 size={14} strokeWidth={2.5} /></button>',
  '<button type="button" onClick={() => insertFormatting("[", "](url)")} className="p-1.5 text-[#50575e] hover:text-[#2271b1] hover:bg-white hover:border-[#8c8f94] border border-transparent rounded-[3px] transition-colors"><Link2 size={14} strokeWidth={2.5} /></button>'
);
code = code.replace(
  '<button type="button" className="p-1.5 text-[#50575e] hover:text-[#2271b1] hover:bg-white hover:border-[#8c8f94] border border-transparent rounded-[3px] transition-colors"><Quote size={14} strokeWidth={2.5} /></button>',
  '<button type="button" onClick={() => insertFormatting("> ", "")} className="p-1.5 text-[#50575e] hover:text-[#2271b1] hover:bg-white hover:border-[#8c8f94] border border-transparent rounded-[3px] transition-colors"><Quote size={14} strokeWidth={2.5} /></button>'
);
code = code.replace(
  '<button type="button" className="p-1.5 text-[#50575e] hover:text-[#2271b1] hover:bg-white hover:border-[#8c8f94] border border-transparent rounded-[3px] transition-colors"><List size={14} strokeWidth={2.5} /></button>',
  '<button type="button" onClick={() => insertFormatting("- ", "")} className="p-1.5 text-[#50575e] hover:text-[#2271b1] hover:bg-white hover:border-[#8c8f94] border border-transparent rounded-[3px] transition-colors"><List size={14} strokeWidth={2.5} /></button>'
);

// Update textarea to have id
const textareaTarget = '<textarea\n                    required\n                    rows={16}\n                    value={content}';
const textareaNew = '<textarea\n                    id="post-content-textarea"\n                    required\n                    rows={16}\n                    value={content}';
if (code.includes(textareaTarget)) {
  code = code.replace(textareaTarget, textareaNew);
} else {
  console.log('Textarea not found');
}

fs.writeFileSync(file, code);
