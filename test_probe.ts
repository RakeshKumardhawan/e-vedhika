import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function probe() {
  const tests = [
    { col: "suggestions", data: { name: "Probe", text: "Probe text" } },
    { col: "telemetryLogs", data: { pcName: "ProbePC" } },
    { col: "deploymentLogs", data: { pcName: "ProbePC" } },
    { col: "visitor_logs", data: { ip: "1.1.1.1" } },
    { col: "system_alerts", data: { title: "Probe alert" } },
    { col: "notifications", data: { title: "Probe notif", uid: "all" } },
    { col: "security_logs", data: { action: "Probe" } },
    { col: "support_tickets", data: { subject: "Probe" } }
  ];

  for (const t of tests) {
    try {
      const res = await addDoc(collection(db, t.col), t.data);
      console.log(`[PASS] ${t.col}: ${res.id}`);
    } catch (e: any) {
      console.log(`[FAIL] ${t.col}: ${e.message}`);
    }
  }

  // Also test updating an existing post
  try {
    const snap = await getDocs(collection(db, "posts"));
    if (!snap.empty) {
      const firstDoc = snap.docs[0];
      console.log("Found post:", firstDoc.id, firstDoc.data().title);
      await updateDoc(doc(db, "posts", firstDoc.id), {
        views: (firstDoc.data().views || 0) + 1
      });
      console.log("[PASS] updateDoc posts:", firstDoc.id);
    }
  } catch (e: any) {
    console.log("[FAIL] updateDoc posts:", e.message);
  }

  process.exit(0);
}

probe();
