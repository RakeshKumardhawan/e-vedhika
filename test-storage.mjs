import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function main() {
  await db.collection('settings').doc('admin_config').set({
    storageType: 'cloudflare'
  }, { merge: true });
  console.log("Updated storageType to cloudflare");
}

main().catch(console.error);
