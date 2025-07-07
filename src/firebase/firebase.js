// Firebase initialization and Auth export
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDRWg5EXUuodrOlBQkKGdQ-fDl5iwhoHWM",
    authDomain: "ecommerce-aae82.firebaseapp.com",
    databaseURL: "https://ecommerce-aae82-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ecommerce-aae82",
    storageBucket: "ecommerce-aae82.firebasestorage.app",
    messagingSenderId: "707295591915",
    appId: "1:707295591915:web:cda8e3fcf12223fe402dae"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }; 