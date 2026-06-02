import { useState } from 'react';
import { Cpu, Lock, LogIn, AlertCircle } from 'lucide-react';

interface AdminLoginViewProps {
  onSuccess: () => void;
}

const ADMIN_PASSWORD_KEY = 'rrio_admin_password';
const DEFAULT_PASSWORD = 'admin2024rrio';

export function AdminLoginView({ onSuccess }: AdminLoginViewProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD;
      if (password === storedPassword) {
        localStorage.setItem('rrio_admin_auth', 'true');
        onSuccess();
      } else {
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: '2rem',
        backgroundImage:
          'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(13,211,255,0.06) 0%, transparent 60%)',
      }}
    >
      {/* Card */}
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(13,211,255,0.1)',
              border: '1px solid rgba(13,211,255,0.22)',
              marginBottom: '1.25rem',
              boxShadow: '0 0 24px rgba(13,211,255,0.12)',
            }}
          >
            <Cpu size={26} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h1
            style={{
              fontSize: '1.125rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--text-main)',
              marginBottom: '0.375rem',
            }}
          >
            RRIO RRS — Admin Panel
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>
            Authorized access required
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">
              <Lock size={11} style={{ display: 'inline', marginRight: '0.3rem' }} />
              Admin Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'rgba(255,82,119,0.08)',
                border: '1px solid rgba(255,82,119,0.22)',
                borderRadius: 'var(--r-sm)',
                fontSize: '0.8125rem',
                color: 'var(--status-danger)',
              }}
            >
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-glow-blue"
            disabled={loading || !password}
            style={{ width: '100%', minHeight: '48px' }}
          >
            {loading ? (
              <>Verifying...</>
            ) : (
              <>
                <LogIn size={16} /> Login
              </>
            )}
          </button>
        </form>
      </div>

      {/* Back to demo */}
      <button
        onClick={() => {
          window.location.hash = '';
        }}
        style={{
          marginTop: '1.5rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.75rem',
          color: 'var(--text-faint)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-faint)')}
      >
        ← Back to Demo
      </button>
    </div>
  );
}
