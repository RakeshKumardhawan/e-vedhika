import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function test() {
  try {
    const q = await getDocs(collection(db, "posts"));
    if (q.empty) { console.log("No posts"); return; }
    const pRef = q.docs[0].ref;
    console.log("Post ID:", pRef.id);
    await updateDoc(pRef, {
        views: increment(1)
    });
    console.log("Success! Anonymous user updated views.");
    const snapshot = await getDoc(pRef);
    console.log("New views:", snapshot.data().views);
  } catch (err) {
    console.error("FAILED:", err);
  }
}

test();
