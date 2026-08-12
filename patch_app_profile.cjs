const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace confirms
code = code.replace(
  /if \(!window\.confirm\("Are you sure you want to delete this reply\?"\)\) return;/g,
  `const res = await Swal.fire({
      title: "Delete Reply?",
      text: "Are you sure you want to delete this reply?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it"
    });
    if (!res.isConfirmed) return;`
);

code = code.replace(
  /if \(!window\.confirm\("Are you sure you want to delete this comment\?"\)\) return;/g,
  `const res = await Swal.fire({
      title: "Delete Comment?",
      text: "Are you sure you want to delete this comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it"
    });
    if (!res.isConfirmed) return;`
);

code = code.replace(
  /if \(\s*!window\.confirm\(\s*"ఈ లాగ్ మరియు రిపోర్ట్ శాశ్వతంగా తొలగించబడుతుంది\. మీరు నిశ్చయించుకున్నారా\?"\,\s*\)\s*\)\s*return;/g,
  `const res = await Swal.fire({
      title: "Delete?",
      text: "ఈ లాగ్ మరియు రిపోర్ట్ శాశ్వతంగా తొలగించబడుతుంది. మీరు నిశ్చయించుకున్నారా?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it"
    });
    if (!res.isConfirmed) return;`
);


// Let's replace MyActivity
const myActivityStart = code.indexOf('function MyActivity({ user, userProfile, problems, suggestions, posts, setShowProfileModal }: any) {');
const myActivityEnd = code.indexOf('export const DEFAULT_HOME_ELEMENTS', myActivityStart);

