# 🛠️ Comandos Útiles

## 🚀 Desarrollo

### Iniciar servidor de desarrollo
```bash
npm run dev
```
Abre la app en http://localhost:5173

### Ver versión en red local (para probar en celular/tablet)
```bash
npm run dev
```
Busca la línea que dice `Network: http://192.168.x.x:5173` y usa esa URL

## 📦 Producción

### Construir para producción
```bash
npm run build
```
Genera la carpeta `dist/` con archivos optimizados

### Vista previa de la versión de producción
```bash
npm run preview
```
Prueba la versión construida localmente antes de deployar

## 🧹 Mantenimiento

### Reinstalar dependencias (si algo sale mal)
```bash
rm -rf node_modules package-lock.json
npm install
```

### Limpiar caché de Vite
```bash
rm -rf node_modules/.vite
npm run dev
```

### Actualizar dependencias
```bash
npm update
```

## 🐛 Debugging

### Ver errores en consola del navegador
1. Abre DevTools (F12 o Cmd+Opt+I en Mac)
2. Ve a la pestaña "Console"
3. Busca errores en rojo

### Verificar reglas de Firebase
1. Ve a Firebase Console
2. Realtime Database → Reglas
3. Asegúrate de que estén en modo de prueba:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### Verificar conexión a Firebase
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Busca peticiones a `firebaseio.com`
4. Si ves errores 401/403, revisa las reglas de Firebase

### Ver datos en Firebase
1. Ve a Firebase Console
2. Realtime Database → Datos
3. Deberías ver una estructura como:
```
tasks
  └─ -NXxxXxxXxxXxxXxxXx
      ├─ text: "Sacar la basura"
      ├─ createdBy: "Juan"
      └─ timestamp: 1234567890
```

## 📱 PWA

### Probar PWA localmente
```bash
npm run build
npm run preview
```
Luego intenta instalar la app desde el navegador

### Verificar manifest
1. Abre DevTools (F12)
2. Ve a "Application" → "Manifest"
3. Verifica que nombre e íconos aparezcan correctamente

### Verificar Service Worker
1. Abre DevTools (F12)
2. Ve a "Application" → "Service Workers"
3. Deberías ver un service worker activo después de hacer build

## 🌐 Deploy

### Netlify (manual)
```bash
npm run build
# Arrastra la carpeta dist/ a netlify.com
```

### Vercel (CLI)
```bash
npm install -g vercel
npm run build
vercel --prod
```

### Firebase Hosting (si quieres usar Firebase para hosting también)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 📊 Estadísticas

### Ver tamaño del bundle
```bash
npm run build
```
Al final mostrará el tamaño de cada archivo

### Analizar dependencias
```bash
npx vite-bundle-visualizer
```

## 🔧 Git (si usas control de versiones)

### Inicializar repositorio
```bash
git init
git add .
git commit -m "Proyecto inicial - Pendientes del Hogar"
```

### Crear repositorio en GitHub
```bash
# Primero crea el repo en github.com, luego:
git remote add origin https://github.com/tu-usuario/pendientes-hogar.git
git branch -M main
git push -u origin main
```

## 💡 Tips

- **Hot Reload:** Los cambios se reflejan automáticamente al guardar archivos
- **Puerto ocupado:** Si el puerto 5173 está ocupado, Vite usará el siguiente disponible
- **CORS en producción:** Si tienes problemas de CORS, verifica las reglas de Firebase
- **Caché del navegador:** Usa Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows) para forzar recarga

## 🆘 Si algo no funciona

1. Verifica que Node.js esté instalado: `node --version`
2. Verifica que npm funcione: `npm --version`
3. Reinstala dependencias: `rm -rf node_modules && npm install`
4. Limpia caché: `rm -rf node_modules/.vite`
5. Verifica la configuración de Firebase en `src/firebase.js`
6. Revisa la consola del navegador (F12) para ver errores específicos
