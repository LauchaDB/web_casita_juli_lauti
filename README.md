# 🏠 Pendientes del Hogar

Web app de tablero de tareas del hogar con sincronización en tiempo real, pensada para uso doméstico en celulares y tablet fija.

## 🚀 Características

- ✅ **Sincronización en tiempo real** usando Firebase Realtime Database
- 🔐 **Login estático persistente** sin expiración (localStorage)
- 📱 **PWA instalable** en celulares y tablets
- 🎵 **Notificación sonora** cuando alguien agrega una tarea
- ✨ **Animaciones suaves** con Framer Motion
- 🎨 **Diseño moderno** optimizado para visualización a distancia en tablet
- 👥 **Multi-usuario** - se registra quién creó cada tarea

## 📋 Requisitos previos

- Node.js (versión 16 o superior)
- npm (viene con Node.js)
- Cuenta de Firebase (gratuita)

## 🛠️ Instalación paso a paso

### 1. Clonar o descargar el proyecto

Ya tienes el proyecto, así que salta este paso.

### 2. Instalar dependencias

Las dependencias ya están instaladas. Si necesitas reinstalarlas:

```bash
npm install
```

### 3. Configurar Firebase

#### 3.1. Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Ponle un nombre (ej: "pendientes-hogar")
4. Desactiva Google Analytics (no es necesario)
5. Haz clic en "Crear proyecto"

#### 3.2. Crear base de datos Realtime Database

1. En el menú lateral, ve a **Build** → **Realtime Database**
2. Haz clic en "Crear base de datos"
3. Elige una ubicación (ej: us-central1)
4. Selecciona "Comenzar en **modo de prueba**" (importante para desarrollo)
5. Haz clic en "Habilitar"

**IMPORTANTE:** En modo de prueba, la base de datos es pública. Para producción, configura reglas de seguridad.

#### 3.3. Obtener credenciales de Firebase

1. En Firebase Console, haz clic en el ícono de configuración (⚙️) → **Configuración del proyecto**
2. En la sección "Tus apps", haz clic en el ícono web `</>`
3. Registra la app con un nombre (ej: "pendientes-web")
4. **NO** marques "También configurar Firebase Hosting"
5. Haz clic en "Registrar app"
6. Copia el objeto `firebaseConfig` que aparece

#### 3.4. Configurar credenciales en el proyecto

1. Abre el archivo `src/firebase.js`
2. Reemplaza los valores placeholder con tus credenciales:

```javascript
const firebaseConfig = {
  apiKey: "tu-api-key-aqui",
  authDomain: "tu-proyecto.firebaseapp.com",
  databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com/",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

**IMPORTANTE:** Asegúrate de que `databaseURL` incluya tu región correcta.

### 4. Agregar sonido de notificación

El archivo `public/notify.mp3` está vacío. Necesitas reemplazarlo con un sonido corto (1-2 segundos).

**Opciones:**

- Descarga un sonido gratuito de [Freesound](https://freesound.org/) o [Zapsplat](https://www.zapsplat.com/)
- Usa un sonido de notificación del sistema
- Graba tu propio sonido

**Instrucciones:**

1. Descarga o crea un archivo de sonido MP3
2. Renómbralo a `notify.mp3`
3. Colócalo en la carpeta `public/`
4. Reemplaza el archivo existente

### 5. (Opcional) Personalizar íconos de la PWA

Los íconos actuales son placeholders SVG. Para mejores resultados:

1. Crea o descarga un ícono PNG de 512x512 píxeles
2. Usa una herramienta como [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator) para generar los tamaños
3. Reemplaza `public/icon-192.png` y `public/icon-512.png`

## 🎮 Correr el proyecto localmente

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo en `http://localhost:5173`

Abre esta URL en tu navegador y listo! 🎉

## 📱 Probar en dispositivos móviles

### En la misma red WiFi:

1. Asegúrate de que tu computadora y dispositivo móvil estén en la misma red WiFi
2. Ejecuta `npm run dev`
3. Busca la línea que dice "Network: http://192.168.x.x:5173"
4. Abre esa URL en tu celular o tablet

### Usando túnel (ngrok, LocalTunnel, etc.):

Si quieres probar desde fuera de tu red local, puedes usar servicios como ngrok.

## 🚀 Deploy en producción

### Opción 1: Netlify

