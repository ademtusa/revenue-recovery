import { useState } from 'react';
import { ShieldCheck, LogIn, ArrowRight, Cpu, Zap, Lock } from 'lucide-react';

interface AuthViewProps {
  onAuthSuccess: (userEmail: string) => void;
}

export function AuthView({ onAuthSuccess }: AuthViewProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.includes('@') || password.length < 6) {
      setError('Geçerli bir e-posta girin ve şifre en az 6 karakter olmalıdır.');
      return;
    }

    const accountsKey = 'rrs_simulated_accounts';
    const accountsRaw = localStorage.getItem(accountsKey);
    const accounts = accountsRaw ? JSON.parse(accountsRaw) : {};

    if (isSignUp) {
      if (accounts[email]) {
        setError('Bu e-posta adresiyle kayıtlı bir hesap zaten var.');
        return;
      }
      accounts[email] = { password, name: name || 'Kullanıcı' };
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
      setSuccess('Hesabınız oluşturuldu! Giriş yapılıyor...');
      setTimeout(() => onAuthSuccess(email), 1000);
    } else {
      const user = accounts[email];
      if (!user || user.password !== password) {
        setError('E-posta adresi veya şifre hatalı.');
        return;
      }
      setSuccess('Giriş başarılı! Yönlendiriliyorsunuz...');
      setTimeout(() => onAuthSuccess(email), 1000);
    }
  };

  const handleQuickDemoLogin = () => {
    const demoEmail = 'demo@rrs-platform.com';
    const accountsKey = 'rrs_simulated_accounts';
    const accountsRaw = localStorage.getItem(accountsKey);
    const accounts = accountsRaw ? JSON.parse(accountsRaw) : {};
    if (!accounts[demoEmail]) {
      accounts[demoEmail] = { password: 'demopassword123', name: 'Demo Kullanıcı' };
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
    }
    localStorage.setItem('rrs_active_session', demoEmail);
    onAuthSuccess(demoEmail);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient background blobs */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13,211,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-5%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,126,71,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }} className="animate-in">

        {/* Logo + Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'rgba(13,211,255,0.1)',
            border: '1px solid rgba(13,211,255,0.22)',
            marginBottom: '1.25rem',
            boxShadow: '0 0 24px rgba(13,211,255,0.12)',
          }}>
            <Cpu size={26} style={{ color: 'var(--accent-primary)' }} className="animate-pulse-slow" />
          </div>
          <h1 style={{
            fontSize: '1.625rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-main)',
            marginBottom: '0.375rem',
            lineHeight: 1.2,
          }}>
            Revenue Recovery System
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Gelir kurtarma ve kayıp analitiği işletim platformu
          </p>
        </div>

        {/* Auth Card */}
        <div className="auth-card" style={{ marginBottom: '1.25rem' }}>

          {/* Card Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border)',
          }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {isSignUp ? 'Hesap Oluştur' : 'Sisteme Giriş'}
            </h2>
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
              style={{
                fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.25rem 0',
              }}
            >
              {isSignUp ? '← Giriş yap' : 'Yeni hesap →'}
            </button>
          </div>

          {/* Card Body */}
          <div style={{ padding: '1.5rem' }}>
            {/* Alerts */}
            {error && (
              <div style={{
                padding: '0.75rem 1rem', marginBottom: '1rem',
                borderRadius: 'var(--r-sm)',
                background: 'rgba(255,82,119,0.08)',
                border: '1px solid rgba(255,82,119,0.22)',
                color: 'var(--status-danger)',
                fontSize: '0.8125rem', fontWeight: 500,
              }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{
                padding: '0.75rem 1rem', marginBottom: '1rem',
                borderRadius: 'var(--r-sm)',
                background: 'rgba(56,242,150,0.08)',
                border: '1px solid rgba(56,242,150,0.22)',
                color: 'var(--status-success)',
                fontSize: '0.8125rem', fontWeight: 500,
              }}>
                {success}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="stack-md">
              {isSignUp && (
                <div className="form-group">
                  <label className="form-label">Şirket veya Yetkili Adı</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ahmet Yılmaz"
                    required
                    className="form-input"
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">E-Posta Adresi</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Şifre</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn btn-glow-blue" style={{ width: '100%', marginTop: '0.5rem' }}>
                {isSignUp ? 'Kayıt Ol' : 'Giriş Yap'} <LogIn size={16} />
              </button>
            </form>

            <div className="divider" style={{ margin: '1.25rem 0' }}>veya</div>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="btn btn-glow-orange"
              style={{ width: '100%' }}
            >
              <Zap size={16} />
              Tek Tıkla Demo Girişi
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Security footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--text-faint)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <ShieldCheck size={12} style={{ color: 'var(--status-success)' }} />
            Yerel Sandbox
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Lock size={12} />
            256-bit Güvenlik
          </span>
        </div>
      </div>
    </div>
  );
}
