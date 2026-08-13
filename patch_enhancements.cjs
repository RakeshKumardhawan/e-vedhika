const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Enhance SmartImage component
const oldSmartImageReturn = `  return (
    <img
      src={currentSrc}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      className={\`\${className} transition-all duration-500 \${isLoading ? "blur-md opacity-50 scale-[1.02]" : "blur-0 opacity-100 scale-100"} \${allowLightbox ? "cursor-pointer" : ""}\`}
      style={style}
      onLoad={() => setIsLoading(false)}
      onError={handleError}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        } else if (allowLightbox && (window as any).setLightboxImage) {
          (window as any).setLightboxImage({
            url: currentSrc,
            name: alt || "Photo Preview",
          });
        }
      }}
    />
  );`;

const newSmartImageReturn = `  return (
    <div className="relative overflow-hidden inline-block w-full">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200/80 animate-pulse rounded-2xl flex items-center justify-center z-10 min-h-[160px]">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={\`\${className} transition-all duration-700 \${isLoading ? "blur-sm opacity-40 scale-[1.02]" : "blur-0 opacity-100 scale-100"} \${allowLightbox ? "cursor-pointer" : ""}\`}
        style={style}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        onClick={(e) => {
          if (onClick) {
            onClick(e);
          } else if (allowLightbox && (window as any).setLightboxImage) {
            (window as any).setLightboxImage({
              url: currentSrc,
              name: alt || "Photo Preview",
            });
          }
        }}
      />
    </div>
  );`;

if (code.includes(oldSmartImageReturn)) {
  code = code.replace(oldSmartImageReturn, newSmartImageReturn);
  console.log("SmartImage enhanced successfully.");
} else {
  console.log("Warning: oldSmartImageReturn exact match not found, replacing via regex or alternative.");
}

// 2. Enhance PostComments with onSnapshot on parent post doc as well
const oldPostCommentsEffect = `  useEffect(() => {
    if (!post?.id) return;
    const commentsCol = collection(db, "posts", post.id, "comments");
    const unsub = onSnapshot(
      commentsCol,
      (snap) => {
        const docs = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setDbComments(docs);
        setCommentsLoaded(true);
      },
      (err) => {
        console.error("Error fetching comments snapshot:", err);
        setCommentsLoaded(true);
      },
    );
    return () => unsub();
  }, [post.id]);`;

const newPostCommentsEffect = `  useEffect(() => {
    if (!post?.id) return;
    const commentsCol = collection(db, "posts", post.id, "comments");
    const unsubComments = onSnapshot(
      commentsCol,
      (snap) => {
        const docs = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setDbComments(docs);
        setCommentsLoaded(true);
      },
      (err) => {
        console.error("Error fetching comments snapshot:", err);
        setCommentsLoaded(true);
      },
    );
    const unsubPost = onSnapshot(
      doc(db, "posts", post.id),
      (docSnap) => {
        if (docSnap.exists()) {
          const updatedPostData = docSnap.data();
          if (updatedPostData.comments) {
            postRef.current = { ...postRef.current, comments: updatedPostData.comments, commentCount: updatedPostData.commentCount };
          }
        }
      },
      (err) => console.error("Error fetching post doc snapshot for comments:", err)
    );
    return () => {
      unsubComments();
      unsubPost();
    };
  }, [post.id]);`;

if (code.includes(oldPostCommentsEffect)) {
  code = code.replace(oldPostCommentsEffect, newPostCommentsEffect);
  console.log("PostComments onSnapshot enhanced successfully.");
} else {
  console.log("Warning: oldPostCommentsEffect exact match not found.");
}

fs.writeFileSync('src/App.tsx', code);
