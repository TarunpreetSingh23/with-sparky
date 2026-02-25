import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCt4jPvBXbHhA_IprvS2uxEe5-7yuKVhEQ",
  authDomain: "withspark-3195b.firebaseapp.com",
  projectId: "withspark-3195b",
  storageBucket: "withspark-3195b.firebasestorage.app",
  messagingSenderId: "20473899706",
  appId: "1:20473899706:web:161bd0c0491fdbcbc57083",
  measurementId: "G-6HMC1KQ9DN"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);