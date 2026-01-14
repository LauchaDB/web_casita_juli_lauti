# ⚡ Configuración Rápida - Pendientes del Hogar

## 🎯 Pasos mínimos para empezar

### 1️⃣ Configurar Firebase (5 minutos)

1. **Crear proyecto:**
   - Ve a https://console.firebase.google.com/
   - Clic en "Agregar proyecto"
   - Nombre: "pendientes-hogar" (o el que quieras)
   - Deshabilita Google Analytics
   - Clic en "Crear proyecto"

2. **Crear base de datos:**
   - Menú lateral: Build → Realtime Database
   - Clic en "Crear base de datos"
   - Ubicación: us-central1 (o la más cercana)
   - **IMPORTANTE:** Selecciona "Comenzar en modo de prueba"
   - Clic en "Habilitar"

3. **Obtener credenciales:**
   - Ícono de configuración ⚙️ → Configuración del proyecto
   - Sección "Tus apps" → Clic en ícono web `</>`
   - Nombre de app: "pendientes-web"
   - NO marques "Firebase Hosting"
   - Clic en "Registrar app"
   - **COPIA** todo el objeto `firebaseConfig`

4. **Pegar credenciales en el proyecto:**
   - Abre: `src/firebase.js`
   - Reemplaza TODO el objeto `firebaseConfig` con el que copiaste
   - **Verifica que `databaseURL` esté presente**
   - Guarda el archivo

### 2️⃣ Agregar sonido de notificación (2 minutos)

**Opción A - Descargar sonido gratis:**
1. Ve a: https://freesound.org/search/?q=notification
2. Descarga un sonido corto (1-2 segundos)
3. Renómbralo a `notify.mp3`
4. Ponlo en la carpeta `public/`

**Opción B - Usar un sonido del sistema:**
1. Busca un sonido de notificación en tu computadora
2. Conviértelo a MP3 si es necesario
3. Renómbralo a `notify.mp3`
4. Ponlo en la carpeta `public/`

**Opción C - Usar un sonido online:**
```bash
cd public
curl -o notify.mp3 "https://notificationsounds.com/soundfiles/path-to-sound.mp3"
```

### 3️⃣ Probar la aplicación

```bash
npm run dev
```

Abre http://localhost:5173 en tu navegador.

¡Listo! 🎉

---

## 📱 Probar en tu celular/tablet

1. Asegúrate de que tu celular y computadora estén en la misma red WiFi
2. Cuando ejecutes `npm run dev`, busca la línea:
   ```
   Network: http://192.168.X.X:5173
   ```
3. Abre esa URL en el navegador de tu celular/tablet
4. (Opcional) Instálala como PWA desde el menú del navegador

---

## ⚠️ Problemas comunes

### "Firebase: Error (auth/...)"
→ No uses Firebase Auth, este proyecto usa login estático

### "Permission denied"
→ Verifica que las reglas de Firebase Realtime Database estén en modo de prueba:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### "No se reproduce el sonido"
→ Asegúrate de que `public/notify.mp3` existe y es un archivo MP3 válido

### "No se sincronizan las tareas"
→ Verifica que el `databaseURL` en `src/firebase.js` sea correcto

---

## 🚀 Deploy rápido

### Netlify (recomendado):
1. Crea cuenta en https://netlify.com
2. Arrastra la carpeta `dist/` (después de hacer `npm run build`)
3. ¡Listo!

### Vercel:
```bash
npm install -g vercel
vercel
```

---

**¿Dudas?** Lee el README.md completo para más detalles.
