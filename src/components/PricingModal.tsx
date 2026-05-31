import { Check, X, Shield, Zap } from 'lucide-react';
import { setUserPlan } from '../lib/db';
import type { PlanType } from '../lib/db';

interface PricingModalProps {
  onClose: () => void;
  onPlanUpdated: () => void;
}

export function PricingModal({ onClose, onPlanUpdated }: PricingModalProps) {
  const handleSelectPlan = (plan: PlanType) => {
    setUserPlan(plan);
    // Remove the limit hit if they upgrade
    if (plan !== 'FREE') {
      localStorage.removeItem('rrio_limit_hit');
    }
    onPlanUpdated();
    onClose();
  };

  return (
    <div className="modal-overlay animate-in">
      <div className="modal-container" style={{ maxWidth: '800px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-header" style={{ textAlign: 'center', borderBottom: 'none', paddingBottom: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255, 126, 71, 0.1)', color: 'var(--neon-orange)', marginBottom: '1rem' }}>
            <Zap size={24} />
          </div>
          <h2 className="modal-title" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Hesabınızı Yükseltin</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', maxWidth: '400px', margin: '0 auto' }}>
            Sınırsız gelir kurtarma operasyonları, tam pipeline yönetimi ve AI otomasyonuna erişin.
          </p>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '2rem' }}>
          
          {/* Pro Plan */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: '2rem',
            display: 'flex', flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Pro</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', minHeight: '40px' }}>
              Bağımsız işletmeler ve B2B ekipler için tam kapsamlı kurtarma.
            </p>
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>$97</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>/ ay</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {['Sınırsız Müşteri Analizi', 'Gelişmiş Pipeline & Outcomes', 'AI Otomatik Mesaj Taslakları', 'PDF Rapor Çıktıları', 'Öncelikli E-posta Desteği'].map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                  <Check size={16} style={{ color: 'var(--status-success)', flexShrink: 0, marginTop: '0.125rem' }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button 
              className="btn btn-glow-orange" 
              style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', fontWeight: 700 }}
              onClick={() => handleSelectPlan('PRO')}
            >
              Pro'ya Yükselt
            </button>
          </div>

          {/* Agency Plan */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(13,211,255,0.05) 0%, rgba(13,211,255,0) 100%)',
            border: '1px solid var(--accent-primary)',
            borderRadius: 'var(--r-lg)',
            padding: '2rem',
            display: 'flex', flexDirection: 'column',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)',
              background: 'var(--accent-primary)', color: '#000', fontSize: '0.75rem', fontWeight: 800,
              padding: '0.25rem 1rem', borderRadius: '99px', letterSpacing: '0.05em'
            }}>
              EN POPÜLER
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Agency <Shield size={16} style={{ color: 'var(--accent-primary)' }} />
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', minHeight: '40px' }}>
              Ajanslar için çoklu hesap yönetimi ve limitsiz kapasite.
            </p>
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>$197</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>/ ay</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {['Pro plandaki her şey', 'Sınırsız Takım Arkadaşı', 'Beyaz Etiketli (White-label) Raporlar', 'Limitsiz Entegrasyon', '7/24 Özel Destek Hattı'].map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                  <Check size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '0.125rem' }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button 
              className="btn btn-glow-blue" 
              style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', fontWeight: 700 }}
              onClick={() => handleSelectPlan('AGENCY')}
            >
              Agency'ye Yükselt
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
