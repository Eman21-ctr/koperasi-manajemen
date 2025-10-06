import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ← TAMBAHKAN INI
// Ganti dengan konfigurasi Firebase PROYEK BARU Anda
const firebaseConfig = {
  apiKey: "AIzaSyDk4iThpJXqiuHNlo6R470Pp8DfFHDhr-U",
  authDomain: "manajemen-anggota.firebaseapp.com",
  projectId: "manajemen-anggota",
  storageBucket: "manajemen-anggota.firebasestorage.app",
  messagingSenderId: "64540987532",
  appId: "1:64540987532:web:cd7f38e221c0b2a2722ba9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // ← TAMBAHKAN INI