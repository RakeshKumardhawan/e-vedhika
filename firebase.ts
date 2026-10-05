import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from './firebase-applet-config.json';

let appInstance: any = null;
let authInstance: any = null;
let dbInstance: any = null;
let storageInstance: any = null;

try {
  appInstance = initializeApp(firebaseConfig);
  authInstance = getAuth(appInstance);
  
  const rawDatabaseId = firebaseConfig.firestoreDatabaseId;
  const firestoreDatabaseId = !rawDatabaseId || rawDatabaseId === "(default)" ? undefined : rawDatabaseId;

  dbInstance = initializeFirestore(appInstance, {
    experimentalForceLongPolling: true,
  }, firestoreDatabaseId);

  storageInstance = getStorage(appInstance);
  console.log("Firebase App Initialized successfully.");
} catch (error) {
  console.error("Firebase initialization failed, running in resilient fallback mode:", error);
}

export const app = appInstance;
export const auth = authInstance || { currentUser: null, onAuthStateChanged: () => {} };
export const db = dbInstance || {};
export const analyticsDb = dbInstance || {};
export const storage = storageInstance || {};
