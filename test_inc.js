import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";

const firebaseConfig = {
  projectId: "e-vedhika-258f2",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testInc() {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    if (querySnapshot.empty) {
       console.log("No posts found");
       return;
    }
    const firstPost = querySnapshot.docs[0];
    console.log("Found post:", firstPost.id);
    
    await updateDoc(doc(db, "posts", firstPost.id), {
      views: increment(1)
    });
    console.log("Success incrementing", firstPost.id);
  } catch (e) {
    console.error("Failed:", e.message);
  }
}
testInc();

