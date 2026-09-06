const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const welcomeCode = `  useEffect(() => {
    const sendWelcomeMsg = async () => {
      if (!user || !userProfile || userProfile.welcome_message_sent) return;
      try {
        await addDoc(collection(db, "chat"), {
          uid: "e-vedika-official",
          senderId: "e-vedika-official",
          senderName: "e-Vedika Team",
          receiverId: user.uid,
          msg: "Welcome to e-Vedika! We're glad to have you here. This is an official message from the admin team.",
          createdAt: Date.now(),
          time: Date.now(),
          type: "official_welcome"
        });
        await updateDoc(doc(db, "users", user.uid), {
          welcome_message_sent: true
        });
      } catch (err) {
        console.error("Failed to send welcome message:", err);
      }
    };
    sendWelcomeMsg();
  }, [user, userProfile]);
`;

// Insert it somewhere inside App component, maybe after user effect.
const regex = /useEffect\(\(\) => \{\n    if \(!user\) return;\n    const unsub = onSnapshot\(collection\(db, "chat"\)/;
content = content.replace(regex, welcomeCode + '\n  ' + '$&');

fs.writeFileSync('src/App.tsx', content, 'utf8');
