const { initializeApp } = require("firebase/app");
const { initializeFirestore, doc, getDoc, collection, getDocs } = require("firebase/firestore");
const firebaseConfig = require("./firebase-applet-config.json");

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {});

async function run() {
  try {
    const postRef = doc(db, "posts", "qkQ9PDCxO0myy5l2seda");
    const d = await getDoc(postRef);
    if (d.exists()) {
      console.log("Post exists!");
      console.log("Post data commentCount:", d.data().commentCount);
      console.log("Post data comments array length:", d.data().comments ? d.data().comments.length : 0);
    } else {
      console.log("Post does not exist.");
    }
    
    const snap = await getDocs(collection(db, "posts", "qkQ9PDCxO0myy5l2seda", "comments"));
    console.log("Subcollection count:", snap.size);
  } catch (e) {
    console.error("Error fetching:", e);
  }
  process.exit(0);
}
run();
