const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

appTsx = appTsx.replace(
  /const unsub = onSnapshot\(collection\(db, "chat"\), \(snapshot\) => \{/g,
  `const unsub = onSnapshot(query(collection(db, "chat"), or(where("uid", "==", user.uid), where("receiverId", "==", user.uid))), (snapshot) => {`
);

appTsx = appTsx.replace(
  /const unsub = onSnapshot\(collection\(db, "chat"\), async \(snapshot\) => \{/g,
  `const unsub = onSnapshot(query(collection(db, "chat"), or(where("uid", "==", user.uid), where("receiverId", "==", user.uid))), async (snapshot) => {`
);

// We must also ensure 'or' is imported from firebase/firestore
if (!appTsx.includes('import {') || !appTsx.includes(', or,')) {
  appTsx = appTsx.replace(/import\s+\{([^}]+)\}\s+from\s+['"]firebase\/firestore['"];/, (match, p1) => {
    if (!p1.includes('or')) {
      return `import { ${p1}, or } from 'firebase/firestore';`;
    }
    return match;
  });
}

fs.writeFileSync('src/App.tsx', appTsx, 'utf8');
