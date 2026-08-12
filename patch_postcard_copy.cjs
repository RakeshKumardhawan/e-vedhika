const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const search = `          <button
            aria-label="Read Post"
            onClick={(e) => {
              e.stopPropagation();
              setSearchParams({ postId: post.id });
            }}
            className="flex items-center gap-2 p-2 px-4 rounded-xl text-primary font-black text-xs uppercase bg-slate-50 hover:bg-primary hover:text-white transition-all"
          >
            <Eye size={16} strokeWidth={2.5} />
            <span>Read post</span>
          </button>
        </div>
      </div>`;

const replace = `          <button
            aria-label="Read Post"
            onClick={(e) => {
              e.stopPropagation();
              setSearchParams({ postId: post.id });
            }}
            className="flex items-center gap-2 p-2 px-4 rounded-xl text-primary font-black text-xs uppercase bg-slate-50 hover:bg-primary hover:text-white transition-all"
          >
            <Eye size={16} strokeWidth={2.5} />
            <span>Read post</span>
          </button>
          
          <button
            aria-label="Copy Post Link"
            onClick={(e) => {
              e.stopPropagation();
              const url = \`\${window.location.origin}\${window.location.pathname}?postId=\${post.id}\`;
              navigator.clipboard.writeText(url);
              addToast("పోస్ట్ లింక్ కాపీ చేయబడింది! (URL Copied!)");
            }}
            className="flex items-center gap-2 p-2 px-4 rounded-xl text-slate-500 font-black text-xs uppercase bg-slate-50 hover:bg-slate-200 hover:text-slate-800 transition-all cursor-pointer"
          >
            <Link2 size={16} strokeWidth={2.5} />
            <span>Copy Link</span>
          </button>
        </div>
      </div>`;

if (content.includes(search)) {
  content = content.replace(search, replace);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Patched PostCard copy link button");
} else {
  console.log("Could not find PostCard buttons");
}
