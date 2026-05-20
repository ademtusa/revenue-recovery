import { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, ArrowRight, Settings, CreditCard, Heart, Save } from 'lucide-react';
import { Button } from './Button';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'subscription' | 'cancel'>('general');
  
  // Cancellation steps
  const [cancelStep, setCancelStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState('');

  // General Settings State
  const [companyName, setCompanyName] = useState('Creaizen');
  const [replyTone, setReplyTone] = useState('formal');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load general settings
    const savedCompany = localStorage.getItem('rrs_setting_company') || 'Creaizen';
    const savedTone = localStorage.getItem('rrs_setting_tone') || 'formal';
    const savedCurrency = localStorage.getItem('rrs_setting_currency') || 'USD';
    
    setCompanyName(savedCompany);
    setReplyTone(savedTone);
    setSelectedCurrency(savedCurrency);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('rrs_setting_company', companyName);
    localStorage.setItem('rrs_setting_tone', replyTone);
    localStorage.setItem('rrs_setting_currency', selectedCurrency);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-5 animate-in">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Genel Sistem Ayarları</h3>
        <p className="text-xs text-muted">Platform genelindeki varsayılan değerleri ve AI stüdyo tonunu özelleştirin.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-faint uppercase tracking-widest block mb-2">Firma Adınız</label>
          <input 
            type="text" 
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="form-input bg-black/50 border border-zinc-800 rounded focus:border-primary w-full pl-3 text-sm py-2 text-white"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-faint uppercase tracking-widest block mb-2">Varsayılan İletişim Dili Tonu</label>
          <select 
            value={replyTone}
            onChange={(e) => setReplyTone(e.target.value)}
            className="form-select bg-black/50 border border-zinc-800 rounded focus:border-primary w-full text-sm py-2 text-white"
          >
            <option value="formal">Kurumsal & Ciddi (Varsayılan)</option>
            <option value="friendly">Samimi & Yakın</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-faint uppercase tracking-widest block mb-2">Para Birimi</label>
            <select 
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="form-select bg-black/50 border border-zinc-800 rounded focus:border-primary w-full text-sm py-2 text-white"
            >
              <option value="USD">Dolar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="TRY">Türk Lirası (₺)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-faint uppercase tracking-widest block mb-2">Çalışma Prensibi</label>
            <div className="bg-zinc-950/60 border border-zinc-850 p-2 text-xs text-muted rounded mt-0.5">
              Manuel-First Hybrid (AI Önerili)
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted">Kurtarma Uyarılarını Al:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-8 h-4 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
        <Button variant="outline" onClick={onClose}>Kapat</Button>
        <Button variant="glow-blue" onClick={handleSaveSettings} className="gap-2">
          <Save size={14} /> {isSaved ? 'Kaydedildi!' : 'Değişiklikleri Kaydet'}
        </Button>
      </div>
    </div>
  );

  const renderSubscriptionPlans = () => (
    <div className="space-y-5 animate-in">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Abonelik ve Limit Bilgisi</h3>
        <p className="text-xs text-muted">Aktif paketinizi görüntüleyin ve diğer planları inceleyin.</p>
      </div>

      <div className="space-y-4">
        {/* Active Plan Detail */}
        <div className="premium-panel bg-primary/5 border-primary/20 p-4 relative overflow-hidden">
          <div className="absolute top-2 right-2">
            <span className="badge badge-success text-[8.5px] uppercase tracking-wider">Aktif Üyelik</span>
          </div>
          <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">Mevcut Plan</span>
          <span className="text-xl font-extrabold text-white mt-1 block">RRS Pro Analist Paketi</span>
          <span className="text-xs text-muted block mt-1">Sonraki Yenileme: 15 Haziran 2026 ($99 / Ay)</span>
        </div>

        {/* Tier Lists */}
        <div className="space-y-2">
          <span className="text-[10px] text-faint font-bold uppercase tracking-widest block mb-2">Tüm Paketler</span>
          
          <div className="bg-zinc-950/40 border border-zinc-900 p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-white">Starter Plan</div>
              <div className="text-[10px] text-muted">Maksimum 10 Şirket Teşhisi, Manuel Şablonlar</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-white">$29 / Ay</div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-white">Pro Plan (Mevcut)</div>
              <div className="text-[10px] text-muted">Sınırsız Şirket, AI Yanıt Stüdyosu, PDF Raporlama</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-primary">$99 / Ay</div>
            </div>
          </div>

          <div className="bg-zinc-950/40 border border-zinc-900 p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-white">Enterprise VPS Plan</div>
              <div className="text-[10px] text-muted">Özel Veritabanı, Entegrasyon API, Dedicated VPS Kurulumu</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-white">İletişime Geçin</div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-900 flex justify-end">
        <Button variant="outline" onClick={onClose}>Kapat</Button>
      </div>
    </div>
  );

  const renderCancelStep1 = () => (
    <div className="space-y-6 animate-in">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-[rgba(249,115,22,0.1)] text-orange-500 mx-auto flex items-center justify-center mb-4">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-xl font-bold mb-2">Aboneliği İptal Et & İade İste</h3>
        <p className="text-sm text-muted">Ayrıldığınızı görmek bizi üzer. Hizmetimizi geliştirebilmemiz için lütfen ayrılma nedeninizi paylaşın.</p>
      </div>

      <div className="space-y-3">
        {['Fiyat çok yüksek', 'İstediğim sonucu alamadım', 'Sistemi karmaşık buldum', 'Sadece denemek istemiştim'].map((reason) => (
          <label key={reason} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${selectedReason === reason ? 'border-primary bg-[rgba(59,130,246,0.1)]' : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700'}`}>
            <input 
              type="radio" 
              name="reason" 
              value={reason} 
              className="hidden"
              checked={selectedReason === reason}
              onChange={() => setSelectedReason(reason)}
            />
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedReason === reason ? 'border-primary' : 'border-gray-500'}`}>
              {selectedReason === reason && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <span className="text-sm font-medium text-white">{reason}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t border-zinc-900">
        <Button variant="outline" className="flex-1" onClick={onClose}>Vazgeç</Button>
        <Button variant="glow-orange" className="flex-1" disabled={!selectedReason} onClick={() => setCancelStep(2)}>Devam Et</Button>
      </div>
    </div>
  );

  const renderCancelStep2 = () => (
    <div className="space-y-6 animate-in">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2 text-white">Belki fikrinizi değiştirirsiniz?</h3>
        <p className="text-sm text-muted font-normal">Aboneliğinizi iptal etmek yerine size özel bir kurtarma teklifimiz var.</p>
      </div>

      <div className="premium-panel bg-[rgba(16,185,129,0.05)] border-[rgba(16,185,129,0.2)] p-6 text-center">
        <div className="inline-flex p-3 bg-emerald-500/10 rounded-full text-emerald-400 mb-3">
          <Heart size={24} />
        </div>
        <h4 className="text-emerald-400 font-bold text-lg mb-2">2 Ay Ücretsiz Pro Üyelik</h4>
        <p className="text-sm text-muted mb-6 leading-relaxed">İptal işlemini durdurun ve sistemi 2 ay daha ücretsiz, tüm özellikleriyle kullanın. Herhangi bir kart ücreti çekilmeyecektir.</p>
        <Button variant="glow-green" className="w-full" onClick={onClose}>
          Teklifi Kabul Et ve Devam Et
        </Button>
      </div>

      <div className="pt-4 border-t border-zinc-900">
        <button className="w-full text-center text-xs text-muted hover:text-white transition-colors" onClick={() => setCancelStep(3)}>
          Hayır, teşekkürler. İptal ve İade işlemine devam et <ArrowRight size={14} className="inline ml-1" />
        </button>
      </div>
    </div>
  );

  const renderCancelStep3 = () => (
    <div className="space-y-6 animate-in text-center py-6">
      <div className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.1)] text-emerald-400 mx-auto flex items-center justify-center mb-6">
        <CheckCircle size={32} />
      </div>
      <h3 className="text-2xl font-bold mb-2 text-white">İptal ve İade Talebi Alındı</h3>
      <p className="text-sm text-muted mb-8 leading-relaxed">
        İade talebiniz 3 adımda kolayca işleme alınmıştır. Bankanızın süreçlerine bağlı olarak ücret iadesi 3-5 iş günü içerisinde kartınıza yansıyacaktır.
      </p>
      <Button variant="outline" className="w-full" onClick={onClose}>Panoya Dön</Button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-lg relative border-zinc-800">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <Settings className="text-primary" size={20} />
            <h2 className="text-lg font-bold text-white tracking-tight">Hesap & Ayarlar</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-muted hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[160px_1fr]">
          
          {/* Left Navigation Bar */}
          <div className="flex md:flex-col border-b md:border-b-0 md:border-r border-zinc-900 p-4 gap-1">
            <button 
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded transition-all text-left w-full ${activeTab === 'general' ? 'bg-primary/10 text-white border-l-2 border-primary' : 'text-muted hover:text-white'}`}
            >
              <Settings size={14} /> Genel Ayarlar
            </button>
            <button 
              onClick={() => setActiveTab('subscription')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded transition-all text-left w-full ${activeTab === 'subscription' ? 'bg-primary/10 text-white border-l-2 border-primary' : 'text-muted hover:text-white'}`}
            >
              <CreditCard size={14} /> Abonelik Planları
            </button>
            <button 
              onClick={() => setActiveTab('cancel')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded transition-all text-left w-full ${activeTab === 'cancel' ? 'bg-orange-550/10 text-orange border-l-2 border-orange' : 'text-muted hover:text-white'}`}
            >
              <AlertTriangle size={14} /> Abonelik İptali
            </button>
          </div>

          {/* Right Content Panel */}
          <div className="p-6">
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'subscription' && renderSubscriptionPlans()}
            {activeTab === 'cancel' && (
              <>
                {cancelStep === 1 && renderCancelStep1()}
                {cancelStep === 2 && renderCancelStep2()}
                {cancelStep === 3 && renderCancelStep3()}
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
