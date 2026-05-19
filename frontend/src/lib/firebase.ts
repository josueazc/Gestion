import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBfATdgfFt5VunNs3vEFKitV6q3_ehACrk",
  authDomain: "gestion-920a5.firebaseapp.com",
  projectId: "gestion-920a5",
  storageBucket: "gestion-920a5.firebasestorage.app",
  messagingSenderId: "1017334163787",
  appId: "1:1017334163787:web:89ebb4fb85080ab57f60ce",
};

// Patrón Singleton: Evita inicializar Firebase múltiples veces en desarrollo (Hot Reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exportamos la instancia de Auth para usarla en la app
export const auth = getAuth(app);