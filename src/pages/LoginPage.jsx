import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import CowIcon from '../components/CowIcon';

export default function LoginPage() {
  const { login, users } = useFarm();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-page">
      {/* Floating Theme Toggle in Top Right */}
      <button 
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(17, 25, 22, 0.85)',
          border: '1px solid var(--border-glass)',
          color: 'var(--text-primary)',
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          zIndex: 10
        }}
        title={theme === 'light' ? "Tungi rejim" : "Kunduzgi rejim"}
      >
        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
      </button>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <CowIcon size={36} />
            </div>
            <h1>Chorva Monitor</h1>
            <p>Tizimga kirish uchun maʼlumotlarni kiriting</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="login-error">{error}</div>}

            <div className="login-field">
              <label htmlFor="username">Foydalanuvchi nomi</label>
              <input
                type="text"
                id="username"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Foydalanuvchi nomini kiriting"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Parol</label>
              <input
                type="password"
                id="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolni kiriting"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary login-btn">
              Kirish
            </button>
          </form>

          <div className="login-demo">
            <h4>Demo foydalanuvchilar</h4>
            <p>Fermer:    fermer / fermer123</p>
            <p>Veterinar: veterinar / vet123</p>
            <p>Admin:     admin / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
