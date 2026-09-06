const fs = require('fs');

let rules = fs.readFileSync('firestore.rules', 'utf8');
rules = rules.replace(
  "allow create: if isAdmin() || (isSignedIn() && get(/databases/$(database)/documents/support_tickets/$(ticketId)).data.uid == request.auth.uid && incoming().senderId == request.auth.uid);",
  "allow create: if isAdmin() || (isSignedIn() && get(/databases/$(database)/documents/support_tickets/$(ticketId)).data.uid == request.auth.uid && (incoming().senderId == request.auth.uid || incoming().senderId == 'admin'));"
);
fs.writeFileSync('firestore.rules', rules, 'utf8');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');
// Remove the chat welcome message loop (lines 2759-2779)
appTsx = appTsx.replace(/useEffect\(\(\) => \{\n\s*const sendWelcomeMsg = async \(\) => \{\n\s*if \(\!user \|\| \!userProfile \|\| userProfile\.welcome_message_sent\) return;\n\s*try \{\n\s*await addDoc\(collection\(db, "chat"\), \{[\s\S]*?\}\);\n\s*await updateDoc\(doc\(db, "users", user\.uid\), \{\n\s*welcome_message_sent: true\n\s*\}\);\n\s*\} catch \(err\) \{\n\s*console\.error\("Failed to send welcome message:", err\);\n\s*\}\n\s*\};\n\s*sendWelcomeMsg\(\);\n\s*\}, \[user, userProfile\]\);/m, "");

fs.writeFileSync('src/App.tsx', appTsx, 'utf8');
