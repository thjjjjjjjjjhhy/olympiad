// firebase-init.js (ES module loaded from CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ⬇️ Replace with YOUR values from Firebase console
export const firebaseConfig = {
  apiKey: "AIzaSyBgzjqj27sNke7QS46ZSjxCw7QZBd6K5gQ",
  authDomain: "olympiad-9fac6.firebaseapp.com",
  projectId: "olympiad-9fac6",
  storageBucket: "olympiad-9fac6.firebasestorage.app",
  messagingSenderId: "728029155815",
  appId: "1:728029155815:web:2e9aadc1d44555af66ad42",
  measurementId: "G-R641V1KFSP"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
