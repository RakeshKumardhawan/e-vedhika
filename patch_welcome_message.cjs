const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const profileFetchRegex = /if \(snap.exists\(\)\) \{\s*const p = \{ id: snap.id, \.\.\.snap.data\(\) \} as UserProfile;\s*setUserProfile\(p\);/g;
const profileFetchReplacement = `if (snap.exists()) {
          const p = { id: snap.id, ...snap.data() } as UserProfile & { welcomeMessageSent?: boolean };
          setUserProfile(p);
          
          if (!p.welcomeMessageSent) {
            // Send welcome message and mark as sent
            const { collection, addDoc, updateDoc, doc } = require('firebase/firestore');
            updateDoc(doc(db, "users", user.uid), { welcomeMessageSent: true }).then(async () => {
              const ticketRef = await addDoc(collection(db, "support_tickets"), {
                uid: user.uid,
                userName: p.username || p.name || "User",
                subject: "Welcome to E-VEDHIKA / ఈ వేదిక కు స్వాగతం",
                status: "read",
                createdAt: Date.now(),
                updatedAt: Date.now()
              });
              await addDoc(collection(db, "support_tickets", ticketRef.id, "messages"), {
                senderId: "admin",
                senderName: "ఈ వేదిక",
                text: "ఈ వేదిక కు స్వాగతం! మీకు ఏమైనా సందేహాలు లేదా సమస్యలు ఉంటే ఇక్కడ మెసేజ్ చేయవచ్చు.\\n\\nWelcome to E-VEDHIKA! If you have any questions or issues, you can message us here.",
                time: Date.now()
              });
            }).catch(console.error);
          }`;

content = content.replace(profileFetchRegex, profileFetchReplacement);
fs.writeFileSync('src/App.tsx', content, 'utf8');
