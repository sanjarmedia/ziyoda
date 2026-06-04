import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { animals, vetRecords, feedPlans } from '../data/mockData';

export default function AnimalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const animal = animals.find((a) => a.id === parseInt(id));

  if (!animal) {
    return (
      <div className="page-container animate-fade-in text-center" style={{ padding: '40px' }}>
        <div className="glass-card" style={{ display: 'inline-block', padding: '30px' }}>
          <h2>Hayvon topilmadi!</h2>
          <button className="back-btn" onClick={() => navigate('/animals')} style={{ marginTop: '16px' }}>
            <ArrowLeft size={16} />
            Roʻyxatga qaytish
          </button>
        </div>
      </div>
    );
  }

  // Find veterinary records for this animal
  const records = vetRecords.filter((r) => r.animalId === animal.id || r.animalTag === animal.tag);

  // Find feeding plan for this animal type
  const plan = feedPlans.find((p) => p.animalType === animal.type);

  return (
    <div className="page-container animate-fade-in">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate('/animals')}>
        <ArrowLeft size={16} />
        Ortga qaytish
      </button>

      <header className="page-header" style={{ marginBottom: '24px' }}>
        <h2>{animal.name} — Tafsilotlar</h2>
        <p>Hayvon identifikatori: <strong>{animal.tag}</strong></p>
      </header>

      {/* Main Details and Animal Profile Grid */}
      <div className="detail-grid" style={{ marginBottom: '24px' }}>
        {/* Profile Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ fontSize: '4rem', width: '96px', height: '96px', borderRadius: '50%', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: 'var(--shadow-glow)' }}>
            {animal.image}
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>{animal.name}</h3>
          <span className={`badge ${animal.status === 'sog\'lom' ? 'badge-healthy' : animal.status === 'karantin' ? 'badge-quarantine' : 'badge-sick'}`} style={{ marginBottom: '20px' }}>
            {animal.status}
          </span>
          
          <div style={{ display: 'flex', gap: '24px', width: '100%', justifyContent: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{animal.weight} kg</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vazni</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-glass)', paddingLeft: '24px' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{animal.age} yosh</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Yoshi</div>
            </div>
            {animal.dailyMilk > 0 && (
              <div style={{ borderLeft: '1px solid var(--border-glass)', paddingLeft: '24px' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{animal.dailyMilk} L</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sut / kun</div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="glass-card detail-section">
          <h3>Umumiy ma'lumotlar</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="detail-row">
              <span className="detail-row-label">Nomi / Laqabi</span>
              <span className="detail-row-value">{animal.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Tegi (Tag ID)</span>
              <span className="detail-row-value">{animal.tag}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Turi / Zoti</span>
              <span className="detail-row-value">{animal.type} ({animal.breed})</span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Jinsi</span>
              <span className="detail-row-value">{animal.gender}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Emlanganligi</span>
              <span className="detail-row-value" style={{ color: animal.vaccinated ? 'var(--green-light)' : 'var(--accent-amber)' }}>
                {animal.vaccinated ? 'Emlangan' : 'Emlanmagan'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Keltirilgan sana</span>
              <span className="detail-row-value">{animal.entryDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-row-label">Oxirgi ko'rik</span>
              <span className="detail-row-value">{animal.lastCheckup}</span>
            </div>
            <div className="detail-row" style={{ borderBottom: 'none' }}>
              <span className="detail-row-label">Joylashuv / Hudud</span>
              <span className="detail-row-value">{animal.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vet History and Feeding Plan Grid */}
      <div className="detail-grid">
        {/* Vet History */}
        <div className="glass-card detail-section">
          <h3>Tibbiyot va Davolash tarixi</h3>
          {records.length > 0 ? (
            <div className="activity-list" style={{ marginTop: '16px' }}>
              {records.map((rec) => (
                <div key={rec.id} className="activity-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '12px', paddingLeft: 0, paddingRight: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{rec.diagnosis}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rec.date}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <strong>Muolaja:</strong> {rec.treatment}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>Shifokor: {rec.doctor}</span>
                    <span style={{ color: 'var(--green-light)', fontWeight: 600 }}>{rec.cost.toLocaleString('uz-UZ')} so'm</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results" style={{ padding: '60px 0' }}>
              <p>Tibbiyot tarixi toza. Salomatligi joyida.</p>
            </div>
          )}
        </div>

        {/* Feeding Plan */}
        <div className="glass-card detail-section">
          <h3>Tavsiya etiladigan ratsion</h3>
          {plan ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
              <div style={{ padding: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--green-light)', fontSize: '0.95rem' }}>{plan.name}</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>{plan.description}</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {plan.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', paddingBottom: '6px', borderBottom: '1px dashed rgba(255,255,255,0.06)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{item.amount} {item.unit}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Mavsum: <strong>{plan.season}</strong></span>
                <span>Kaloriya: <strong>{plan.calories.toLocaleString()} kkal</strong></span>
                <span>Kunlik: <strong style={{ color: 'var(--green-light)' }}>{plan.totalCost.toLocaleString('uz-UZ')} so'm</strong></span>
              </div>
            </div>
          ) : (
            <div className="no-results" style={{ padding: '60px 0' }}>
              <p>Ushbu hayvon turi uchun maxsus ozuqa ratsioni topilmadi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
