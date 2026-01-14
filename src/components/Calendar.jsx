import { useState, useEffect } from 'react';
import { ref, push, onValue, remove } from 'firebase/database';
import { database } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import './Calendar.css';

function Calendar({ username }) {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'general',
    time: ''
  });

  const eventTypes = {
    birthday: { label: 'Cumpleaños', icon: '🎂', color: '#FF6B9D' },
    medical: { label: 'Médico', icon: '🏥', color: '#4ECDC4' },
    general: { label: 'General', icon: '📌', color: '#667eea' },
    important: { label: 'Importante', icon: '⭐', color: '#FFD93D' }
  };

  useEffect(() => {
    // Referencia a los eventos en Firebase
    const eventsRef = ref(database, 'calendar');

    // Escuchar cambios en tiempo real
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const eventsArray = Object.entries(data).map(([id, event]) => ({
          id,
          ...event
        }));
        setEvents(eventsArray);
      } else {
        setEvents([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Funciones de calendario
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const handleDayClick = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setShowEventModal(true);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEvent.title.trim() && selectedDate) {
      const eventsRef = ref(database, 'calendar');
      push(eventsRef, {
        title: newEvent.title.trim(),
        type: newEvent.type,
        time: newEvent.time,
        date: selectedDate,
        createdBy: username,
        timestamp: Date.now()
      });
      setNewEvent({ title: '', type: 'general', time: '' });
      setShowEventModal(false);
    }
  };

  const handleDeleteEvent = (eventId) => {
    const eventRef = ref(database, `calendar/${eventId}`);
    remove(eventRef);
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Espacios vacíos antes del primer día
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className="calendar-container">
      {/* Próximos eventos - ARRIBA */}
      <div className="upcoming-events">
        <h3>📌 Próximos Eventos</h3>
        <div className="events-list">
          {events
            .filter(event => {
              // Parsear fecha correctamente en hora local
              const eventDate = new Date(event.date + 'T00:00:00');
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return eventDate >= today;
            })
            .sort((a, b) => new Date(a.date + 'T00:00:00') - new Date(b.date + 'T00:00:00'))
            .slice(0, 5)
            .map(event => (
              <motion.div
                key={event.id}
                className="event-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="event-item-icon" style={{ backgroundColor: eventTypes[event.type].color }}>
                  {eventTypes[event.type].icon}
                </div>
                <div className="event-item-content">
                  <div className="event-item-title">{event.title}</div>
                  <div className="event-item-date">
                    {new Date(event.date + 'T00:00:00').toLocaleDateString('es-AR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                    {event.time && ` - ${event.time}`}
                  </div>
                </div>
                <button 
                  className="delete-event-btn"
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  🗑️
                </button>
              </motion.div>
            ))}
          {events.filter(event => {
            const eventDate = new Date(event.date + 'T00:00:00');
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return eventDate >= today;
          }).length === 0 && (
            <p className="no-events">No hay eventos próximos</p>
          )}
        </div>
      </div>

      {/* Header del calendario */}
      <div className="calendar-header">
        <h2 className="calendar-title">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="calendar-nav">
          <button onClick={goToPreviousMonth} className="nav-btn">◀</button>
          <button onClick={goToToday} className="today-btn">Hoy</button>
          <button onClick={goToNextMonth} className="nav-btn">▶</button>
        </div>
      </div>

      {/* Grid del calendario */}
      <div className="calendar-grid">
        {/* Nombres de los días */}
        {dayNames.map(day => (
          <div key={day} className="day-name">{day}</div>
        ))}

        {/* Días del mes */}
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="calendar-day empty"></div>;
          }

          const dayEvents = getEventsForDate(day);
          const isTodayDay = isToday(day);

          return (
            <motion.div
              key={day}
              className={`calendar-day ${isTodayDay ? 'today' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
              onClick={() => handleDayClick(day)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="day-number">{day}</div>
              <div className="day-events-in-cell">
                {dayEvents.slice(0, 2).map(event => (
                  <div 
                    key={event.id} 
                    className="event-in-cell"
                    style={{ 
                      backgroundColor: eventTypes[event.type].color,
                      color: 'white'
                    }}
                    title={event.title}
                  >
                    <span className="event-cell-icon">{eventTypes[event.type].icon}</span>
                    <span className="event-cell-title">{event.title}</span>
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="more-events-cell">+{dayEvents.length - 2} más</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal para agregar evento */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{getEventsForDate(new Date(selectedDate + 'T00:00:00').getDate()).length > 0 ? 'Eventos del día' : 'Agregar Evento'}</h3>
              <p className="modal-date">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-AR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>

              {/* Mostrar eventos existentes de este día PRIMERO */}
              {getEventsForDate(new Date(selectedDate + 'T00:00:00').getDate()).length > 0 && (
                <div className="day-events-list" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
                  <h4>Eventos ({getEventsForDate(new Date(selectedDate + 'T00:00:00').getDate()).length}):</h4>
                  {getEventsForDate(new Date(selectedDate + 'T00:00:00').getDate()).map(event => (
                    <div key={event.id} className="day-event-item">
                      <span style={{ color: eventTypes[event.type].color }}>
                        {eventTypes[event.type].icon}
                      </span>
                      <span>{event.title}</span>
                      {event.time && <span className="event-time">{event.time}</span>}
                      <button onClick={() => handleDeleteEvent(event.id)}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulario para agregar nuevo evento */}
              <div style={{ marginTop: getEventsForDate(new Date(selectedDate + 'T00:00:00').getDate()).length > 0 ? '20px' : '0', paddingTop: getEventsForDate(new Date(selectedDate + 'T00:00:00').getDate()).length > 0 ? '20px' : '0', borderTop: getEventsForDate(new Date(selectedDate + 'T00:00:00').getDate()).length > 0 ? '2px solid #f0f0f0' : 'none' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#333' }}>
                  {getEventsForDate(new Date(selectedDate + 'T00:00:00').getDate()).length > 0 ? 'Agregar otro evento:' : ''}
                </h4>
                <form onSubmit={handleAddEvent}>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Título del evento"
                    className="event-input"
                    autoFocus
                  />

                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="event-select"
                  >
                    {Object.entries(eventTypes).map(([key, type]) => (
                      <option key={key} value={key}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="event-input"
                    placeholder="Hora (opcional)"
                  />

                  <div className="modal-actions">
                    <button type="submit" className="btn-primary">Agregar</button>
                    <button 
                      type="button" 
                      onClick={() => setShowEventModal(false)}
                      className="btn-secondary"
                    >
                      {getEventsForDate(new Date(selectedDate + 'T00:00:00').getDate()).length > 0 ? 'Cerrar' : 'Cancelar'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Calendar;