1. Crea una cuenta en [Netlify](https://www.netlify.com/)
2. Conecta tu repositorio Git (o arrastra la carpeta `dist` después de hacer build)
3. Configuración:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy!

### Opción 2: Vercel

1. Crea una cuenta en [Vercel](https://vercel.com/)
2. Instala Vercel CLI: `npm install -g vercel`
3. Ejecuta: `vercel`
4. Sigue las instrucciones

### Construcción manual:

```bash
npm run build
```

Esto generará una carpeta `dist/` con todos los archivos optimizados para producción.

## 📱 Instalar como PWA

Una vez que la app esté corriendo:

### En Android/Chrome:
1. Abre la app en Chrome
2. Toca el menú (⋮) → "Agregar a pantalla de inicio"
3. Confirma

### En iOS/Safari:
1. Abre la app en Safari
2. Toca el botón de compartir
3. Selecciona "Agregar a pantalla de inicio"

### En escritorio:
1. Abre la app en Chrome/Edge
2. Mira el ícono de instalación en la barra de direcciones
3. Haz clic e instala

## 🔒 Reglas de seguridad de Firebase (importante para producción)

El proyecto usa modo de prueba, que permite lectura/escritura pública. Para producción, actualiza las reglas en Firebase Console:

```json
{
  "rules": {
    "tasks": {
      ".read": true,
      ".write": true
    }
  }
}
```

Para mayor seguridad (requiere autenticación):

```json
{
  "rules": {
    "tasks": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

Nota: La segunda opción requeriría implementar Firebase Auth, que no está en este proyecto por diseño.

## 🎨 Personalización

### Cambiar colores:

Los gradientes principales están en:
- `src/components/Login.css` - Gradiente de fondo del login
- `src/components/TaskBoard.css` - Gradiente de fondo del tablero
- Busca `#667eea` y `#764ba2` para cambiar los colores del tema

### Cambiar fuentes:

Edita `src/index.css` y cambia la propiedad `font-family`

### Cambiar tamaño de texto:

Ajusta los valores `font-size` en `src/components/TaskBoard.css` (especialmente en las media queries)

## 🐛 Solución de problemas

### El sonido no se reproduce:

- Asegúrate de que `public/notify.mp3` existe y es un archivo MP3 válido
- Verifica que el botón de sonido no esté en mute (🔇)
- En algunos navegadores, el sonido requiere interacción del usuario primero

### Las tareas no se sincronizan:

- Verifica que la configuración de Firebase en `src/firebase.js` sea correcta
- Asegúrate de que las reglas de la base de datos permitan lectura/escritura
- Revisa la consola del navegador para ver errores

### La PWA no se puede instalar:

- Asegúrate de estar usando HTTPS (o localhost)
- Verifica que los íconos existan en `public/`
- Revisa la consola del navegador para ver advertencias del manifest

### Errores de permisos en Firebase:

- Ve a Firebase Console → Realtime Database → Reglas
- Asegúrate de tener permisos de lectura/escritura habilitados

## 📚 Estructura del proyecto

```
web_casita_juli_lau/
├── public/
│   ├── icon-192.png          # Ícono PWA pequeño
│   ├── icon-512.png          # Ícono PWA grande
│   ├── icon.svg              # Ícono fuente (SVG)
│   └── notify.mp3            # Sonido de notificación
├── src/
│   ├── components/
│   │   ├── Login.jsx         # Componente de login
│   │   ├── Login.css         # Estilos del login
│   │   ├── TaskBoard.jsx     # Componente principal de tareas
│   │   └── TaskBoard.css     # Estilos del tablero
│   ├── App.jsx               # Componente raíz
│   ├── App.css               # Estilos globales de App
│   ├── firebase.js           # Configuración de Firebase
│   ├── index.css             # Estilos base
│   └── main.jsx              # Punto de entrada
├── index.html                # HTML principal
├── package.json              # Dependencias
├── vite.config.js            # Configuración de Vite + PWA
└── README.md                 # Este archivo
```

## 💡 Consejos de uso

- **Login persistente:** Una vez que ingresas tu nombre, quedas logueado incluso si cierras el navegador
- **Eliminar tareas:** Simplemente toca/haz clic en una tarea para eliminarla
- **Sonido:** Usa el botón 🔔/🔇 para activar/desactivar las notificaciones sonoras
- **Multi-dispositivo:** Abre la app en varios dispositivos y verás las tareas sincronizarse en tiempo real
- **Visualización en tablet:** El diseño está optimizado para verse bien a 2-3 metros de distancia

## 🤝 Créditos

- React + Vite
- Firebase Realtime Database
- Framer Motion
- vite-plugin-pwa

---

**¡Disfruta de tu tablero de tareas del hogar!** 🏠✨
