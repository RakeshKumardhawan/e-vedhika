import admin from 'firebase-admin';

admin.initializeApp({
  projectId: "e-vedhika-258f2"
});
const db = admin.firestore();
// db.settings({ databaseId: 'ai-studio-22c3cfb1-d6e9-43a5-89ff-c26680c1e4db' });

async function run() {
  const postsRef = db.collection('posts');
  const snap = await postsRef.limit(5).get();
  snap.forEach(doc => console.log(doc.id));
}
run();
