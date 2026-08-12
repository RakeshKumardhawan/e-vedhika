const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const search = `  return (
    <motion.div layout className="post-card">
      <div className="flex items-center gap-3 mb-3 sm:mb-4">`;

const replace = `  return (
    <motion.div 
      layout 
      className={\`post-card \${commentPulse ? 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20' : ''}\`}
      whileHover={{ scale: 1.005, y: -2 }}
      animate={commentPulse ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-3 sm:mb-4">`;

if (content.includes(search)) {
  content = content.replace(search, replace);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Patched PostCard motion div");
} else {
  console.log("Could not find PostCard return statement");
}
