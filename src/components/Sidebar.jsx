import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PawPrint,
  Wheat,
  Stethoscope,
  Settings,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import CowIcon from './CowIcon';

const navItems = [
  { to: '/dashboard', label: 'Boshqaruv paneli', icon: LayoutDashboard },
  { to: '/animals', label: 'Hayvonlar', icon: PawPrint },
  { to: '/feed-plans', label: "Ozuqa rejasi", icon: Wheat },
  { to: '/vet-records', label: 'Veterinar yozuvlar', icon: Stethoscope },
  { to: '/admin', label: 'Sozlamalar', icon: Settings },
];

export default function Sidebar({ user, onLogout }) {
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

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Header / Logo with Theme Toggle */}
      <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <CowIcon size={28} />
          </div>
          <div className="sidebar-logo-text">
            <h1>Chorva Monitor</h1>
            <p>Monitoring platformasi</p>
          </div>
        </div>
        
        {/* Light / Dark Mode Button */}
        <button 
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-primary)',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            marginLeft: '8px',
            flexShrink: 0
          }}
          title={theme === 'light' ? "Tungi rejim" : "Kunduzgi rejim"}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="sidebar-icon" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{user?.avatar || '👤'}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.fullName || 'Foydalanuvchi'}</div>
            <div className="sidebar-user-role">{user?.role || 'role'}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          Chiqish
        </button>
      </div>
    </aside>
  );
}
