const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      await updateDoc(doc(db, "posts", post.id), {
        commentCount: increment(1)
      });

      const parentComment = comments.find((c) => c.id === commentId);`;

const replacement = `      await updateDoc(doc(db, "posts", post.id), {
        commentCount: increment(1)
      });

      // Global notification for reply
      await addDoc(collection(db, "notifications"), {
        uid: "all",
        title: "కొత్త రిప్లై (New Reply)",
        message: \`\${authorName} వారు ఒక కామెంట్ పై రిప్లై ఇచ్చారు.\`,
        type: "comment_reply",
        read: false,
        time: Date.now(),
        postId: post.id,
      });

      const parentComment = comments.find((c) => c.id === commentId);`;

content = content.split(target).join(replacement);
fs.writeFileSync('src/App.tsx', content);
