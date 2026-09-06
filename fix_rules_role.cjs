const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

const oldUserMatch = /match \/users\/\{userId\} \{[\s\S]*?allow delete: if isSuperAdmin\(\); \/\/ అకౌంట్స్ డిలీట్ చేసే పవర్ కేవలం సూపర్ అడ్మిన్ కి మాత్రమే\n\}/;

const newUserMatch = `match /users/{userId} {
  allow read: if isSignedIn(); 
  allow create: if isAdmin() || (isSignedIn() && request.auth.uid == userId && (!('role' in incoming()) || incoming().role == 'user'));
  allow update: if isAdmin() || (isSignedIn() && request.auth.uid == userId && (!('role' in incoming()) || incoming().role == (resource == null ? null : resource.data.role)));
  allow delete: if isSuperAdmin(); // అకౌంట్స్ డిలీట్ చేసే పవర్ కేవలం సూపర్ అడ్మిన్ కి మాత్రమే
}`;

content = content.replace(oldUserMatch, newUserMatch);

fs.writeFileSync('firestore.rules', content, 'utf8');
