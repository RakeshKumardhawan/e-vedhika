import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./src/firebase.ts";

async function check() {
  const postId = "qkQ9PDCxO0myy5l2seda";
  console.log("Checking post:", postId);
  
  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);
  
  let postCount = 0;
  if (postSnap.exists()) {
    const data = postSnap.data();
    const legacyComments = data.comments || [];
    console.log("Legacy array size:", legacyComments.length);
    console.log("CommentCount field:", data.commentCount);
    postCount = legacyComments.length;
  }
  
  const commentsColRef = collection(db, 'posts', postId, 'comments');
  const commentsSnap = await getDocs(commentsColRef);
  console.log("Subcollection size:", commentsSnap.size);
  
  process.exit(0);
}
check().catch(console.error);
