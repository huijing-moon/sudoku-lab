import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDmhT4NoLA_X0jZM2vj6xjYJZpm4lwPYoQ",
    authDomain: "hye-sudokulab.firebaseapp.com",
    projectId: "hye-sudokulab",
    storageBucket: "hye-sudokulab.firebasestorage.app",
    messagingSenderId: "916536654167",
    appId: "1:916536654167:web:2257952d0cebba1f48e612",
    measurementId: "G-W2E4BN7BBL"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
