const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '        </section>\n      {/* Footer */}',
  '        </section>\n      </main>\n      {/* Footer */}'
);

fs.writeFileSync('src/App.tsx', code);
