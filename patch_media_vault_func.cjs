const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const vaultFunc = `
async function saveToMediaVault(url, file, user) {
  try {
    if (!url) return;
    const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
    const { db } = await import("./firebase");
    await addDoc(collection(db, "media_vault"), {
      url,
      name: file?.name || "unknown",
      type: file?.type || "unknown",
      size: file?.size || 0,
      uploadedBy: user?.uid || "unknown",
      uploaderName: user?.displayName || user?.email || "Unknown User",
      uploadedAt: serverTimestamp(),
      isActive: true
    });
  } catch (err) {
    console.error("Failed to backup media to vault", err);
  }
}
`;

if (!code.includes('async function saveToMediaVault')) {
  code = code.replace(/import \{.*?\} from "firebase\/storage";/s, match => match + '\n' + vaultFunc);
}

fs.writeFileSync('src/App.tsx', code);
