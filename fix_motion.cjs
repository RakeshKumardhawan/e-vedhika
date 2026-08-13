const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /              <MessageSquare size=\{18\} \/>\n              <span className="text-sm font-black">\n                \{post\.commentCount \?\? post\.comments\?\.length \?\? 0\}\n              <\/span>\n            <\/div>/g,
  `              <MessageSquare size={18} />\n              <span className="text-sm font-black">\n                {post.commentCount ?? post.comments?.length ?? 0}\n              </span>\n            </motion.div>`
);

fs.writeFileSync('src/App.tsx', code);
