const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const t1 = `sendCommentNotifications(
        post.id,
        newComment,
        auth.currentUser!.uid,
        authorName,
      );`;
const r1 = t1 + `\n      await logUserActivity("Commented on Post: " + post.id);`;
content = content.replace(t1, r1);

const t2 = `sendLikeNotification(
                    post.id,
                    commentId,
                    "",
                    parentComment.uid,
                    parentComment.userName || "User",
                    auth.currentUser!.uid,
                    likerName,
                  );`;
const r2 = t2 + `\n                  await logUserActivity("Liked a Comment on Post: " + post.id);`;
content = content.replace(t2, r2);

const t3 = `message: \`\${likerName} మరియు ఇతరులు ఒక పోస్ట్‌ను ఇష్టపడ్డారు.\`,
                      time: Date.now(),
                      read: false
                    }).catch(()=>console.error("Failed to update like notif"));
                  }`;
const r3 = t3 + `\n                  await logUserActivity("Liked Post: " + post.id);`;
content = content.replace(t3, r3);

const t4 = `message: \`\${sharerName} మరియు ఇతరులు ఒక పోస్ట్‌ను షేర్ చేశారు.\`,
                          time: Date.now(),
                          read: false
                        }).catch(()=>console.error("Failed to update share notif"));
                      }`;
const r4 = t4 + `\n                      await logUserActivity("Shared Post: " + post.id);`;
content = content.replace(t4, r4);

const t5 = `message: \`\${authorName} మీ కామెంట్ పై ఒక రిప్లై ఇచ్చారు.\`,
          type: "comment_reply",
          read: false,
          time: Date.now(),
          postId: post.id,
        }).catch(() => console.error("Failed to fetch notification"));
      }`;
const r5 = t5 + `\n      await logUserActivity("Replied to a Comment on Post: " + post.id);`;
// Note: t5 is matched twice
content = content.split(t5).join(r5);

fs.writeFileSync('src/App.tsx', content);
