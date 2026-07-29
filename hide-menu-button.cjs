const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="trigger-left pr-2 sm:pr-4 border-r border-slate-200\/60 mr-2 sm:mr-4 shrink-0">\s*<button\s*aria-label="Toggle Menu"\s*className="menu-toggle shrink-0"\s*onClick=\{\(\) => setSidebarOpen\(!sidebarOpen\)\}\s*>\s*<span><\/span>\s*<span><\/span>\s*<span><\/span>\s*<\/button>\s*<\/div>/;

if (regex.test(code)) {
    code = code.replace(regex, '');
    fs.writeFileSync('src/App.tsx', code);
    console.log("Menu button removed successfully");
} else {
    console.log("Button not found");
}
