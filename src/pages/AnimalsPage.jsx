import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, PawPrint } from 'lucide-react';
import { animals } from '../data/mockData';

export default function AnimalsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

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

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>Hayvonlar roʻyxati</h2>
          <p>Fermadagi barcha hayvonlarning toʻliq roʻyxati va holati nazorati</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => alert('Yangi hayvon qoʻshish funksiyasi tez kunda ishga tushadi')}
          style={{ gap: '8px' }}
        >
          <Plus size={16} />
          Yangi qoʻshish
        </button>
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
    </div>
  );
}
