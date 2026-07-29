const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<nav\s*className=\{\`nav-trigger-bar sticky z-\[1000\] \$\{sidebarOpen \? "sidebar-active" : ""\}\`\}\s*>\s*\{\/\* Row 1: Search bar \+ Menu Toggle \+ Clock \*\/\}\s*<div className="h-full w-full flex items-center justify-between gap-3 max-w-7xl mx-auto">\s*<div className="flex-1 flex items-center h-full w-full min-w-0 px-0 sm:px-0">\s*\{\/\* HORIZONTAL NAVIGATION MENU IN TRIGGER BAR \*\/\}\s*<div className="flex-1 min-w-0 overflow-x-auto scrollbar-none flex items-center h-full relative">\s*<div className="flex items-center gap-2 sm:gap-3 min-w-max pr-4">/

const newNav = `<nav className="nav-trigger-bar sticky z-[1000] px-2 sm:px-4">
        <div className="h-full w-full max-w-7xl mx-auto flex items-center">
            <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none flex items-center h-full">
                <div className="flex items-center gap-2 sm:gap-3 min-w-max">`;

if (regex.test(code)) {
    code = code.replace(regex, newNav);
    
    // remove the extra </div>
    const closingRegex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/nav>/;
    code = code.replace(closingRegex, '</div>\n            </div>\n        </div>\n      </nav>');
    
    fs.writeFileSync('src/App.tsx', code);
    console.log("Nav simplified successfully");
} else {
    console.log("Nav not found");
}
