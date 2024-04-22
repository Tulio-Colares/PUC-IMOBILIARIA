// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_APIKEY,
  authDomain: "puc-imoveis.firebaseapp.com",
  projectId: "puc-imoveis",
  storageBucket: "puc-imoveis.appspot.com",
  messagingSenderId: "853541562831",
  appId: "1:853541562831:web:72360fdfe5d19562ed4aba"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);