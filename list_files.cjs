const admin = require('firebase-admin');

// Initialize admin
admin.initializeApp({
  storageBucket: "e-vedhika-258f2.firebasestorage.app"
});
console.log("Firebase Admin initialized");

async function listFiles() {
  try {
    const bucket = admin.storage().bucket();
    const [files] = await bucket.getFiles();
    console.log("Found " + files.length + " files.");
    files.forEach(file => console.log(file.name));
  } catch (e) {
    console.error("Error listing files:", e);
  }
}

listFiles();
