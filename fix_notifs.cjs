const fs = require('fs');

let rules = fs.readFileSync('firestore.rules', 'utf8');
rules = rules.replace(
  "allow create: if isSignedIn();",
  "allow create: if isSignedIn() && (incoming().uid != 'all' || isAdmin());"
);
fs.writeFileSync('firestore.rules', rules, 'utf8');
