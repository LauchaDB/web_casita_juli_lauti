# 🚨 ERROR: Cannot parse Firebase url

## El Error Completo

```
FIREBASE FATAL ERROR: Cannot parse Firebase url. 
Please use https://<YOUR FIREBASE>.firebaseio.com
```

## ¿Por qué pasa esto?

El archivo `src/firebase.js` todavía tiene valores de ejemplo (placeholder). Necesitas reemplazarlos con tus credenciales reales de Firebase.

## ✅ SOLUCIÓN RÁPIDA (5 minutos)

### Paso 1: Abrir Firebase Console

Ve a: https://console.firebase.google.com/

### Paso 2A: Si YA TIENES un proyecto Firebase

1. Selecciona tu proyecto
2. Haz clic en el ícono de engranaje ⚙️ → **Configuración del proyecto**
3. Baja hasta "Tus apps"
4. Si ya tienes una app web, copia el `firebaseConfig`
5. Si NO tienes app web:
   - Haz clic en el ícono `</>`
   - Registra la app (nombre: "pendientes-web")
   - Copia el objeto `firebaseConfig`

### Paso 2B: Si NO TIENES un proyecto Firebase

1. Haz clic en **"Agregar proyecto"**
2. Nombre: "pendientes-hogar" (o el que quieras)
3. Desactiva Google Analytics
4. Haz clic en "Crear proyecto"
5. Espera a que se cree (1 minuto)

### Paso 3: Crear Realtime Database (solo si es proyecto nuevo)

1. En el menú lateral: **Build** → **Realtime Database**
2. Haz clic en "Crear base de datos"
3. Ubicación: Elige la más cercana (ej: us-central1)
4. **IMPORTANTE:** Selecciona **"Comenzar en modo de prueba"**
5. Haz clic en "Habilitar"

### Paso 4: Obtener Credenciales

1. Ícono de engranaje ⚙️ → **Configuración del proyecto**
2. Baja hasta "Tus apps"
3. Haz clic en el ícono web `</>`
4. Nombre de app: "pendientes-web"
5. NO marques "Firebase Hosting"
6. Haz clic en "Registrar app"
7. **COPIA** el objeto `firebaseConfig` completo

Debería verse algo así:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefGHIJKLMNOPQRSTUVW",
  authDomain: "mi-proyecto-12345.firebaseapp.com",
  databaseURL: "https://mi-proyecto-12345-default-rtdb.firebaseio.com",
  projectId: "mi-proyecto-12345",
  storageBucket: "mi-proyecto-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

### Paso 5: Pegar en tu Proyecto

1. Abre el archivo: `src/firebase.js`
2. **REEMPLAZA** completamente el objeto `firebaseConfig` con el que copiaste
3. **Guarda el archivo** (Cmd+S o Ctrl+S)

**ANTES (placeholder):**
```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  databaseURL: "TU_DATABASE_URL",  // ← Este es el problema
  // ...
};
```

**DESPUÉS (tus credenciales reales):**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefGHIJKLMNOPQRSTUVW",
  authDomain: "pendientes-hogar-abc123.firebaseapp.com",
  databaseURL: "https://pendientes-hogar-abc123-default-rtdb.firebaseio.com",
  projectId: "pendientes-hogar-abc123",
  storageBucket: "pendientes-hogar-abc123.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

### Paso 6: Recargar la Aplicación

1. Guarda el archivo `src/firebase.js`
2. Vuelve al navegador
3. Recarga la página (F5 o Cmd+R)
4. ¡Debería funcionar! 🎉

## ⚠️ IMPORTANTE

### Verifica que `databaseURL` esté presente

El campo más importante es `databaseURL`. Si NO aparece en las credenciales que copiaste:

1. Ve a Firebase Console
2. **Build** → **Realtime Database**
3. Copia la URL que aparece arriba (algo como `https://tu-proyecto-xxxxx-default-rtdb.firebaseio.com`)
4. Agrégala manualmente al objeto:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tu-proyecto.firebaseapp.com",
  databaseURL: "https://tu-proyecto-xxxxx-default-rtdb.firebaseio.com", // ← Agregar esta línea
  projectId: "tu-proyecto",
  // ...
};
```

## ✅ ¿Cómo sé si funcionó?

Después de recargar la página:

1. **Deberías ver** la pantalla de login (morada con gradiente)
2. **NO deberías ver** errores en la consola
3. Ingresa tu nombre
4. Deberías ver el tablero de tareas

## 🐛 Si sigue sin funcionar

### Error: "Permission denied"

**Causa:** Las reglas de Firebase no permiten lectura/escritura

**Solución:**
1. Ve a Firebase Console
2. **Realtime Database** → **Reglas**
3. Reemplaza con esto:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

4. Haz clic en "Publicar"

### Error: "Network request failed"

**Causa:** Problemas de conexión o URL incorrecta

**Solución:**
1. Verifica tu conexión a Internet
2. Asegúrate de que `databaseURL` sea correcta
3. Verifica que el proyecto de Firebase existe

### Pantalla blanca sin errores

**Solución:**
1. Abre DevTools (F12)
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Compártelos para ayudarte mejor

## 📚 Más Ayuda

- **Guía completa:** `CONFIGURACION_RAPIDA.md`
- **Documentación detallada:** `README.md`
- **Comandos útiles:** `COMANDOS_UTILES.md`

---

**Una vez configurado, este error no volverá a aparecer.** 🎉
