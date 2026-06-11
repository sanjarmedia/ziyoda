import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2 } from 'lucide-react';
import { useFarm } from '../context/FarmContext';

export default function FeedPlanPage() {
  const { 
    feedStock, 
    refillFeedStock, 
    addFeedStock,
    updateFeedStock,
    deleteFeedStock,
    feedPlans, 
    addFeedPlan, 
    updateFeedPlan, 
    deleteFeedPlan, 
    consumeFeedStock, 
    currentUser,
    isInitialLoading
  } = useFarm();

  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [animalCount, setAnimalCount] = useState(10);
  const [duration, setDuration] = useState(7); // default 7 days

  // Refill Modal State
  const [isRefillOpen, setIsRefillOpen] = useState(false);
  const [refillName, setRefillName] = useState('');
  const [refillAmount, setRefillAmount] = useState('');
  const [refillPrice, setRefillPrice] = useState('');
  const [refillError, setRefillError] = useState('');

  // Add Stock Modal State
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [addStockName, setAddStockName] = useState('');
  const [addStockAmount, setAddStockAmount] = useState('');
  const [addStockUnit, setAddStockUnit] = useState('kg');
  const [addStockPrice, setAddStockPrice] = useState('');
  const [addStockError, setAddStockError] = useState('');

  // Edit Stock Modal State
  const [isEditStockOpen, setIsEditStockOpen] = useState(false);
  const [editStockName, setEditStockName] = useState('');
  const [editStockAmount, setEditStockAmount] = useState('');
  const [editStockUnit, setEditStockUnit] = useState('kg');
  const [editStockPrice, setEditStockPrice] = useState('');
  const [editStockError, setEditStockError] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);

  // Consumption Feedback States
  const [consumeSuccess, setConsumeSuccess] = useState('');
  const [consumeError, setConsumeError] = useState('');

  // CRUD Modal States
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planEditMode, setPlanEditMode] = useState(false);
  const [selectedPlanIdForEdit, setSelectedPlanIdForEdit] = useState(null);
  const [planName, setPlanName] = useState('');
  const [planAnimalType, setPlanAnimalType] = useState('qoramol');
  const [planDescription, setPlanDescription] = useState('');
  const [planSeason, setPlanSeason] = useState('Yil davomida');
  const [planCalories, setPlanCalories] = useState(10000);
  const [planItems, setPlanItems] = useState([]);
  const [planError, setPlanError] = useState('');

  // Set default selected plan once they load
  useEffect(() => {
    if (feedPlans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(feedPlans[0].id.toString());
    }
  }, [feedPlans, selectedPlanId]);

  // Set default refill ozuqa once stock loads
  useEffect(() => {
    if (feedStock.length > 0 && !refillName) {
      setRefillName(feedStock[0].name);
    }
  }, [feedStock, refillName]);

  // Prefill refill price with current stock unit price
  useEffect(() => {
    if (refillName && feedStock.length > 0) {
      const selectedStock = feedStock.find(s => s.name === refillName);
      if (selectedStock) {
        setRefillPrice(selectedStock.price.toString());
      }
    }
  }, [refillName, feedStock]);

  const currentPlan = feedPlans.find((p) => p.id.toString() === selectedPlanId) || feedPlans[0];
  const currentPlanItems = currentPlan ? currentPlan.items : [];
  
  // Calculate dynamic plan daily cost based on actual stock prices
  const currentPlanCost = currentPlan ? currentPlanItems.reduce((acc, item) => {
    const stock = feedStock.find(s => s.name === item.name);
    const price = stock ? parseFloat(stock.price) || 0 : 0;
    return acc + (item.amount * price);
  }, 0) : 0;

  const calculateTotal = (amount) => {
    return (amount * animalCount * duration).toFixed(1);
  };

  const handleRefillSubmit = async (e) => {
    e.preventDefault();
    setRefillError('');

    const amt = parseFloat(refillAmount);
    const prc = parseFloat(refillPrice);
    if (isNaN(amt) || amt <= 0) {
      setRefillError('Iltimos, musbat miqdor kiriting!');
      return;
    }
    if (isNaN(prc) || prc < 0) {
      setRefillError('Iltimos, toʻgʻri narx kiriting!');
      return;
    }

    try {
      await refillFeedStock(refillName, amt, prc);
      setRefillAmount('');
      setIsRefillOpen(false);
    } catch (err) {
      setRefillError(err.message);
    }
  };

  const handleAddStockSubmit = async (e) => {
    e.preventDefault();
    setAddStockError('');
    if (!addStockName.trim()) {
      setAddStockError('Nomi kiritilishi shart!');
      return;
    }
    const amt = parseFloat(addStockAmount);
    const prc = parseFloat(addStockPrice);
    if (isNaN(amt) || amt < 0) {
      setAddStockError('Iltimos, musbat miqdor kiriting!');
      return;
    }
    if (isNaN(prc) || prc < 0) {
      setAddStockError('Iltimos, toʻgʻri narx kiriting!');
      return;
    }

    try {
      await addFeedStock({
        name: addStockName.trim(),
        amount: amt,
        unit: addStockUnit,
        price: prc
      });
      setIsAddStockOpen(false);
      setAddStockName('');
      setAddStockAmount('');
      setAddStockUnit('kg');
      setAddStockPrice('');
    } catch (err) {
      setAddStockError(err.message);
    }
  };

  const handleEditStockClick = (stock) => {
    setSelectedStock(stock);
    setEditStockName(stock.name);
    setEditStockAmount(stock.amount.toString());
    setEditStockUnit(stock.unit);
    setEditStockPrice(stock.price.toString());
    setEditStockError('');
    setIsEditStockOpen(true);
  };

  const handleEditStockSubmit = async (e) => {
    e.preventDefault();
    setEditStockError('');
    const amt = parseFloat(editStockAmount);
    const prc = parseFloat(editStockPrice);
    if (isNaN(amt) || amt < 0) {
      setEditStockError('Iltimos, toʻgʻri miqdor kiriting!');
      return;
    }
    if (isNaN(prc) || prc < 0) {
      setEditStockError('Iltimos, toʻgʻri narx kiriting!');
      return;
    }

    try {
      await updateFeedStock(editStockName, {
        amount: amt,
        price: prc,
        unit: editStockUnit
      });
      setIsEditStockOpen(false);
    } catch (err) {
      setEditStockError(err.message);
    }
  };

  const handleDeleteStockClick = async (name) => {
    if (window.confirm(`Haqiqatan ham '${name}' ozuqa turini ombordan butunlay oʻchirib yubormoqchimisiz?`)) {
      try {
        await deleteFeedStock(name);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleConsumeStock = async () => {
    setConsumeSuccess('');
    setConsumeError('');

    if (!currentPlan) return;

    if (!window.confirm(`Haqiqatan ham ushbu miqdordagi ozuqani ombordan chegirmoqchimisiz?`)) {
      return;
    }

    const itemsToConsume = currentPlanItems.map(item => ({
      name: item.name,
      amount: parseFloat(calculateTotal(item.amount))
    }));

    try {
      await consumeFeedStock(itemsToConsume);
      setConsumeSuccess("Ozuqalar ombordan muvaffaqiyatli chegirildi!");
      setTimeout(() => setConsumeSuccess(''), 4000);
    } catch (err) {
      setConsumeError(err.message);
      setTimeout(() => setConsumeError(''), 5000);
    }
  };

  // CRUD handlers
  const handleAddPlanClick = () => {
    setPlanEditMode(false);
    setPlanName('');
    setPlanAnimalType('qoramol');
    setPlanDescription('');
    setPlanSeason('Yil davomida');
    setPlanCalories(10000);
    setPlanItems([{ name: feedStock[0]?.name || '', amount: 1, unit: feedStock[0]?.unit || 'kg' }]);
    setPlanError('');
    setIsPlanModalOpen(true);
  };

  const handleEditPlanClick = (plan) => {
    setPlanEditMode(true);
    setSelectedPlanIdForEdit(plan.id);
    setPlanName(plan.name);
    setPlanAnimalType(plan.animalType);
    setPlanDescription(plan.description);
    setPlanSeason(plan.season);
    setPlanCalories(plan.calories);
    setPlanItems(plan.items || []);
    setPlanError('');
    setIsPlanModalOpen(true);
  };

  const handleDeletePlanClick = async (id) => {
    if (window.confirm("Haqiqatan ham ushbu ratsion andozasini o'chirib yubormoqchimisiz?")) {
      await deleteFeedPlan(id);
      if (selectedPlanId === id.toString()) {
        setSelectedPlanId('');
      }
    }
  };

  const handleAddItemRow = () => {
    const firstStock = feedStock[0];
    setPlanItems([...planItems, { name: firstStock?.name || '', amount: 1, unit: firstStock?.unit || 'kg' }]);
  };

  const handleRemoveItemRow = (idx) => {
    setPlanItems(planItems.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx, field, val) => {
    setPlanItems(planItems.map((item, i) => {
      if (i === idx) {
        let updated = { ...item, [field]: val };
        if (field === 'name') {
          const matchingStock = feedStock.find(s => s.name === val);
          if (matchingStock) {
            updated.unit = matchingStock.unit;
          }
        }
        return updated;
      }
      return item;
    }));
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    setPlanError('');

    if (!planName.trim()) {
      setPlanError('Ratsion nomini kiriting!');
      return;
    }

    if (planItems.length === 0) {
      setPlanError('Kamida bitta ozuqa turi kiritilishi shart!');
      return;
    }

    const payload = {
      name: planName.trim(),
      animalType: planAnimalType,
      description: planDescription.trim(),
      items: planItems.map(item => ({
        name: item.name,
        amount: parseFloat(item.amount) || 0,
        unit: item.unit
      })),
      totalCost: 0, 
      calories: parseInt(planCalories) || 0,
      season: planSeason
    };

    try {
      if (planEditMode) {
        await updateFeedPlan(selectedPlanIdForEdit, payload);
      } else {
        await addFeedPlan(payload);
      }
      setIsPlanModalOpen(false);
    } catch (err) {
      setPlanError(err.message);
    }
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

  // YouTube-like Skeleton Loading State
  if (isInitialLoading) {
    return (
      <div className="page-container">
        <header className="page-header" style={{ marginBottom: '24px' }}>
          <div className="skeleton skeleton-title" style={{ height: '32px', width: '300px' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '450px' }}></div>
        </header>

        <div className="detail-grid" style={{ marginBottom: '32px' }}>
          {/* Calc Skeleton */}
          <div className="glass-card" style={{ height: '380px' }}>
            <div className="skeleton skeleton-title" style={{ width: '150px', marginBottom: '20px' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="skeleton skeleton-text" style={{ height: '38px' }}></div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="skeleton skeleton-text" style={{ height: '38px', flex: 1 }}></div>
                <div className="skeleton skeleton-text" style={{ height: '38px', flex: 1 }}></div>
              </div>
              <div className="skeleton skeleton-text" style={{ height: '140px', marginTop: '8px' }}></div>
            </div>
          </div>

          {/* Stock Skeleton */}
          <div className="glass-card" style={{ height: '380px' }}>
            <div className="skeleton skeleton-title" style={{ width: '180px', marginBottom: '20px' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[1, 2, 3, 4].map(n => (
                <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="skeleton skeleton-text" style={{ width: '120px' }}></div>
                    <div className="skeleton skeleton-text" style={{ width: '60px' }}></div>
                  </div>
                  <div className="skeleton skeleton-bar"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plans Grid Skeleton */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className="skeleton skeleton-title" style={{ width: '150px', height: '24px' }}></div>
          <div className="skeleton skeleton-button" style={{ width: '120px', height: '32px' }}></div>
        </div>

        <div className="feed-plans-grid">
          {[1, 2, 3].map(n => (
            <div key={n} className="glass-card" style={{ height: '280px' }}>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
              <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
              </div>
              <div className="skeleton skeleton-text" style={{ marginTop: '20px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header" style={{ marginBottom: '24px' }}>
        <h2>Ozuqa ratsionlari va Kalkulyator</h2>
        <p>Chorva ozuqa turlari, ratsion sarfi hisobi va ombor zaxiralari monitoringi</p>
      </header>

      {/* Calculator & Stock Level row */}
      <div className="detail-grid" style={{ marginBottom: '32px' }}>
        {/* Calculator */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
              Ozuqa sarfi kalkulyatori
            </h3>
            
            {consumeSuccess && (
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: 'var(--green-light)', padding: '10px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', marginBottom: '16px', textAlign: 'center' }}>
                {consumeSuccess}
              </div>
            )}
            
            {consumeError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--accent-red)', padding: '10px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', marginBottom: '16px', textAlign: 'center' }}>
                {consumeError}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Ratsionni tanlang:</label>
                <select 
                  className="input" 
                  value={selectedPlanId} 
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                >
                  {feedPlans.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                  {feedPlans.length === 0 && (
                    <option value="">Ratsion yuklanmoqda...</option>
                  )}
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
                  {currentPlanItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{calculateTotal(item.amount)} {item.unit}</strong>
                    </div>
                  ))}
                  {currentPlanItems.length === 0 && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      Yuklanmoqda...
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', marginTop: '12px', paddingTop: '12px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Jami xarajat:</span>
                  <strong style={{ color: 'var(--green-light)', fontSize: '1rem' }}>{(currentPlanCost * animalCount * duration).toLocaleString('uz-UZ')} soʻm</strong>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleConsumeStock}
            disabled={!currentPlan || currentPlanItems.length === 0}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}
          >
            Ombordan sarflash
          </button>
        </div>

        {/* Stock Level */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Ombordagi ozuqa zaxirasi
              </h3>
              {currentUser?.role !== 'veterinar' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setIsAddStockOpen(true)}
                    style={{ padding: '4px 8px', fontSize: '0.72rem', gap: '3px', display: 'flex', alignItems: 'center' }}
                  >
                    <Plus size={11} /> Yangi ozuqa
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setIsRefillOpen(true)}
                    style={{ padding: '4px 8px', fontSize: '0.72rem', gap: '3px' }}
                  >
                    Toʻldirish
                  </button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
              {feedStock.map((stock, idx) => {
                let pct = 80;
                let barColor = 'var(--green-primary)';
                if (stock.status === 'kam') {
                  pct = 35;
                  barColor = 'var(--accent-amber)';
                } else if (stock.status === 'juda kam') {
                  pct = 12;
                  barColor = 'var(--accent-red)';
                } else {
                  pct = Math.min(100, (stock.amount / 5000) * 100);
                }
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                        {stock.name} <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>({(stock.price || 0).toLocaleString('uz-UZ')} so'm / {stock.unit})</span>
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          <strong>{stock.amount.toLocaleString()} {stock.unit}</strong>
                        </span>
                        {currentUser?.role !== 'veterinar' && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => handleEditStockClick(stock)}
                              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '2px' }}
                              title="Tahrirlash"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteStockClick(stock.name)}
                              style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', display: 'flex', padding: '2px' }}
                              title="Oʻchirish"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
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
              {feedStock.length === 0 && (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                  Zaxiralar mavjud emas.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feed Plans Grid */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Ratsion andozalari</h3>
        {currentUser?.role !== 'veterinar' && (
          <button 
            className="btn btn-primary" 
            onClick={handleAddPlanClick}
            style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '6px' }}
          >
            <Plus size={14} />
            Yangi ratsion
          </button>
        )}
      </div>

      <div className="feed-plans-grid">
        {feedPlans.map((plan) => {
          // Calculate dynamic plan daily cost based on stock prices
          const planCost = (plan.items || []).reduce((acc, item) => {
            const stock = feedStock.find(s => s.name === item.name);
            const price = stock ? parseFloat(stock.price) || 0 : 0;
            return acc + (item.amount * price);
          }, 0);

          return (
            <div key={plan.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="feed-plan-header">
                  <div>
                    <h4>{plan.name}</h4>
                    <p>{plan.description}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <span className={`badge ${getPlanBadgeClass(plan.animalType)}`}>
                      {plan.animalType}
                    </span>
                    {currentUser?.role !== 'veterinar' && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <button 
                          onClick={() => handleEditPlanClick(plan)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '2px' }}
                          title="Tahrirlash"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeletePlanClick(plan.id)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', display: 'flex', padding: '2px' }}
                          title="Oʻchirish"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0' }}>
                  {plan.items && plan.items.map((item, idx) => (
                    <div key={idx} className="feed-item">
                      <span className="feed-item-name">{item.name}</span>
                      <span className="feed-item-amount">{item.amount} {item.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="feed-plan-footer">
                <span>Mavsum: <strong>{plan.season}</strong></span>
                <span>Kaloriya: <strong>{plan.calories?.toLocaleString()} kkal</strong></span>
                <span>Kunlik: <strong style={{ color: 'var(--green-light)' }}>{planCost.toLocaleString('uz-UZ')} so'm</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Refill Stock Modal */}
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
                <label>Miqdori</label>
                <input
                  type="number"
                  className="input"
                  min="0.1"
                  step="any"
                  value={refillAmount}
                  onChange={(e) => setRefillAmount(e.target.value)}
                  placeholder="Masalan: 500"
                  required
                />
              </div>

              {/* Refill Price */}
              <div className="login-field" style={{ margin: 0 }}>
                <label>Birlik narxi (so'mda)</label>
                <input
                  type="number"
                  className="input"
                  min="0"
                  value={refillPrice}
                  onChange={(e) => setRefillPrice(e.target.value)}
                  placeholder="Masalan: 3000"
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

      {/* Add Stock Modal */}
      {isAddStockOpen && (
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
          onClick={() => setIsAddStockOpen(false)}
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
              onClick={() => setIsAddStockOpen(false)}
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
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Yangi ozuqa qoʻshish</h3>

            <form onSubmit={handleAddStockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {addStockError && <div className="login-error">{addStockError}</div>}

              <div className="login-field" style={{ margin: 0 }}>
                <label>Ozuqa nomi *</label>
                <input
                  type="text"
                  className="input"
                  value={addStockName}
                  onChange={(e) => setAddStockName(e.target.value)}
                  placeholder="Masalan: Bug'doy yormasi"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="login-field" style={{ flex: 2, margin: 0 }}>
                  <label>Miqdori *</label>
                  <input
                    type="number"
                    className="input"
                    min="0"
                    step="any"
                    value={addStockAmount}
                    onChange={(e) => setAddStockAmount(e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="login-field" style={{ flex: 1, margin: 0 }}>
                  <label>Birligi *</label>
                  <select 
                    className="input"
                    value={addStockUnit}
                    onChange={(e) => setAddStockUnit(e.target.value)}
                  >
                    <option value="kg">kg</option>
                    <option value="litr">litr</option>
                    <option value="bog'">bog'</option>
                    <option value="dona">dona</option>
                  </select>
                </div>
              </div>

              <div className="login-field" style={{ margin: 0 }}>
                <label>Birlik narxi (so'mda) *</label>
                <input
                  type="number"
                  className="input"
                  min="0"
                  value={addStockPrice}
                  onChange={(e) => setAddStockPrice(e.target.value)}
                  placeholder="3000"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsAddStockOpen(false)}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Qoʻshish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Stock Modal */}
      {isEditStockOpen && (
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
          onClick={() => setIsEditStockOpen(false)}
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
              onClick={() => setIsEditStockOpen(false)}
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
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Ozuqani tahrirlash</h3>

            <form onSubmit={handleEditStockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {editStockError && <div className="login-error">{editStockError}</div>}

              <div className="login-field" style={{ margin: 0 }}>
                <label>Ozuqa nomi</label>
                <input
                  type="text"
                  className="input"
                  value={editStockName}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="login-field" style={{ flex: 2, margin: 0 }}>
                  <label>Miqdori ({editStockUnit}) *</label>
                  <input
                    type="number"
                    className="input"
                    min="0"
                    step="any"
                    value={editStockAmount}
                    onChange={(e) => setEditStockAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="login-field" style={{ flex: 1, margin: 0 }}>
                  <label>Birligi</label>
                  <input
                    type="text"
                    className="input"
                    value={editStockUnit}
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="login-field" style={{ margin: 0 }}>
                <label>Birlik narxi (so'mda) *</label>
                <input
                  type="number"
                  className="input"
                  min="0"
                  value={editStockPrice}
                  onChange={(e) => setEditStockPrice(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsEditStockOpen(false)}
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

      {/* Add/Edit Feed Plan Modal */}
      {isPlanModalOpen && (
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
          onClick={() => setIsPlanModalOpen(false)}
        >
          <div 
            className="glass-card animate-fade-in"
            style={{
              width: '90%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              position: 'relative',
              boxShadow: 'var(--shadow-lg), var(--shadow-glow-strong)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsPlanModalOpen(false)}
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
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>
              {planEditMode ? 'Ratsion andozasini tahrirlash' : 'Yangi ratsion andozasi qoʻshish'}
            </h3>

            <form onSubmit={handlePlanSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {planError && <div className="login-error">{planError}</div>}

              {/* Plan Name */}
              <div className="login-field" style={{ margin: 0 }}>
                <label>Ratsion nomi *</label>
                <input
                  type="text"
                  className="input"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="Masalan: Sut sigirlari uchun maxsus ratsion"
                  required
                />
              </div>

              {/* Animal Type & Season Row */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="login-field" style={{ flex: 1, margin: 0 }}>
                  <label>Chorva turi *</label>
                  <select 
                    className="input" 
                    value={planAnimalType} 
                    onChange={(e) => setPlanAnimalType(e.target.value)}
                  >
                    <option value="qoramol">Qoramol</option>
                    <option value="qo'y">Qoʻy</option>
                    <option value="echki">Echki</option>
                  </select>
                </div>
                <div className="login-field" style={{ flex: 1, margin: 0 }}>
                  <label>Mavsum *</label>
                  <select 
                    className="input" 
                    value={planSeason} 
                    onChange={(e) => setPlanSeason(e.target.value)}
                  >
                    <option value="Yil davomida">Yil davomida</option>
                    <option value="Bahor">Bahor</option>
                    <option value="Yoz">Yoz</option>
                    <option value="Kuz">Kuz</option>
                    <option value="Qish">Qish</option>
                  </select>
                </div>
              </div>

              {/* Calories Row */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="login-field" style={{ flex: 1, margin: 0 }}>
                  <label>Kaloriya miqdori (kkal) *</label>
                  <input
                    type="number"
                    className="input"
                    value={planCalories}
                    onChange={(e) => setPlanCalories(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="login-field" style={{ margin: 0 }}>
                <label>Qisqacha tavsifi</label>
                <textarea
                  className="input"
                  style={{ minHeight: '60px', fontFamily: 'inherit', resize: 'vertical' }}
                  value={planDescription}
                  onChange={(e) => setPlanDescription(e.target.value)}
                  placeholder="Ratsionning afzalligi haqida..."
                />
              </div>

              {/* Items / Ingredients */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Ozuqa tarkibi va miqdori (kuniga 1 bosh uchun) *
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    style={{
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: 'var(--green-light)',
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    + Qator qo'shish
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                  {planItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <select
                        className="input"
                        style={{ flex: 2 }}
                        value={item.name}
                        onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                      >
                        {feedStock.map((s, i) => (
                          <option key={i} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        className="input"
                        style={{ flex: 1 }}
                        step="0.01"
                        min="0.01"
                        value={item.amount}
                        onChange={(e) => handleItemChange(idx, 'amount', e.target.value)}
                        placeholder="Miqdor"
                        required
                      />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', minWidth: '24px' }}>{item.unit}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--accent-red)',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {planItems.length === 0 && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>
                      Tarkib kiritilmagan. Qator qo'shish tugmasini bosing.
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsPlanModalOpen(false)}
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
    </div>
  );
}
