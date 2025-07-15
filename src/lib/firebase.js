// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-3EtommEekqajyq_3C-qj1xen08QAzwk",
  authDomain: "inventario-app-5.firebaseapp.com",
  projectId: "inventario-app-5",
  storageBucket: "inventario-app-5.firebaseapp.com",
  messagingSenderId: "801620157322",
  appId: "1:801620157322:web:6ada2180357c56b15a5e73",
  measurementId: "G-ZYE0VD04YM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
