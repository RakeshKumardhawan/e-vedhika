import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from './firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(console.error);

// Use initializeFirestore with long polling for better connectivity in proxied environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const storage = getStorage(app);
console.log("Firebase App Initialized with storage bucket:", storage.app.options.storageBucket);




