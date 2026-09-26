import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {});

async function test() {
  console.log("Testing Firestore with config:", firebaseConfig.projectId);
  try {
    console.log("1. Trying to add a test doc to support_tickets unauthenticated...");
    const ref = await addDoc(collection(db, "support_tickets"), {
      trackingNumber: "EV-SUP-TEST99",
      ticketNumber: "EV-SUP-TEST99",
      postId: "test-post-id",
      subject: "Test Ticket",
      problem: "Test Problem",
      status: "open",
      createdAt: Date.now()
    });
    console.log("SUCCESS creating support_tickets doc:", ref.id);
  } catch (e: any) {
    console.error("FAILED creating support_tickets doc:", e.code, e.message);
  }

  try {
    console.log("2. Trying to add to security_logs unauthenticated...");
    const ref2 = await addDoc(collection(db, "security_logs"), {
      category: "SETTINGS_CHANGE",
      title: "Test",
      time: Date.now()
    });
    console.log("SUCCESS creating security_logs doc:", ref2.id);
  } catch (e: any) {
    console.error("FAILED creating security_logs doc:", e.code, e.message);
  }

  try {
    console.log("3. Trying to update a post in posts unauthenticated...");
    // Let's create or update
    await updateDoc(doc(db, "posts", "dummy_post_id"), {
      status: "private_support"
    });
    console.log("SUCCESS updating posts");
  } catch (e: any) {
    console.error("FAILED updating posts doc:", e.code, e.message);
  }
  process.exit(0);
}

test();
