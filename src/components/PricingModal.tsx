import { Check, X, Shield, Zap, AlertTriangle } from 'lucide-react';
import { setUserPlan } from '../lib/db';
import type { PlanType } from '../lib/db';

interface PricingModalProps {
  onClose: () => void;
  onPlanUpdated: () => void;
}

export function PricingModal({ onClose, onPlanUpdated }: PricingModalProps) {
  const handleSelectPlan = (plan: PlanType) => {
    setUserPlan(plan);
    if (plan !== 'FREE') {
      localStorage.removeItem('rrio_limit_hit');
    }
    onPlanUpdated();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-panel" style={{ maxWidth: '820px' }}>

        {/* Header */}
        <div className="modal-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(255,126,71,0.1)', color: 'var(--neon-orange)', flexShrink: 0,
            }}>
              <Zap size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                Hesabınızı Yükseltin
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.125rem' }}>
                Sınırsız analiz, tam pipeline yönetimi ve AI otomasyonu.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', cursor: 'pointer',
            color: 'var(--text-muted)', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: 'var(--r-sm)',
            transition: 'all 0.15s ease', flexShrink: 0,
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Demo Warning Banner */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
          padding: '0.75rem 1.5rem',
          background: 'rgba(255,208,67,0.07)',
          borderBottom: '1px solid rgba(255,208,67,0.18)',
        }}>
          <AlertTriangle size={14} style={{ color: 'var(--status-warning)', flexShrink: 0, marginTop: '1px' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--status-warning)', lineHeight: 1.55, margin: 0 }}>
            <strong>Demo ortamı:</strong> Plan değişikliği gerçek ödeme içermez.
            Canlı sürümde Stripe entegrasyonu ile çalışacaktır.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="modal-body" style={{ padding: '1.75rem' }}>
          <div className="pricing-grid">

            {/* Pro Plan */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-hover)',
              borderRadius: 'var(--r-lg)',
              padding: '2rem',
              display: 'flex', flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Pro
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', minHeight: '40px' }}>
                Bağımsız işletmeler ve B2B ekipler için tam kapsamlı kurtarma.
              </p>
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>$97</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}> / ay</span>
              </div>

              <ul style={{
                listStyle: 'none', padding: 0, margin: '0 0 2rem 0',
                display: 'flex', flexDirection: 'column', gap: '0.875rem', flex: 1,
              }}>
                {[
                  'Sınırsız Müşteri Analizi',
                  'Gelişmiş Pipeline & Outcomes',
                  'AI Otomatik Mesaj Taslakları',
                  'PDF Rapor Çıktıları',
                  'Öncelikli E-posta Desteği',
                ].map((feat, i) => (
                  <li key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    fontSize: '0.875rem', color: 'var(--text-main)',
                  }}>
                    <Check size={16} style={{ color: 'var(--status-success)', flexShrink: 0, marginTop: '0.125rem' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                className="btn btn-glow-orange"
                style={{ width: '100%', padding: '0.875rem', fontSize: '0.9375rem', fontWeight: 700 }}
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
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)',
                background: 'var(--accent-primary)', color: '#000', fontSize: '0.7rem', fontWeight: 800,
                padding: '0.25rem 1rem', borderRadius: '99px', letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
              }}>
                EN POPÜLER
              </div>
              <h3 style={{
                fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)',
                marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                Agency <Shield size={16} style={{ color: 'var(--accent-primary)' }} />
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', minHeight: '40px' }}>
                Ajanslar için çoklu hesap yönetimi ve limitsiz kapasite.
              </p>
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>$197</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}> / ay</span>
              </div>

              <ul style={{
                listStyle: 'none', padding: 0, margin: '0 0 2rem 0',
                display: 'flex', flexDirection: 'column', gap: '0.875rem', flex: 1,
              }}>
                {[
                  'Pro plandaki her şey',
                  'Sınırsız Takım Arkadaşı',
                  'Beyaz Etiketli (White-label) Raporlar',
                  'Limitsiz Entegrasyon',
                  '7/24 Özel Destek Hattı',
                ].map((feat, i) => (
                  <li key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    fontSize: '0.875rem', color: 'var(--text-main)',
                  }}>
                    <Check size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '0.125rem' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                className="btn btn-glow-blue"
                style={{ width: '100%', padding: '0.875rem', fontSize: '0.9375rem', fontWeight: 700 }}
                onClick={() => handleSelectPlan('AGENCY')}
              >
                Agency'ye Yükselt
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
