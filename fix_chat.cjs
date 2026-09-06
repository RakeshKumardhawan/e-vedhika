const fs = require('fs');

let rules = fs.readFileSync('firestore.rules', 'utf8');
rules = rules.replace(
  "match /chat/{msgId} {\n  allow read: if true;",
  "match /chat/{msgId} {\n  allow read: if isAdmin() || (isSignedIn() && (resource.data.uid == request.auth.uid || resource.data.receiverId == request.auth.uid));"
);
fs.writeFileSync('firestore.rules', rules, 'utf8');
