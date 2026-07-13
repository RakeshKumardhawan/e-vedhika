const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, doc, updateDoc, increment, arrayUnion } = require("firebase/firestore");
const { getAuth, signInAnonymously, signInWithEmailAndPassword } = require("firebase/auth");
const firebaseConfig = require("./firebase-applet-config.json");

async function run() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

  try {
    console.log("Signing in anonymously...");
    const userCred = await signInAnonymously(auth);
    const uid = userCred.user.uid;
    console.log("Signed in with uid:", uid);

    // Let's test adding a comment to a known post or a mock post ID
    const mockPostId = "dummy_post_id_for_testing";
    
    console.log("Attempting to add a comment document...");
    try {
      const commentRef = await addDoc(collection(db, "posts", mockPostId, "comments"), {
        text: "Test comment from diagnostics",
        time: Date.now(),
        uid: uid,
        userName: "Diagnostic Bot"
      });
      console.log("Successfully added comment with ID:", commentRef.id);
    } catch (commentErr) {
      console.error("FAILED to add comment document:", commentErr.message);
    }

    console.log("Attempting to update post commentCount...");
    try {
      await updateDoc(doc(db, "posts", mockPostId), {
        commentCount: increment(1)
      });
      console.log("Successfully updated post commentCount!");
    } catch (countErr) {
      console.error("FAILED to update post commentCount:", countErr.message);
    }

    console.log("Attempting to update post likes (as if liking a post)...");
    try {
      await updateDoc(doc(db, "posts", mockPostId), {
        likes: increment(1),
        likedBy: arrayUnion(uid)
      });
      console.log("Successfully updated post likes!");
    } catch (likeErr) {
      console.error("FAILED to update post likes:", likeErr.message);
    }

  } catch (err) {
    console.error("Global script error:", err);
  }
}

run();
