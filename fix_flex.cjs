const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The issue might be in how the messages area handles word breaks or how the text input prevents the container from shrinking.

// Fix 1: Ensure the message bubble container allows wrapping
content = content.replace(
  /className="leading-relaxed break-words whitespace-pre-wrap"/g,
  'className="leading-relaxed break-words whitespace-pre-wrap max-w-full"'
);

// Fix 2: Add flex-1 min-w-0 to the outer wrapper of the right pane content
content = content.replace(
  /<div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 w-full">/g,
  '<div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">'
);

// Fix 3: Ensure the overall modal container is strict
content = content.replace(
  /className="w-full max-w-6xl bg-white sm:rounded-\[24px\] rounded-2xl shadow-2xl overflow-hidden flex flex-row h-\[85vh\] max-h-\[900px\] max-w-\[100vw\]"/g,
  'className="w-full max-w-6xl w-[calc(100vw-32px)] bg-white sm:rounded-[24px] rounded-2xl shadow-2xl overflow-hidden flex flex-row h-[85vh] max-h-[900px]"'
);

fs.writeFileSync('src/App.tsx', content);
