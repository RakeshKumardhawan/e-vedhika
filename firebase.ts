import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from './firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use initializeFirestore with long polling for better connectivity in proxied environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

import { getFirestore } from "firebase/firestore";
export const analyticsDb = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || "ai-studio-22c3cfb1-d6e9-43a5-89ff-c26680c1e4db");

export const storage = getStorage(app);
console.log("Firebase App Initialized with storage bucket:", storage.app.options.storageBucket);




