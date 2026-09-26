import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);

async function testWrites() {
  const dbDefault = getFirestore(app);
  console.log("--- Testing write to (default) db ---");
  try {
    const res1 = await addDoc(collection(dbDefault, "support_tickets"), {
      trackingNumber: "EV-TEST-1",
      title: "Test ticket"
    });
    console.log("(default) support_tickets write SUCCESS:", res1.id);
  } catch (e: any) {
    console.log("(default) support_tickets write FAIL:", e.message);
  }

  console.log("--- Testing write to named db 'ai-studio-22c3cfb1-d6e9-43a5-89ff-c26680c1e4db' ---");
  try {
    const dbNamed = getFirestore(app, "ai-studio-22c3cfb1-d6e9-43a5-89ff-c26680c1e4db");
    const res2 = await addDoc(collection(dbNamed, "support_tickets"), {
      trackingNumber: "EV-TEST-2",
      title: "Test ticket"
    });
    console.log("named db support_tickets write SUCCESS:", res2.id);
  } catch (e: any) {
    console.log("named db support_tickets write FAIL:", e.message);
  }
  process.exit(0);
}

testWrites();
