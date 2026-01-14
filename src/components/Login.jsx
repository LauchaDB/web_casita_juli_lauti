import { useState } from 'react';
import { motion } from 'framer-motion';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // ⚠️ CREDENCIALES ESTÁTICAS - Cambia estos valores por los que quieras
  const VALID_USERNAME = 'familia';
  const VALID_PASSWORD = 'casita2026';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validar que todos los campos estén completos
    if (!username.trim() || !password.trim() || !name.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Verificar usuario y contraseña
    if (username.trim() !== VALID_USERNAME || password.trim() !== VALID_PASSWORD) {
      setError('Usuario o contraseña incorrectos');
      return;
    }

    // Login exitoso
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', name.trim());
    onLogin(name.trim());
  };

  return (
    <div className="login-container">
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>🏠 Casita</h1>
        <p>Ingresa las credenciales de la familia</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario"
            autoFocus
            className="login-input"
            autoComplete="username"
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="login-input"
            autoComplete="current-password"
          />
          
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="login-input"
          />

          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
          
          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
