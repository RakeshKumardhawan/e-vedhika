const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  `          </select>
        </div>
      </div>
      <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200">
        <label className="block text-sm font-black text-primary mb-3">`,
  `          </select>
        </div>
        </div>
      </div>
      <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200">
        <label className="block text-sm font-black text-primary mb-3">`
);

fs.writeFileSync('src/App.tsx', content);
