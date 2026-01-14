import { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, remove } from 'firebase/database';
import { database } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import WidgetBar from './WidgetBar';
import './TasksView.css';

function TasksView({ username }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const isFirstLoad = useRef(true);
  const previousTaskIds = useRef(new Set());

  useEffect(() => {
    // Referencia a las tareas en Firebase
    const tasksRef = ref(database, 'tasks');

    // Escuchar cambios en tiempo real
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tasksArray = Object.entries(data).map(([id, task]) => ({
          id,
          ...task
        }));

        // Ordenar por timestamp (más recientes primero)
        tasksArray.sort((a, b) => b.timestamp - a.timestamp);

        // Detectar si hay una tarea nueva (solo después de la carga inicial)
        if (!isFirstLoad.current) {
          const newTaskIds = new Set(tasksArray.map(t => t.id));
          const hasNewTask = tasksArray.some(t => !previousTaskIds.current.has(t.id));
          
          if (hasNewTask && !isMuted) {
            // Reproducir sonido de notificación
            if (audioRef.current) {
              audioRef.current.play().catch(err => {
                console.log('No se pudo reproducir el sonido:', err);
              });
            }
          }
          
          previousTaskIds.current = newTaskIds;
        } else {
          // En la primera carga, solo guardar los IDs existentes
          previousTaskIds.current = new Set(tasksArray.map(t => t.id));
          isFirstLoad.current = false;
        }

        setTasks(tasksArray);
      } else {
        setTasks([]);
        previousTaskIds.current = new Set();
      }
    });

    // Cleanup: desuscribirse cuando el componente se desmonte
    return () => unsubscribe();
  }, [isMuted]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const tasksRef = ref(database, 'tasks');
      push(tasksRef, {
        text: newTask.trim(),
        createdBy: username,
        timestamp: Date.now()
      });
      setNewTask('');
    }
  };

  const handleDeleteTask = (taskId) => {
    const taskRef = ref(database, `tasks/${taskId}`);
    remove(taskRef);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="tasks-view">
      {/* Audio element para el sonido de notificación */}
      <audio ref={audioRef} src="/notify.mp3" preload="auto" />

      {/* Widgets de información */}
      <div className="widgets-container-view">
        <WidgetBar />
      </div>

      {/* Formulario para agregar tareas */}
      <div className="add-task-container-view">
        <form onSubmit={handleAddTask} className="add-task-form-view">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="¿Qué hay que hacer?"
            className="task-input-view"
          />
          <button type="submit" className="add-button-view">
            + Agregar
          </button>
          <button 
            type="button"
            onClick={toggleMute} 
            className="mute-button-view"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? '🔇' : '🔔'}
          </button>
        </form>
      </div>

      {/* Lista de tareas */}
      <div className="tasks-container-view">
        {tasks.length === 0 ? (
          <motion.div 
            className="empty-state-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>✨ No hay tareas pendientes</p>
            <p className="empty-subtitle-view">¡Agrega una para empezar!</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                className="task-card-view"
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleDeleteTask(task.id)}
              >
                <div className="task-content-view">
                  <p className="task-text-view">{task.text}</p>
                  <div className="task-footer-view">
                    <span className="task-author-view">👤 {task.createdBy}</span>
                    <span className="task-time-view">
                      {new Date(task.timestamp).toLocaleString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <div className="delete-hint-view">Toca para eliminar</div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default TasksView;
