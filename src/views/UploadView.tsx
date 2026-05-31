import { useState, useRef } from 'react';
import {
  UploadCloud, Mail, Database, ShieldCheck, Search, Rocket,
  DollarSign, Calculator, AlertTriangle, ArrowDown, Cpu, LogOut, User, Download
} from 'lucide-react';
import Papa from 'papaparse';
import { addRecordsFromCSV } from '../lib/db';
import type { RawCSVRow } from '../lib/db';
import { GoogleOAuthModal } from '../components/GoogleOAuthModal';

interface UploadViewProps {
  onStartDiagnosis: () => void;
  userEmail: string;
  onLogout: () => void;
}

export function UploadView({ onStartDiagnosis, userEmail, onLogout }: UploadViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const [showGoogleAuth, setShowGoogleAuth] = useState(false);

  const [monthlyRevenue, setMonthlyRevenue] = useState(50000);
  const [lostDeals, setLostDeals] = useState(8);

  const averageDealValue = Math.round(monthlyRevenue * 0.15);
  const estimatedMonthlyLoss = Math.round(lostDeals * averageDealValue);
  const potentialRecoverable = Math.round(estimatedMonthlyLoss * 0.45);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const { limitHit } = await addRecordsFromCSV(results.data as RawCSVRow[]);
        if (limitHit) {
          localStorage.setItem('rrio_limit_hit', 'true');
        } else {
          localStorage.removeItem('rrio_limit_hit');
        }
        onStartDiagnosis();
      },
      error: (error: Error) => {
        console.error('Error parsing CSV:', error);
        alert('CSV yüklenirken bir hata oluştu.');
      },
    });
  };

  const handleGoogleSuccess = () => {
    setShowGoogleAuth(false);
    onStartDiagnosis();
  };

  const handleLoadDemoData = async () => {
    const demoCSV = [
      { Company: 'Apex Enerji Ltd.', Contact: 'Mert Aksoy (Satış Md.)', Project: 'Yapay Zeka Danışmanlığı', Revenue: '9800', LastContactDays: '45' },
      { Company: 'Nova Retail A.Ş.', Contact: 'Ebru Şahin (CFO)', Project: 'CRM Entegrasyonu Lisansı', Revenue: '3500', LastContactDays: '15' },
      { Company: 'Atlas Bilişim', Contact: 'Burak Yalçın (CTO)', Project: 'Yıllık Bakım Anlaşması', Revenue: '5400', LastContactDays: '12' },
      { Company: 'Karya Teknoloji', Contact: 'Deniz Eren (Kurucu)', Project: 'Mobil Uygulama Arayüzü', Revenue: '12000', LastContactDays: '210' },
      { Company: 'Vortex Global', Contact: 'Hakan Çelik (Direktör)', Project: 'Bulut Altyapı Desteği', Revenue: '1600', LastContactDays: '120' },
    ];
    const { limitHit } = await addRecordsFromCSV(demoCSV);
    if (limitHit) {
      localStorage.setItem('rrio_limit_hit', 'true');
    } else {
      localStorage.removeItem('rrio_limit_hit');
    }
    onStartDiagnosis();
  };

  const handleDownloadTemplate = () => {
    const header = 'Company,Contact,Project,Revenue,LastContactDays,Email,Phone';
    const rows = [
      '"Apex Teknoloji A.Ş.","Mert Aksoy (CEO)","Yapay Zeka Danışmanlığı",9800,45,mert@apextek.com.tr,+905321234567',
      '"Nova Retail A.Ş.","Ebru Şahin (CFO)","CRM Lisansı Yenileme",3500,15,ebru@novaretail.com,+905449876543',
      '"Atlas Bilişim","Burak Yalçın (CTO)","Yıllık Bakım Anlaşması",5400,12,burak@atlasbilisim.com,+905557654321',
      '"Karya Teknoloji","Deniz Eren (Kurucu)","Mobil Uygulama Arayüzyüzü",12000,210,deniz@karya.io,',
      '"Vortex Global","Hakan Çelik (Direktör)","Bulut Altyapı Desteği",1600,120,hakan@vortexglobal.com,+905554567890',
    ];
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rrio_musteri_sablonu.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page-full animate-in">

      {/* ── TOPBAR ── */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="topbar-brand">
            <div className="topbar-brand-icon">
              <Cpu size={18} className="animate-pulse-slow" />
            </div>
            <span className="topbar-brand-name">RRIO RRS</span>
          </div>

          <div className="topbar-actions">
            <span className="user-pill">
              <User size={12} />
              {userEmail.split('@')[0]}
            </span>
            <button
              onClick={onLogout}
              className="btn btn-outline"
              style={{ padding: '0.5rem 0.875rem', minHeight: '40px', fontSize: '0.75rem' }}
            >
              <LogOut size={14} /> Çıkış
            </button>
          </div>
        </div>
      </header>

      {/* ── GOOGLE OAUTH MODAL ── */}
      {showGoogleAuth && (
        <GoogleOAuthModal
          onClose={() => setShowGoogleAuth(false)}
          onSuccess={handleGoogleSuccess}
        />
      )}

      <div className="page-container" style={{ paddingTop: '3.5rem', paddingBottom: '4rem' }}>

        {/* ── HERO ── */}
        <div className="animate-in" style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 5rem' }}>
          <div className="hero-badge">
            <Cpu size={12} /> Gelir Kaçağı İşletim Sistemi
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.035em',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            color: 'var(--text-main)',
          }}>
            Gelirinizin Nereye Sızdığını{' '}
            <span style={{ color: 'var(--accent-primary)', textShadow: '0 0 30px var(--glow-primary)' }}>
              Sessizce İzlemeyi Bırakın
            </span>
          </h1>

          <p style={{
            fontSize: '1.0625rem',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            marginBottom: '2rem',
            maxWidth: '640px',
            margin: '0 auto 2rem',
          }}>
            RRIO, e-posta ve CRM verilerinizdeki unutulmuş takipleri, askıda kalmış teklifleri ve 
            çürüyen abonelikleri saniyeler içinde analiz eder. Kaçak cirolarınızı listeler ve kurtarır.
          </p>

          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '0.875rem', justifyContent: 'center',
          }}>
            <button onClick={scrollToUpload} className="btn btn-primary">
              Hemen Teşhis Et <ArrowDown size={16} />
            </button>
            <button onClick={handleLoadDemoData} className="btn btn-glow-orange">
              🚀 Hazır Demo Verisiyle Dene
            </button>
          </div>
        </div>

        {/* ── FEATURE CARDS ── */}
        <div className="grid-3" style={{ marginBottom: '4rem' }}>
          <div className="feature-card fc-cyan">
            <div className="feature-icon" style={{ marginBottom: '1.25rem' }}>
              <Database size={24} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.625rem', color: 'var(--text-main)' }}>
              1. Veri Entegrasyonu
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Geçmiş e-posta veya CRM verilerinizi saniyeler içinde analiz motoruna bağlayın.
            </p>
          </div>

          <div className="feature-card fc-orange">
            <div className="feature-icon" style={{ marginBottom: '1.25rem' }}>
              <Search size={24} style={{ color: 'var(--neon-orange)' }} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.625rem', color: 'var(--text-main)' }}>
              2. Gelir Kaçağı Teşhisi
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Unutulmuş takipleri, askıda kalmış teklifleri ve soğuyan müşterileri bulur.
            </p>
          </div>

          <div className="feature-card fc-green">
            <div className="feature-icon" style={{ marginBottom: '1.25rem' }}>
              <Rocket size={24} style={{ color: 'var(--status-success)' }} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.625rem', color: 'var(--text-main)' }}>
              3. Olay Güdümlü Kurtarma
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Her kaçağa özel kurtarma şablonları oluşturur ve kurtarma döngüsünü başlatır.
            </p>
          </div>
        </div>

        {/* ── CALCULATOR ── */}
        <div className="glass-panel" style={{ maxWidth: '860px', margin: '0 auto 4rem', position: 'relative' }}>
          {/* Corner tag */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            background: 'rgba(13,211,255,0.12)', color: 'var(--accent-primary)',
            border: '1px solid rgba(13,211,255,0.22)',
            borderRadius: '0 var(--r-lg) 0 var(--r-md)',
            padding: '0.375rem 0.875rem',
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Hızlı Hesaplayıcı
          </div>

          <div style={{ padding: '2rem 2rem 1.5rem' }}>
            <h2 style={{
              fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              color: 'var(--text-main)',
            }}>
              <Calculator size={22} style={{ color: 'var(--accent-primary)' }} />
              Olası Gelir Sızıntınızı Hesaplayın
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.5rem',
            }}>
              {/* Controls */}
              <div className="stack-lg">
                <div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                  }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      Aylık Ortalama Cironuz
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      ${monthlyRevenue.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range" min="5000" max="500000" step="5000"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                  />
                </div>

                <div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                  }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      Aylık Kayıp Fırsatlar
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {lostDeals} Teklif
                    </span>
                  </div>
                  <input
                    type="range" min="1" max="50" step="1"
                    value={lostDeals}
                    onChange={(e) => setLostDeals(Number(e.target.value))}
                    className="range-orange"
                  />
                </div>
              </div>

              {/* Output Panel */}
              <div className="calc-output">
                <div>
                  <span className="form-label" style={{ marginBottom: '0.375rem' }}>
                    Hesaplanan Aylık Kaçak Gelir
                  </span>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                    fontSize: '2rem', fontWeight: 800,
                    color: 'var(--status-danger)',
                    textShadow: '0 0 20px var(--glow-danger)',
                    marginBottom: '0.375rem',
                  }}>
                    <DollarSign size={26} />
                    {estimatedMonthlyLoss.toLocaleString()}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                    Fırsat ortalama değeri: ${averageDealValue.toLocaleString()}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  <span className="form-label" style={{ color: 'var(--accent-primary)', marginBottom: '0.375rem' }}>
                    RRS İle Geri Kazanılabilir
                  </span>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                    fontSize: '1.625rem', fontWeight: 800,
                    color: 'var(--status-success)',
                    textShadow: '0 0 20px var(--glow-success)',
                    marginBottom: '0.375rem',
                  }}>
                    <DollarSign size={22} />
                    {potentialRecoverable.toLocaleString()} / Ay
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <AlertTriangle size={10} style={{ color: 'var(--status-warning)', flexShrink: 0 }} />
                    Ortalama %45 geri kazanım başarı oranı
                  </p>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button onClick={scrollToUpload} className="btn btn-glow-orange">
                Kaçakları Tespit Et <ArrowDown size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── UPLOAD SECTION ── */}
        <div
          ref={uploadSectionRef}
          className="glass-panel"
          style={{
            maxWidth: '760px', margin: '0 auto',
            border: '1px solid rgba(255,126,71,0.12)',
            scrollMarginTop: '80px',
          }}
        >
          {/* Top accent line */}
          <div style={{
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,126,71,0.6) 40%, rgba(13,211,255,0.4) 70%, transparent 100%)',
          }} />

          <div style={{ padding: '2.5rem 2.5rem 2rem', textAlign: 'center' }}>

            {/* Upload icon */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '68px', height: '68px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,126,71,0.1) 0%, rgba(255,126,71,0.04) 100%)',
              border: '1px solid rgba(255,126,71,0.22)',
              marginBottom: '1.25rem',
              boxShadow: '0 0 28px rgba(255,126,71,0.08)',
            }}>
              <UploadCloud size={28} style={{ color: 'var(--neon-orange)' }} className="animate-pulse-slow" />
            </div>

            <h2 style={{
              fontSize: '1.625rem', fontWeight: 800, marginBottom: '0.625rem',
              letterSpacing: '-0.025em', color: 'var(--text-main)',
            }}>
              Zeka Teşhis Motorunu Başlatın
            </h2>

            <p style={{
              fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.75,
              maxWidth: '440px', margin: '0 auto',
            }}>
              Verileriniz tamamen yerel tarayıcınızda işlenir. Sunucularımıza hiçbir hassas ciro
              veya e-posta verisi yüklenmez. <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>%100 Gizlilik Güvencesi.</span>
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--border)', margin: '0 2.5rem' }} />

          {/* Action Tiles */}
          <div style={{ padding: '1.75rem 2.5rem' }}>
            <p style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--text-faint)',
              textAlign: 'center', marginBottom: '1.25rem',
            }}>
              Veri Kaynağı Seçin
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              style={{ display: 'none' }}
            />

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              {/* Google Workspace Tile */}
              <button
                className="action-tile action-tile-google"
                onClick={() => setShowGoogleAuth(true)}
                style={{ padding: '1.25rem 1.5rem', minHeight: '72px' }}
              >
                <div className="icon-box" style={{ width: '44px', height: '44px', flexShrink: 0 }}>
                  <Mail size={20} />
                </div>
                <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                  <span style={{
                    display: 'block', fontWeight: 700, fontSize: '0.9375rem',
                    color: 'var(--text-main)', marginBottom: '0.2rem',
                  }}>
                    Google Workspace Tarama
                  </span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Gmail &amp; Takvim veri akışlarını simüle edin
                  </span>
                </div>
                <div style={{
                  fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: 'var(--accent-primary)',
                  background: 'rgba(13,211,255,0.08)', border: '1px solid rgba(13,211,255,0.18)',
                  padding: '0.3rem 0.65rem', borderRadius: 'var(--r-full)', flexShrink: 0,
                }}>
                  OAuth
                </div>
              </button>

              {/* CSV / CRM Tile */}
              <button
                className="action-tile action-tile-crm"
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: '1.25rem 1.5rem', minHeight: '72px' }}
              >
                <div className="icon-box" style={{ width: '44px', height: '44px', flexShrink: 0 }}>
                  <Database size={20} />
                </div>
                <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                  <span style={{
                    display: 'block', fontWeight: 700, fontSize: '0.9375rem',
                    color: 'var(--text-main)', marginBottom: '0.2rem',
                  }}>
                    Müşteri / CRM Verisi Yükle
                  </span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    CSV dosyanızı yerel analiz motoruna aktarın
                  </span>
                </div>
                <div style={{
                  fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: 'var(--status-info)',
                  background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.18)',
                  padding: '0.3rem 0.65rem', borderRadius: 'var(--r-full)', flexShrink: 0,
                }}>
                  CSV
                </div>
              </button>
            </div>

            {/* CSV Template Download Helper */}
            <div style={{
              textAlign: 'center',
              paddingTop: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                CSV kolonları hakkında bilgi almak için:
              </span>
              <button
                onClick={handleDownloadTemplate}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.72rem', fontWeight: 700,
                  color: 'var(--accent-primary)',
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  padding: '0.2rem 0',
                  textDecoration: 'underline',
                  textDecorationColor: 'rgba(13,211,255,0.35)',
                  textUnderlineOffset: '2px',
                }}
              >
                <Download size={11} /> Örnek CSV Şablonu İndir
              </button>
            </div>
          </div>

          {/* Security Badges — completely separated */}
          <div style={{
            borderTop: '1px solid var(--border)',
            padding: '1rem 2.5rem',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-faint)',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              <ShieldCheck size={13} style={{ color: 'var(--status-success)', flexShrink: 0 }} />
              Enterprise-Grade Security
            </span>
            <div style={{ width: '1px', height: '14px', background: 'var(--border)' }} />
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-faint)',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              🛡️ %100 KVKK &amp; GDPR Uyumlu Local Sandbox
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
