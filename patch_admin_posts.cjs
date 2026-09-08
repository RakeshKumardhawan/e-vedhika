const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const titleTarget = `<h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                    {item.title ||
                                      item.name ||
                                      item.type ||
                                      "Untitled Report"}
                                  </h4>`;

const titleNew = `<h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight flex items-center gap-2">
                                    {item.status === "draft" && <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">Draft</span>}
                                    {item.title ||
                                      item.name ||
                                      item.type ||
                                      "Untitled Report"}
                                  </h4>`;

if (code.includes(titleTarget)) {
  code = code.replace(titleTarget, titleNew);
  console.log("Admin Title Tag Updated");
} else {
  console.log("Admin Title Tag NOT Found");
}

fs.writeFileSync(file, code);
