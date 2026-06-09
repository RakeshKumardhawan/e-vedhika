const { initializeApp } = require("firebase/app");
const { initializeFirestore, doc, collection, getDocs, updateDoc } = require("firebase/firestore");
const firebaseConfig = require("./firebase-applet-config.json");

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId || "(default)");

async function fixCounts() {
  try {
    const postsSnap = await getDocs(collection(db, "posts"));
    console.log(`Found ${postsSnap.size} posts in database.`);
    for (const d of postsSnap.docs) {
      const postId = d.id;
      const data = d.data();
      
      const legacyComments = data.comments || [];
      const subSnap = await getDocs(collection(db, "posts", postId, "comments"));
      
      const combinedMap = new Map();
      legacyComments.forEach((c) => {
          const cid = c.id || c.time?.toString() || Math.random().toString();
          combinedMap.set(cid, { ...c, id: cid, isLegacy: true });
      });
      subSnap.forEach((c) => {
          combinedMap.set(c.id, c.data());
      });
      const actualCount = Array.from(combinedMap.values()).length;
      
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
fixCounts();
