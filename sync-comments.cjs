const { initializeApp } = require("firebase/app");
const { initializeFirestore, doc, collection, getDocs, updateDoc } = require("firebase/firestore");
const firebaseConfig = require("./firebase-applet-config.json");

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {});

async function syncAllPosts() {
  try {
    const postsSnap = await getDocs(collection(db, "posts"));
    for (const d of postsSnap.docs) {
      const postId = d.id;
      const data = d.data();
      
      const legacyCount = data.comments ? data.comments.length : 0;
      const subSnap = await getDocs(collection(db, "posts", postId, "comments"));
      const subCount = subSnap.size;
      
      const actualCount = legacyCount + subCount;
      if (data.commentCount !== actualCount) {
        console.log(`Updating ${postId}: ${data.commentCount} -> ${actualCount}`);
        await updateDoc(doc(db, "posts", postId), {
          commentCount: actualCount
        });
      }
    }
    console.log("Done syncing.");
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
syncAllPosts();
