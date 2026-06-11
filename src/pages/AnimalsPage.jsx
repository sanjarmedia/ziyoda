import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, PawPrint, X } from 'lucide-react';
import { useFarm } from '../context/FarmContext';

export default function AnimalsPage() {
  const navigate = useNavigate();
  const { animals, addAnimal, currentUser } = useFarm();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('qoramol');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState(2);
  const [weight, setWeight] = useState(200);
  const [gender, setGender] = useState('urg\'ochi');
  const [status, setStatus] = useState('sog\'lom');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [dailyMilk, setDailyMilk] = useState(0);
  const [error, setError] = useState('');

  // Filter animals based on search, type, and status
  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch = 
      animal.name.toLowerCase().includes(search.toLowerCase()) ||
      animal.tag.toLowerCase().includes(search.toLowerCase()) ||
      animal.breed.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === 'all' || animal.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || animal.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !breed.trim() || !location.trim()) {
      setError('Iltimos, barcha majburiy maydonlarni toʻldiring!');
      return;
    }

    const newAnimalData = {
      name: name.trim(),
      type,
      breed: breed.trim(),
      age: parseInt(age) || 0,
      weight: parseFloat(weight) || 0,
      gender,
      status,
      location: location.trim(),
      notes: notes.trim(),
      dailyMilk: gender === 'urg\'ochi' && (type === 'qoramol' || type === 'echki') ? parseFloat(dailyMilk) || 0 : 0
    };

    addAnimal(newAnimalData);
    
    // Reset form
    setName('');
    setType('qoramol');
    setBreed('');
    setAge(2);
    setWeight(200);
    setGender('urg\'ochi');
    setStatus('sog\'lom');
    setLocation('');
    setNotes('');
    setDailyMilk(0);
    setIsAddOpen(false);
  };

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>Hayvonlar roʻyxati</h2>
          <p>Fermadagi barcha hayvonlarning toʻliq roʻyxati va holati nazorati</p>
        </div>
        {currentUser?.role !== 'veterinar' && (
          <button 
            className="btn btn-primary" 
            onClick={() => setIsAddOpen(true)}
            style={{ gap: '8px' }}
          >
            <Plus size={16} />
            Yangi qoʻshish
          </button>
        )}
      </header>

      {/* Filters and Search Bar */}
      <div className="filters-bar">
        <input
          type="text"
          className="input"
          placeholder="Nomi, zoti yoki tag bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        
        <select 
          className="input" 
          value={typeFilter} 
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">Barcha turlar</option>
          <option value="qoramol">Qoramol</option>
          <option value="qo'y">Qoʻy</option>
          <option value="echki">Echki</option>
        </select>

        <select 
          className="input" 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Barcha holatlar</option>
          <option value="sog'lom">Sogʻlom</option>
          <option value="davolanmoqda">Davolanmoqda</option>
          <option value="karantin">Karantin</option>
        </select>
      </div>

      {/* Animals Grid */}
      <section className="animals-grid">
        {filteredAnimals.length > 0 ? (
          filteredAnimals.map((animal) => (
            <div key={animal.id} className="glass-card animal-card" onClick={() => navigate(`/animals/${animal.id}`)}>
              {/* Card Header (Avatar + Title Info) */}
              <div className="animal-card-header">
                <div className="animal-card-emoji">{animal.image}</div>
                <div className="animal-card-title">
                  <h4>{animal.name}</h4>
                  <p>{animal.breed} — {animal.type}</p>
                </div>
              </div>

              {/* Grid Statistics inside Card */}
              <div className="animal-card-stats" style={{ margin: '16px 0' }}>
                <div className="animal-card-stat">
                  <span>Tag Nomeri</span>
                  <span>{animal.tag}</span>
                </div>
                <div className="animal-card-stat">
                  <span>Holati</span>
                  <span>
                    <span className={`badge ${animal.status === 'sog\'lom' ? 'badge-healthy' : animal.status === 'karantin' ? 'badge-quarantine' : 'badge-sick'}`}>
                      {animal.status}
                    </span>
                  </span>
                </div>
                <div className="animal-card-stat">
                  <span>Yoshi</span>
                  <span>{animal.age} yosh</span>
                </div>
                <div className="animal-card-stat">
                  <span>Og'irligi</span>
                  <span>{animal.weight} kg</span>
                </div>
              </div>

              {/* Action Button inside Card */}
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/animals/${animal.id}`);
                }}
              >
                Batafsil maʼlumot
                <ArrowRight size={14} />
              </button>
            </div>
          ))
        ) : (
          <div className="glass-card no-results" style={{ gridColumn: '1/-1' }}>
            <PawPrint size={48} style={{ margin: '0 auto 16px', color: 'var(--text-muted)' }} />
            <h3>Hayvonlar topilmadi</h3>
            <p>Qidiruv shartlarini oʻzgartirib koʻring.</p>
          </div>
        )}
      </section>

      {isAddOpen && (
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
          onClick={() => setIsAddOpen(false)}
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
              onClick={() => setIsAddOpen(false)}
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

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Yangi chorva qoʻshish</h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {error && <div className="login-error">{error}</div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Name */}
                <div className="login-field" style={{ margin: 0 }}>
                  <label>Laqabi / Nomi *</label>
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masalan: Bo'g'doy"
                    required
                  />
                </div>

                {/* Type */}
                <div className="login-field" style={{ margin: 0 }}>
                  <label>Turi</label>
                  <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="qoramol">Qoramol</option>
                    <option value="qo'y">Qoʻy</option>
                    <option value="echki">Echki</option>
                  </select>
                </div>

                {/* Breed */}
                <div className="login-field" style={{ margin: 0 }}>
                  <label>Zoti *</label>
                  <input
                    type="text"
                    className="input"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="Masalan: Golshtayn"
                    required
                  />
                </div>

                {/* Gender */}
                <div className="login-field" style={{ margin: 0 }}>
                  <label>Jinsi</label>
                  <select className="input" value={gender} onChange={(e) => setGender(e.target.value)}>
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
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>

                {/* Weight */}
                <div className="login-field" style={{ margin: 0 }}>
                  <label>Ogʻirligi (kg)</label>
                  <input
                    type="number"
                    className="input"
                    min="1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>

                {/* Status */}
                <div className="login-field" style={{ margin: 0 }}>
                  <label>Sogʻliq holati</label>
                  <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
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
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Masalan: Ferma A — 1-oʻtov"
                    required
                  />
                </div>
              </div>

              {/* Conditional Daily Milk Yield */}
              {gender === 'urg\'ochi' && (type === 'qoramol' || type === 'echki') && (
                <div className="login-field" style={{ margin: 0 }}>
                  <label>Kundalik sut mahsuldorligi (litr)</label>
                  <input
                    type="number"
                    className="input"
                    min="0"
                    value={dailyMilk}
                    onChange={(e) => setDailyMilk(e.target.value)}
                  />
                </div>
              )}

              {/* Notes */}
              <div className="login-field" style={{ margin: 0 }}>
                <label>Qoʻshimcha eslatmalar</label>
                <textarea
                  className="input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Xarakteri yoki o'ziga xosligi..."
                  style={{ height: '70px', resize: 'vertical' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsAddOpen(false)}
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
    </div>
  );
}