if (myActivityStart !== -1 && myActivityEnd !== -1) {
  const originalMyActivity = code.substring(myActivityStart, myActivityEnd);

  const newMyActivity = `function MyActivity({ user, userProfile, problems, suggestions, posts, setShowProfileModal }: any) {
  const [activeTab, setActiveTab] = useState<"posts" | "problems" | "suggestions">("posts");

  const myPosts = posts?.filter(
    (p: any) => p.uid === user?.uid || p.authorId === user?.uid || p.author === userProfile?.username
  ) || [];

  const myProblems = problems?.filter(
    (p: any) => p.userId === user?.uid || p.authorId === user?.uid
  ) || [];

  const mySuggestions = suggestions?.filter(
    (s: any) => s.authorId === user?.uid || s.userId === user?.uid || s.uid === user?.uid
  ) || [];

  const pendingProblems = myProblems.filter((p: any) => p.status !== "resolved").length;
  const resolvedProblems = myProblems.filter((p: any) => p.status === "resolved").length;

  const handleDeleteItem = async (col: string, id: string) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!"
    });
    if (res.isConfirmed) {
      try {
        await deleteDoc(doc(db, col, id));
        Swal.fire("Deleted!", "Your item has been deleted.", "success");
      } catch (err: any) {
        Swal.fire("Error", "Could not delete item.", "error");
      }
    }
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-sm border border-slate-200 min-h-[60vh]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-2xl font-black text-primary flex items-center gap-2 mb-2">
            <User size={28} className="text-primary" /> My Profile
          </h2>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">
            Track your posts, problems, and suggestions
          </p>
        </div>
        <button
          onClick={() => setShowProfileModal(true)}
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-6 py-2.5 rounded-xl font-bold transition-colors text-sm flex items-center gap-2 shadow-sm"
        >
          <User size={16} /> Edit Profile
        </button>
      </div>

      {/* Summary Stats Component */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-center items-center">
          <span className="text-3xl font-black text-primary">{myPosts.length}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Total Posts</span>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex flex-col justify-center items-center">
          <span className="text-3xl font-black text-amber-600">{pendingProblems}</span>
          <span className="text-[10px] font-bold text-amber-600/70 uppercase tracking-widest mt-1">Pending Problems</span>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex flex-col justify-center items-center">
          <span className="text-3xl font-black text-green-600">{resolvedProblems}</span>
          <span className="text-[10px] font-bold text-green-600/70 uppercase tracking-widest mt-1">Resolved Problems</span>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-slate-100 pb-2 overflow-x-auto custom-scrollbar">
        <button
          aria-label="My Posts"
          onClick={() => setActiveTab("posts")}
          className={\`py-2 px-4 font-black text-sm uppercase tracking-widest transition-all whitespace-nowrap \${activeTab === "posts" ? "text-primary border-b-2 border-primary" : "text-slate-400 hover:text-slate-600"}\`}
        >
          My Posts ({myPosts.length})
        </button>
        <button
          aria-label="My Problems"
          onClick={() => setActiveTab("problems")}
          className={\`py-2 px-4 font-black text-sm uppercase tracking-widest transition-all whitespace-nowrap \${activeTab === "problems" ? "text-primary border-b-2 border-primary" : "text-slate-400 hover:text-slate-600"}\`}
        >
          My Problems ({myProblems.length})
        </button>
        <button
          aria-label="My Suggestions"
          onClick={() => setActiveTab("suggestions")}
          className={\`py-2 px-4 font-black text-sm uppercase tracking-widest transition-all whitespace-nowrap \${activeTab === "suggestions" ? "text-primary border-b-2 border-primary" : "text-slate-400 hover:text-slate-600"}\`}
        >
          My Suggestions ({mySuggestions.length})
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === "posts" &&
          (myPosts.length > 0 ? (
            myPosts.map((p: any) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest">
                      {p.category || "General"}
                    </span>
                    <span className={\`px-3 text-[10px] font-black uppercase tracking-widest py-1 rounded-full \${p.status === "Published" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}\`}>
                      {p.status || "Published"}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mt-2">
                    {p.title || "Untitled Post"}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-2">
                    Posted on: {new Date(p.createdAt || p.time || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteItem("posts", p.id)}
                  className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors shrink-0"
                  aria-label="Delete Post"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="py-10 text-center font-bold text-slate-400">
              No posts published yet.
            </div>
          ))}

        {activeTab === "problems" &&
          (myProblems.length > 0 ? (
            myProblems.map((p: any) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest">
                      {p.category || "Problem"}
                    </span>
                    <span
                      className={\`px-3 text-[10px] font-black uppercase tracking-widest py-1 rounded-full \${p.status === "resolved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}\`}
                    >
                      {p.status || "Pending"}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mt-2">
                    {p.title || p.desc?.substring(0, 50)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {p.desc}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-2">
                    Submitted on:{" "}
                    {new Date(p.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteItem("problems", p.id)}
                  className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors shrink-0"
                  aria-label="Delete Problem"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="py-10 text-center font-bold text-slate-400">
              No problems reported yet.
            </div>
          ))}

        {activeTab === "suggestions" &&
          (mySuggestions.length > 0 ? (
            mySuggestions.map((s: any) => (
              <div
                key={s.id}
                className="p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={\`px-3 text-[10px] font-black uppercase tracking-widest py-1 rounded-full \${s.status === "approved" || s.status === "resolved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}\`}
                    >
                      {s.status === "approved" || s.status === "resolved"
                        ? "Published"
                        : s.status || "Under Review"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 mt-2">
                    {s.text || s.msg || s.suggestion}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-2">
                    Submitted on:{" "}
                    {new Date(
                      s.time || s.createdAt || Date.now(),
                    ).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteItem("suggestions", s.id)}
                  className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors shrink-0"
                  aria-label="Delete Suggestion"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="py-10 text-center font-bold text-slate-400">
              No suggestions submitted yet.
            </div>
          ))}
      </div>
    </div>
  );
}
`

  code = code.replace(originalMyActivity, newMyActivity);
  fs.writeFileSync('src/App.tsx', code);
  console.log("MyActivity replaced successfully!");
} else {
  console.log("Could not find MyActivity boundaries.");
}
