import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import fs from "fs";

const configRaw = fs.readFileSync("./firebase-applet-config.json", "utf8");
const firebaseConfig = JSON.parse(configRaw);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  try {
    console.log("Fetching users from 'users' collection...");
    const usersSnap = await getDocs(collection(db, "users"));
    console.log(`Found ${usersSnap.size} users.`);

    const welcomeText = "నమస్కారం! e-Vedhika Support System కు స్వాగతం. ఏవైనా సందేహాలు లేదా సమస్యలు ఉంటే ఇక్కడ తెలపగలరు.";
    const senderId = "evedhika_support_system";

    let count = 0;
    for (const userDoc of usersSnap.docs) {
      const userId = userDoc.id;
      if (userId === senderId) continue;

      // Check if we should skip admins or if the user is the admin themselves?
      // The user said "all users", so we send to everyone.

      try {
        await addDoc(collection(db, "chat"), {
          uid: senderId,
          senderId: senderId,
          receiverId: userId,
          text: welcomeText,
          createdAt: Date.now(),
          read: false
        });
        
        await addDoc(collection(db, "notifications"), {
          uid: userId,
          senderUid: senderId,
          type: "message",
          title: "e-Vedhika Support System",
          message: welcomeText,
          time: Date.now(),
          read: false
        });
        count++;
        if (count % 10 === 0) console.log(`Sent to ${count} users...`);
      } catch (err) {
        console.error(`Failed to send to ${userId}:`, err.message);
      }
    }
    console.log(`Successfully sent welcome message to ${count} users.`);
  } catch (err) {
    console.error("Run error:", err);
  }
  process.exit(0);
}

run();
