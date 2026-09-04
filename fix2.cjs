const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix duplicates of setShowDirectMessages in AdminPanel props
code = code.replace(/setShowDirectMessages = \(\) => \{\},\n  setShowDirectMessages = \(\) => \{\},/g, 'setShowDirectMessages = () => {},');
code = code.replace(/setActiveDmUser = \(\) => \{\},\n  setActiveDmUser = \(\) => \{\},/g, 'setActiveDmUser = () => {},');
code = code.replace(/setShowDirectMessages = \(\) => \{\},\n  setActiveDmUser = \(\) => \{\},\n  setShowDirectMessages = \(\) => \{\},\n  setActiveDmUser = \(\) => \{\},/g, 'setShowDirectMessages = () => {},\n  setActiveDmUser = () => {},');

// Fix TS17001 in AdminPanel usage
code = code.replace(/setShowDirectMessages=\{setShowDirectMessages\}\n\s*setActiveDmUser=\{setActiveDmUser\}\n\s*setShowDirectMessages=\{setShowDirectMessages\}\n\s*setActiveDmUser=\{setActiveDmUser\}/g, 'setShowDirectMessages={setShowDirectMessages}\n                setActiveDmUser={setActiveDmUser}');

// Fix TS17001 in PostComments usage
code = code.replace(/setShowDirectMessages=\{setShowDirectMessages\}\n\s*setActiveDmUser=\{setActiveDmUser\}\n\s*setShowDirectMessages=\{setShowDirectMessages\}\n\s*setActiveDmUser=\{setActiveDmUser\}/g, 'setShowDirectMessages={setShowDirectMessages}\n            setActiveDmUser={setActiveDmUser}');

// Also there were duplicates created by sed inside UserListModal calls
code = code.replace(/allUsers=\{allUsers\}\n\s*setShowDirectMessages=\{setShowDirectMessages\}\n\s*setActiveDmUser=\{setActiveDmUser\}/g, 'allUsers={allUsers}');

// But we do want setShowDirectMessages={setShowDirectMessages} inside PostCard / PostComments 
// So let's write a regex that matches PostComments and makes sure there's only one.
fs.writeFileSync('src/App.tsx', code);
