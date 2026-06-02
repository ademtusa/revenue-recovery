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
        alert('An error occurred while loading CSV.');
      },
    });
  };

  const handleGoogleSuccess = () => {
    setShowGoogleAuth(false);
    onStartDiagnosis();
  };

  const handleLoadSectorDemoData = async (sector: 'ecommerce' | 'agency' | 'membership') => {
    localStorage.setItem('rrio_revenue_records', '[]');
    
    let demoCSV: RawCSVRow[] = [];
    if (sector === 'ecommerce') {
      demoCSV = [
        { Company: 'TrendFashion Apparel Ltd.', Contact: 'Melissa White (E-Comm Mgr)', Project: 'Abandoned Cart & Checkout Recovery', Revenue: '18400', LastContactDays: '14', Email: 'meltem@trendmoda.com.tr' },
        { Company: 'HomeGoods World', Contact: 'Kevin Drake (Founder)', Project: 'Wholesale Order Form Abandonment', Revenue: '42000', LastContactDays: '45', Email: 'kaan@zuccaciyedunyasi.com' },
        { Company: 'Cosmetics Depot', Contact: 'Sarah King (CFO)', Project: 'Annual B2B Supply Contract', Revenue: '75000', LastContactDays: '120', Email: 'seda.kaya@kozmetikdeposu.com' },
        { Company: 'PetShop Market', Contact: 'Alex Cole (Operations)', Project: 'Monthly Recurring Food Plan Cancel', Revenue: '3200', LastContactDays: '30', Email: 'ali@petshoppazari.com' },
        { Company: 'Gourmet Delights', Contact: 'Zoe Taylor (Sales)', Project: 'Corporate Gift Order Follow-up', Revenue: '9800', LastContactDays: '21', Email: 'zeynep@gurmelezzetler.io' },
        { Company: 'SmartHome Turkey', Contact: 'Omar Steel (General Manager)', Project: 'Smart Home Packages Sales Offer', Revenue: '28000', LastContactDays: '210', Email: 'omer@smarthome.com.tr' },
        { Company: 'ModaLine Design', Contact: 'Dennis Lion (Design Director)', Project: 'VIP Fabric Purchase Price Offer', Revenue: '15000', LastContactDays: '90', Email: 'deniz.aslan@modaline.com' },
        { Company: 'Elektronik Center', Contact: 'Sam Star (Category Mgr)', Project: 'Bulk Monitor Order Pending', Revenue: '55000', LastContactDays: '60', Email: 'selim.yildiz@elektronikcenter.com' },
      ];
    } else if (sector === 'agency') {
      demoCSV = [
        { Company: 'Alpha Software & Consulting', Contact: 'Adam Yilmaz (CEO)', Project: 'Digital Marketing Monthly Retainer', Revenue: '15000', LastContactDays: '45', Email: 'ahmet.yilmaz@alfayazilim.com' },
        { Company: 'Beta Creative Studio', Contact: 'Selena Arslan (Co-Founder)', Project: 'Web UI Design & UX Project', Revenue: '25000', LastContactDays: '75', Email: 'selin@betacreative.com' },
        { Company: 'Vega Media Group', Contact: 'Brian Hawk (Director)', Project: 'Social Media Management Contract', Revenue: '12000', LastContactDays: '12', Email: 'burak@vegamedya.com' },
        { Company: 'Gamma SEO Agency', Contact: 'Chloe Aksoy (SEO Lead)', Project: 'SEO & Content Marketing Renewal', Revenue: '8000', LastContactDays: '60', Email: 'canan@gammasound.com' },
        { Company: 'Delta Video Production', Contact: 'Mark Lightning (Producer)', Project: 'Corporate Commercial Promo Video', Revenue: '38000', LastContactDays: '190', Email: 'murat@deltavideo.com' },
        { Company: 'Sigma Media Planning', Contact: 'Eda Rock (Budget Mgr)', Project: 'Annual Google Ads Mgmt Contract', Revenue: '9500', LastContactDays: '25', Email: 'eda@sigmamedia.io' },
        { Company: 'Omni Brand Communications', Contact: 'Tyler Efe (Creative Director)', Project: 'Rebranding & Logo Design Offer', Revenue: '40000', LastContactDays: '110', Email: 'turgut@omniiletisim.com' },
      ];
    } else if (sector === 'membership') {
      demoCSV = [
        { Company: 'SaaSify Cloud Systems', Contact: 'Ben Hunter (CTO)', Project: 'Enterprise Cloud Plan (10 Seats)', Revenue: '4800', LastContactDays: '90', Email: 'bulent@saasify.io' },
        { Company: 'FitLife Sports Centers', Contact: 'Cersei Cetin (Operations Director)', Project: 'Annual Corporate Premium Membership', Revenue: '2400', LastContactDays: '45', Email: 'ceren@fitlife.com' },
        { Company: 'EnglishOnline Academy', Contact: 'Matt Guler (Education Mgr)', Project: 'Corporate English Package License', Revenue: '12000', LastContactDays: '15', Email: 'mert.guler@englishonline.com' },
        { Company: 'CoWork Loft Center', Contact: 'Sibel Star (Account Manager)', Project: 'Co-Working Space Subscription', Revenue: '3500', LastContactDays: '30', Email: 'sibel@coworkloft.com' },
        { Company: 'ChefBox Food Service', Contact: 'Dennis Rock (Marketing)', Project: 'Corporate Daily Lunch Package', Revenue: '1800', LastContactDays: '20', Email: 'deniz@chefbox.com' },
        { Company: 'DesignCloud Premium', Contact: 'Hank Sen (Art Director)', Project: 'Pro Design Templates License', Revenue: '6000', LastContactDays: '70', Email: 'hakan@designcloud.io' },
      ];
    }

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
      '"Apex Technology Inc.","Matt Aksoy (CEO)","Artificial Intelligence Consulting",9800,45,mert@apextek.com.tr,+905321234567',
      '"Nova Retail Inc.","Ebru Hawk (CFO)","CRM License Renewal",3500,15,ebru@novaretail.com,+905449876543',
      '"Atlas IT","Brian Yalcin (CTO)","Annual Maintenance Agreement",5400,12,burak@atlasbilisim.com,+905557654321',
      '"Karya Technology","Dennis Eren (Founder)","Mobile App UI",12000,210,deniz@karya.io,',
      '"Vortex Global","Hank Steel (Director)","Cloud Infrastructure Support",1600,120,hakan@vortexglobal.com,+905554567890',
    ];
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rrio_customer_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ── GOOGLE OAUTH MODAL — rendered outside animate-in to prevent fixed positioning bug ── */}
      {showGoogleAuth && (
        <GoogleOAuthModal
          onClose={() => setShowGoogleAuth(false)}
          onSuccess={handleGoogleSuccess}
        />
      )}

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
                onClick={() => {
                  window.location.hash = '#admin';
                }}
                className="btn btn-outline"
                style={{
                  padding: '0.5rem 0.875rem',
                  minHeight: '40px',
                  fontSize: '0.75rem',
                  marginRight: '0.5rem',
                  borderColor: 'rgba(13,211,255,0.3)',
                  color: 'var(--accent-primary)',
                }}
              >
                🛠️ Admin Panel
              </button>
              <button
                onClick={onLogout}
                className="btn btn-outline"
                style={{ padding: '0.5rem 0.875rem', minHeight: '40px', fontSize: '0.75rem' }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </header>

        <div className="page-container" style={{ paddingTop: '3.5rem', paddingBottom: '4rem' }}>

        {/* ── HERO ── */}
        <div className="animate-in" style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto 5rem' }}>
          <div className="hero-badge">
            <Cpu size={12} /> Revenue Leakage Operating System
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.035em',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            color: 'var(--text-main)',
          }}>
            Stop Quietly Watching{' '}
            <span style={{ color: 'var(--accent-primary)', textShadow: '0 0 30px var(--glow-primary)' }}>
              Your Revenue Leak Away
            </span>
          </h1>

          <p style={{
            fontSize: '1.0625rem',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            marginBottom: '2rem',
            maxWidth: '860px',
            margin: '0 auto 2rem',
          }}>
            RRIO analyzes forgotten follow-ups, pending proposals, and decaying subscriptions in your email and CRM data in seconds. It lists and recovers your leaked revenues.
          </p>

          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '0.875rem', justifyContent: 'center',
          }}>
            <button onClick={scrollToUpload} className="btn btn-primary">
              Diagnose Now <ArrowDown size={16} />
            </button>
            <button onClick={() => handleLoadSectorDemoData('ecommerce')} className="btn btn-glow-orange">
              🚀 Try with Demo Data
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
              1. Data Integration
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Connect your past email or CRM data to the analysis engine in seconds.
            </p>
          </div>

          <div className="feature-card fc-orange">
            <div className="feature-icon" style={{ marginBottom: '1.25rem' }}>
              <Search size={24} style={{ color: 'var(--neon-orange)' }} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.625rem', color: 'var(--text-main)' }}>
              2. Revenue Leakage Diagnosis
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Finds forgotten follow-ups, pending proposals, and cooling clients.
            </p>
          </div>

          <div className="feature-card fc-green">
            <div className="feature-icon" style={{ marginBottom: '1.25rem' }}>
              <Rocket size={24} style={{ color: 'var(--status-success)' }} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.625rem', color: 'var(--text-main)' }}>
              3. Event-Driven Recovery
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
              Creates custom recovery templates for each leak and starts the recovery loop.
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
            Quick Calculator
          </div>

          <div style={{ padding: '2rem 2rem 1.5rem' }}>
            <h2 style={{
              fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              color: 'var(--text-main)',
            }}>
              <Calculator size={22} style={{ color: 'var(--accent-primary)' }} />
              Calculate Your Potential Revenue Leakage
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
                      Average Monthly Revenue
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
                      Monthly Lost Opportunities
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {lostDeals} Deals
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
                    Calculated Monthly Leaked Revenue
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
                    Average deal value: ${averageDealValue.toLocaleString()}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  <span className="form-label" style={{ color: 'var(--accent-primary)', marginBottom: '0.375rem' }}>
                    Recoverable with RRS
                  </span>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                    fontSize: '1.625rem', fontWeight: 800,
                    color: 'var(--status-success)',
                    textShadow: '0 0 20px var(--glow-success)',
                    marginBottom: '0.375rem',
                  }}>
                    <DollarSign size={22} />
                    {potentialRecoverable.toLocaleString()} / Month
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <AlertTriangle size={10} style={{ color: 'var(--status-warning)', flexShrink: 0 }} />
                    Average 45% recovery success rate
                  </p>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button onClick={scrollToUpload} className="btn btn-glow-orange">
                Detect Leakages <ArrowDown size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── UPLOAD SECTION ── */}
        <div
          ref={uploadSectionRef}
          className="glass-panel"
          style={{
            maxWidth: '860px', margin: '0 auto',
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
              Start Intelligence Diagnostic Engine
            </h2>

            <p style={{
              fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.75,
              maxWidth: '440px', margin: '0 auto',
            }}>
              Your data is processed entirely in your local browser. No sensitive revenue or email data is uploaded to our servers. <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>100% Privacy Guarantee.</span>
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
              Select Data Source
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
                    Google Workspace Scan
                  </span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Simulate Gmail & Calendar data streams
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
                    Upload Customer / CRM Data
                  </span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Transfer your CSV file to the local analysis engine
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

            {/* OR separator */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0 1.5rem', gap: '1rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <p style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--text-faint)',
              textAlign: 'center', marginBottom: '1.25rem',
            }}>
              Try with Ready Demo Datasets
            </p>

            {/* Sector Datasets Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '0.875rem',
              marginBottom: '2rem',
            }}>
              {/* E-Commerce Dataset */}
              <button
                type="button"
                className="action-tile action-tile-google"
                onClick={() => handleLoadSectorDemoData('ecommerce')}
                style={{ padding: '1rem 1.25rem', minHeight: '68px', display: 'flex', alignItems: 'center', gap: '0.875rem', borderColor: 'rgba(13,211,255,0.2)', background: 'rgba(13,211,255,0.03)' }}
              >
                <div className="icon-box" style={{ width: '38px', height: '38px', flexShrink: 0, background: 'rgba(13,211,255,0.1)', color: 'var(--accent-primary)', fontSize: '1.125rem' }}>
                  🛒
                </div>
                <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontWeight: 750, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.15rem' }}>E-Commerce Set</span>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>8 Leaked Opportunity Analysis</span>
                </div>
                <div style={{ fontSize: '0.58rem', fontWeight: 800, background: 'rgba(13,211,255,0.08)', color: 'var(--accent-primary)', border: '1px solid rgba(13,211,255,0.18)', padding: '0.2rem 0.5rem', borderRadius: 'var(--r-full)' }}>
                  Demo
                </div>
              </button>

              {/* Agency Dataset */}
              <button
                type="button"
                className="action-tile action-tile-crm"
                onClick={() => handleLoadSectorDemoData('agency')}
                style={{ padding: '1rem 1.25rem', minHeight: '68px', display: 'flex', alignItems: 'center', gap: '0.875rem', borderColor: 'rgba(255,126,71,0.2)', background: 'rgba(255,126,71,0.03)' }}
              >
                <div className="icon-box" style={{ width: '38px', height: '38px', flexShrink: 0, background: 'rgba(255,126,71,0.1)', color: 'var(--neon-orange)', fontSize: '1.125rem' }}>
                  🏢
                </div>
                <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontWeight: 750, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.15rem' }}>Agency Set</span>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>7 Customers &amp; Deals Analysis</span>
                </div>
                <div style={{ fontSize: '0.58rem', fontWeight: 800, background: 'rgba(255,126,71,0.08)', color: 'var(--neon-orange)', border: '1px solid rgba(255,126,71,0.18)', padding: '0.2rem 0.5rem', borderRadius: 'var(--r-full)' }}>
                  Demo
                </div>
              </button>

              {/* Membership Dataset */}
              <button
                type="button"
                className="action-tile action-tile-google"
                onClick={() => handleLoadSectorDemoData('membership')}
                style={{ padding: '1rem 1.25rem', minHeight: '68px', display: 'flex', alignItems: 'center', gap: '0.875rem', borderColor: 'rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.03)' }}
              >
                <div className="icon-box" style={{ width: '38px', height: '38px', flexShrink: 0, background: 'rgba(16,185,129,0.1)', color: 'var(--status-success)', fontSize: '1.125rem' }}>
                  💳
                </div>
                <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontWeight: 750, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.15rem' }}>Subscription / Membership Set</span>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>6 Subscription Decay Analysis</span>
                </div>
                <div style={{ fontSize: '0.58rem', fontWeight: 800, background: 'rgba(16,185,129,0.08)', color: 'var(--status-success)', border: '1px solid rgba(16,185,129,0.18)', padding: '0.2rem 0.5rem', borderRadius: 'var(--r-full)' }}>
                  Demo
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
                For information about CSV columns:
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
                <Download size={11} /> Download Sample CSV Template
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
              🛡️ 100% GDPR Compliant Local Sandbox
            </span>
          </div>
        </div>

      </div>
    </div>
    </>
  );
}
