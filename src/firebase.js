// Configuración de Firebase
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Configuración de Firebase para web-casita-juli-lau
const firebaseConfig = {
  apiKey: "AIzaSyBykkZCqidD3AlQmSzgJcqhLMjgir5I3C4",
  authDomain: "web-casita-juli-lau.firebaseapp.com",
  databaseURL: "https://web-casita-juli-lau-default-rtdb.firebaseio.com",
  projectId: "web-casita-juli-lau",
  storageBucket: "web-casita-juli-lau.firebasestorage.app",
  messagingSenderId: "800193832972",
  appId: "1:800193832972:web:536e705d5e6883a497a629",
  measurementId: "G-98LT9X9ZD7" // Google Analytics (opcional, no afecta la funcionalidad)
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener referencia a la base de datos
export const database = getDatabase(app);
