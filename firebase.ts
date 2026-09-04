import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from './firebase-applet-config.json';

const getDynamicAuthDomain = () => {
  if (typeof window !== 'undefined' && window.location.hostname) {
    const host = window.location.host;
    // If running on custom domain like e-vedhika.in
    if (host.includes('e-vedhika.in')) {
      return host;
    }
  }
  return firebaseConfig.authDomain;
};

export const app = initializeApp({
  ...firebaseConfig,
  authDomain: getDynamicAuthDomain()
});
export const auth = getAuth(app);

// Use initializeFirestore with long polling for better connectivity in proxied environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

import { getFirestore } from "firebase/firestore";
export const analyticsDb = db;

export const storage = getStorage(app);
console.log("Firebase App Initialized with storage bucket:", storage.app.options.storageBucket);




