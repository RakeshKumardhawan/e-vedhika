const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// For comments
code = code.replace(
  /onKeyDown=\{\(e\) => e\.key === "Enter" && !submittingComment && handleAddComment\(\)\}/g,
  `onKeyDown={(e) => (e.ctrlKey || e.metaKey) && e.key === "Enter" && !submittingComment && handleAddComment()}`
);

// For replies
code = code.replace(
  /onKeyDown=\{\(e\) => e\.key === "Enter" && handleAddReply\(c\.id\)\}/g,
  `onKeyDown={(e) => (e.ctrlKey || e.metaKey) && e.key === "Enter" && handleAddReply(c.id)}`
);

// For edit replies
code = code.replace(
  /onKeyDown=\{\(e\) => e\.key === "Enter" && handleEditReplySubmit\(c\.id\)\}/g,
  `onKeyDown={(e) => (e.ctrlKey || e.metaKey) && e.key === "Enter" && handleEditReplySubmit(c.id)}`
);

fs.writeFileSync('src/App.tsx', code);
