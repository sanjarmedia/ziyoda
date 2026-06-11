import React, { useState } from 'react';
import { Search, Filter, Stethoscope, Table, LayoutGrid, Plus, X } from 'lucide-react';
import { useFarm } from '../context/FarmContext';

export default function VetRecordsPage() {
  const { vetRecords, addVetRecord, updateVetRecord, animals, currentUser, isInitialLoading } = useFarm();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [animalId, setAnimalId] = useState(animals[0]?.id || '');
  const [recordType, setRecordType] = useState('Tekshiruv');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [cost, setCost] = useState('');
  const [status, setStatus] = useState('davom etmoqda');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const filteredRecords = vetRecords.filter((record) => {
    const matchesSearch = 
      record.animalName.toLowerCase().includes(search.toLowerCase()) ||
      record.animalTag.toLowerCase().includes(search.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      record.doctor.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalCost = filteredRecords.reduce((acc, curr) => acc + curr.cost, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!animalId) {
      setError('Iltimos, hayvonni tanlang!');
      return;
    }

    if (!diagnosis.trim() || !treatment.trim()) {
      setError('Iltimos, tashxis va muolajani kiriting!');
      return;
    }

    const selectedAnimal = animals.find(a => a.id === parseInt(animalId));
    if (!selectedAnimal) {
      setError('Tanlangan hayvon topilmadi!');
      return;
    }

    addVetRecord({
      animalId: selectedAnimal.id,
      animalName: selectedAnimal.name,
      animalTag: selectedAnimal.tag,
      type: recordType,
      diagnosis: diagnosis.trim(),
      treatment: treatment.trim(),
      doctor: currentUser?.fullName || 'Karimova Dilnoza',
      status,
      cost: parseFloat(cost) || 0,
      notes: notes.trim()
    });

    // Reset Form
    setAnimalId(animals[0]?.id || '');
    setRecordType('Tekshiruv');
    setDiagnosis('');
    setTreatment('');
    setCost('');
    setStatus('davom etmoqda');
    setNotes('');
    setIsAddOpen(false);
  };

  const getRecordTypeBadge = (type) => {
    switch (type) {
      case 'Emlash':
        return 'badge-healthy';
      case 'Davolash':
        return 'badge-sick';
      case 'Tekshiruv':
        return 'badge-treating';
      default:
        return 'badge-treating';
    }
  };

  if (isInitialLoading) {
    return (
      <div className="page-container animate-fade-in">
        <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div className="skeleton skeleton-title" style={{ height: '32px', width: '250px', marginBottom: '12px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '400px' }}></div>
          </div>
          <div className="skeleton skeleton-button" style={{ width: '130px', height: '38px' }}></div>
        </header>

        <div className="filters-bar">
          <div className="skeleton" style={{ flex: 1, height: '42px', borderRadius: 'var(--radius-sm)' }}></div>
          <div className="skeleton" style={{ width: '150px', height: '42px', borderRadius: 'var(--radius-sm)' }}></div>
          <div className="skeleton" style={{ width: '150px', height: '42px', borderRadius: 'var(--radius-sm)' }}></div>
          <div className="skeleton" style={{ width: '100px', height: '42px', borderRadius: 'var(--radius-sm)' }}></div>
        </div>

        {/* Skeleton Table Card */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div className="skeleton" style={{ width: '80px', height: '24px' }}></div>
                <div className="skeleton" style={{ width: '120px', height: '24px' }}></div>
                <div className="skeleton" style={{ flex: 2, height: '24px' }}></div>
                <div className="skeleton" style={{ flex: 1, height: '24px' }}></div>
                <div className="skeleton" style={{ width: '100px', height: '24px' }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>Veterinar yozuvlar</h2>
          <p>Tibbiy koʻriklar, kasalliklarni davolash, emlashlar va profilaktika tadbirlari tarixi</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Jami xarajat:</div>
            <strong style={{ fontSize: '1.25rem', color: 'var(--green-light)', fontWeight: 800 }}>{totalCost.toLocaleString('uz-UZ')} soʻm</strong>
          </div>
          {currentUser?.role !== 'fermer' && (
            <button 
              className="btn btn-primary" 
              onClick={() => setIsAddOpen(true)}
              style={{ gap: '8px' }}
            >
              <Plus size={16} />
              Yozuv qoʻshish
            </button>
          )}
        </div>
      </header>

      {/* Filters and Controls */}
      <div className="filters-bar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
          <input
            type="text"
            className="input"
            placeholder="Hayvon nomi, tegi, tashxis yoki shifokor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: '300px' }}
          />

          <select 
            className="input" 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ maxWidth: '160px' }}
          >
            <option value="all">Barcha turlar</option>
            <option value="Tekshiruv">Tekshiruv</option>
            <option value="Davolash">Davolash</option>
            <option value="Emlash">Emlash</option>
          </select>

          <select 
            className="input" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ maxWidth: '160px' }}
          >
            <option value="all">Barcha holatlar</option>
            <option value="davom etmoqda">Davom etmoqda</option>
            <option value="yakunlangan">Yakunlangan</option>
          </select>
        </div>

        {/* View Mode Toggle Buttons */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', padding: '4px', borderRadius: '8px' }}>
          <button 
            onClick={() => setViewMode('table')} 
            style={{ 
              background: viewMode === 'table' ? 'var(--green-primary)' : 'transparent',
              color: viewMode === 'table' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <Table size={14} />
            Jadval
          </button>
          <button 
            onClick={() => setViewMode('card')} 
            style={{ 
              background: viewMode === 'card' ? 'var(--green-primary)' : 'transparent',
              color: viewMode === 'card' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <LayoutGrid size={14} />
            Karta
          </button>
        </div>
      </div>

      {/* Render Table or Card view depending on selected mode */}
      {filteredRecords.length > 0 ? (
        viewMode === 'table' ? (
          /* Table View Mode */
          <div className="glass-card table-container">
            <table>
              <thead>
                <tr>
                  <th>Sana</th>
                  <th>Hayvon</th>
                  <th>Turi</th>
                  <th>Tashxis / Sabab</th>
                  <th>Muolaja / Dori</th>
                  <th>Veterinar</th>
                  <th style={{ textAlign: 'right' }}>Xarajat</th>
                  <th>Holati</th>
                  {currentUser?.role !== 'fermer' && <th style={{ textAlign: 'center' }}>Amallar</th>}
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{record.date}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {record.animalName} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.78rem' }}>({record.animalTag})</span>
                    </td>
                    <td>
                      <span className={`badge ${getRecordTypeBadge(record.type)}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                        {record.type}
                      </span>
                    </td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={record.diagnosis}>
                      {record.diagnosis}
                    </td>
                    <td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={record.treatment}>
                      {record.treatment}
                    </td>
                    <td>{record.doctor}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--green-light)' }}>
                      {record.cost.toLocaleString('uz-UZ')} so'm
                    </td>
                    <td>
                      <span className={`badge ${record.status === 'yakunlangan' ? 'badge-healthy' : 'badge-treating'}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                        {record.status}
                      </span>
                    </td>
                    {currentUser?.role !== 'fermer' && (
                      <td style={{ textAlign: 'center' }}>
                        {record.status === 'davom etmoqda' ? (
                          <button
                            onClick={() => updateVetRecord(record.id, { status: 'yakunlangan' })}
                            className="btn btn-secondary"
                            style={{ padding: '2px 6px', fontSize: '0.7rem', height: 'auto', display: 'inline-block' }}
                          >
                            Yakunlash
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Card View Mode */
          <section className="animals-grid">
            {filteredRecords.map((record) => (
              <div key={record.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={`badge ${getRecordTypeBadge(record.type)}`}>
                        {record.type}
                      </span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                        {record.animalName} ({record.animalTag})
                      </h4>
                    </div>
                    <span className={`badge ${record.status === 'yakunlangan' ? 'badge-healthy' : 'badge-treating'}`}>
                      {record.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="detail-row">
                      <span className="detail-row-label">Tashxis / Sabab</span>
                      <span className="detail-row-value" style={{ textAlign: 'right', maxWidth: '180px', wordBreak: 'break-word' }}>{record.diagnosis}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-row-label">Muolaja / Emlash</span>
                      <span className="detail-row-value" style={{ textAlign: 'right', maxWidth: '180px', wordBreak: 'break-word' }}>{record.treatment}</span>
                    </div>
                    {record.notes && (
                      <div className="detail-row" style={{ borderBottom: 'none' }}>
                        <span className="detail-row-label">Eslatmalar</span>
                        <span className="detail-row-value" style={{ textAlign: 'right', maxWidth: '180px', wordBreak: 'break-word', color: 'var(--text-muted)' }}>{record.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '12px', marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Sana: <strong>{record.date}</strong></span>
                  <span>Ko'rik: <strong>{record.doctor}</strong></span>
                  <span>Xarajat: <strong style={{ color: 'var(--green-light)' }}>{record.cost.toLocaleString('uz-UZ')} so'm</strong></span>
                </div>
                {record.status === 'davom etmoqda' && currentUser?.role !== 'fermer' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                    <button
                      onClick={() => updateVetRecord(record.id, { status: 'yakunlangan' })}
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem', width: '100%', justifyContent: 'center' }}
                    >
                      Tadbirni yakunlash
                    </button>
                  </div>
                )}
              </div>
            ))}
          </section>
        )
      ) : (
        <div className="glass-card no-results">
          <Stethoscope size={48} style={{ margin: '0 auto 16px', color: 'var(--text-muted)' }} />
          <h3>Tibbiy yozuvlar topilmadi</h3>
          <p>Qidiruv shartlarini oʻzgartirib koʻring.</p>
        </div>
      )}
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

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>Yangi tibbiy koʻrik yozuvi</h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {error && <div className="login-error">{error}</div>}

              {/* Animal Select */}
              <div className="login-field" style={{ margin: 0 }}>
                <label>Hayvonni tanlang *</label>
                <select 
                  className="input" 
                  value={animalId} 
                  onChange={(e) => setAnimalId(e.target.value)}
                  required
                >
                  <option value="" disabled>Hayvonni tanlang</option>
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.tag})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                {/* Type */}
                <div className="login-field" style={{ flex: 1, margin: 0 }}>
                  <label>Tekshiruv turi</label>
                  <select className="input" value={recordType} onChange={(e) => setRecordType(e.target.value)}>
                    <option value="Tekshiruv">Tekshiruv</option>
                    <option value="Davolash">Davolash</option>
                    <option value="Emlash">Emlash</option>
                  </select>
                </div>

                {/* Status */}
                <div className="login-field" style={{ flex: 1, margin: 0 }}>
                  <label>Muolaja holati</label>
                  <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
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
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Masalan: Mastit yoki Profilaktik emlash"
                  required
                />
              </div>

              {/* Treatment */}
              <div className="login-field" style={{ margin: 0 }}>
                <label>Muolaja / Dori / Vaksina *</label>
                <input
                  type="text"
                  className="input"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  placeholder="Masalan: Antibiotik terapiya"
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
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="Masalan: 120000"
                />
              </div>

              {/* Notes */}
              <div className="login-field" style={{ margin: 0 }}>
                <label>Eslatmalar</label>
                <textarea
                  className="input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Qo'shimcha tafsilotlar..."
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

