import { useState } from 'react';
import { X, Mail, ArrowRight, ShieldCheck, CheckCircle2, Lock, Cpu, AlertTriangle } from 'lucide-react';

interface GoogleOAuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function GoogleOAuthModal({ onClose, onSuccess }: GoogleOAuthModalProps) {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => { onSuccess(); }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-panel animate-in" style={{ maxWidth: '440px' }}>

        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Cpu size={18} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Google Workspace Entegrasyonu
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: '0.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '32px', height: '32px', borderRadius: 'var(--r-xs)',
            transition: 'background 0.2s',
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
            Bu bir <strong>demo simülasyonudur</strong>. Gerçek Google hesabınıza bağlanılmaz,
            hiçbir veri okunmaz veya saklanmaz.
          </p>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Icon bridge */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '1rem', marginBottom: '1.75rem',
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px',
              background: '#ffffff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              padding: '10px', flexShrink: 0,
            }}>
              <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--border-hover)' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--border-hover)' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--border-hover)' }} />
              <ArrowRight size={16} style={{ color: 'var(--accent-primary)', marginLeft: '4px' }} />
            </div>

            <div style={{
              width: '56px', height: '56px', borderRadius: '14px',
              background: 'rgba(13,211,255,0.1)',
              border: '1px solid rgba(13,211,255,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 16px rgba(13,211,255,0.1)',
            }}>
              <Mail size={24} style={{ color: 'var(--accent-primary)' }} />
            </div>
          </div>

          <h3 style={{
            fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.02em',
            color: 'var(--text-main)', marginBottom: '0.625rem', textAlign: 'center',
          }}>
            E-Posta Arşivini Tara
          </h3>
          <p style={{
            fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65,
            textAlign: 'center', marginBottom: '1.75rem',
          }}>
            Gmail &amp; Takvim akışlarınız analiz edilerek sessiz kalmış fırsatlar,
            unutulmuş teklifler ve soğuyan ilişkiler tespit edilecektir.
            Yalnızca metadata ve iletişim frekansı okunur.
          </p>

          <button
            onClick={handleConnect}
            disabled={connecting}
            className="btn btn-glow-blue"
            style={{ width: '100%', marginBottom: '1.25rem', fontSize: '0.875rem' }}
          >
            {connecting ? (
              <>
                <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                Güvenli Bağlantı Kuruluyor...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google ile Devam Et
              </>
            )}
          </button>
        </div>

        {/* Security Footer */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: 'rgba(0,0,0,0.25)',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem', marginBottom: '0.875rem',
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--status-success)',
          }}>
            <ShieldCheck size={13} /> Global Güvenlik Standartları
          </div>
          <ul className="stack-xs">
            {[
              'RRIO verilerinizi ASLA kendi sunucularında saklamaz veya üçüncü partilerle paylaşmaz.',
              'Sadece "Read-Only" (Salt Okunur) analiz izni istenir. E-postalarınız değiştirilemez.',
              'Tamamen GDPR ve KVKK uyumlu uçtan uca şifreleme mimarisi (AES-256).',
            ].map((item, i) => (
              <li key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
                fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5,
                listStyle: 'none',
              }}>
                <CheckCircle2 size={13} style={{ color: 'var(--status-success)', flexShrink: 0, marginTop: '1px' }} />
                {item}
              </li>
            ))}
          </ul>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
            marginTop: '0.875rem', paddingTop: '0.875rem',
            borderTop: '1px solid var(--border)',
            fontSize: '0.65rem', color: 'var(--text-faint)', fontWeight: 600,
          }}>
            <Lock size={10} /> SOC2 Type II Certified
          </div>
        </div>
      </div>
    </div>
  );
}
