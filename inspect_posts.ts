import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);

async function inspectPosts() {
  const db1 = getFirestore(app);
  const snap1 = await getDocs(collection(db1, "posts"));
  console.log("=== (default) POSTS ===");
  snap1.forEach(d => console.log(d.id, d.data().title, d.data().status));

  const db2 = getFirestore(app, "ai-studio-22c3cfb1-d6e9-43a5-89ff-c26680c1e4db");
  const snap2 = await getDocs(collection(db2, "posts"));
  console.log("=== ai-studio-22c3cfb1-d6e9-43a5-89ff-c26680c1e4db POSTS ===");
  snap2.forEach(d => console.log(d.id, d.data().title, d.data().status));

  process.exit(0);
}

inspectPosts();
