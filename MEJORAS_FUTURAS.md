# 🚀 Mejoras Futuras

Ideas y snippets de código para expandir la funcionalidad de tu app.

## 💡 Ideas de Funcionalidades

### 1. Categorías de Tareas

Agregar colores o etiquetas a las tareas:
- 🔴 Urgente
- 🟡 Normal
- 🟢 Baja prioridad

### 2. Asignar Tareas a Personas

En lugar de solo guardar quién creó la tarea, permitir asignarla a alguien.

### 3. Completar en Lugar de Eliminar

- Marcar tareas como completadas
- Mostrar tareas completadas con estilo diferente
- Opción para ver/ocultar completadas

### 4. Subtareas o Checklist

Permitir que cada tarea tenga una lista de pasos.

### 5. Fechas y Recordatorios

- Agregar fecha límite a las tareas
- Notificaciones cuando se acerca la fecha
- Vista de calendario

### 6. Modo Oscuro

Toggle para cambiar entre tema claro y oscuro.

### 7. Filtros y Búsqueda

- Buscar tareas por texto
- Filtrar por persona que la creó
- Ordenar por fecha, prioridad, etc.

### 8. Historial

Ver tareas eliminadas/completadas en los últimos 7 días.

---

## 🔧 Snippets de Código Útiles

### Agregar Categoría a las Tareas

**En TaskBoard.jsx:**

```javascript
// Al crear tarea
const handleAddTask = (e) => {
  e.preventDefault();
  if (newTask.trim()) {
    const tasksRef = ref(database, 'tasks');
    push(tasksRef, {
      text: newTask.trim(),
      createdBy: username,
      timestamp: Date.now(),
      category: selectedCategory, // 'urgent', 'normal', 'low'
    });
    setNewTask('');
  }
};

// Colores según categoría
const getCategoryColor = (category) => {
  const colors = {
    urgent: '#ff6b6b',
    normal: '#ffd93d',
    low: '#6bcf7f'
  };
  return colors[category] || colors.normal;
};
```

### Marcar como Completada en Lugar de Eliminar

**En TaskBoard.jsx:**

```javascript
import { ref, push, onValue, update } from 'firebase/database';

const handleToggleComplete = (taskId, currentStatus) => {
  const taskRef = ref(database, `tasks/${taskId}`);
  update(taskRef, {
    completed: !currentStatus,
    completedAt: Date.now()
  });
};

// En el JSX
<motion.div
  className={`task-card ${task.completed ? 'completed' : ''}`}
  onClick={() => handleToggleComplete(task.id, task.completed)}
>
  {/* contenido */}
</motion.div>
```

**En TaskBoard.css:**

```css
.task-card.completed {
  opacity: 0.6;
  background: #f0f0f0;
}

.task-card.completed .task-text {
  text-decoration: line-through;
  color: #999;
}
```

### Modo Oscuro

**Agregar estado en App.jsx:**

```javascript
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  const savedTheme = localStorage.getItem('darkMode');
  if (savedTheme === 'true') {
    setDarkMode(true);
    document.body.classList.add('dark-mode');
  }
}, []);

const toggleDarkMode = () => {
  const newMode = !darkMode;
  setDarkMode(newMode);
  localStorage.setItem('darkMode', newMode);
  document.body.classList.toggle('dark-mode');
};
```

**En index.css:**

```css
body.dark-mode {
  background: #1a1a2e;
  color: #eee;
}

body.dark-mode .task-board {
  background: linear-gradient(135deg, #2d2d44 0%, #1a1a2e 100%);
}

body.dark-mode .task-card {
  background: #16213e;
  color: #eee;
}

body.dark-mode .header {
  background: #16213e;
}
```

### Filtro y Búsqueda

**En TaskBoard.jsx:**

```javascript
const [searchTerm, setSearchTerm] = useState('');
const [filterUser, setFilterUser] = useState('all');

// Filtrar tareas
const filteredTasks = tasks.filter(task => {
  const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesUser = filterUser === 'all' || task.createdBy === filterUser;
  return matchesSearch && matchesUser;
});

// En el JSX
<div className="filters">
  <input
    type="search"
    placeholder="Buscar tarea..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
  />
  
  <select 
    value={filterUser} 
    onChange={(e) => setFilterUser(e.target.value)}
    className="filter-select"
  >
    <option value="all">Todos</option>
    <option value="Juan">Juan</option>
    <option value="María">María</option>
  </select>
</div>
```

### Agregar Fecha Límite

**En TaskBoard.jsx:**

