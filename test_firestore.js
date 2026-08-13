import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app);

async function run() {
  try {
    const docRef = await addDoc(collection(db, "suggestions"), {
      status: "open"
    });
    console.log("Success suggestions:", docRef.id);
  } catch (err) {
    console.error("Error suggestions:", err.message);
  }
}
run();
