// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRREBASE_API_KEY,
  authDomain: "mern-web-application.firebaseapp.com",
  projectId: "mern-web-application",
  storageBucket: "mern-web-application.appspot.com",
  messagingSenderId: "923947447056",
  appId: "1:923947447056:web:8ff5d70f6e1945854d2b95"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);