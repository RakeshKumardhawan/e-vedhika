const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const modalStart = code.indexOf('{/* Priority Services Modal */}');
if (modalStart !== -1) {
    code = code.substring(0, modalStart);
    code += '    </div>\n  );\n}\n'; // Close SuggestAppDialog
    fs.writeFileSync('src/App.tsx', code);
    console.log("Removed Modal from bottom");
}
