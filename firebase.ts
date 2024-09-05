import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage"; 

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAR-HJTJwOW1Wzu5dxWfbrsGPgUCbfskyE",
  authDomain: "water-bender-4902a.firebaseapp.com",
  projectId: "water-bender-4902a",
  storageBucket: "water-bender-4902a.appspot.com",
  messagingSenderId: "142607146805",
  appId: "1:142607146805:web:1bf509ef16dce03818f67c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); // Firestore instance
const storage = getStorage(app); // Storage instance

export { auth, provider, signInWithPopup, signOut, db, storage };
