require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local" });

const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

console.log("ProjectId:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    console.error("Error fetching:", e.message);
  }
  process.exit(0);
}
run();
