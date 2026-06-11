import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { feedPlans } from '../data/mockData';

export default function FeedPlanPage() {
  const { feedStock, refillFeedStock } = useFarm();
  const [selectedPlanId, setSelectedPlanId] = useState(feedPlans[0]?.id || 1);
  const [animalCount, setAnimalCount] = useState(10);
  const [duration, setDuration] = useState(7); // default 7 days

  // Refill Modal State
  const [isRefillOpen, setIsRefillOpen] = useState(false);
  const [refillName, setRefillName] = useState(feedStock[0]?.name || '');
  const [refillAmount, setRefillAmount] = useState('');
  const [refillError, setRefillError] = useState('');

  const currentPlan = feedPlans.find((p) => p.id === parseInt(selectedPlanId)) || feedPlans[0];

  const calculateTotal = (amount) => {
    return (amount * animalCount * duration).toFixed(1);
  };

  const handleRefillSubmit = (e) => {
    e.preventDefault();
    setRefillError('');

    const amt = parseFloat(refillAmount);
    if (isNaN(amt) || amt <= 0) {
      setRefillError('Iltimos, musbat miqdor kiriting!');
      return;
    }

    refillFeedStock(refillName, amt);
    
    // Reset Form
    setRefillAmount('');
    setIsRefillOpen(false);
  };

  const getPlanBadgeClass = (type) => {
    switch (type) {
      case 'qoramol':
        return 'badge-treating';
      case "qo'y":
        return 'badge-healthy';
      case 'echki':
        return 'badge-quarantine';
      default:
        return 'badge-treating';
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header" style={{ marginBottom: '24px' }}>
        <h2>Ozuqa ratsionlari va Kalkulyator</h2>
        <p>Chorva ozuqa turlari, ratsion sarfi hisobi va ombor zaxiralari monitoringi</p>
      </header>

      {/* Calculator & Stock Level row */}
      <div className="detail-grid" style={{ marginBottom: '32px' }}>
        {/* Calculator */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
            Ozuqa sarfi kalkulyatori
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Ratsionni tanlang:</label>
              <select 
                className="input" 
                value={selectedPlanId} 
                onChange={(e) => setSelectedPlanId(parseInt(e.target.value))}
              >
                {feedPlans.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Chorva soni (bosh):</label>
                <input 
                  type="number" 
                  className="input" 
                  min="1" 
                  value={animalCount}
                  onChange={(e) => setAnimalCount(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Kunlar soni:</label>
                <input 
                  type="number" 
                  className="input" 
                  min="1" 
                  value={duration}
                  onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
            </div>

            <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '16px', marginTop: '8px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '12px', color: 'var(--green-light)' }}>Hisoblangan sarf miqdori:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentPlan.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{calculateTotal(item.amount)} {item.unit}</strong>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', marginTop: '12px', paddingTop: '12px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Jami xarajat:</span>
                <strong style={{ color: 'var(--green-light)', fontSize: '1rem' }}>{(currentPlan.totalCost * animalCount * duration).toLocaleString('uz-UZ')} soʻm</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Level */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Ombordagi ozuqa zaxirasi
            </h3>
            <button 
              className="btn btn-secondary" 
              onClick={() => setIsRefillOpen(true)}
              style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px' }}
            >
              Toʻldirish
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {feedStock.map((stock, idx) => {
              let pct = 80;
              let barColor = 'var(--green-primary)';
              if (stock.status === 'kam') {
                pct = 35;
                barColor = 'var(--accent-amber)';
              } else if (stock.status === 'juda kam') {
                pct = 12;
                barColor = 'var(--accent-red)';
              }
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{stock.name}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      <strong>{stock.amount.toLocaleString()} {stock.unit}</strong>
                    </span>
                  </div>
                  <div className="stock-bar">
                    <div 
                      className="stock-bar-fill" 
                      style={{ width: `${pct}%`, background: barColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feed Plans Grid */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Ratsion andozalari</h3>
      <div className="feed-plans-grid">
        {feedPlans.map((plan) => (
          <div key={plan.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="feed-plan-header">
                <div>
                  <h4>{plan.name}</h4>
                  <p>{plan.description}</p>
                </div>
                <span className={`badge ${getPlanBadgeClass(plan.animalType)}`}>
                  {plan.animalType}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0' }}>
                {plan.items.map((item, idx) => (
                  <div key={idx} className="feed-item">
                    <span className="feed-item-name">{item.name}</span>
                    <span className="feed-item-amount">{item.amount} {item.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="feed-plan-footer">
              <span>Mavsum: <strong>{plan.season}</strong></span>
              <span>Xarajat: <strong style={{ color: 'var(--green-light)' }}>{plan.totalCost.toLocaleString('uz-UZ')} so'm</strong></span>
            </div>
          </div>
        ))}
      </div>
      {isRefillOpen && (
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
          onClick={() => setIsRefillOpen(false)}
        >
          <div 
            className="glass-card animate-fade-in"
            style={{
              width: '90%',
              maxWidth: '400px',
              padding: '32px',
              position: 'relative',
              boxShadow: 'var(--shadow-lg), var(--shadow-glow-strong)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsRefillOpen(false)}
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

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Ozuqa zaxirasini toʻldirish</h3>

            <form onSubmit={handleRefillSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {refillError && <div className="login-error">{refillError}</div>}

              {/* Feed Name Select */}
              <div className="login-field" style={{ margin: 0 }}>
                <label>Ozuqa turi</label>
                <select 
                  className="input" 
                  value={refillName} 
                  onChange={(e) => setRefillName(e.target.value)}
                >
                  {feedStock.map((s, idx) => (
                    <option key={idx} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Refill Amount */}
              <div className="login-field" style={{ margin: 0 }}>
                <label>Miqdori (kg)</label>
                <input
                  type="number"
                  className="input"
                  min="1"
                  value={refillAmount}
                  onChange={(e) => setRefillAmount(e.target.value)}
                  placeholder="Masalan: 500"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsRefillOpen(false)}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Toʻldirish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

