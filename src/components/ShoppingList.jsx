import { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, update, remove } from 'firebase/database';
import { database } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import './ShoppingList.css';

function ShoppingList({ username }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const isFirstLoad = useRef(true);
  const previousItemIds = useRef(new Set());

  useEffect(() => {
    // Referencia a los items de compras en Firebase
    const itemsRef = ref(database, 'shopping');

    // Escuchar cambios en tiempo real
    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const itemsArray = Object.entries(data).map(([id, item]) => ({
          id,
          ...item
        }));

        // Ordenar: no comprados primero, luego por timestamp
        itemsArray.sort((a, b) => {
          if (a.purchased === b.purchased) {
            return b.timestamp - a.timestamp;
          }
          return a.purchased ? 1 : -1;
        });

        // Solo actualizar IDs (sin sonido en compras)
        if (!isFirstLoad.current) {
          previousItemIds.current = new Set(itemsArray.map(i => i.id));
        } else {
          previousItemIds.current = new Set(itemsArray.map(i => i.id));
          isFirstLoad.current = false;
        }

        setItems(itemsArray);
      } else {
        setItems([]);
        previousItemIds.current = new Set();
      }
    });

    // Cleanup: desuscribirse cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      const itemsRef = ref(database, 'shopping');
      push(itemsRef, {
        text: newItem.trim(),
        addedBy: username,
        purchased: false,
        timestamp: Date.now()
      });
      setNewItem('');
    }
  };

  const handleToggleItem = (itemId, currentStatus) => {
    const itemRef = ref(database, `shopping/${itemId}`);
    update(itemRef, {
      purchased: !currentStatus,
      purchasedAt: !currentStatus ? Date.now() : null
    });
  };

  const handleDeleteItem = (itemId) => {
    const itemRef = ref(database, `shopping/${itemId}`);
    remove(itemRef);
  };

  // Contar items
  const pendingCount = items.filter(item => !item.purchased).length;
  const purchasedCount = items.filter(item => item.purchased).length;

  return (
    <div className="shopping-list">
      {/* Header de la lista */}
      <div className="shopping-header">
        <div className="shopping-stats">
          <div className="stat">
            <span className="stat-number">{pendingCount}</span>
            <span className="stat-label">Pendientes</span>
          </div>
          <div className="stat purchased">
            <span className="stat-number">{purchasedCount}</span>
            <span className="stat-label">Comprados</span>
          </div>
        </div>
      </div>

      {/* Formulario para agregar items */}
      <div className="add-item-container">
        <form onSubmit={handleAddItem} className="add-item-form">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="¿Qué necesitas comprar?"
            className="item-input"
          />
          <button type="submit" className="add-item-button">
            + Agregar
          </button>
        </form>
      </div>

      {/* Lista de items */}
      <div className="items-container">
        {items.length === 0 ? (
          <motion.div 
            className="empty-state-shopping"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>🛒 Lista vacía</p>
            <p className="empty-subtitle">¡Agrega items que necesites comprar!</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                className={`item-card ${item.purchased ? 'purchased' : ''}`}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="item-checkbox"
                  onClick={() => handleToggleItem(item.id, item.purchased)}
                >
                  <div className={`checkbox ${item.purchased ? 'checked' : ''}`}>
                    {item.purchased && '✓'}
                  </div>
                </div>

                <div 
                  className="item-content"
                  onClick={() => handleToggleItem(item.id, item.purchased)}
                >
                  <p className="item-text">{item.text}</p>
                  <div className="item-footer">
                    <span className="item-author">👤 {item.addedBy}</span>
                  </div>
                </div>

                <button 
                  className="delete-item-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                  title="Eliminar item"
                >
                  🗑️
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default ShoppingList;
