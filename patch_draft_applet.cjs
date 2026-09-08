const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetStr = `            {(showPostForm || editingPost) && (
              <div className="fixed inset-0 z-[3000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl custom-scrollbar">
                  <PostForm`;

const newStr = `            {(showPostForm || editingPost) && (
              <div className="fixed inset-0 z-[3000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4">
                <div className="w-full h-full sm:h-auto sm:max-h-[95vh] sm:rounded-[3px] bg-[#f0f0f1] sm:max-w-[1200px] overflow-hidden flex flex-col shadow-2xl z-[3000]">
                  <div className="bg-[#1d2327] text-white p-3 flex justify-between items-center shrink-0">
                    <h2 className="text-[13px] font-semibold">{editingPost ? "Edit Post" : "Add New Post"}</h2>
                    <button type="button" onClick={() => { setShowPostForm(false); setEditingPost(null); }} className="text-slate-300 hover:text-white transition-colors"><X size={18} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-0 sm:p-4 bg-[#f0f0f1]">
                  <PostForm`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
  console.log("PostForm layout updated");
} else {
  console.log("PostForm target not found");
}

// Ensure proper closing div
const targetEnd = `                  />
                </div>
              </div>
            )}`;

const newEnd = `                  />
                </div>
                </div>
              </div>
            )}`;

if (code.includes(targetEnd)) {
  code = code.replace(targetEnd, newEnd);
  console.log("PostForm end tags updated");
}

fs.writeFileSync(file, code);
