const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `  // Load draft when activeDmUser changes
  useEffect(() => {
    if (!user || !activeDmUser) {
      setDmInput("");
      return;
    }`;

const replacement = `  // Listen for typing status
  useEffect(() => {
    if (!user || !activeDmUser) return;
    const unsub = onSnapshot(doc(db, "typing_status", \`\${activeDmUser.id}_\${user.uid}\`), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const isCurrentlyTyping = data.isTyping && (Date.now() - data.updatedAt < 10000); // 10s timeout
        setTypingUsers(prev => ({ ...prev, [activeDmUser.id]: isCurrentlyTyping }));
      } else {
        setTypingUsers(prev => ({ ...prev, [activeDmUser.id]: false }));
      }
    });
    return () => unsub();
  }, [user, activeDmUser]);

  // Load draft when activeDmUser changes
  useEffect(() => {
    if (!user || !activeDmUser) {
      setDmInput("");
      return;
    }`;

content = content.replace(targetStr, replacement);
fs.writeFileSync('src/App.tsx', content);
