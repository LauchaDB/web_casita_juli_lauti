import { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, remove, update } from 'firebase/database';
import { database } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import WidgetBar from './WidgetBar';
import './TasksView.css';

function TasksView({ username, onLogout, onNavigate }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [deletedTask, setDeletedTask] = useState(null);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const audioRef = useRef(null);
  const isFirstLoad = useRef(true);
  const previousTaskIds = useRef(new Set());
  const clickTimeoutRef = useRef(null);
  const undoTimeoutRef = useRef(null);
  const tasksContainerRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

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
    // Guardar el pendiente antes de eliminarlo
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (taskToDelete) {
      setDeletedTask(taskToDelete);
      setShowUndoToast(true);
      
      // Eliminar de Firebase
      const taskRef = ref(database, `tasks/${taskId}`);
      remove(taskRef);
      
      // Ocultar el toast después de 5 segundos
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
      undoTimeoutRef.current = setTimeout(() => {
        setShowUndoToast(false);
        setDeletedTask(null);
      }, 5000);
    }
  };

  const handleUndoDelete = () => {
    if (deletedTask) {
      // Restaurar el pendiente en Firebase
      const tasksRef = ref(database, 'tasks');
      push(tasksRef, {
        text: deletedTask.text,
        createdBy: deletedTask.createdBy,
        timestamp: deletedTask.timestamp
      });
      
      // Limpiar el estado
      setShowUndoToast(false);
      setDeletedTask(null);
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task.id);
    setEditText(task.text);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editingTask) {
      const taskRef = ref(database, `tasks/${editingTask}`);
      update(taskRef, {
        text: editText.trim()
      });
      setEditingTask(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditText('');
  };

  const handleCardClick = (task) => {
    // Si ya hay un click pendiente, es un doble click = eliminar
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      handleDeleteTask(task.id);
    } else {
      // Primer click = editar (después de 250ms)
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
        handleEditTask(task);
      }, 250);
    }
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter para enviar el formulario
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleAddTask(e);
    }
  };

  const handleEditKeyDown = (e) => {
    // Ctrl/Cmd + Enter para guardar la edición
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    }
    // Escape para cancelar
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Ajustar el tamaño de las cards en el grid
  useEffect(() => {
    const resizeGridItems = () => {
      const grid = tasksContainerRef.current;
      if (!grid) return;

      const rowHeight = 10; // grid-auto-rows
      const rowGap = 24; // gap entre filas

      const cards = grid.querySelectorAll('.task-card-view');
      cards.forEach((card) => {
        const cardHeight = card.getBoundingClientRect().height;
        const rowSpan = Math.ceil((cardHeight + rowGap) / (rowHeight + rowGap));
        card.style.setProperty('--row-span', rowSpan);
      });
    };

    // Ejecutar al cargar y cuando cambien las tareas
    resizeGridItems();

    // Ejecutar después de un pequeño delay para asegurar que el DOM esté listo
    const timeoutId = setTimeout(resizeGridItems, 100);

    // Observer para detectar cambios en el tamaño
    const resizeObserver = new ResizeObserver(resizeGridItems);
    if (tasksContainerRef.current) {
      resizeObserver.observe(tasksContainerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [tasks]);

  // Auto-scroll después de 1 minuto de inactividad
  useEffect(() => {
    const startAutoScroll = () => {
      setIsAutoScrolling(true);
      let scrollSpeed = 1; // pixels por frame

      autoScrollIntervalRef.current = setInterval(() => {
        if (tasksContainerRef.current) {
          const container = tasksContainerRef.current;
          const maxScroll = container.scrollHeight - container.clientHeight;
          
          // Si llegamos al final, volver al inicio
          if (container.scrollTop >= maxScroll - 10) {
            container.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ top: scrollSpeed, behavior: 'auto' });
          }
        }
      }, 30); // 30ms = ~33 fps
    };

    const stopAutoScroll = () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
      setIsAutoScrolling(false);
    };

    const resetInactivityTimer = () => {
      // Detener auto-scroll si está activo
      stopAutoScroll();

      // Limpiar timer anterior
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      // Iniciar nuevo timer de 1 minuto
      inactivityTimerRef.current = setTimeout(() => {
        startAutoScroll();
      }, 60000); // 60 segundos
    };

    // Eventos que indican actividad
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Agregar listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });

    // Iniciar el timer por primera vez
    resetInactivityTimer();

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      stopAutoScroll();
    };
  }, []);

  return (
    <div className="tasks-view">
      {/* Audio element para el sonido de notificación */}
      <audio ref={audioRef} src="/notify.mp3" preload="auto" />

      {/* Columna principal (izquierda) */}
      <div className="tasks-main-column">
        {/* Indicador de auto-scroll */}
        {isAutoScrolling && (
          <div className="auto-scroll-indicator">
            ⏱️ Modo visualización activo
          </div>
        )}

        {/* Formulario para agregar tareas */}
        <div className="add-task-container-view">
        <form onSubmit={handleAddTask} className="add-task-form-view">
          <textarea
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="¿Qué hay que hacer? (Ctrl+Enter para agregar)"
            className="task-textarea-view"
            rows="3"
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
      <div className="tasks-container-view" ref={tasksContainerRef}>
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
                className={`task-card-view ${editingTask === task.id ? 'editing' : ''}`}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={() => editingTask !== task.id && handleCardClick(task)}
              >
                <div className="task-content-view">
                  {editingTask === task.id ? (
                    // Modo edición
                    <div className="task-edit-container">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        className="task-edit-textarea"
                        autoFocus
                        rows="3"
                      />
                      <div className="task-edit-actions">
                        <button 
                          onClick={handleSaveEdit}
                          className="btn-save-edit"
                          title="Ctrl+Enter para guardar"
                        >
                          ✅ Guardar
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="btn-cancel-edit"
                          title="Esc para cancelar"
                        >
                          ❌ Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Modo visualización
                    <>
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
                    </>
                  )}
                </div>
                {editingTask !== task.id && (
                  <div className="action-hint-view">
                    <span className="hint-edit">1 click: Editar</span>
                    <span className="hint-delete">2 clicks: Eliminar</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      </div>

      {/* Columna sidebar (derecha) */}
      <div className="tasks-sidebar-column">
        <WidgetBar username={username} onLogout={onLogout} onNavigate={onNavigate} />
      </div>

      {/* Toast de deshacer */}
      <AnimatePresence>
        {showUndoToast && (
          <motion.div
            className="undo-toast"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <span className="undo-message">✅ Pendiente eliminado</span>
            <button 
              onClick={handleUndoDelete}
              className="undo-button"
            >
              ↶ Deshacer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TasksView;
