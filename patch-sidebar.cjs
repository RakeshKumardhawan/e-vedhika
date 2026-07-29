const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const navBlockRegex = /<h3 className="text-\[10px\] font-black text-slate-400 uppercase tracking-widest ml-4 mb-4">\s*Navigations\s*<\/h3>.*?<\/motion\.a>/s;

if (navBlockRegex.test(code)) {
    code = code.replace(navBlockRegex, '{/* Main navigation has been moved to the horizontal top bar */}');
    fs.writeFileSync('src/App.tsx', code);
    console.log("Replaced Navigations section.");
} else {
    console.log("Could not find Navigations section!");
}
