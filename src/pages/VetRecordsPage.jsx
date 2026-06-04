import React, { useState } from 'react';
import { Search, Filter, Stethoscope, Table, LayoutGrid } from 'lucide-react';
import { vetRecords } from '../data/mockData';

export default function VetRecordsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

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

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>Veterinar yozuvlar</h2>
          <p>Tibbiy koʻriklar, kasalliklarni davolash, emlashlar va profilaktika tadbirlari tarixi</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Jami xarajat:</div>
          <strong style={{ fontSize: '1.25rem', color: 'var(--green-light)', fontWeight: 800 }}>{totalCost.toLocaleString('uz-UZ')} soʻm</strong>
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
    </div>
  );
}
