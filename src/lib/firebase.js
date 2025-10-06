import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ← TAMBAHKAN INI
// Ganti dengan konfigurasi Firebase PROYEK BARU Anda
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "manajemen-anggota.firebaseapp.com",
  projectId: "manajemen-anggota",
  storageBucket: "manajemen-anggota.firebasestorage.app",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // ← TAMBAHKAN INI