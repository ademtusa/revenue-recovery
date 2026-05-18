import { useState } from 'react';
import { X, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [step, setStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState('');

  const renderStep1 = () => (
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
          <label key={reason} className={`flex items-center gap-3 p-4 rounded-[var(--radius-md)] border cursor-pointer transition-all ${selectedReason === reason ? 'border-primary bg-[rgba(59,130,246,0.1)]' : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)]'}`}>
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
            <span className="text-sm font-medium">{reason}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" className="flex-1" onClick={onClose}>Vazgeç</Button>
        <Button variant="glow-orange" className="flex-1" disabled={!selectedReason} onClick={() => setStep(2)}>Devam Et</Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Belki fikrinizi değiştirirsiniz?</h3>
        <p className="text-sm text-muted">Aboneliğinizi iptal etmek yerine size özel bir teklifimiz var.</p>
      </div>

      <div className="premium-panel bg-[rgba(16,185,129,0.05)] border-[rgba(16,185,129,0.2)] p-6 text-center">
        <h4 className="text-success font-bold text-lg mb-2">2 Ay Ücretsiz Pro Üyelik</h4>
        <p className="text-sm text-main mb-6">İptal işlemini durdurun ve sistemi 2 ay daha ücretsiz, tüm özellikleriyle kullanın. Herhangi bir kart ücreti çekilmeyecektir.</p>
        <Button variant="glow-green" className="w-full" onClick={onClose}>
          Teklifi Kabul Et ve Devam Et
        </Button>
      </div>

      <div className="pt-4 border-t border-[var(--border)]">
        <button className="w-full text-center text-sm text-muted hover:text-white transition-colors" onClick={() => setStep(3)}>
          Hayır, teşekkürler. İptal ve İade işlemine devam et <ArrowRight size={14} className="inline ml-1" />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-in text-center py-6">
      <div className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.1)] text-success mx-auto flex items-center justify-center mb-6">
        <CheckCircle size={32} />
      </div>
      <h3 className="text-2xl font-bold mb-2">İptal ve İade Başarıyla Alındı</h3>
      <p className="text-sm text-muted mb-8">
        İade talebiniz 3 adımda kolayca işleme alınmıştır. Bankanızın süreçlerine bağlı olarak ücret iadesi 3-5 iş günü içerisinde kartınıza yansıyacaktır.
      </p>
      <Button variant="outline" className="w-full" onClick={onClose}>Panoya Dön</Button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        
      </div>
    </div>
  );
}
