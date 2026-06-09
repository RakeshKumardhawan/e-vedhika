import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from './firebase.ts';

async function checkPost() {
  try {
    const postId = "qkQ9PDCxO0myy5l2seda";
    console.log("Checking post:", postId);
    
    // Check main post doc
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      const data = postSnap.data();
      const legacyComments = data.comments || [];
      console.log("Main Post Doc comments array length:", legacyComments.length);
      console.log("Main Post Doc commentCount field:", data.commentCount);
    } else {
      console.log("Post document not found!");
    }
    
    // Check subcollection
    const commentsColRef = collection(db, 'posts', postId, 'comments');
    const commentsSnap = await getDocs(commentsColRef);
    console.log("Subcollection 'comments' document count:", commentsSnap.size);
    
    // Output all legacy comments + subcollection to verify unique IDs.
    if (postSnap.exists()) {
        const data = postSnap.data();
        const legacyComments = data.comments || [];
        const combinedMap = new Map();
        
        legacyComments.forEach((c) => {
            const cid = c.id || c.time?.toString() || Math.random().toString();
            combinedMap.set(cid, { ...c, id: cid, isLegacy: true });
        });
        
        commentsSnap.forEach((d) => {
            combinedMap.set(d.id, d.data());
        });
        
        const combinedComments = Array.from(combinedMap.values());
        console.log("Calculated Combined Unique Comments Length:", combinedComments.length);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

checkPost();
