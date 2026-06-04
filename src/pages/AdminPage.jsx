import React, { useState } from 'react';
import { users } from '../data/mockData';

export default function AdminPage() {
  const [backupAuto, setBackupAuto] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [syncInterval, setSyncInterval] = useState('5');
  const [saved, setSaved] = useState(false);

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
          <div key={user.id} className="glass-card admin-user-card">
            <div className="admin-user-avatar">{user.avatar}</div>
            <h4>{user.fullName}</h4>
            <p style={{ marginTop: '2px' }}>Logini: <strong>@{user.username}</strong></p>
            <div style={{ marginTop: '12px' }}>
              <span className={`badge ${getRoleBadge(user.role)}`}>
                {user.role}
              </span>
            </div>
          </div>
        ))}
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
    </div>
  );
}
