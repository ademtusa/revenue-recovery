import { useState, useRef } from 'react';
import { UploadCloud, Mail, Database, ShieldCheck, Search, Rocket, DollarSign, Calculator, AlertTriangle, ArrowDown, Cpu } from 'lucide-react';
import Papa from 'papaparse';
import { addRecordsFromCSV } from '../lib/db';
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
  
  // Interactive Simulator States
  const [monthlyRevenue, setMonthlyRevenue] = useState(50000);
  const [lostDeals, setLostDeals] = useState(8);

  // Live Calculations
  const averageDealValue = Math.round(monthlyRevenue * 0.15); // Avg deal is 15% of monthly ciro
  const estimatedMonthlyLoss = Math.round(lostDeals * averageDealValue);
  const potentialRecoverable = Math.round(estimatedMonthlyLoss * 0.45); // 45% average recovery rate

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

  // Immediate Experience CTA - Load beautiful pre-made demo data
  const handleLoadDemoData = async () => {
    const demoCSV = [
      { Company: 'Apex Enerji Ltd.', Contact: 'Mert Aksoy (Satış Md.)', Project: 'Yapay Zeka Danışmanlığı', Revenue: '9800', LastContactDays: '45' },
      { Company: 'Nova Retail A.Ş.', Contact: 'Ebru Şahin (CFO)', Project: 'CRM Entegrasyonu Lisansı', Revenue: '3500', LastContactDays: '15' },
      { Company: 'Atlas Bilişim', Contact: 'Burak Yalçın (CTO)', Project: 'Yıllık Bakım Anlaşması', Revenue: '5400', LastContactDays: '12' },
      { Company: 'Karya Teknoloji', Contact: 'Deniz Eren (Kurucu)', Project: 'Mobil Uygulama Arayüzü', Revenue: '12000', LastContactDays: '210' },
      { Company: 'Vortex Global', Contact: 'Hakan Çelik (Direktör)', Project: 'Bulut Altyapı Desteği', Revenue: '1600', LastContactDays: '120' }
    ];
    await addRecordsFromCSV(demoCSV);
    onStartDiagnosis();
  };

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container min-h-screen py-12 md:py-16 animate-in">
      
      {/* --- TOP HEADER --- */}
      <div className="flex justify-between items-center w-full max-w-4xl mx-auto mb-16 border-b border-zinc-800/40 pb-4">
        <div className="flex items-center gap-2">
          <Cpu className="text-blue-500 animate-pulse-slow" size={18} />
          <span className="font-extrabold text-xs tracking-wider text-white uppercase font-mono">DESPSEEK RRS</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted font-bold tracking-wide bg-zinc-950/80 border border-zinc-850 px-3 py-1 rounded-full uppercase">
            👤 {userEmail.split('@')[0]}
          </span>
          <button 
            onClick={onLogout}
            className="text-[10px] text-rose-400 hover:text-rose-300 font-bold uppercase tracking-wider transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
      
      {showGoogleAuth && (
        <GoogleOAuthModal 
          onClose={() => setShowGoogleAuth(false)} 
          onSuccess={handleGoogleSuccess} 
        />
      )}

      {/* --- HERO SECTION --- */}
      <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto mb-20 relative z-10">
        <span className="inline-flex items-center px-4 py-1.5 mb-6 text-[10px] font-bold tracking-widest text-primary uppercase border border-[var(--border)] rounded-full bg-[var(--surface-highlight)]">
          ✨ GELİR KAÇAĞI İŞLETİM SİSTEMİ
        </span>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
          Gelirinizin Nereye Sızdığını <br />
          <span className="text-primary">Sessizce İzlemeyi Bırakın</span>
        </h1>
        
        <p className="text-base md:text-xl text-muted max-w-3xl leading-relaxed mb-8">
          Creaizen, e-posta ve CRM verilerinizdeki unutulmuş takip aramalarını, rafa kalkan yüksek bütçeli teklifleri ve çürüyen abonelikleri saniyeler içinde analiz eder. **Faturası kesilmemiş kaçak cirolarınızı listeler ve tek tıkla kurtarır.**
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <button 
            onClick={scrollToUpload} 
            className="btn btn-primary flex items-center justify-center gap-2 py-3 px-8 text-sm"
          >
            Hemen Teşhis Et <ArrowDown size={16} />
          </button>
          <button 
            onClick={handleLoadDemoData}
            className="btn btn-glass flex items-center justify-center gap-2 py-3 px-8 text-sm text-orange border-[rgba(249,115,22,0.3)] bg-orange/5"
          >
            Hazır Demo Verisiyle Dene 🚀
          </button>
        </div>
      </div>

      {/* --- LIVE INTERACTIVE SIMULATOR (Dönüşüm Tetikleyici) --- */}
      <div className="max-w-4xl mx-auto mb-24 relative z-10">
        <div className="glass-panel p-8 md:p-10 border-[rgba(59,130,246,0.15)] relative">
          <div className="absolute top-0 right-0 bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-lg">
            Hızlı Hesaplayıcı
          </div>

          <h3 className="text-xl md:text-2xl font-bold mb-8 flex items-center gap-3">
            <Calculator className="text-primary" size={24} /> Olası Gelir Sızıntınızı Hesaplayın
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-muted">Aylık Ortalama Cironuz</span>
                  <span className="text-main">${monthlyRevenue.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="5000" 
                  max="500000" 
                  step="5000" 
                  value={monthlyRevenue} 
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                  className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-muted">Aylık Takip Edilemeyen/Kayıp Fırsatlar</span>
                  <span className="text-main">{lostDeals} Teklif / Müşteri</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  step="1" 
                  value={lostDeals} 
                  onChange={(e) => setLostDeals(Number(e.target.value))}
                  className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            </div>

            {/* Simulated Output Panel */}
            <div className="premium-panel bg-black/40 border-[rgba(249,115,22,0.15)] flex flex-col justify-between p-6">
              <div>
                <span className="text-[10px] text-faint font-bold uppercase tracking-widest block mb-1">Hesaplanan Aylık Kaçak Gelir</span>
                <span className="text-3xl font-extrabold text-danger flex items-center gap-1 mb-2">
                  <DollarSign size={28} /> ${estimatedMonthlyLoss.toLocaleString()}
                </span>
                <p className="text-xs text-muted leading-relaxed">
                  Fırsatların ortalama değeri ${averageDealValue.toLocaleString()} olarak baz alınmıştır.
                </p>
              </div>

              <div className="border-t border-[var(--border)] pt-4 mt-4">
                <span className="text-[10px] text-primary font-bold uppercase tracking-widest block mb-1">RRS İstihbaratıyla Geri Kazanılabilir Tutar</span>
                <span className="text-2xl font-bold text-success flex items-center gap-1">
                  <DollarSign size={22} /> ${potentialRecoverable.toLocaleString()} / Ay
                </span>
                <p className="text-[10px] text-muted mt-1 flex items-center gap-1">
                  <AlertTriangle size={10} className="text-warning" /> Ortalama %45 geri kazanım başarı oranına dayanmaktadır.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={scrollToUpload}
              className="btn btn-glow-orange gap-2 px-8 py-3 font-semibold text-sm"
            >
              Kaçakları Tespit Etmek İçin Veri Yükle <ArrowDown size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* --- CORE PRODUCT FEATURE CARD GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 w-full relative z-10">
        <div className="glass-panel p-8 flex flex-col items-center text-center hover:border-blue-500/20 transition-all">
          <div className="w-14 h-14 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center mb-5 text-primary shadow-inner">
            <Database size={24} />
          </div>
          <h3 className="text-lg font-bold mb-3">1. Veri Entegrasyonu</h3>
          <p className="text-sm text-muted leading-relaxed">Geçmiş e-posta veya CRM verilerinizi, kurtarma zekası motorunun anlamlandırması için saniyeler içinde analiz motoruna bağlayın.</p>
        </div>

        <div className="glass-panel p-8 flex flex-col items-center text-center hover:border-orange-500/20 transition-all">
          <div className="w-14 h-14 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center mb-5 text-orange shadow-inner">
            <Search size={24} />
          </div>
          <h3 className="text-lg font-bold mb-3">2. Gelir Kaçağı Teşhisi</h3>
          <p className="text-sm text-muted leading-relaxed">Gelişmiş kural ve olay motoru, unutulmuş takipleri, askıda kalmış teklifleri ve soğuyan müşterileri saniyeler içinde bulur.</p>
        </div>

        <div className="glass-panel p-8 flex flex-col items-center text-center hover:border-emerald-500/20 transition-all">
          <div className="w-14 h-14 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center mb-5 text-success shadow-inner">
            <Rocket size={24} />
          </div>
          <h3 className="text-lg font-bold mb-3">3. Olay Güdümlü Kurtarma</h3>
          <p className="text-sm text-muted leading-relaxed">Her kaçağın durumuna ve iletişim geçmişine özel kurtarma iletişim şablonları oluşturur ve kurtarma döngüsünü tetikler.</p>
        </div>
      </div>

      {/* --- UPLOAD CONTAINER SECTION --- */}
      <div ref={uploadSectionRef} className="glass-panel w-full p-8 md:p-14 text-center relative z-10 mb-12 border-[rgba(249,115,22,0.15)] scroll-mt-6">
        <div className="mb-6 flex justify-center">
          <div className="p-5 rounded-full bg-[var(--surface-highlight)] border border-[var(--border)] text-muted shadow-inner animate-pulse-slow">
            <UploadCloud size={40} className="text-orange" />
          </div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Zeka Teşhis Motorunu Başlatın</h2>
        <p className="text-sm text-muted mb-10 max-w-lg mx-auto leading-relaxed">
          Verileriniz tamamen yerel tarayıcınızda işlenir. Sunucularımıza hiçbir hassas ciro veya e-posta verisi yüklenmez. %100 Gizlilik Güvencesi.
        </p>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept=".csv" 
          className="hidden" 
        />

        {/* Action Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <button 
            className="action-tile action-tile-google flex items-center p-5 rounded-[var(--radius-lg)] text-left gap-5"
            onClick={() => setShowGoogleAuth(true)}
          >
            <div className="icon-box bg-[var(--surface-highlight)] p-3.5 rounded-md text-main transition-all">
              <Mail size={24} />
            </div>
            <div>
              <span className="block font-bold text-base text-main mb-0.5">Google Workspace Tarama</span>
              <span className="block text-xs text-muted">Gmail & Takvim veri akışlarını simüle edin</span>
            </div>
          </button>
          
          <button 
            className="action-tile action-tile-crm flex items-center p-5 rounded-[var(--radius-lg)] text-left gap-5"
            onClick={handleCrmClick}
          >
            <div className="icon-box bg-[var(--surface-highlight)] p-3.5 rounded-md text-main transition-all">
              <Database size={24} />
            </div>
            <div>
              <span className="block font-bold text-base text-main mb-0.5">Müşteri / CRM Verisi Yükle</span>
              <span className="block text-xs text-muted">CSV dosyanızı yerel analiz motoruna aktarın</span>
            </div>
          </button>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-muted font-semibold tracking-wider uppercase border-t border-[var(--border)] pt-8">
          <span className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-success" /> Enterprise-Grade Security
          </span>
          <span className="hidden sm:inline text-faint">|</span>
          <span className="flex items-center gap-2">
            🛡️ %100 KVKK & GDPR UYUMLU LOCAL SANDBOX
          </span>
        </div>
      </div>
      
    </div>
  );
}

