import React, { useState } from 'react';
import { feedPlans, feedStock } from '../data/mockData';

export default function FeedPlanPage() {
  const [selectedPlanId, setSelectedPlanId] = useState(feedPlans[0]?.id || 1);
  const [animalCount, setAnimalCount] = useState(10);
  const [duration, setDuration] = useState(7); // default 7 days

  const currentPlan = feedPlans.find((p) => p.id === parseInt(selectedPlanId)) || feedPlans[0];

  const calculateTotal = (amount) => {
    return (amount * animalCount * duration).toFixed(1);
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
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
            Ombordagi ozuqa zaxirasi
          </h3>
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
    </div>
  );
}
