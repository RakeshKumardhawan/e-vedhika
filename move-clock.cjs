const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const latestBarTarget = `<div className="latest-bar overflow-hidden">
          <div className="latest-label whitespace-nowrap shrink-0 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
            Latest Updates
          </div>
          <div className="latest-text flex-1">`;

const latestBarNew = `<div className="latest-bar overflow-hidden flex items-center justify-between gap-4">
          <div className="flex items-center flex-1 min-w-0">
            <div className="latest-label whitespace-nowrap shrink-0 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
              Latest Updates
            </div>
            <div className="latest-text flex-1">`;

const navClockRegex = /<div className="hidden min-\[400px\]:flex items-center gap-2 sm:gap-6 ml-2 sm:ml-4 shrink-0">\s*<SystemLiveClock \/>\s*<\/div>/;

if (code.includes(latestBarTarget) && navClockRegex.test(code)) {
    code = code.replace(latestBarTarget, latestBarNew);
    
    const closingRegex = /(\s*<\/span>\s*<\/div>\s*)(<\/div>\s*\)\}\s*<nav)/;
    code = code.replace(closingRegex, `$1</div>\n          <div className="hidden min-[400px]:flex items-center shrink-0 pr-2 sm:pr-4">\n            <SystemLiveClock />\n          </div>$2`);
    
    code = code.replace(navClockRegex, '');
    
    fs.writeFileSync('src/App.tsx', code);
    console.log("Clock moved successfully.");
} else {
    console.log("Could not find targets");
}
