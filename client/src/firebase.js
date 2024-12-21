// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ebuy-f03f8.firebaseapp.com",
  projectId: "ebuy-f03f8",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "1024537934651",
  appId: "1:1024537934651:web:4609aafb530356f269151e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);