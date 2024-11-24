import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1-QuakN6Q32dWIzkBPzG8SEWhLIltICU",
  authDomain: "minsu-d6ae4.firebaseapp.com",
  projectId: "minsu-d6ae4",
  storageBucket: "minsu-d6ae4.firebasestorage.app",
  messagingSenderId: "338350609658",
  appId: "1:338350609658:web:cf2c90c6389f2a5fe62543",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db }; // Export the Firestore instance to use in other files
