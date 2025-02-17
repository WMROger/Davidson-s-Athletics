import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyBjdEDzPtlkwiNWJfvqdVlUyJPWzjnRgVQ",
  authDomain: "davidson-athletics-96cc6.firebaseapp.com",
  projectId: "davidson-athletics-96cc6",
  storageBucket: "davidson-athletics-96cc6.firebasestorage.app",
  messagingSenderId: "749720785605",
  appId: "1:749720785605:web:0d84424fb3b4df5fa396ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

// OAuth Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { app, auth, db, googleProvider, facebookProvider }; // Export db
