import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyBm4dibvsG1mi6esQ1JUnhxLi-JHNO8spo",
  authDomain: "real-draft-association.firebaseapp.com",
  projectId: "real-draft-association",
  storageBucket: "real-draft-association.firebasestorage.app",
  messagingSenderId: "268687975259",
  appId: "1:268687975259:web:90e298c1f8663ad4ca707e",
  measurementId: "G-FHZBEFPQG6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);