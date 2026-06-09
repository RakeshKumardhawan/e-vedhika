require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const postId = "qkQ9PDCxO0myy5l2seda";
  console.log("Checking post:", postId);
  
  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);
  
  if (postSnap.exists()) {
    const data = postSnap.data();
    const legacyComments = data.comments || [];
    console.log("Legacy array size:", legacyComments.length);
    console.log("CommentCount field:", data.commentCount);
  } else {
    console.log("Not found.");
  }
  
  const commentsColRef = collection(db, 'posts', postId, 'comments');
  const commentsSnap = await getDocs(commentsColRef);
  console.log("Subcollection size:", commentsSnap.size);
  
  process.exit(0);
}
check().catch(console.error);
