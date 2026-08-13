const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the like button
code = code.replace(
  /className=\{`flex items-center gap-2 p-2 rounded-xl transition-all active:scale-95 \$\{\(Array\.isArray\(post\.likedBy\) \? post\.likedBy\.includes\(auth\.currentUser\?\.uid \|\| ""\) : false\) \? "bg-rose-50 text-rose-500" : "hover:bg-slate-50 text-slate-400"\}`\}/g,
  `className={\`flex items-center gap-2 p-2 rounded-xl transition-all \${(Array.isArray(post.likedBy) ? post.likedBy.includes(auth.currentUser?.uid || "") : false) ? "bg-rose-50 text-rose-500" : "hover:bg-slate-50 text-slate-400"}\`}`
);

code = code.replace(
  /            <button\n              onClick=\{async \(e\) => \{\n                e\.stopPropagation\(\);\n                if \(requireLoginAlert\(\)\) return;/g,
  `            <motion.button\n              whileTap={{ scale: 0.85 }}\n              onClick={async (e) => {\n                e.stopPropagation();\n                if (requireLoginAlert()) return;`
);

code = code.replace(
  /                \{post\.likes \|\| 0\}\n              <\/span>\n            <\/button>\n          <\/div>\n          <div className="flex items-center gap-2">/g,
  `                {post.likes || 0}\n              </span>\n            </motion.button>\n          </div>\n          <div className="flex items-center gap-2">`
);

// Replace the comment div
code = code.replace(
  /            <div\n              className="flex items-center gap-2 p-2 text-slate-400 cursor-pointer hover:bg-slate-50 rounded-xl transition-all"\n              onClick=\{\(e\) => \{\n                e\.stopPropagation\(\);\n                setShowComments\(!showComments\);\n              \}\}\n            >/g,
  `            <motion.div\n              whileTap={{ scale: 0.85 }}\n              className="flex items-center gap-2 p-2 text-slate-400 cursor-pointer hover:bg-slate-50 rounded-xl transition-all"\n              onClick={(e) => {\n                e.stopPropagation();\n                setShowComments(!showComments);\n              }}\n            >`
);

code = code.replace(
  /              <MessageSquare size=\{18\} \/>\n              <span className="text-sm font-black">\n                \{post\.commentCount \?\? post\.comments\?\.length \?\? 0\}\n              <\/span>\n            <\/div>\n          <\/div>\n          \{\/\* Views/g,
  `              <MessageSquare size={18} />\n              <span className="text-sm font-black">\n                {post.commentCount ?? post.comments?.length ?? 0}\n              </span>\n            </motion.div>\n          </div>\n          {/* Views`
);

fs.writeFileSync('src/App.tsx', code);
