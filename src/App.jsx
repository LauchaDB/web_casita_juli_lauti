import { useState, useEffect } from 'react';
import Login from './components/Login';
import MainContainer from './components/MainContainer';

function App() {
  const [username, setUsername] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Al cargar la app, verificar si hay un usuario autenticado en localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUsername = localStorage.getItem('username');
    
    if (savedAuth === 'true' && savedUsername) {
      setIsAuthenticated(true);
      setUsername(savedUsername);
    }
  }, []);

  const handleLogin = (name) => {
    setIsAuthenticated(true);
    setUsername(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername(null);
  };

  return (
    <div className="App">
      {isAuthenticated && username ? (
        <MainContainer username={username} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
