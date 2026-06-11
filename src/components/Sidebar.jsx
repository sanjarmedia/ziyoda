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
  Moon,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import CowIcon from './CowIcon';

const navItems = [
  { to: '/dashboard', label: 'Boshqaruv paneli', icon: LayoutDashboard },
  { to: '/animals', label: 'Hayvonlar', icon: PawPrint },
  { to: '/feed-plans', label: "Ozuqa rejasi", icon: Wheat },
  { to: '/vet-records', label: 'Veterinar yozuvlar', icon: Stethoscope },
  { to: '/admin', label: 'Sozlamalar', icon: Settings },
];


const AVATAR_EMOJIS = ['👨‍🌾', '👩‍⚕️', '👨‍💼', '👩‍🌾', '👨‍⚕️', '👩‍💼', '🦁', '🐻', '🦊', '🐱'];

export default function Sidebar() {
  const navigate = useNavigate();
  const { currentUser, updateSelfProfile, logout } = useFarm();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  
  // Modal states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('👤');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [isUserHovered, setIsUserHovered] = useState(false);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Pre-fill profile form when modal opens
  useEffect(() => {
    if (currentUser && isProfileOpen) {
      setFullName(currentUser.fullName || '');
      setUsername(currentUser.username || '');
      setPassword(currentUser.password || '');
      setAvatar(currentUser.avatar || '👤');
      setError('');
      setSuccess(false);
    }
  }, [currentUser, isProfileOpen]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!fullName.trim() || !username.trim() || !password.trim()) {
      setError('Barcha maydonlarni toʻldiring!');
      return;
    }

    try {
      updateSelfProfile({
        fullName: fullName.trim(),
        username: username.trim(),
        password: password.trim(),
        avatar
      });
      setSuccess(true);
      setTimeout(() => {
        setIsProfileOpen(false);
        setSuccess(false);
      }, 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
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
            // Admin only item check
            if (item.to === '/admin' && currentUser?.role !== 'admin') {
              return null;
            }
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
          <div 
            className="sidebar-user"
            onClick={() => setIsProfileOpen(true)}
            onMouseEnter={() => setIsUserHovered(true)}
            onMouseLeave={() => setIsUserHovered(false)}
            style={{ 
              cursor: 'pointer', 
              transition: 'all 0.25s ease',
              borderColor: isUserHovered ? 'var(--border-glass-hover)' : 'var(--border-glass)',
              background: isUserHovered ? 'var(--bg-glass-hover)' : 'var(--bg-glass)',
              boxShadow: isUserHovered ? 'var(--shadow-glow)' : 'none',
              marginBottom: '12px'
            }}
            title="Profilni tahrirlash"
          >
            <div className="sidebar-user-avatar">{currentUser?.avatar || '👤'}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{currentUser?.fullName || 'Foydalanuvchi'}</div>
              <div className="sidebar-user-role">{currentUser?.role || 'role'}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Chiqish
          </button>
        </div>
      </aside>

      {/* Profile Edit Modal */}
      {isProfileOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(10, 15, 13, 0.75)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setIsProfileOpen(false)}
        >
          <div 
            className="glass-card animate-fade-in"
            style={{
              width: '90%',
              maxWidth: '450px',
              padding: '32px',
              position: 'relative',
              boxShadow: 'var(--shadow-lg), var(--shadow-glow-strong)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button 
              onClick={() => setIsProfileOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '3.5rem', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: 'var(--shadow-glow)' }}>
                {avatar}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Profilni tahrirlash</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Shaxsiy ma'lumotlaringizni yangilang</p>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {error && <div className="login-error">{error}</div>}
              {success && (
                <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: 'var(--green-light)', padding: '10px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', textAlign: 'center' }}>
                  Profil yangilandi!
                </div>
              )}

              {/* Avatar Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Avatar tanlang</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  {AVATAR_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setAvatar(emoji)}
                      style={{
                        fontSize: '1.5rem',
                        padding: '8px',
                        background: avatar === emoji ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-glass)',
                        border: avatar === emoji ? '1.5px solid var(--green-primary)' : '1px solid var(--border-glass)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div className="login-field">
                <label htmlFor="fullName">Toʻliq ism-sharf</label>
                <input
                  type="text"
                  id="fullName"
                  className="input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ism-sharfni kiriting"
                  required
                />
              </div>

              {/* Username */}
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

              {/* Password */}
              <div className="login-field">
                <label htmlFor="password">Parol</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Yangi parolni kiriting"
                    required
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsProfileOpen(false)}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

