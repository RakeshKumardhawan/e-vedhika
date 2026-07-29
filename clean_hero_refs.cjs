const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove from DEFAULT_HOME_ELEMENTS
const defHero = `  {
    id: 1,
    type: "Hero Section",
    title: "Welcome to E-Vedhika",
    content: "All Problems One Solution",
    color: "blue",
    hidden: false,
  },
`;
if (code.includes(defHero)) {
  code = code.replace(defHero, '');
  console.log("Removed from DEFAULT_HOME_ELEMENTS");
}

// Remove admin field for Hero Section
const adminHero = `        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <h4 className="font-black text-slate-800 mb-4 text-lg">Hero Section</h4>
          {renderInput("Hero Title", "heroTitle")}
          {renderInput("Hero Highlight (Blue Text)", "heroHighlight")}
          {renderRichText("Hero Subtitle", "heroSubtitle")}
        </div>

`;
if (code.includes(adminHero)) {
  code = code.replace(adminHero, '');
  console.log("Removed from Admin config");
}

// Remove from the list of page elements
const pageElemHero1 = `                                  "Hero Section",\n`;
if (code.includes(pageElemHero1)) {
  code = code.split(pageElemHero1).join('');
  console.log("Removed from element types list");
}

fs.writeFileSync('src/App.tsx', code);
