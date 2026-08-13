const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const idx = code.indexOf('const commentsCol = collection(db, "posts", post.id, "comments");');
if (idx !== -1) {
  // Find the useEffect start before idx
  const effectStart = code.lastIndexOf('useEffect(() => {', idx);
  // Find the useEffect end after idx
  const effectEnd = code.indexOf('}, [post.id]);', idx) + '}, [post.id]);'.length;
  
  const originalBlock = code.substring(effectStart, effectEnd);
  console.log("Found original block:\n", originalBlock);

  const newBlock = `useEffect(() => {
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

  code = code.substring(0, effectStart) + newBlock + code.substring(effectEnd);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Successfully patched PostComments useEffect flexibly.");
} else {
  console.log("commentsCol not found.");
}
