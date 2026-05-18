import { useState, useRef } from 'react';
import { UploadCloud, Mail, Database, ShieldCheck, Search, Rocket } from 'lucide-react';
import Papa from 'papaparse';
import { addRecordsFromCSV } from '../lib/db';
import { GoogleOAuthModal } from '../components/GoogleOAuthModal';

interface UploadViewProps {
  onStartDiagnosis: () => void;
}

export function UploadView({ onStartDiagnosis }: UploadViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showGoogleAuth, setShowGoogleAuth] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        await addRecordsFromCSV(results.data);
        onStartDiagnosis();
      },
      error: (error: Error) => {
        console.error("Error parsing CSV:", error);
        alert("CSV yüklenirken bir hata oluştu.");
      }
    });
  };

  const handleCrmClick = () => {
    fileInputRef.current?.click();
  };

  const handleGoogleSuccess = () => {
    setShowGoogleAuth(false);
    onStartDiagnosis();
  };

  return (
    <div className="container min-h-screen flex items-center justify-center py-16 animate-in">
      
      {showGoogleAuth && (
        <GoogleOAuthModal 
          onClose={() => setShowGoogleAuth(false)} 
          onSuccess={handleGoogleSuccess} 
        />
      )}

      <div className="flex flex-col items-center justify-center w-full max-w-4xl relative">
        
        {/* Minimal Hero Title */}
        <div className="text-center mb-16 relative z-10">
          <span className="inline-flex items-center px-3 py-1 mb-6 text-xs font-semibold tracking-widest text-faint uppercase border border-[var(--border)] rounded-full bg-[var(--surface-highlight)]">
            BETA v3.1
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight relative">
            Gelir Kurtarma İstihbaratı
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Müşteri ilişkilerinizdeki sessiz kırılmaları tespit edin, terk edilmiş fırsatları analiz edin ve <strong className="text-main font-semibold">yapay zeka destekli stratejilerle gelirinizi geri kazanın.</strong>
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full relative z-10">
          <div className="glass-panel p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center mb-4 text-primary">
              <Database size={20} />
            </div>
            <h3 className="text-base font-semibold mb-2">Veri Entegrasyonu</h3>
            <p className="text-sm text-muted">Geçmiş e-posta veya CRM verilerinizi saniyeler içinde analiz motoruna bağlayın.</p>
          </div>
          <div className="glass-panel p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center mb-4 text-primary">
              <Search size={20} />
            </div>
            <h3 className="text-base font-semibold mb-2">Kayıpları Tespit Et</h3>
            <p className="text-sm text-muted">Sistem, unutulmuş müşterileri ve rafa kalkan teklifleri otomatik bulur.</p>
          </div>
          <div className="glass-panel p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center mb-4 text-primary">
              <Rocket size={20} />
            </div>
            <h3 className="text-base font-semibold mb-2">Stratejik Kurtarma</h3>
            <p className="text-sm text-muted">Duruma özel istihbarat analizleriyle, her müşteri için doğru mesajı anında iletin.</p>
          </div>
        </div>

        {/* Upload Action Box */}
        <div className="glass-panel w-full p-8 md:p-12 text-center relative z-10">
          
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-full bg-[var(--surface-highlight)] border border-[var(--border)] text-muted shadow-inner">
              <UploadCloud size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Teşhis Motorunu Başlat</h2>
          <p className="text-sm text-muted mb-8 max-w-lg mx-auto">
            Verileriniz uçtan uca şifrelenir ve analiz tamamlandıktan sonra sunuculardan kalıcı olarak silinir.
          </p>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv" 
            className="hidden" 
          />

          {/* Neon Orange 2-Column Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button 
              className="action-tile action-tile-google flex items-center p-4 rounded-[var(--radius-md)] text-left gap-4"
              onClick={() => setShowGoogleAuth(true)}
            >
              <div className="icon-box bg-[var(--surface-highlight)] p-3 rounded-md text-main transition-all">
                <Mail size={22} />
              </div>
              <div>
                <span className="block font-bold text-sm text-main mb-0.5">Google Workspace</span>
                <span className="block text-xs text-muted">Gmail verileriyle analize başla</span>
              </div>
            </button>
            
            <button 
              className="action-tile action-tile-crm flex items-center p-4 rounded-[var(--radius-md)] text-left gap-4"
              onClick={handleCrmClick}
            >
              <div className="icon-box bg-[var(--surface-highlight)] p-3 rounded-md text-main transition-all">
                <Database size={22} />
              </div>
              <div>
                <span className="block font-bold text-sm text-main mb-0.5">CRM Verisi Yükle</span>
                <span className="block text-xs text-muted">CSV dosyanızı sisteme aktarın</span>
              </div>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted font-medium tracking-wide uppercase">
            <ShieldCheck size={14} className="text-success" /> Enterprise-Grade Security
          </div>
        </div>
        
      </div>
    </div>
  );
}
