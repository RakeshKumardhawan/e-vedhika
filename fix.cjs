const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            {postIdFromUrl ? (
              <PostDetail
                postId={postIdFromUrl}
                onBack={() => {
                  setSearchParams(prev => {
    const next = new URLSearchParams(prev);
    next.delete("postId");
    return next;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
            setShowDirectMessages={setShowDirectMessages}
            setActiveDmUser={setActiveDmUser}
          setShowDirectMessages={setShowDirectMessages}
          setActiveDmUser={setActiveDmUser}
                storageConfig={storageConfig}
                siteConfig={siteConfig}
                onEdit={(p) => {
                  setEditingPost(p);
                  setShowPostForm(true);
                }}
                allPosts={posts}
              />
            ) : (`

const replacement = `            {postIdFromUrl ? (
              <PostDetail
                postId={postIdFromUrl}
                onBack={() => {
                  setSearchParams(prev => {
    const next = new URLSearchParams(prev);
    next.delete("postId");
    return next;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                isAdmin={isAdmin}
                addToast={addToast}
                userProfile={userProfile}
                allUsers={allUsers}
                setShowDirectMessages={setShowDirectMessages}
                setActiveDmUser={setActiveDmUser}
                storageConfig={storageConfig}
                siteConfig={siteConfig}
                onEdit={(p) => {
                  setEditingPost(p);
                  setShowPostForm(true);
                }}
                allPosts={posts}
              />
            ) : (`

if(code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Fixed');
} else {
  console.log('Target not found');
}
