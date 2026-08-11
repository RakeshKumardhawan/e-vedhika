const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const searchStr = `<div 
                              className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium ql-editor px-0 sm:px-4 max-w-5xl"
                              dangerouslySetInnerHTML={{__html: landingPageData.heroSubtitle}}
                            />`;
const replaceStr = `<div 
                              className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium ql-editor px-0 sm:px-4 w-full max-w-full sm:max-w-5xl break-words overflow-x-hidden"
                              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                              dangerouslySetInnerHTML={{__html: landingPageData.heroSubtitle}}
                            />`;

if (content.includes(searchStr)) {
  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Patched successfully");
} else {
  console.log("String not found");
}
