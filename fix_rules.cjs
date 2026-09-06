const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

// We will remove all those wildcards at the bottom and replace them with proper rules.
const wildcardRegex = /match \/notifications\/\{document=\*\*\} \{[\s\S]*?\/\/ Default deny/m;

const newRules = `
match /support_tickets/{ticketId} {
  allow read: if isAdmin() || (isSignedIn() && resource.data.uid == request.auth.uid);
  allow create: if isSignedIn() && incoming().uid == request.auth.uid;
  allow update, delete: if isAdmin();
  
  match /messages/{messageId} {
    allow read: if isAdmin() || (isSignedIn() && get(/databases/$(database)/documents/support_tickets/$(ticketId)).data.uid == request.auth.uid);
    allow create: if isAdmin() || (isSignedIn() && get(/databases/$(database)/documents/support_tickets/$(ticketId)).data.uid == request.auth.uid && incoming().senderId == request.auth.uid);
    allow update, delete: if isAdmin();
  }
}

match /notifications/{notifId} {
  allow read: if isSignedIn() && (resource.data.uid == request.auth.uid || resource.data.uid == 'all');
  allow create: if isSignedIn();
  allow update, delete: if isAdmin() || (isSignedIn() && resource.data.uid == request.auth.uid);
}
match /security_logs/{logId} {
  allow read: if isAdmin();
  allow create: if true;
  allow update, delete: if false;
}
match /audit_logs/{logId} {
  allow read: if isAdmin();
  allow create: if true;
  allow update, delete: if false;
}
match /usernames/{username} { allow read: if true; allow write: if isSignedIn(); }
match /settings/{document=**} { allow read: if true; allow write: if isAdmin(); }
match /site_settings/{document=**} { allow read: if true; allow write: if isAdmin(); }
match /system_errors/{document=**} { allow read: if isAdmin(); allow create: if true; }
match /app_errors/{document=**} { allow read: if isAdmin(); allow create: if true; }
match /polls/{document=**} { allow read: if true; allow write: if isAdmin(); }
match /home_sections/{document=**} { allow read: if true; allow write: if isAdmin(); }
match /deploymentLogs/{document=**} { allow read: if isAdmin(); allow write: if isAdmin(); }
match /telemetryLogs/{document=**} { allow read: if isAdmin(); allow write: if isAdmin(); }
match /remoteQueue/{document=**} { allow read: if isAdmin(); allow write: if isAdmin(); }
match /gpdp_plans/{document=**} { allow read: if true; allow write: if isAdmin(); }
match /ubdDataChunks/{document=**} { allow read: if isAdmin(); allow write: if isAdmin(); }
match /custom_code/{document=**} { allow read: if true; allow write: if isAdmin(); }
match /daily_traffic/{document=**} { allow read: if isAdmin(); allow create: if true; allow update: if true; }
match /visitor_logs/{document=**} { allow read: if isAdmin(); allow create: if true; }
match /user_tracking/{document=**} { allow read: if isAdmin(); allow create: if true; }
match /typing_status/{document=**} { allow read: if isSignedIn(); allow write: if isSignedIn(); }

// Default deny`;

content = content.replace(wildcardRegex, newRules);

// We should also remove the duplicate generic matches like `match /users/{document=**} { allow read, write: if true; }`
// The regex above will capture them all because it goes from `match /notifications/{document=**} {` down to `// Default deny`.

fs.writeFileSync('firestore.rules', content, 'utf8');
