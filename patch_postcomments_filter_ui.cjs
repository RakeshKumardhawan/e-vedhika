const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const search = `      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-2xl font-black text-primary flex items-center gap-3">
          <MessageCircle
            size={24}
            className="text-accent"
            style={{ color: "#fbbf24" }}
          />
          Community Comments{" "}
          <span className="bg-slate-100 text-slate-500 text-sm py-1 px-3 rounded-full">
            {commentsLoaded ? comments.reduce((acc: number, c: any) => acc + 1 + (c.replies?.length || 0), 0) : (post.commentCount ?? post.comments?.length ?? 0)}
          </span>
        </h3>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">`;

const replace = `      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-2xl font-black text-primary flex items-center gap-3">
          <MessageCircle
            size={24}
            className="text-accent"
            style={{ color: "#fbbf24" }}
          />
          Community Comments{" "}
          <span className="bg-slate-100 text-slate-500 text-sm py-1 px-3 rounded-full">
            {commentsLoaded ? comments.reduce((acc: number, c: any) => acc + 1 + (c.replies?.length || 0), 0) : (post.commentCount ?? post.comments?.length ?? 0)}
          </span>
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => setShowAdminOnly(!showAdminOnly)}
            className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm border \${showAdminOnly ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-200'}\`}
          >
            <Filter size={14} />
            అడ్మిన్ రిప్లైస్
          </button>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">`;

if (content.includes(search)) {
  content = content.replace(search, replace);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Patched PostComments UI successfully.");
} else {
  console.log("Could not find the target string for PostComments UI.");
}
