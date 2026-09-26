import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);

async function checkDbs() {
  console.log("Checking (default) db...");
  const dbDefault = getFirestore(app);
  try {
    const snap = await getDocs(collection(dbDefault, "posts"));
    console.log("(default) posts count:", snap.size);
  } catch (e: any) {
    console.log("(default) error:", e.message);
  }

  console.log("Checking named db 'ai-studio-22c3cfb1-d6e9-43a5-89ff-c26680c1e4db'...");
  try {
    const dbNamed = getFirestore(app, "ai-studio-22c3cfb1-d6e9-43a5-89ff-c26680c1e4db");
    const snap = await getDocs(collection(dbNamed, "posts"));
    console.log("ai-studio-... posts count:", snap.size);
  } catch (e: any) {
    console.log("ai-studio-... error:", e.message);
  }

  process.exit(0);
}

checkDbs();