```javascript
const [taskDeadline, setTaskDeadline] = useState('');

const handleAddTask = (e) => {
  e.preventDefault();
  if (newTask.trim()) {
    const tasksRef = ref(database, 'tasks');
    push(tasksRef, {
      text: newTask.trim(),
      createdBy: username,
      timestamp: Date.now(),
      deadline: taskDeadline ? new Date(taskDeadline).getTime() : null
    });
    setNewTask('');
    setTaskDeadline('');
  }
};

// En el JSX del formulario
<input
  type="datetime-local"
  value={taskDeadline}
  onChange={(e) => setTaskDeadline(e.target.value)}
  className="deadline-input"
/>
```

### Notificaciones Push (PWA)

**Crear nuevo archivo: src/notifications.js**

```javascript
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const showNotification = (title, body) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png'
    });
  }
};
```

**Usar en TaskBoard.jsx:**

```javascript
import { requestNotificationPermission, showNotification } from '../notifications';

// Al detectar nueva tarea
if (hasNewTask) {
  showNotification('Nueva tarea', tasksArray[0].text);
}
```

### Exportar Tareas a JSON

**En TaskBoard.jsx:**

```javascript
const exportTasks = () => {
  const dataStr = JSON.stringify(tasks, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tareas-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};

// Botón en el JSX
<button onClick={exportTasks} className="export-button">
  📥 Exportar
</button>
```

---

## 🎨 Mejoras de UI/UX

### 1. Confirmación al Eliminar

```javascript
const handleDeleteTask = (taskId, taskText) => {
  if (confirm(`¿Eliminar "${taskText}"?`)) {
    const taskRef = ref(database, `tasks/${taskId}`);
    remove(taskRef);
  }
};
```

### 2. Animación de Confetti al Completar

Instalar librería:
```bash
npm install canvas-confetti
```

Usar:
```javascript
import confetti from 'canvas-confetti';

const handleCompleteTask = (taskId) => {
  // ... marcar como completada
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};
```

### 3. Drag and Drop para Reordenar

Instalar:
```bash
npm install react-beautiful-dnd
```

### 4. Indicador de "Alguien está escribiendo..."

```javascript
import { ref, set, onValue } from 'firebase/database';

const handleInputChange = (e) => {
  setNewTask(e.target.value);
  
  // Indicar que estás escribiendo
  const typingRef = ref(database, `typing/${username}`);
  set(typingRef, true);
  
  // Limpiar después de 3 segundos
  setTimeout(() => set(typingRef, false), 3000);
};
```

---

## 🔒 Mejoras de Seguridad para Producción

### Reglas de Firebase más Estrictas

```json
{
  "rules": {
    "tasks": {
      ".read": true,
      ".write": true,
      "$taskId": {
        ".validate": "newData.hasChildren(['text', 'createdBy', 'timestamp'])",
        "text": {
          ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 500"
        },
        "createdBy": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },
        "timestamp": {
          ".validate": "newData.isNumber()"
        }
      }
    }
  }
}
```

### Validación en el Cliente

```javascript
const validateTask = (text) => {
  if (!text || text.trim().length === 0) {
    alert('La tarea no puede estar vacía');
    return false;
  }
  if (text.length > 500) {
    alert('La tarea es demasiado larga (máximo 500 caracteres)');
    return false;
  }
  return true;
};
```

---

## 📊 Analytics y Métricas

### Agregar Google Analytics

```bash
npm install firebase
```

```javascript
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics(app);

// Registrar eventos
logEvent(analytics, 'task_created');
logEvent(analytics, 'task_deleted');
logEvent(analytics, 'user_login', { username });
```

---

## 🧩 Componentes Reutilizables

### Crear componente de Tarea Individual

**src/components/TaskCard.jsx:**

```javascript
import { motion } from 'framer-motion';
import './TaskCard.css';

function TaskCard({ task, onDelete }) {
  return (
    <motion.div
      className="task-card"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      onClick={() => onDelete(task.id)}
    >
      <p className="task-text">{task.text}</p>
      <div className="task-footer">
        <span className="task-author">👤 {task.createdBy}</span>
        <span className="task-time">
          {new Date(task.timestamp).toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
}

export default TaskCard;
```

---

## 🎯 Próximos Pasos Sugeridos

1. **Corto plazo (1-2 horas):**
   - Agregar categorías con colores
   - Implementar modo oscuro
   - Agregar confirmación al eliminar

2. **Medio plazo (1 día):**
   - Marcar como completadas en lugar de eliminar
   - Agregar filtros y búsqueda
   - Implementar fechas límite

3. **Largo plazo (varios días):**
   - Notificaciones push
   - Historial de tareas
   - Estadísticas y métricas

---

**¡Diviértete mejorando tu app! 🚀**
