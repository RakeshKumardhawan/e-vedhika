import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();

async function updateSetting() {
  try {
    await db.collection("settings").doc("admin_config").set({
      storageType: 'firebase'
    }, { merge: true });
    console.log("Successfully updated storageType to firebase");
  } catch (err) {
    console.error("Error:", err);
  }
}

updateSetting();
