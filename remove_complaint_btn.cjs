const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* Complaint \/ Report Button \*\/\}\s*<button\s*onClick=\{\(\) => setShowComplaintFormModal\(true\)\}\s*className="bg-rose-600[\s\S]*?<\/button>/m;

if(code.match(regex)) {
    code = code.replace(regex, "");
    fs.writeFileSync(file, code);
    console.log("Complaint button removed");
} else {
    console.log("Could not find regex match!");
}
