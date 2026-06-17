import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, updateDoc, increment } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "e-vedhika-258f2",
  apiKey: "AIzaSyC_oLAFLdpErutmSmR9bQnm0ETq5hd9qnU",
  databaseURL: "https://e-vedhika-258f2-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function run() {
  await signInWithEmailAndPassword(auth, "guest_viewer@e-vedhika.online", "GuestView@1234");
  const docRef = doc(db, 'posts', 'qkQ9PDCxO0myy5l2seda');
  try {
    await updateDoc(docRef, { views: increment(1) });
    console.log("Success with Guest Auth");
  } catch (e) {
    console.error(e);
  }
}
run();
