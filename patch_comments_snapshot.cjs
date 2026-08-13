const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  useEffect(() => {
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

const replacement = `  useEffect(() => {
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

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log("PostComments snapshot patched successfully.");
} else {
  console.log("Target not found.");
}
