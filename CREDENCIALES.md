# 🔐 Credenciales de Acceso

## 🔑 Credenciales Actuales

**Usuario:** `familia`  
**Contraseña:** `casita2026`

---

## ✏️ Cómo Cambiar las Credenciales

### Paso 1: Abre el archivo de Login

Abre el archivo: `src/components/Login.jsx`

### Paso 2: Busca estas líneas (cerca de la línea 10)

```javascript
// ⚠️ CREDENCIALES ESTÁTICAS - Cambia estos valores por los que quieras
const VALID_USERNAME = 'familia';
const VALID_PASSWORD = 'casita2026';
```

### Paso 3: Cambia los valores

Reemplaza `'familia'` y `'casita2024'` por tus propias credenciales:

```javascript
const VALID_USERNAME = 'miusuario';
const VALID_PASSWORD = 'micontraseña123';
```

### Paso 4: Guarda el archivo

Presiona `Cmd+S` (Mac) o `Ctrl+S` (Windows/Linux)

### Paso 5: Recarga el navegador

Presiona `F5` o `Cmd+R` para ver los cambios

---

## 🔒 Recomendaciones de Contraseña

Para uso doméstico, puedes usar algo simple y memorable:

**Ejemplos:**
- Usuario: `casa`, Contraseña: `hogar2024`
- Usuario: `familia`, Contraseña: `pendientes123`
- Usuario: `hogar`, Contraseña: `tareas2024`

---

## 👥 Cómo Funciona el Sistema

### Login
1. **Todos usan las mismas credenciales** (usuario y contraseña)
2. Después de ingresar correctamente, cada persona escribe **su nombre**
3. Ese nombre se usa para identificar quién creó cada tarea

### Ejemplo de Uso:
- **Julio** ingresa: `familia` / `casita2024` → luego escribe "Julio"
- **Lautaro** ingresa: `familia` / `casita2024` → luego escribe "Lautaro"
- Las tareas mostrarán quién las creó (Julio o Lautaro)

### Persistencia:
- Una vez que ingresas correctamente, **quedas logueado**
- Puedes cerrar el navegador y volver a abrir la app
- No necesitas volver a ingresar las credenciales
- Solo necesitas volver a ingresar si haces clic en "Salir"

---

## 🚨 Cerrar Sesión

Para cerrar sesión:
1. Haz clic en el botón **"Salir"** (esquina superior derecha)
2. Te llevará de vuelta a la pantalla de login
3. Se borrarán las credenciales guardadas
4. Deberás volver a ingresar usuario y contraseña

---

## 🔐 Seguridad

### ⚠️ Importante:
- Las credenciales están **hardcodeadas** en el código
- **NO es seguro para producción** si la app es pública
- **Es perfecto para uso doméstico/familiar** en red local
- Si subes la app a Internet, cualquiera que vea el código puede ver las credenciales

### Para Mayor Seguridad:
Si quieres mayor seguridad (no necesario para uso doméstico):
1. Implementa Firebase Auth real (más complejo)
2. Usa variables de entorno
3. Implementa un backend con autenticación

**Para uso familiar en casa: el sistema actual es suficiente** ✅

---

## 🐛 Problemas Comunes

### "Usuario o contraseña incorrectos"
- Verifica que estés usando las credenciales correctas
- Revisa que no haya espacios extra
- Las credenciales distinguen mayúsculas y minúsculas

### Quedé bloqueado y no sé las credenciales
- Abre `src/components/Login.jsx`
- Busca las líneas con `VALID_USERNAME` y `VALID_PASSWORD`
- Ahí verás las credenciales actuales

### Quiero resetear todo
```bash
# Limpia el localStorage del navegador
# Opción 1: Haz clic en "Salir" en la app

# Opción 2: Desde DevTools
# F12 → Console → ejecuta:
localStorage.clear()
```

---

## 💡 Ocultar el Hint de Credenciales

Por defecto, la pantalla de login muestra las credenciales como ayuda.

**Para ocultarlas:**

1. Abre `src/components/Login.jsx`
2. Busca esta sección (cerca del final):

```javascript
<div className="login-hint">
  <p>💡 Credenciales actuales:</p>
  <p><strong>Usuario:</strong> {VALID_USERNAME}</p>
  <p><strong>Contraseña:</strong> {VALID_PASSWORD}</p>
  <p className="hint-small">Puedes cambiarlas en el código</p>
</div>
```

3. **Elimina todo ese bloque** o coméntalo:

```javascript
{/* 
<div className="login-hint">
  ...
</div>
*/}
```

4. Guarda y recarga

Ahora la pantalla de login no mostrará las credenciales.

---

## 📝 Resumen

| Acción | Cómo |
|--------|------|
| Ver credenciales actuales | Abre `src/components/Login.jsx` líneas ~10 |
| Cambiar credenciales | Modifica `VALID_USERNAME` y `VALID_PASSWORD` |
| Cerrar sesión | Botón "Salir" en la app |
| Ocultar hint | Elimina el bloque `login-hint` |
| Resetear todo | `localStorage.clear()` en consola |

---

**Las credenciales actuales son:**
- **Usuario:** `familia`
- **Contraseña:** `casita2026`

**¿Quieres cambiarlas?** Sigue las instrucciones arriba. 😊
