import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyAUu8g06_D9r6XZnwi1ld6H_-b1rieAG6E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "budget-buddy-23d58.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);
export const onAuthChange = (callback: (user: User | null) => void) => 
  onAuthStateChanged(auth, callback);

export type { User };
