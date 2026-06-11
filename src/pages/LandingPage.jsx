import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  HelpCircle, 
  Users, 
  Calendar, 
  Calculator, 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  ChevronDown 
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import CowIcon from '../components/CowIcon';

export default function LandingPage() {
  const navigate = useNavigate();
  const { feedPlans, feedStock, currentUser } = useFarm();
  
  // Interactive Calculator States
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [animalCount, setAnimalCount] = useState(15);
  const [duration, setDuration] = useState(10);
  
  // FAQ accordion states
  const [activeFaq, setActiveFaq] = useState(null);

  // Set default calculator plan
  useEffect(() => {
    if (feedPlans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(feedPlans[0].id.toString());
    }
  }, [feedPlans, selectedPlanId]);

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, [feedPlans]);

  const currentPlan = feedPlans.find(p => p.id.toString() === selectedPlanId) || feedPlans[0];
  const currentPlanItems = currentPlan ? currentPlan.items : [];
  const currentPlanCost = currentPlan ? currentPlan.totalCost : 0;

  const calculateTotal = (amount) => {
    return (amount * animalCount * duration).toFixed(0);
  };

  const faqs = [
    {
      q: "Chorva Monitor platformasi o'zi nima?",
      a: "Bu chorvachilik fermalarini raqamli boshqarish, hayvonlar hisobini yuritish, emlash va davolash ishlarini monitoring qilish hamda ozuqa zaxiralarini rejalashtirish uchun mo'ljallangan zamonaviy intellektual tizimdir."
    },
    {
      q: "Qanday foydalanuvchilar tizimdan foydalanishi mumkin?",
      a: "Tizimda 3 ta asosiy rol mavjud: Ferma egalari/Adminlar (umumiy nazorat va xodimlar boshqaruvi), Fermerlar (hayvonlar va ozuqa zaxiralari boshqaruvi) hamda Veterinarlar (kasalliklar tarixi va emlash jadvallari boshqaruvi)."
    },
    {
      q: "Ozuqa kalkulyatori qanday ishlaydi?",
      a: "Tizimga kiritilgan ozuqa ratsioni andozalari asosida chorva turi, soni va kuniga ko'ra kerakli ozuqa sarfi avtomatik hisoblab beriladi hamda bitta tugma orqali real vaqt rejimida ombor zaxirasidan chegiriladi."
    },
    {
      q: "Sut mahsuldorligini qanday kuzatish mumkin?",
      a: "Har bir sog'in sigir/echki uchun kunlik sut miqdori qayd etib boriladi va boshqaruv panelida o'rtacha sut mahsuldorligi hamda umumiy dinamika diagrammalar ko'rinishida taqdim etiladi."
    }
  ];

  return (
    <div className="landing-layout" style={{ background: '#070b09', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Decorative Glowing Spotlights */}
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '40%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '20%', width: '380px', height: '380px', background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Grid Pattern Overlay */}
      <div 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          backgroundImage: 'radial-gradient(rgba(34, 197, 94, 0.08) 1px, transparent 1px)', 
          backgroundSize: '32px 32px', 
          opacity: 0.6, 
          pointerEvents: 'none', 
          zIndex: 1 
        }} 
      />

      {/* Navbar Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(34,197,94,0.1)', background: 'rgba(7, 11, 9, 0.8)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--green-primary) 0%, var(--green-dark) 100%)', width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
              <CowIcon size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.5px', color: '#fff', lineHeight: 1 }}>Chorva Monitor</h1>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>AQL-IDROK TIZIMI</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a href="#features" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }} className="nav-hover-link">Imkoniyatlar</a>
            <a href="#calculator" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }} className="nav-hover-link">Kalkulyator</a>
            <a href="#faq" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }} className="nav-hover-link">Savollar</a>
            
            {currentUser ? (
              <button 
                onClick={() => navigate('/dashboard')} 
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                Tizimga kirish <ArrowRight size={14} />
              </button>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                Tizimga kirish <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* 1. Hero Section */}
        <section style={{ padding: '80px 0 60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '6px 16px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', animation: 'pulse 3s infinite' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green-light)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--green-light)', letterSpacing: '0.5px' }}>CHORVACHILIKDA INTELLAKTUAL BOSHQARUV TIZIMI</span>
          </div>

          <h1 style={{ fontSize: '3.25rem', fontWeight: 900, lineHeight: 1.15, maxWidth: '850px', letterSpacing: '-0.5px', marginBottom: '24px', background: 'linear-gradient(180deg, #fff 40%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Chorva fermangizni <span style={{ color: 'var(--green-light)', background: 'linear-gradient(135deg, var(--green-light) 30%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>raqamli va aqlli</span> nazorat qiling!
          </h1>
          
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '650px', marginBottom: '40px', lineHeight: 1.6 }}>
            Boshqaruv paneli, real vaqt rejimidagi ozuqa hisob-kitoblari va chorva salomatligi tarixi — endi hammasi bitta xavfsiz PostgreSQL bazasida mujassam.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '60px' }}>
            {currentUser ? (
              <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem', gap: '10px' }}>
                Boshqaruv paneliga o'tish <ArrowRight size={18} />
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem', gap: '10px' }}>
                Demoni boshlash <ArrowRight size={18} />
              </button>
            )}
            <a href="#calculator" className="btn btn-secondary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
              Ozuqani hisoblash
            </a>
          </div>

          {/* Interactive Stat Graphic Mockup */}
          <div className="reveal" style={{ width: '100%', maxWidth: '850px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ width: '100%', background: 'rgba(7, 11, 9, 0.9)', borderRadius: '12px', padding: '24px 20px', border: '1px solid rgba(34,197,94,0.1)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              
              <div style={{ textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <Activity size={14} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>JAMI CHORVA</span>
                </div>
                <strong style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>12 bosh</strong>
                <p style={{ fontSize: '0.65rem', color: 'var(--green-light)', marginTop: '4px' }}>100% sog'lom va karantinda</p>
              </div>

              <div style={{ textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <TrendingUp size={14} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>SUT MAHSULOTI</span>
                </div>
                <strong style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--green-light)' }}>56.0 L / kun</strong>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>O'rtacha 18.6L boshiga</p>
              </div>

              <div style={{ textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <ShieldCheck size={14} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>SALOMATLIK</span>
                </div>
                <strong style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>8 sog'lom</strong>
                <p style={{ fontSize: '0.65rem', color: 'var(--accent-amber)', marginTop: '4px' }}>2 bosh davolanmoqda</p>
              </div>

              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <Calendar size={14} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>OZUQADAN KUNLAR</span>
                </div>
                <strong style={{ fontSize: '1.75rem', fontWeight: 800, color: '#3b82f6' }}>34 kunga</strong>
                <p style={{ fontSize: '0.65rem', color: 'var(--green-light)', marginTop: '4px' }}>Omborda zaxira yetarli</p>
              </div>

            </div>
          </div>
        </section>

        {/* 2. Platform Value Props (Features) */}
        <section id="features" style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>Platforma kimlar uchun moʻljallangan?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>Har bir xodimga oʻziga mos keladigan ish qurollari taqdim etiladi</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            
            {/* Card 1 */}
            <div className="glass-card reveal" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(34,197,94,0.1)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-light)' }}>
                <Users size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Fermerlar</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Chorvalar ro'yxatini shakllantirish, vazn va yoshni nazorat qilish, ozuqa sarfi kalkulyatori orqali ombor zaxirasidan yemlarni avtomatik chegirish va boshqarish imkoniyati.
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', listStyle: 'none', marginTop: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={12} color="var(--green-light)" /> Ozuqani real vaqtda chegirish</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={12} color="var(--green-light)" /> Sut mahsuldorligi hisobi</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={12} color="var(--green-light)" /> Hayvonlar toifalari filtrlari</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="glass-card reveal" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(59,130,246,0.1)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                <Activity size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Veterinarlar</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Har bir hayvonning kasallanish, emlash va profilaktik tadbirlari tarixini yuritish. Davolash jarayonlari yakunlanganda hayvon holatini avtomatik sog'lomga o'tkazish.
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', listStyle: 'none', marginTop: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={12} color="var(--green-light)" /> Tibbiy ko'riklar arxivi</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={12} color="var(--green-light)" /> Emlash jadvallari monitoringi</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={12} color="var(--green-light)" /> Davolash holatini boshqarish</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="glass-card reveal" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(168,85,247,0.1)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Tizim Adminlari</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Fermadagi barcha xodimlarni ro'yxatga olish, rollarini belgilash va o'chirish. Profil rasmlari, tizim sozlamalari va ma'lumotlar xavfsizligini ta'minlash.
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', listStyle: 'none', marginTop: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={12} color="var(--green-light)" /> Xodimlar CRUD rosteri</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={12} color="var(--green-light)" /> Neon DB PostgreSQL xavfsizligi</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={12} color="var(--green-light)" /> Ruxsatnomalar boshqaruvi</li>
              </ul>
            </div>

          </div>
        </section>

        {/* 3. Interactive Calculator Section */}
        <section id="calculator" style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center' }}>
            
            <div className="reveal">
              <span style={{ fontSize: '0.78rem', color: 'var(--green-light)', fontWeight: 700, letterSpacing: '0.5px' }}>INTERAKTIV KALKULYATOR</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginTop: '8px', marginBottom: '16px' }}>
                Ozuqa ratsioningizni hozirning o'zida hisoblang!
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Ratsion turi va chorva sonini tanlang. Bizning kalkulyatorimiz kunlik yem mikdorini hisoblab beradi. Tizimga kirgach, ushbu hisob-kitoblar bir zumda fermaning ozuqa omboridagi real zaxiralardan ayirib tashlanadi.
              </p>
              
              {/* Sliders Container */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Ratsion turi:</span>
                    <span style={{ color: 'var(--green-light)', fontWeight: 700 }}>
                      {currentPlan ? currentPlan.name : 'Yuklanmoqda...'}
                    </span>
                  </div>
                  <select 
                    className="input" 
                    value={selectedPlanId} 
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                  >
                    {feedPlans.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Chorva soni:</span>
                    <strong style={{ color: '#fff', fontSize: '1rem' }}>{animalCount} bosh</strong>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="150" 
                    value={animalCount}
                    onChange={(e) => setAnimalCount(parseInt(e.target.value))}
                    style={{ accentColor: 'var(--green-primary)', width: '100%', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Muddati (kun):</span>
                    <strong style={{ color: '#fff', fontSize: '1rem' }}>{duration} kun</strong>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="60" 
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    style={{ accentColor: 'var(--green-primary)', width: '100%', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>

            {/* Calculations Result card */}
            <div className="glass-card reveal" style={{ border: '1px solid rgba(34,197,94,0.2)', boxShadow: 'var(--shadow-glow)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--green-light)', marginBottom: '16px' }}>
                <Calculator size={18} />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>RATSION HISOBI</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {currentPlanItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                    <strong style={{ color: '#fff' }}>{calculateTotal(item.amount)} {item.unit}</strong>
                  </div>
                ))}
                {currentPlanItems.length === 0 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '12px' }}>
                    Ratsionlar yuklanmoqda...
                  </div>
                )}
              </div>

              <div style={{ background: 'rgba(34, 197, 94, 0.04)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mavsumiy narxi:</span>
                <strong style={{ color: 'var(--green-light)', fontSize: '1.15rem', fontWeight: 900 }}>
                  {((currentPlan ? currentPlan.totalCost : 0) * animalCount * duration).toLocaleString('uz-UZ')} soʻm
                </strong>
              </div>

              <button 
                onClick={() => navigate('/login')} 
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '20px', justifyContent: 'center', gap: '8px' }}
              >
                Tizimda sinab ko'rish <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </section>

        {/* 4. FAQ Section */}
        <section id="faq" style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>Koʻp soʻraladigan savollar</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>Chorva Monitor haqida qiziqtirgan savollaringizga tezkor javoblar</p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="glass-card reveal" 
                style={{ padding: '16px 20px', cursor: 'pointer', transition: 'all 0.25s' }}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <HelpCircle size={16} color="var(--green-light)" />
                    {faq.q}
                  </h4>
                  <ChevronDown 
                    size={16} 
                    style={{ transform: activeFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: 'var(--text-muted)' }} 
                  />
                </div>
                {activeFaq === idx && (
                  <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '26px', borderLeft: '2px solid var(--green-primary)' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{ background: '#040706', borderTop: '1px solid rgba(34,197,94,0.1)', padding: '40px 0', marginTop: '80px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(34,197,94,0.1)', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CowIcon size={16} color="var(--green-light)" />
            </div>
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>Chorva Monitor</span>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>&copy; 2026 Ziyoda. Barcha huquqlar himoyalangan.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span style={{ cursor: 'pointer' }} className="nav-hover-link" onClick={() => navigate('/login')}>Fermer kirish</span>
            <span style={{ cursor: 'pointer' }} className="nav-hover-link" onClick={() => navigate('/login')}>Veterinar kirish</span>
            <span style={{ cursor: 'pointer' }} className="nav-hover-link" onClick={() => navigate('/login')}>Admin kirish</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
