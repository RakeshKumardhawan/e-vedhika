import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-22c3cfb1-d6e9-43a5-89ff-c26680c1e4db");

async function probe() {
  console.log("Probing database: ai-studio-22c3cfb1-d6e9-43a5-89ff-c26680c1e4db");
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

  process.exit(0);
}

probe();
