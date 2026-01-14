// EJEMPLO DE CONFIGURACIÓN DE FIREBASE
// Este archivo muestra cómo debe verse tu configuración de Firebase
// NO uses estos valores, son solo de ejemplo

// PASO 1: Ve a Firebase Console
// https://console.firebase.google.com/

// PASO 2: Crea un proyecto nuevo o selecciona uno existente

// PASO 3: Ve a Configuración del proyecto (ícono de engranaje) 
// → Tus apps → Agrega una app web

// PASO 4: Copia el objeto firebaseConfig que aparece

// PASO 5: Pega esos valores en src/firebase.js

// Ejemplo de cómo se ve (con valores ficticios):
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefGHIJKLMNOPQRSTUVW",
  authDomain: "mi-proyecto-12345.firebaseapp.com",
  databaseURL: "https://mi-proyecto-12345-default-rtdb.firebaseio.com",
  projectId: "mi-proyecto-12345",
  storageBucket: "mi-proyecto-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// IMPORTANTE:
// - Asegúrate de que databaseURL esté presente y sea correcto
// - El databaseURL debe terminar con tu región (ej: firebaseio.com o asia-southeast1.firebasedatabase.app)
// - Todos los valores deben ser strings (entre comillas)
// - No compartas estas credenciales públicamente si usas reglas de seguridad estrictas
