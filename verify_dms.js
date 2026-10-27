import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import fs from "fs";

const configRaw = fs.readFileSync("./firebase-applet-config.json", "utf8");
const firebaseConfig = JSON.parse(configRaw);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  try {
    const q = query(collection(db, "chat"), where("senderId", "==", "evedhika_support_system"));
    const snap = await getDocs(q);
    console.log(`Current DMs from support system: ${snap.size}`);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

run();
