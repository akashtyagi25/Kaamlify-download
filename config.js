// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_GeNQ7JcEs-aOxejuzNiVNhlI-ANm4Zg",
  authDomain: "project-2b5c9.firebaseapp.com",
  projectId: "project-2b5c9",
  storageBucket: "project-2b5c9.firebasestorage.app",
  messagingSenderId: "287955184755",
  appId: "1:287955184755:web:ba8d48c69a8365ef4ece06" // <--- IMPORTANT: REPLACE THIS WITH YOUR WEB APP ID FROM FIREBASE CONSOLE
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
