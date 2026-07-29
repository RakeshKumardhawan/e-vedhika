const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const navMenuStart = code.indexOf('{/* HORIZONTAL NAVIGATION MENU IN TRIGGER BAR */}');
const navMenuEnd = code.indexOf('<SystemLiveClock');

if (navMenuStart !== -1 && navMenuEnd !== -1) {
    // Find the end of the div that wraps the nav menu before SystemLiveClock
    // We can just find the matching block or the end of the conditional rendering.
    
    // Instead of regex, let's locate the ending brackets.
    // The previous code had:
    /*
            {/* HORIZONTAL NAVIGATION MENU IN TRIGGER BAR *\/}
            {(hasEnteredSite || user) && (
              <div ...>
                ...
              </div>
            )}
          </div>
          <div className="hidden min-[400px]:flex items-center gap-2 sm:gap-6 ml-2 sm:ml-4 shrink-0">
            <SystemLiveClock />
    */
    const endNav = code.lastIndexOf(')}', navMenuEnd);
    if (endNav !== -1) {
        const toRemove = code.substring(navMenuStart, endNav + 2);
        code = code.replace(toRemove, '');
        fs.writeFileSync('src/App.tsx', code);
        console.log("Nav menu removed!");
    } else {
        console.log("Could not find end of nav block");
    }
} else {
    console.log("Could not find start or end", navMenuStart, navMenuEnd);
}
