import React, { useState } from 'react';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { useFarm } from '../context/FarmContext';

const AVATARS = ['👨‍🌾', '👩‍⚕️', '👨‍💼', '👩‍🌾', '👨‍⚕️', '👩‍💼', '👤', '👦', '👧', '🦁'];

export default function AdminPage() {
  const { users, addUser, updateUser, deleteUser, currentUser } = useFarm();
  const [backupAuto, setBackupAuto] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [syncInterval, setSyncInterval] = useState('5');
  const [saved, setSaved] = useState(false);

  // User CRUD states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('fermer');
  const [avatar, setAvatar] = useState('👨‍🌾');
  const [error, setError] = useState('');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-sick'; // red/pink tone
      case 'veterinar':
        return 'badge-treating'; // blue tone
      case 'fermer':
        return 'badge-healthy'; // green tone
      default:
        return 'badge-healthy';
    }
  };

  const handleEditUserClick = (user) => {
    setError('');
    setEditMode(true);
    setSelectedUserId(user.id);
    setFullName(user.fullName || '');
    setUsername(user.username || '');
    setPassword(user.password || '');
    setRole(user.role || 'fermer');
    setAvatar(user.avatar || '👨‍🌾');
    setIsUserModalOpen(true);
  };

  const handleDeleteUserClick = (id) => {
    if (window.confirm('Haqiqatan ham bu foydalanuvchini oʻchirib yubormoqchimisiz?')) {
      try {
        deleteUser(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !username.trim() || !password.trim()) {
      setError('Barcha maydonlarni toʻldiring!');
      return;
    }

    try {
      if (editMode) {
        await updateUser(selectedUserId, {
          fullName: fullName.trim(),
          username: username.trim(),
          password: password.trim(),
          role,
          avatar
        });
      } else {
        await addUser({
          fullName: fullName.trim(),
          username: username.trim(),
          password: password.trim(),
          role,
          avatar
        });
      }
      setIsUserModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header" style={{ marginBottom: '24px' }}>
        <h2>Tizim sozlamalari va Admin panel</h2>
        <p>Tizim foydalanuvchilarini boshqarish, server holati va avtomatlashtirish parametrlari</p>
      </header>

      {/* Users Management Grid */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
        Foydalanuvchilar va Rollar
      </h3>
      <section className="admin-users-grid" style={{ marginBottom: '32px' }}>
        {users.map((user) => (
          <div key={user.id} className="glass-card admin-user-card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="admin-user-avatar">{user.avatar}</div>
              <h4>{user.fullName}</h4>
              <p style={{ marginTop: '2px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Logini: <strong>@{user.username}</strong>
              </p>
            </div>
            
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`badge ${getRoleBadge(user.role)}`}>
                {user.role}
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleEditUserClick(user)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                  title="Tahrirlash"
                >
                  <Edit size={14} />
                </button>
                {currentUser?.id !== user.id && (
                  <button 
                    onClick={() => handleDeleteUserClick(user.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                    title="Oʻchirish"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add User Button Card */}
        <div 
          className="glass-card admin-user-card" 
          onClick={() => {
            setError('');
            setEditMode(false);
            setFullName('');
            setUsername('');
            setPassword('');
            setRole('fermer');
            setAvatar('👨‍🌾');
            setIsUserModalOpen(true);
          }}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderStyle: 'dashed', 
            borderColor: 'var(--border-glass)', 
            cursor: 'pointer',
            minHeight: '165px',
            transition: 'all 0.25s',
            background: 'rgba(34, 197, 94, 0.02)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-glass-hover)';
            e.currentTarget.style.background = 'var(--bg-glass-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-glass)';
            e.currentTarget.style.background = 'rgba(34, 197, 94, 0.02)';
          }}
        >
          <Plus size={28} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Foydalanuvchi qoʻshish</span>
        </div>
      </section>

      {/* Settings & Server Health Grid */}
      <div className="detail-grid">
        {/* Settings Form */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
            Tizim konfiguratsiyasi
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Toggle 1 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Avtomatik zaxira nusxalash (Backup)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Har 24 soatda ma'lumotlar bazasining zaxira nusxasini saqlash</div>
              </div>
              <input 
                type="checkbox" 
                checked={backupAuto}
                onChange={(e) => setBackupAuto(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--green-primary)', cursor: 'pointer' }}
              />
            </div>

            {/* Toggle 2 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Tibbiy ogohlantirish xabarlari</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Kasal yoki karantindagi chorvalar haqida veterinar pochtasiga xabar berish</div>
              </div>
              <input 
                type="checkbox" 
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--green-primary)', cursor: 'pointer' }}
              />
            </div>

            {/* Select options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Datchiklar sinxronizatsiya intervali
              </label>
              <select 
                className="input" 
                value={syncInterval} 
                onChange={(e) => setSyncInterval(e.target.value)}
              >
                <option value="1">Har daqiqada yangilash</option>
                <option value="5">Har 5 daqiqada yangilash</option>
                <option value="15">Har 15 daqiqada yangilash</option>
                <option value="60">Har soatda yangilash</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <button className="btn btn-primary" onClick={handleSave}>
                Sozlamalarni saqlash
              </button>
              {saved && <span className="animate-fade-in" style={{ color: 'var(--green-light)', fontSize: '0.85rem', fontWeight: 600 }}>Saqlandi!</span>}
            </div>
          </div>
        </div>

        {/* Server Performance Stats */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
            Server resurslari va holati
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>CPU Yuklanishi</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>14.5%</span>
                <span className="pulse-dot green" />
              </div>
            </div>

            <div style={{ padding: '16px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>RAM (Tezkor Xotira)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>3.2 GB</span>
                <span className="pulse-dot green" />
              </div>
            </div>

            <div style={{ padding: '16px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>MB Ulanishi (DB)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>12 ms</span>
                <span className="pulse-dot green" />
              </div>
            </div>

            <div style={{ padding: '16px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Xizmat Faoliyati</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>99.98%</span>
                <span className="pulse-dot green" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isUserModalOpen && (
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
          onClick={() => setIsUserModalOpen(false)}
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
            <button 
              onClick={() => setIsUserModalOpen(false)}
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

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>
              {editMode ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi qoʻshish'}
            </h3>

            <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {error && <div className="login-error">{error}</div>}

              {/* Avatar Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Avatar tanlang</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  {AVATARS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setAvatar(emoji)}
                      style={{
                        fontSize: '1.5rem',
                        padding: '6px',
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
              <div className="login-field" style={{ margin: 0 }}>
                <label>Toʻliq ism-sharf *</label>
                <input
                  type="text"
                  className="input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Abdullayev Sherzod"
                  required
                />
              </div>

              {/* Username */}
              <div className="login-field" style={{ margin: 0 }}>
                <label>Foydalanuvchi nomi *</label>
                <input
                  type="text"
                  className="input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="fermer"
                  required
                />
              </div>

              {/* Password */}
              <div className="login-field" style={{ margin: 0 }}>
                <label>Parol *</label>
                <input
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parolni kiriting"
                  required
                />
              </div>

              {/* Role Select */}
              <div className="login-field" style={{ margin: 0 }}>
                <label>Roli</label>
                <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="fermer">Fermer</option>
                  <option value="veterinar">Veterinar</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsUserModalOpen(false)}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {editMode ? 'Saqlash' : 'Qoʻshish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

