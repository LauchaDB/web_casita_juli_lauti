import './Navigation.css';

function Navigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'tasks', label: 'Pendientes', icon: '📋' },
    { id: 'shopping', label: 'Compras', icon: '🛒' },
    { id: 'calendar', label: 'Calendario', icon: '📅' },
    { id: 'notes', label: 'Notas', icon: '📝' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
