import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();
const db = getFirestore();
async function test() {
  const doc = await db.collection('settings').doc('admin_config').get();
  console.log(doc.data());
}
test();
