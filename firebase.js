import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_oLAFLdpErutmSmR9bQnm0ETq5hd9qnU",
  authDomain: "e-vedhika-258f2.firebaseapp.com",
  projectId: "e-vedhika-258f2",
  storageBucket: "e-vedhika-258f2.firebasestorage.app",
  messagingSenderId: "188172181883",
  appId: "1:188172181883:web:e1e7b7f5a94cf792f49dde"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);