import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Plus, X } from 'lucide-react';
import { useFarm } from '../context/FarmContext';
export default function AnimalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { animals, vetRecords, updateAnimal, deleteAnimal, addVetRecord, updateVetRecord, feedPlans, currentUser } = useFarm();
  
  const animal = animals.find((a) => a.id === parseInt(id));

  // Edit Animal Form States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBreed, setEditBreed] = useState('');
  const [editAge, setEditAge] = useState(0);
  const [editWeight, setEditWeight] = useState(0);
  const [editGender, setEditGender] = useState('urg\'ochi');
  const [editStatus, setEditStatus] = useState('sog\'lom');
  const [editLocation, setEditLocation] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editDailyMilk, setEditDailyMilk] = useState(0);

  // Add Vet Record Form States
  const [isAddVetOpen, setIsAddVetOpen] = useState(false);
  const [vetType, setVetType] = useState('Tekshiruv');
  const [vetDiagnosis, setVetDiagnosis] = useState('');
  const [vetTreatment, setVetTreatment] = useState('');
  const [vetCost, setVetCost] = useState('');
  const [vetStatus, setVetStatus] = useState('davom etmoqda');
  const [vetNotes, setVetNotes] = useState('');
  const [vetError, setVetError] = useState('');

  // Delete Confirm State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Pre-fill edit fields
  useEffect(() => {
    if (animal) {
      setEditName(animal.name || '');
      setEditBreed(animal.breed || '');
      setEditAge(animal.age || 0);
      setEditWeight(animal.weight || 0);
      setEditGender(animal.gender || 'urg\'ochi');
      setEditStatus(animal.status || 'sog\'lom');
      setEditLocation(animal.location || '');
      setEditNotes(animal.notes || '');
      setEditDailyMilk(animal.dailyMilk || 0);
    }
  }, [animal, isEditOpen]);

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

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateAnimal(animal.id, {
      name: editName.trim(),
      breed: editBreed.trim(),
      age: parseInt(editAge) || 0,
      weight: parseFloat(editWeight) || 0,
      gender: editGender,
      status: editStatus,
      location: editLocation.trim(),
      notes: editNotes.trim(),
      dailyMilk: editGender === 'urg\'ochi' && (animal.type === 'qoramol' || animal.type === 'echki') ? parseFloat(editDailyMilk) || 0 : 0
    });
    setIsEditOpen(false);
  };

  const handleAddVetSubmit = (e) => {
    e.preventDefault();
    setVetError('');

    if (!vetDiagnosis.trim() || !vetTreatment.trim()) {
      setVetError('Tashxis va muolajani kiriting!');
      return;
    }

    addVetRecord({
      animalId: animal.id,
      animalName: animal.name,
      animalTag: animal.tag,
      type: vetType,
      diagnosis: vetDiagnosis.trim(),
      treatment: vetTreatment.trim(),
      doctor: currentUser?.fullName || 'Karimova Dilnoza',
      status: vetStatus,
      cost: parseFloat(vetCost) || 0,
      notes: vetNotes.trim()
    });

    // Reset fields
    setVetType('Tekshiruv');
    setVetDiagnosis('');
    setVetTreatment('');
    setVetCost('');
    setVetStatus('davom etmoqda');
    setVetNotes('');
    setIsAddVetOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteAnimal(animal.id);
    navigate('/animals');
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Action Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button className="back-btn" onClick={() => navigate('/animals')} style={{ margin: 0 }}>
          <ArrowLeft size={16} />
          Ortga qaytish
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          {currentUser?.role !== 'veterinar' && (
            <button 
              className="btn btn-secondary" 
              onClick={() => setIsEditOpen(true)}
              style={{ padding: '8px 16px', gap: '6px' }}
            >
              <Edit size={14} />
              Tahrirlash
            </button>
          )}
          {currentUser?.role !== 'veterinar' && (
            <button 
              className="btn btn-danger" 
              onClick={() => setIsDeleteOpen(true)}
              style={{ padding: '8px 16px', gap: '6px' }}
            >
              <Trash2 size={14} />
              Oʻchirish
            </button>
          )}
        </div>
      </div>

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Tibbiyot va Davolash tarixi</h3>
            {currentUser?.role !== 'fermer' && (
              <button 
                className="btn btn-primary" 
                onClick={() => setIsAddVetOpen(true)}
                style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '4px' }}
              >
                <Plus size={12} />
                Yozuv qoʻshish
              </button>
            )}
          </div>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', alignItems: 'center' }}>
                    <span>Shifokor: {rec.doctor} ({rec.type})</span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--green-light)', fontWeight: 600 }}>{rec.cost.toLocaleString('uz-UZ')} so'm</span>
                      <span className={`badge ${rec.status === 'yakunlangan' ? 'badge-healthy' : 'badge-treating'}`} style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                        {rec.status}
                      </span>
                      {rec.status === 'davom etmoqda' && currentUser?.role !== 'fermer' && (
                        <button
                          onClick={() => updateVetRecord(rec.id, { status: 'yakunlangan' })}
                          style={{
                            background: 'rgba(34, 197, 94, 0.15)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            color: 'var(--green-light)',
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'var(--green-primary)';
                            e.target.style.color = '#fff';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(34, 197, 94, 0.15)';
                            e.target.style.color = 'var(--green-light)';
                          }}
                        >
                          Yakunlash
                        </button>
                      )}
                    </div>
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

      {/* Edit Animal Modal */}
      {isEditOpen && (
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
          onClick={() => setIsEditOpen(false)}
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
              onClick={() => setIsEditOpen(false)}
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

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Chorva ma'lumotlarini tahrirlash</h3>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Name */}
                <div className="login-field" style={{ margin: 0 }}>
                  <label>Laqabi / Nomi *</label>
                  <input
                    type="text"
                    className="input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>

                {/* Breed */}
                <div className="login-field" style={{ margin: 0 }}>
                  <label>Zoti *</label>
                  <input
                    type="text"
                    className="input"
                    value={editBreed}
                    onChange={(e) => setEditBreed(e.target.value)}
                    required
                  />
                </div>

                {/* Gender */}
                <div className="login-field" style={{ margin: 0 }}>
                  <label>Jinsi</label>
                  <select className="input" value={editGender} onChange={(e) => setEditGender(e.target.value)}>
                    <option value="urg'ochi">Urgʻochi</option>
                    <option value="erkak">Erkak</option>
                  </select>
                </div>

                {/* Age */}
                <div className="login-field" style={{ margin: 0 }}>
                  <label>Yoshi (yil)</label>
                  <input
                    type="number"
                    className="input"
                    min="0"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                  />
                </div>

                {/* Weight */}
                <div className="login-field" style={{ margin: 0 }}>
                  <label>Ogʻirligi (kg)</label>
                  <input
                    type="number"
                    className="input"
                    min="1"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                  />
                </div>

                {/* Status */}
                <div className="login-field" style={{ margin: 0 }}>
                  <label>Sogʻliq holati</label>
                  <select className="input" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                    <option value="sog'lom">Sogʻlom</option>
                    <option value="davolanmoqda">Davolanmoqda</option>
                    <option value="karantin">Karantin</option>
                  </select>
                </div>

                {/* Location */}
                <div className="login-field" style={{ margin: 0 }}>
                  <label>Joylashuv / Bino *</label>
                  <input
                    type="text"
                    className="input"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Conditional Daily Milk Yield */}
              {editGender === 'urg\'ochi' && (animal.type === 'qoramol' || animal.type === 'echki') && (
                <div className="login-field" style={{ margin: 0 }}>
                  <label>Kundalik sut mahsuldorligi (litr)</label>
                  <input
                    type="number"
                    className="input"
                    min="0"
                    value={editDailyMilk}
                    onChange={(e) => setEditDailyMilk(e.target.value)}
                  />
                </div>
              )}

              {/* Notes */}
              <div className="login-field" style={{ margin: 0 }}>
                <label>Qoʻshimcha eslatmalar</label>
                <textarea
                  className="input"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  style={{ height: '70px', resize: 'vertical' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsEditOpen(false)}
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

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
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
          onClick={() => setIsDeleteOpen(false)}
        >
          <div 
            className="glass-card animate-fade-in"
            style={{
              width: '90%',
              maxWidth: '400px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg), var(--shadow-glow-strong)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: 'var(--accent-red)' }}>Chorvani oʻchirish</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Haqiqatan ham <strong>{animal.name}</strong> ({animal.tag}) ma'lumotlarini o'chirib yubormoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi!
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsDeleteOpen(false)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Bekor qilish
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleDeleteConfirm}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Oʻchirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vet Record Modal */}
      {isAddVetOpen && (
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
          onClick={() => setIsAddVetOpen(false)}
        >
          <div 
            className="glass-card animate-fade-in"
            style={{
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              position: 'relative',
              boxShadow: 'var(--shadow-lg), var(--shadow-glow-strong)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsAddVetOpen(false)}
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

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Yangi tibbiy koʻrik varaqasi</h3>

            <form onSubmit={handleAddVetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {vetError && <div className="login-error">{vetError}</div>}

              <div style={{ display: 'flex', gap: '16px' }}>
                {/* Type */}
                <div className="login-field" style={{ flex: 1, margin: 0 }}>
                  <label>Tekshiruv turi</label>
                  <select className="input" value={vetType} onChange={(e) => setVetType(e.target.value)}>
                    <option value="Tekshiruv">Tekshiruv</option>
                    <option value="Davolash">Davolash</option>
                    <option value="Emlash">Emlash</option>
                  </select>
                </div>

                {/* Status */}
                <div className="login-field" style={{ flex: 1, margin: 0 }}>
                  <label>Muolaja holati</label>
                  <select className="input" value={vetStatus} onChange={(e) => setVetStatus(e.target.value)}>
                    <option value="davom etmoqda">Davom etmoqda</option>
                    <option value="yakunlangan">Yakunlangan</option>
                  </select>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="login-field" style={{ margin: 0 }}>
                <label>Tashxis / Sabab *</label>
                <input
                  type="text"
                  className="input"
                  value={vetDiagnosis}
                  onChange={(e) => setVetDiagnosis(e.target.value)}
                  placeholder="Masalan: Profilaktik emlash"
                  required
                />
              </div>

              {/* Treatment */}
              <div className="login-field" style={{ margin: 0 }}>
                <label>Muolaja / Emlash dorisi *</label>
                <input
                  type="text"
                  className="input"
                  value={vetTreatment}
                  onChange={(e) => setVetTreatment(e.target.value)}
                  placeholder="Masalan: Brusellyoz vaksinasi"
                  required
                />
              </div>

              {/* Cost */}
              <div className="login-field" style={{ margin: 0 }}>
                <label>Xarajat miqdori (so'm)</label>
                <input
                  type="number"
                  className="input"
                  min="0"
                  value={vetCost}
                  onChange={(e) => setVetCost(e.target.value)}
                  placeholder="Masalan: 85000"
                />
              </div>

              {/* Notes */}
              <div className="login-field" style={{ margin: 0 }}>
                <label>Eslatmalar (tana harorati, alomatlar)</label>
                <textarea
                  className="input"
                  value={vetNotes}
                  onChange={(e) => setVetNotes(e.target.value)}
                  placeholder="Reaksiya kuzatilmadi..."
                  style={{ height: '70px', resize: 'vertical' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsAddVetOpen(false)}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Yozuvni kiritish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
