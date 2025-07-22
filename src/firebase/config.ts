import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATtD2A0eAEirTiHk0EPv5_fFbKp0lG8OA",
  authDomain: "blood-donors-list-62349.firebaseapp.com",
  projectId: "blood-donors-list-62349",
  storageBucket: "blood-donors-list-62349.firebasestorage.app",
  messagingSenderId: "826841453558",
  appId: "1:826841453558:web:96110f4f2be1317646add7"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);