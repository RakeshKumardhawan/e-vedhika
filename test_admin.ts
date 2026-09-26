import admin from 'firebase-admin';

admin.initializeApp({
  projectId: "e-vedhika-258f2"
});

async function testAdmin() {
  try {
    const db = admin.firestore();
    const snap = await db.collection("posts").limit(2).get();
    console.log("Admin SDK read posts count:", snap.size);
    
    // Test write to support_tickets using Admin SDK
    const res = await db.collection("support_tickets").add({
      trackingNumber: "EV-ADMIN-TEST",
      subject: "Test from Admin SDK",
      time: Date.now()
    });
    console.log("Admin SDK write to support_tickets SUCCESS:", res.id);
  } catch (e: any) {
    console.error("Admin SDK failed:", e.message);
  }
  process.exit(0);
}

testAdmin();
