#!/bin/bash
sed -i 's/const token = await auth.currentUser?.getIdToken();/await new Promise(r => { const u = auth.onAuthStateChanged(user => { if (user) { u(); r(user); } }); setTimeout(() => { r(auth.currentUser); }, 1500); });\n        const token = await auth.currentUser?.getIdToken();/' src/components/CloudStorageManager.tsx
