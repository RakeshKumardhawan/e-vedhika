const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Add state
content = content.replace(
  '  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "popular">("newest");',
  '  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "popular">("newest");\n  const [showAdminOnly, setShowAdminOnly] = useState(false);'
);

// Add filtering logic
content = content.replace(
  '    const combinedComments = Array.from(combinedMap.values());\n    combinedComments.sort((a: any, b: any) => {',
  '    let combinedComments = Array.from(combinedMap.values());\n    \n    if (showAdminOnly) {\n      combinedComments = combinedComments.filter((c: any) => {\n        const u = allUsers.find(user => user.id === c.uid);\n        return c.isAdminComment || c.uid === "KGT2roF9bPTNhWIceHgWsJEnEnH3" || u?.role === "admin" || u?.role === "super admin" || u?.role === "moderator";\n      });\n    }\n\n    combinedComments.sort((a: any, b: any) => {'
);

// Add dependencies to useEffect
content = content.replace(
  '  }, [dbComments, optimisticComments, post.id, post.comments, sortOrder]);',
  '  }, [dbComments, optimisticComments, post.id, post.comments, sortOrder, showAdminOnly, allUsers]);'
);

// Add Filter Button UI
content = content.replace(
  '      <div className="flex justify-between items-center mb-6">\n        <h3 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">\n          <MessageCircle size={24} className="text-emerald-500" />\n          చర్చ (Comments) <span className="text-slate-400 text-sm ml-1 font-bold">({post.commentCount || 0})</span>\n        </h3>\n        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">',
  '      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">\n        <h3 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">\n          <MessageCircle size={24} className="text-emerald-500" />\n          చర్చ (Comments) <span className="text-slate-400 text-sm ml-1 font-bold">({post.commentCount || 0})</span>\n        </h3>\n        <div className="flex items-center gap-2 flex-wrap">\n          <button \n            onClick={() => setShowAdminOnly(!showAdminOnly)}\n            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm border ${showAdminOnly ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-200"}`}\n          >\n            <Filter size={14} />\n            అడ్మిన్ రిప్లైస్ (Admin Only)\n          </button>\n          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">'
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched PostComments filter logic");
