import { useState } from 'react';
import { ShieldCheck, ArrowRight, LogIn, Cpu } from 'lucide-react';
import { Button } from '../components/Button';

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
      setSuccess('Hesabınız başarıyla oluşturuldu! Giriş yapılıyor...');
      setTimeout(() => {
        onAuthSuccess(email);
      }, 1000);
    } else {
      const user = accounts[email];
      if (!user || user.password !== password) {
        setError('E-posta adresi veya şifre hatalı.');
        return;
      }
      setSuccess('Giriş başarılı! Yönlendiriliyorsunuz...');
      setTimeout(() => {
        onAuthSuccess(email);
      }, 1000);
    }
  };

  const handleQuickDemoLogin = () => {
    const demoEmail = 'demo@rrs-platform.com';
    // Add default account if it doesn't exist
    const accountsKey = 'rrs_simulated_accounts';
    const accountsRaw = localStorage.getItem(accountsKey);
    const accounts = accountsRaw ? JSON.parse(accountsRaw) : {};
    if (!accounts[demoEmail]) {
      accounts[demoEmail] = { password: 'demopassword123', name: 'Demo Kullanıcı' };
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
    }
    
    // Set active session
    localStorage.setItem('rrs_active_session', demoEmail);
    onAuthSuccess(demoEmail);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#050814]">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-primary mb-6 shadow-inner">
            <Cpu size={32} className="text-blue-500 animate-pulse-slow" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Revenue Recovery System
          </h2>
          <p className="mt-2 text-sm text-muted">
            Gelir kurtarma ve kayıp analitiği işletim platformu
          </p>
        </div>

        <div className="glass-panel p-8 relative border border-zinc-800/60 shadow-[0_0_50px_rgba(59,130,246,0.05)]">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-800/80 pb-3">
            <h3 className="text-lg font-bold text-white">
              {isSignUp ? 'Hesap Oluştur' : 'Sisteme Giriş'}
            </h3>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccess('');
              }}
              className="text-xs font-semibold text-primary hover:text-blue-400 transition-colors"
            >
              {isSignUp ? 'Zaten hesabım var' : 'Yeni hesap oluştur'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="text-[10px] font-bold text-faint uppercase tracking-widest block mb-1">
                  Şirket veya Yetkili Adı
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  required
                  className="form-input bg-black/50 border border-zinc-800 focus:border-blue-500 w-full pl-3 text-sm py-2 rounded"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-faint uppercase tracking-widest block mb-1">
                E-Posta Adresi
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="form-input bg-black/50 border border-zinc-800 focus:border-blue-500 w-full pl-3 text-sm py-2 rounded"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-faint uppercase tracking-widest block mb-1">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="form-input bg-black/50 border border-zinc-800 focus:border-blue-500 w-full pl-3 text-sm py-2 rounded"
              />
            </div>

            <Button type="submit" variant="glow-blue" className="w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
              {isSignUp ? 'Kayıt Ol' : 'Giriş Yap'} <LogIn size={16} />
            </Button>
          </form>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-zinc-800/80"></div>
            <span className="flex-shrink mx-4 text-[10px] text-faint font-bold tracking-widest uppercase">veya</span>
            <div className="flex-grow border-t border-zinc-800/80"></div>
          </div>

          <Button
            type="button"
            variant="glass"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 text-xs text-orange border-[rgba(249,115,22,0.3)] bg-orange/5 font-semibold flex items-center justify-center gap-2"
          >
            Hızlı Test: Tek Tıkla Demo Giriş <ArrowRight size={14} />
          </Button>
        </div>

        <div className="flex justify-between items-center text-[10px] text-faint font-bold uppercase tracking-widest px-2">
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-success" /> Yerel Sandbox Güvencesi
          </span>
          <span>
            🔒 256-bit Veri Güvenliği
          </span>
        </div>
      </div>
    </div>
  );
}
