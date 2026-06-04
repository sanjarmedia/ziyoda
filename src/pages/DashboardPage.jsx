import React from 'react';
import { 
  TrendingUp, 
  Activity, 
  ShieldAlert, 
  Heart, 
  Milk, 
  Calendar,
  AlertCircle,
  Wheat
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  animals, 
  dashboardStats, 
  monthlyAnimalData, 
  animalTypeData, 
  recentActivities 
} from '../data/mockData';
import CowIcon from '../components/CowIcon';

export default function DashboardPage() {
  const activeSick = animals.filter(a => a.status === 'davolanmoqda').length;
  const activeQuarantine = animals.filter(a => a.status === 'karantin').length;
  const activeHealthy = animals.filter(a => a.status === 'sog\'lom').length;

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header">
        <div>
          <h2>Boshqaruv paneli</h2>
          <p>Tizimning umumiy holati va asosiy koʻrsatkichlar monitoringi</p>
        </div>
      </header>

      {/* Primary Stats Grid */}
      <section className="stats-grid">
        <div className="glass-card stat-card blue">
          <div className="stat-card-content">
            <div>
              <div className="stat-card-value">{animals.length} bosh</div>
              <div className="stat-card-label">Jami chorva</div>
            </div>
            <div className="stat-card-icon">
              <CowIcon size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card stat-card green">
          <div className="stat-card-content">
            <div>
              <div className="stat-card-value">{activeHealthy} bosh</div>
              <div className="stat-card-label">Sogʻlom holatda</div>
            </div>
            <div className="stat-card-icon">
              <Heart size={22} />
            </div>
          </div>
        </div>

        <div className="glass-card stat-card red">
          <div className="stat-card-content">
            <div>
              <div className="stat-card-value">{activeSick} bosh</div>
              <div className="stat-card-label">Davolanmoqda</div>
            </div>
            <div className="stat-card-icon">
              <Activity size={22} />
            </div>
          </div>
        </div>

        <div className="glass-card stat-card amber">
          <div className="stat-card-content">
            <div>
              <div className="stat-card-value">{activeQuarantine} bosh</div>
              <div className="stat-card-label">Karantinda</div>
            </div>
            <div className="stat-card-icon">
              <ShieldAlert size={22} />
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Mini-Stats Grid */}
      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: '32px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="stat-card-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: 'var(--green-primary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Milk size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{dashboardStats.totalMilkToday} litr</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bugungi sut mahsuldorligi</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="stat-card-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wheat size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{dashboardStats.feedStockDays} kunlik</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ozuqa zaxirasi kafolati</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="stat-card-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: 'var(--accent-purple)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{dashboardStats.totalVetVisits} ta faol</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Joriy tibbiy ko'riklar</div>
          </div>
        </div>
      </section>

      {/* Charts Grid */}
      <section className="charts-grid">
        <div className="glass-card chart-card">
          <h3>Chorva bosh soni oʻzgarishi (Yillik)</h3>
          <div style={{ marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyAnimalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 197, 94, 0.06)" />
                <XAxis dataKey="month" stroke="#6b8f7b" style={{ fontSize: '0.78rem' }} />
                <YAxis stroke="#6b8f7b" style={{ fontSize: '0.78rem' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111916', 
                    borderColor: 'rgba(34, 197, 94, 0.2)',
                    color: '#f0fdf4',
                    borderRadius: '8px'
                  }} 
                />
                <Legend style={{ fontSize: '0.8rem' }} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Chorva soni (bosh)" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card chart-card">
          <h3>Chorva turlari taqsimoti</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={animalTypeData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {animalTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#111916', 
                    borderColor: 'rgba(34, 197, 94, 0.2)',
                    color: '#f0fdf4',
                    borderRadius: '8px'
                  }} 
                />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" style={{ fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Bottom Activity and Alerts Grid */}
      <section className="charts-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="glass-card chart-card">
          <h3>Oxirgi harakatlar</h3>
          <div className="activity-list" style={{ marginTop: '16px' }}>
            {recentActivities.map((act) => (
              <div key={act.id} className="activity-item">
                <div className="activity-icon">{act.icon}</div>
                <div className="activity-text">{act.text}</div>
                <div className="activity-time">{act.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card chart-card">
          <h3>Faol tibbiy nazoratdagi chorvalar</h3>
          <div className="activity-list" style={{ marginTop: '16px' }}>
            {animals.filter(a => a.status !== 'sog\'lom').map(animal => (
              <div key={animal.id} className="activity-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{animal.image}</span>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{animal.name} ({animal.tag})</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Joylashuv: {animal.location}</div>
                  </div>
                </div>
                <span className={`badge ${animal.status === 'karantin' ? 'badge-quarantine' : 'badge-sick'}`}>
                  {animal.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
