const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <h4 className="font-black text-slate-800 mb-4 text-lg">Card 1</h4>
          {renderInput("Card 1 Title", "card1Title")}
          {renderRichText("Card 1 Description", "card1Desc")}
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <h4 className="font-black text-slate-800 mb-4 text-lg">Card 2</h4>
          {renderInput("Card 2 Title", "card2Title")}
          {renderRichText("Card 2 Description", "card2Desc")}
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <h4 className="font-black text-slate-800 mb-4 text-lg">Card 3</h4>
          {renderInput("Card 3 Title", "card3Title")}
          {renderRichText("Card 3 Description", "card3Desc")}
        </div>`;

if (code.includes(target)) {
  code = code.replace(target, '');
  fs.writeFileSync('src/App.tsx', code);
  console.log("Removed admin fields");
} else {
  console.log("Admin fields not found exactly, will try regex or index");
}
