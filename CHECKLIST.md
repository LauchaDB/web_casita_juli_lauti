# ✅ Checklist de Configuración

Marca cada paso a medida que lo completas.

## 🔧 Configuración Inicial

### Paso 1: Firebase Realtime Database
- [ ] He creado un proyecto en Firebase Console
- [ ] He creado una Realtime Database en modo de prueba
- [ ] He obtenido las credenciales de configuración (firebaseConfig)
- [ ] He pegado las credenciales en `src/firebase.js`
- [ ] He verificado que `databaseURL` esté presente y sea correcto

### Paso 2: Assets (Sonido e Íconos)
- [ ] He reemplazado `public/notify.mp3` con un sonido real
- [ ] (Opcional) He reemplazado `public/icon-192.png` con un ícono personalizado
- [ ] (Opcional) He reemplazado `public/icon-512.png` con un ícono personalizado

### Paso 3: Primera Prueba Local
- [ ] He ejecutado `npm run dev`
- [ ] He abierto http://localhost:5174 en el navegador
- [ ] He ingresado mi nombre en la pantalla de login
- [ ] He agregado mi primera tarea
- [ ] La tarea aparece en pantalla

## 🧪 Pruebas de Funcionalidad

### Sincronización en Tiempo Real
- [ ] He abierto la app en dos pestañas/dispositivos diferentes
- [ ] He agregado una tarea desde un dispositivo
- [ ] La tarea apareció automáticamente en el otro dispositivo

### Persistencia de Login
- [ ] He ingresado mi nombre y cerrado el navegador
- [ ] He vuelto a abrir la app
- [ ] Sigo logueado sin necesidad de ingresar mi nombre nuevamente

### Sonido de Notificación
- [ ] He verificado que el sonido esté activado (🔔)
- [ ] He agregado una tarea desde otro dispositivo
- [ ] Escuché el sonido de notificación
- [ ] He probado el botón de silenciar (🔇)

### Eliminar Tareas
- [ ] He tocado/clickeado una tarea
- [ ] La tarea se eliminó con animación
- [ ] La eliminación se sincronizó en todos los dispositivos

### Animaciones
- [ ] Las tareas nuevas aparecen con animación suave
- [ ] Las tareas eliminadas desaparecen con animación
- [ ] Los botones tienen efectos hover

## 📱 Pruebas en Dispositivos

### Celular
- [ ] He abierto la app desde mi celular (misma red WiFi)
- [ ] La interfaz se ve correctamente en móvil
- [ ] Puedo agregar tareas desde el celular
- [ ] Las tareas se sincronizan con otros dispositivos

### Tablet
- [ ] He abierto la app desde una tablet
- [ ] El texto es legible a 2-3 metros de distancia
- [ ] Las tarjetas son lo suficientemente grandes
- [ ] La interfaz se ve moderna y clara

### PWA (Instalación)
- [ ] He instalado la app en la pantalla de inicio
- [ ] El ícono se ve bien en la pantalla de inicio
- [ ] La app se abre en modo standalone (sin barra del navegador)
- [ ] Funciona correctamente como app instalada

## 🚀 Deploy (Opcional)

### Preparación para Deploy
- [ ] He ejecutado `npm run build` sin errores
- [ ] He probado la versión de producción con `npm run preview`
- [ ] He verificado que todo funcione en la versión de producción

### Deploy en Plataforma
- [ ] He deployado en Netlify/Vercel/Firebase Hosting
- [ ] La app está accesible desde Internet
- [ ] Las tareas se sincronizan correctamente en producción
- [ ] La PWA funciona en el deploy

### Seguridad (Producción)
- [ ] He revisado las reglas de seguridad de Firebase
- [ ] (Opcional) He configurado reglas más estrictas para producción
- [ ] He verificado que no haya errores de permisos

## 🎨 Personalización (Opcional)

- [ ] He cambiado los colores del tema a mi gusto
- [ ] He personalizado el nombre de la app en el manifest
- [ ] He ajustado el tamaño de fuente para mi tablet específica
- [ ] He agregado íconos personalizados

## 📚 Documentación Leída

- [ ] He leído `INICIO.md`
- [ ] He leído `CONFIGURACION_RAPIDA.md`
- [ ] He consultado `README.md` para detalles
- [ ] Conozco los comandos en `COMANDOS_UTILES.md`

## ✨ Funcionalidad Extra (Ideas para el futuro)

- [ ] Categorías de tareas (urgente, normal, baja prioridad)
- [ ] Asignar tareas a personas específicas
- [ ] Marcar tareas como completadas en lugar de eliminarlas
- [ ] Histórico de tareas completadas
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Exportar tareas a PDF/CSV

---

## 🎊 Estado del Proyecto

**Tareas completadas:** ___ de 30 esenciales

**Estado general:**
- [ ] ⚙️ En configuración
- [ ] 🧪 En pruebas
- [ ] ✅ Funcionando localmente
- [ ] 🚀 Deployado en producción
- [ ] 🏆 100% completo y personalizado

---

### Notas Personales

_Espacio para tus notas, problemas encontrados, soluciones, etc._

```
Fecha de inicio: _______________

Problemas encontrados:
- 

Soluciones aplicadas:
- 

Personalizaciones realizadas:
- 

URL de producción: _______________

```

---

**¡Mucha suerte con tu proyecto! 🏠✨**
