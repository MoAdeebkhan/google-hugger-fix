import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0966090438",
  appId: "1:765838935199:web:058de432e0ca5a4a99ceaa",
  apiKey: "AIzaSyDzkD2uJ-Jyt-Qgoo6dQQ9QPlWD7fLMw_Q",
  authDomain: "gen-lang-client-0966090438.firebaseapp.com",
  storageBucket: "gen-lang-client-0966090438.firebasestorage.app",
  messagingSenderId: "765838935199",
};

const FIRESTORE_DB_ID = "ai-studio-e9e650af-7098-4422-a0f4-7072a9bfe776";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, FIRESTORE_DB_ID);
export const googleProvider = new GoogleAuthProvider();