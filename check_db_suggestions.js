import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function check() {
  try {
    const querySnapshot = await getDocs(collection(db, 'suggestions'));
    console.log(`Successfully fetched ${querySnapshot.size} documents from 'suggestions'`);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  } catch (err) {
    console.error("Error fetching suggestions:", err);
  }
}

check();
