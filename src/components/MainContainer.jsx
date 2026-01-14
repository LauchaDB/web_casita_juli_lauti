import { useState } from 'react';
import Navigation from './Navigation';
import TasksView from './TasksView';
import ShoppingList from './ShoppingList';
import Calendar from './Calendar';
import Notes from './Notes';
import './MainContainer.css';

function MainContainer({ username, onLogout }) {
  const [activeTab, setActiveTab] = useState('tasks');

  const renderContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <TasksView username={username} />;
      case 'shopping':
        return <ShoppingList username={username} />;
      case 'calendar':
        return <Calendar username={username} />;
      case 'notes':
        return <Notes username={username} />;
      default:
        return <TasksView username={username} />;
    }
  };

  return (
    <div className="main-container">
      {/* Header */}
      <div className="main-header">
        <div className="header-content-main">
          <div className="header-title">
            <h1><span className="emoji-icon">🏠</span> Casita</h1>
            <p className="header-subtitle">Av 9 de julio 2274</p>
          </div>
          <div className="header-actions">
            <div className="user-info">
              <span className="username">{username}</span>
              <button onClick={onLogout} className="logout-button">
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default MainContainer;
