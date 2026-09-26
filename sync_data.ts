import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
const dbSource = getFirestore(app); // (default)
const dbTarget = getFirestore(app, "ai-studio-22c3cfb1-d6e9-43a5-89ff-c26680c1e4db");

const collectionsToSync = [
  "posts",
  "users",
  "problems",
  "suggestions",
  "updates",
  "gos_formats",
  "forms",
  "pins",
  "user_pins",
  "admins",
  "settings",
  "site_settings",
  "notifications",
  "home_sections",
  "polls",
  "gpdp_plans"
];

async function syncAll() {
  console.log("Starting data migration from (default) to ai-studio-22c3cfb1-d6e9-43a5-89ff-c26680c1e4db...");
  for (const colName of collectionsToSync) {
    try {
      const snap = await getDocs(collection(dbSource, colName));
      console.log(`Found ${snap.size} docs in collection '${colName}'`);
      for (const d of snap.docs) {
        const data = d.data();
        await setDoc(doc(dbTarget, colName, d.id), data, { merge: true });
        
        // If posts, also copy comments subcollection
        if (colName === "posts") {
          try {
            const commentsSnap = await getDocs(collection(dbSource, "posts", d.id, "comments"));
            for (const c of commentsSnap.docs) {
              await setDoc(doc(dbTarget, "posts", d.id, "comments", c.id), c.data(), { merge: true });
            }
            if (commentsSnap.size > 0) {
              console.log(`  Copied ${commentsSnap.size} comments for post ${d.id}`);
            }
          } catch (eComments) {
            // ignore
          }
        }
      }
    } catch (e: any) {
      console.warn(`Could not sync collection '${colName}':`, e.message);
    }
  }
  console.log("Data sync completed successfully!");
  process.exit(0);
}

syncAll();
