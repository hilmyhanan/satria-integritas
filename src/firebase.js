// Konfigurasi Firebase (Kosongkan dulu, bisa diisi oleh user)
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQ-nZaPQpVRGnF-wZxHSWvHUihiyRdt0w",
  authDomain: "satria-integritas.firebaseapp.com",
  projectId: "satria-integritas",
  storageBucket: "satria-integritas.firebasestorage.app",
  messagingSenderId: "976091083169",
  appId: "1:976091083169:web:807122181bcdda10cddbe0"
};

let db = null;

try {
  if (firebaseConfig.apiKey !== "") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized");
  }
} catch (error) {
  console.error("Firebase init error", error);
}

// Fallback jika firebase belum disetting (menggunakan LocalStorage)
export const saveScore = async (name, category, score, avatar) => {
  const data = { name, category, score, avatar, date: new Date().toISOString() };

  if (db) {
    try {
      await addDoc(collection(db, "leaderboard"), data);
      return true;
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  // Fallback local storage
  const existing = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  existing.push(data);
  localStorage.setItem("leaderboard", JSON.stringify(existing));
  return true;
};

export const getLeaderboard = async (category) => {
  if (db) {
    try {
      const q = query(
        collection(db, "leaderboard"),
        // Note: idealnya di-filter berdasarkan category pakai where() tapi butuh index,
        // jadi untuk sementara kita get all atau sort lalu filter di frontend
        orderBy("score", "desc"),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      return results.filter(item => item.category === category).slice(0, 10);
    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  }

  // Fallback local storage
  const existing = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  const filtered = existing.filter(item => item.category === category);
  return filtered.sort((a, b) => b.score - a.score).slice(0, 10);
};

export const checkNameExists = async (name) => {
  if (db) {
    try {
      const q = query(
        collection(db, "leaderboard"),
        where("name", "==", name),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (e) {
      console.error("Error checking name: ", e);
      return false; // allow on error to prevent blocking
    }
  }
  
  // Fallback local storage
  const existing = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  return existing.some(item => item.name.toLowerCase() === name.toLowerCase());
};
