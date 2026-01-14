# 📁 Assets de la PWA

Esta carpeta contiene los recursos necesarios para la Progressive Web App.

## 🔊 Sonido de notificación

**Archivo:** `notify.mp3`

- **Estado actual:** Archivo placeholder (vacío)
- **Qué hacer:** Reemplazarlo con un sonido MP3 real
- **Duración recomendada:** 1-2 segundos
- **Formato:** MP3
- **Volumen:** Normalizado, no muy alto

### Dónde conseguir sonidos gratis:

1. **Freesound.org**
   - https://freesound.org/search/?q=notification
   - Busca: "notification", "bell", "ding", "pop"
   - Descarga en MP3

2. **Zapsplat**
   - https://www.zapsplat.com/
   - Categoría: UI/Notification

3. **Notification Sounds**
   - https://notificationsounds.com/

4. **Usar sonido del sistema:**
   - En Mac: `/System/Library/Sounds/`
   - En Windows: `C:\Windows\Media\`
   - Convierte a MP3 si es necesario

## 🖼️ Íconos de la PWA

**Archivos:**
- `icon-192.png` - Ícono pequeño (192x192 px)
- `icon-512.png` - Ícono grande (512x512 px)

**Estado actual:** Archivos SVG placeholder

### Para crear íconos profesionales:

1. **Usar un generador online:**
   - https://www.pwabuilder.com/imageGenerator
   - Sube una imagen de 512x512 px
   - Descarga todos los tamaños

2. **Crear manualmente:**
   - Diseña un ícono de 512x512 px
   - Usa una herramienta como Photoshop, GIMP, Figma, etc.
   - Exporta en PNG con fondo transparente u opaco
   - Redimensiona a 192x192 para el ícono pequeño

3. **Usar el emoji de casa:**
   - Captura de pantalla del emoji 🏠 en grande
   - Recorta a cuadrado
   - Redimensiona a 512x512 y 192x192

### Requisitos de los íconos:

- **Formato:** PNG
- **Tamaños:** Exactamente 192x192 y 512x512 píxeles
- **Fondo:** Preferiblemente opaco (puede ser transparente)
- **Contenido:** Reconocible cuando se ve pequeño

## ✅ Checklist

- [ ] He reemplazado `notify.mp3` con un sonido real
- [ ] He probado que el sonido se reproduzca en el navegador
- [ ] He reemplazado `icon-192.png` con un ícono PNG de 192x192
- [ ] He reemplazado `icon-512.png` con un ícono PNG de 512x512
- [ ] Los íconos se ven bien en diferentes tamaños

## 🧪 Cómo probar

### Probar el sonido:
1. Abre la app en el navegador
2. Asegúrate de que el botón de sonido esté activado (🔔)
3. Agrega una tarea desde otro dispositivo o pestaña
4. Deberías escuchar el sonido

### Probar los íconos:
1. Abre DevTools (F12)
2. Ve a la pestaña "Application" (Chrome) o "Almacenamiento" (Firefox)
3. En "Manifest", verifica que los íconos aparezcan
4. Intenta instalar la PWA y verifica que el ícono se vea bien
