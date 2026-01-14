import { useState, useEffect } from 'react';
import { ref, push, onValue, update, remove } from 'firebase/database';
import { database } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import './Notes.css';

function Notes({ username }) {
  const [notes, setNotes] = useState([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'general'
  });

  const categories = {
    password: { label: 'Contraseñas', icon: '🔐', color: '#FF6B9D' },
    contact: { label: 'Contactos', icon: '📞', color: '#4ECDC4' },
    wifi: { label: 'WiFi', icon: '📶', color: '#FFD93D' },
    service: { label: 'Servicios', icon: '🔧', color: '#9B59B6' },
    general: { label: 'General', icon: '📝', color: '#667eea' }
  };

  useEffect(() => {
    // Referencia a las notas en Firebase
    const notesRef = ref(database, 'notes');

    // Escuchar cambios en tiempo real
    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notesArray = Object.entries(data).map(([id, note]) => ({
          id,
          ...note
        }));
        // Ordenar por timestamp (más recientes primero)
        notesArray.sort((a, b) => b.timestamp - a.timestamp);
        setNotes(notesArray);
      } else {
        setNotes([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (newNote.title.trim() && newNote.content.trim()) {
      if (editingNote) {
        // Editar nota existente
        const noteRef = ref(database, `notes/${editingNote.id}`);
        update(noteRef, {
          title: newNote.title.trim(),
          content: newNote.content.trim(),
          category: newNote.category,
          editedBy: username,
          editedAt: Date.now()
        });
      } else {
        // Agregar nueva nota
        const notesRef = ref(database, 'notes');
        push(notesRef, {
          title: newNote.title.trim(),
          content: newNote.content.trim(),
          category: newNote.category,
          createdBy: username,
          timestamp: Date.now()
        });
      }
      setNewNote({ title: '', content: '', category: 'general' });
      setEditingNote(null);
      setShowNoteModal(false);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category
    });
    setShowNoteModal(true);
  };

  const handleDeleteNote = (noteId) => {
    if (confirm('¿Eliminar esta nota?')) {
      const noteRef = ref(database, `notes/${noteId}`);
      remove(noteRef);
    }
  };

  const handleCancelEdit = () => {
    setNewNote({ title: '', content: '', category: 'general' });
    setEditingNote(null);
    setShowNoteModal(false);
  };

  const filteredNotes = filterCategory === 'all' 
    ? notes 
    : notes.filter(note => note.category === filterCategory);

  const notesByCategory = Object.keys(categories).reduce((acc, cat) => {
    acc[cat] = notes.filter(note => note.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="notes-container">
      {/* Header con filtros y botón agregar */}
      <div className="notes-header">
        <div className="notes-filters">
          <button
            className={`filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            📋 Todas ({notes.length})
          </button>
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              className={`filter-btn ${filterCategory === key ? 'active' : ''}`}
              onClick={() => setFilterCategory(key)}
              style={{
                borderColor: filterCategory === key ? cat.color : 'transparent'
              }}
            >
              {cat.icon} {cat.label} ({notesByCategory[key] || 0})
            </button>
          ))}
        </div>
        <button 
          className="add-note-btn"
          onClick={() => setShowNoteModal(true)}
        >
          + Nueva Nota
        </button>
      </div>

      {/* Grid de notas */}
      <div className="notes-grid">
        {filteredNotes.length === 0 ? (
          <motion.div 
            className="empty-notes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>📝 No hay notas</p>
            <p className="empty-subtitle">
              {filterCategory === 'all' 
                ? '¡Agrega la primera nota!' 
                : `No hay notas de ${categories[filterCategory].label}`}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                className="note-card"
                style={{ borderTopColor: categories[note.category].color }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="note-category">
                  <span style={{ color: categories[note.category].color }}>
                    {categories[note.category].icon} {categories[note.category].label}
                  </span>
                </div>
                <h3 className="note-title">{note.title}</h3>
                <p className="note-content">{note.content}</p>
                <div className="note-footer">
                  <span className="note-author">
                    👤 {note.editedBy || note.createdBy}
                  </span>
                  <div className="note-actions">
                    <button 
                      onClick={() => handleEditNote(note)}
                      className="note-btn edit"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      className="note-btn delete"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Modal para agregar/editar nota */}
      <AnimatePresence>
        {showNoteModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelEdit}
          >
            <motion.div
              className="modal-content-notes"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{editingNote ? 'Editar Nota' : 'Nueva Nota'}</h3>

              <form onSubmit={handleAddNote}>
                <select
                  value={newNote.category}
                  onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                  className="note-select"
                >
                  {Object.entries(categories).map(([key, cat]) => (
                    <option key={key} value={key}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Título de la nota"
                  className="note-input"
                  autoFocus
                  required
                />

                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="Contenido de la nota..."
                  className="note-textarea"
                  rows="6"
                  required
                />

                <div className="modal-actions">
                  <button type="submit" className="btn-primary">
                    {editingNote ? 'Guardar' : 'Agregar'}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Notes;
