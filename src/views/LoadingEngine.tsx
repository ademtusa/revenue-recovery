import { useEffect, useState } from 'react';
import { Activity, Search, ShieldAlert, Cpu } from 'lucide-react';

interface LoadingEngineProps {
  onComplete: () => void;
}

const STEPS = [
  {
    label: 'E-Posta logları & Workspace veri akışları taranıyor...',
    color: 'var(--accent-primary)',
    rgbValues: '13,211,255',
    icon: <Search size={18} style={{ color: 'var(--accent-primary)' }} />,
  },
  {
    label: "Olay güdümlü 'customer_inactive' & 'churn' riskleri tespit ediliyor...",
    color: 'var(--neon-orange)',
    rgbValues: '255,126,71',
    icon: <Activity size={18} style={{ color: 'var(--neon-orange)' }} />,
  },
  {
    label: "'proposal_followup_missed' (Unutulmuş Takip) açıkları analiz ediliyor...",
    color: 'var(--status-danger)',
    rgbValues: '255,82,119',
    icon: <ShieldAlert size={18} style={{ color: 'var(--status-danger)' }} />,
  },
  {
    label: 'Öncelik Puanları ve kurtarılabilir ciro hesaplanıyor...',
    color: 'var(--status-success)',
    rgbValues: '56,242,150',
    icon: <Cpu size={18} style={{ color: 'var(--status-success)' }} />,
  },
];

const MATRIX_LINES = [
  "[TARAMA] Ahmet Yılmaz (TechCorp) 'proposal_viewed' logu eşleştirildi...",
  "[KURAL MOTORU] 'customer_inactive' tetiklendi: Selin Kaya > 30 gün...",
  "[SENSÖR] Caner Öz (Nexus) son temas: 7 ay — Risk Skoru: %85...",
  "[ANALİZ] Teklif etkileşim: 3 kez görüntülendi, yanıt yok...",
  "[GÜVENLİK] Uçtan Uca Şifreli Local Sandbox izole edildi...",
  "[İSTİHBARAT] ROI & ciro kayıp matrisi önceliklendiriliyor...",
];

export function LoadingEngine({ onComplete }: LoadingEngineProps) {
  const [step, setStep] = useState(0);
  const [matrixIdx, setMatrixIdx] = useState(0);

  // Step advancement
  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 1200);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [onComplete]);

  // Matrix text rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setMatrixIdx(prev => (prev + 1) % MATRIX_LINES.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const progressPct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient blobs */}
      <div style={{
        position: 'absolute', top: '15%', left: '5%', width: '450px', height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13,211,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '5%', right: '5%', width: '350px', height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,242,150,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }} className="animate-in">

        {/* ── Animated CPU Rings ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>

            {/* Base ring */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              borderRadius: '50%',
              border: '2px solid var(--border)',
            }} />

            {/* Outer spinning ring */}
            <div className="animate-spin-slow" style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: 'var(--accent-primary)',
              borderRightColor: 'rgba(13,211,255,0.25)',
            }} />

            {/* Inner counter-ring */}
            <div style={{
              position: 'absolute', top: '14px', left: '14px', right: '14px', bottom: '14px',
              borderRadius: '50%',
              border: '2px solid transparent',
              borderBottomColor: 'var(--neon-orange)',
              borderLeftColor: 'rgba(255,126,71,0.2)',
              animation: 'spin-slow 2.5s linear infinite reverse',
            }} />

            {/* Center icon */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Cpu size={42} style={{ color: 'var(--accent-primary)' }} className="animate-pulse-slow" />
            </div>

            {/* Glow */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              borderRadius: '50%',
              boxShadow: '0 0 30px rgba(13,211,255,0.1), inset 0 0 20px rgba(13,211,255,0.04)',
              pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* ── Title ── */}
        <h2 style={{
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 800,
          letterSpacing: '-0.025em',
          color: 'var(--text-main)',
          marginBottom: '0.5rem',
        }}>
          Zeka Teşhis Motoru Aktif
        </h2>

        {/* ── Matrix ticker ── */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.68rem',
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 500,
          color: 'var(--accent-primary)',
          marginBottom: '2rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: '0 1rem',
          opacity: 0.8,
          minHeight: '1.1rem',
        }}>
          {MATRIX_LINES[matrixIdx]}
        </p>

        {/* ── Steps Panel ── */}
        <div className="glass-panel" style={{ padding: '1.375rem', marginBottom: '1.375rem', position: 'relative', overflow: 'hidden' }}>
          {/* Scan line */}
          <div className="animate-scan" style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, var(--accent-primary) 50%, transparent 100%)',
            opacity: 0.7,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {STEPS.map((s, idx) => {
              const isActive = idx === step;
              const isDone = idx < step;
              if (idx > step) return null;

              return (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--r-sm)',
                  background: isActive ? `rgba(${s.rgbValues}, 0.06)` : 'transparent',
                  border: `1px solid ${isActive ? `rgba(${s.rgbValues}, 0.2)` : 'transparent'}`,
                  transition: 'all 0.35s ease',
                  opacity: isDone ? 0.5 : 1,
                }}>
                  {/* Icon bubble */}
                  <div style={{
                    width: '34px', height: '34px', flexShrink: 0,
                    borderRadius: '50%',
                    background: isDone ? 'rgba(56,242,150,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isDone ? 'rgba(56,242,150,0.2)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isDone
                      ? <span style={{ color: 'var(--status-success)', fontSize: '0.875rem', lineHeight: 1 }}>✓</span>
                      : <div className={isActive ? 'animate-pulse-slow' : ''}>{s.icon}</div>
                    }
                  </div>

                  {/* Label */}
                  <span style={{
                    fontSize: '0.8125rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                    lineHeight: 1.5,
                    flex: 1,
                  }}>
                    {s.label}
                  </span>

                  {/* Active spinner */}
                  {isActive && (
                    <div style={{ flexShrink: 0 }}>
                      <div className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{
              fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--text-faint)',
            }}>
              Analiz İlerlemesi
            </span>
            <span style={{
              fontSize: '0.7rem', fontWeight: 700,
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--accent-primary)',
            }}>
              {progressPct}%
            </span>
          </div>
          <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '2px',
              background: 'linear-gradient(90deg, var(--accent-primary), var(--status-success))',
              width: `${progressPct}%`,
              transition: 'width 2s ease',
              boxShadow: '0 0 8px var(--glow-primary)',
            }} />
          </div>
        </div>

        {/* ── Security note ── */}
        <p style={{
          textAlign: 'center', fontSize: '0.68rem', color: 'var(--text-faint)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
        }}>
          🔒 Tüm veriler yerel sandbox ortamında işlenmektedir.
        </p>
      </div>
    </div>
  );
}
