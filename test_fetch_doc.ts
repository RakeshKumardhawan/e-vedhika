import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  projectId: "e-vedhika-258f2",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFetch() {
  const d = await getDoc(doc(db, "posts", "qkQ9PDCxO0myy5l2seda"));
  console.log("Exists:", d.exists());
}
testFetch();
