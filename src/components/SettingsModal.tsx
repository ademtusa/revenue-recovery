import { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, ArrowRight, Settings, CreditCard, Heart, Save } from 'lucide-react';
import { Button } from './Button';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'subscription' | 'cancel'>('general');
  const [cancelStep, setCancelStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState('');
  const [companyName, setCompanyName] = useState('RRIO');
  const [replyTone, setReplyTone] = useState('formal');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setCompanyName(localStorage.getItem('rrs_setting_company') || 'RRIO');
    setReplyTone(localStorage.getItem('rrs_setting_tone') || 'formal');
    setSelectedCurrency(localStorage.getItem('rrs_setting_currency') || 'USD');
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('rrs_setting_company', companyName);
    localStorage.setItem('rrs_setting_tone', replyTone);
    localStorage.setItem('rrs_setting_currency', selectedCurrency);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const navItems: Array<{
    key: 'general' | 'subscription' | 'cancel';
    icon: React.ReactNode;
    label: string;
    danger?: boolean;
  }> = [
    { key: 'general', icon: <Settings size={15} />, label: 'Genel Ayarlar' },
    { key: 'subscription', icon: <CreditCard size={15} />, label: 'Abonelik' },
    { key: 'cancel', icon: <AlertTriangle size={15} />, label: 'İptal & İade', danger: true },
  ];

  const renderGeneral = () => (
    <div className="stack-md animate-in">
      <div>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.375rem' }}>
          Genel Sistem Ayarları
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Platform genelindeki varsayılan değerleri ve AI stüdyo tonunu özelleştirin.
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">Firma Adınız</label>
        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
          className="form-input" />
      </div>

      <div className="form-group">
        <label className="form-label">Varsayılan İletişim Tonu</label>
        <select value={replyTone} onChange={(e) => setReplyTone(e.target.value)} className="form-select">
          <option value="formal">Kurumsal &amp; Ciddi (Varsayılan)</option>
          <option value="friendly">Samimi &amp; Yakın</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Para Birimi</label>
          <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)} className="form-select">
            <option value="USD">Dolar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="TRY">Türk Lirası (₺)</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Çalışma Prensibi</label>
          <div style={{
            background: 'rgba(5,6,15,0.7)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)', padding: '0.75rem 1rem',
            fontSize: '0.8125rem', color: 'var(--text-muted)', minHeight: '48px',
            display: 'flex', alignItems: 'center',
          }}>
            Manuel-First Hybrid
          </div>
        </div>
      </div>

      {/* Notification toggle */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.875rem 1rem',
        background: 'rgba(5,6,15,0.5)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-sm)',
        gap: '1rem',
      }}>
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.1rem' }}>
            Kurtarma Uyarıları
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Kritik sızıntı tespitlerinde bildirim al
          </div>
        </div>
        <label className="toggle-label">
          <input type="checkbox" checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)} />
          <div className="toggle-track">
            <div className="toggle-thumb" />
          </div>
        </label>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', gap: '0.75rem', justifyContent: 'flex-end',
        paddingTop: '1rem', borderTop: '1px solid var(--border)',
      }}>
        <Button variant="outline" onClick={onClose}>Kapat</Button>
        <Button variant="glow-blue" onClick={handleSaveSettings}>
          <Save size={14} /> {isSaved ? '✓ Kaydedildi!' : 'Değişiklikleri Kaydet'}
        </Button>
      </div>
    </div>
  );

  const renderSubscription = () => (
    <div className="stack-md animate-in">
      <div>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.375rem' }}>
          Abonelik ve Limit Bilgisi
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Aktif paketinizi görüntüleyin ve diğer planları inceleyin.
        </p>
      </div>

      {/* Active plan */}
      <div style={{
        padding: '1.25rem',
        background: 'rgba(13,211,255,0.04)',
        border: '1px solid rgba(13,211,255,0.18)',
        borderRadius: 'var(--r-md)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '0.875rem', right: '0.875rem' }}>
          <span className="badge badge-success">Aktif Üyelik</span>
        </div>
        <span style={{
          display: 'block', fontSize: '0.65rem', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-primary)',
          marginBottom: '0.375rem',
        }}>
          Mevcut Plan
        </span>
        <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
          RRS Pro Analist Paketi
        </span>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Sonraki Yenileme: 15 Haziran 2026 ($99 / Ay)
        </span>
      </div>

      {/* Plan list */}
      <div className="stack-xs">
        <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
          Tüm Paketler
        </span>

        {[
          { name: 'Starter Plan', desc: 'Maks 10 Şirket Teşhisi, Manuel Şablonlar', price: '$29 / Ay', active: false },
          { name: 'Pro Plan', desc: 'Sınırsız Şirket, AI Yanıt Stüdyosu, PDF Raporlama', price: '$99 / Ay', active: true },
          { name: 'Enterprise VPS', desc: 'Özel Veritabanı, Entegrasyon API, Dedicated VPS', price: 'İletişime Geçin', active: false },
        ].map((plan) => (
          <div key={plan.name} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.875rem 1rem',
            background: plan.active ? 'rgba(13,211,255,0.04)' : 'rgba(5,6,15,0.5)',
            border: `1px solid ${plan.active ? 'rgba(13,211,255,0.18)' : 'var(--border)'}`,
            borderRadius: 'var(--r-sm)',
            gap: '1rem',
          }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                {plan.name} {plan.active && <span className="badge badge-primary" style={{ fontSize: '0.6rem', marginLeft: '0.375rem' }}>Aktif</span>}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{plan.desc}</div>
            </div>
            <div style={{
              fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
              color: plan.active ? 'var(--accent-primary)' : 'var(--text-main)',
            }}>
              {plan.price}
            </div>
          </div>
        ))}
      </div>

      <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outline" onClick={onClose}>Kapat</Button>
      </div>
    </div>
  );

  const renderCancelStep1 = () => (
    <div className="stack-md animate-in">
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'rgba(255,208,67,0.1)', border: '1px solid rgba(255,208,67,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem',
        }}>
          <AlertTriangle size={24} style={{ color: 'var(--status-warning)' }} />
        </div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          Aboneliği İptal Et &amp; İade İste
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
          Ayrıldığınızı görmek bizi üzer. Hizmetimizi geliştirebilmemiz için lütfen ayrılma nedeninizi paylaşın.
        </p>
      </div>

      <div className="stack-xs">
        {['Fiyat çok yüksek', 'İstediğim sonucu alamadım', 'Sistemi karmaşık buldum', 'Sadece denemek istemiştim'].map((reason) => (
          <label key={reason} style={{
            display: 'flex', alignItems: 'center', gap: '0.875rem',
            padding: '0.875rem 1rem',
            borderRadius: 'var(--r-sm)',
            border: `1px solid ${selectedReason === reason ? 'rgba(13,211,255,0.3)' : 'var(--border)'}`,
            background: selectedReason === reason ? 'rgba(13,211,255,0.06)' : 'rgba(5,6,15,0.5)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}>
            <input type="radio" name="reason" value={reason}
              checked={selectedReason === reason}
              onChange={() => setSelectedReason(reason)}
              style={{ display: 'none' }} />
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${selectedReason === reason ? 'var(--accent-primary)' : 'var(--border-hover)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {selectedReason === reason && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
              )}
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>{reason}</span>
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
        <Button variant="outline" style={{ flex: 1 }} onClick={onClose}>Vazgeç</Button>
        <Button variant="glow-orange" style={{ flex: 1 }} disabled={!selectedReason} onClick={() => setCancelStep(2)}>
          Devam Et <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );

  const renderCancelStep2 = () => (
    <div className="stack-md animate-in">
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          Belki fikrinizi değiştirirsiniz?
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Aboneliğinizi iptal etmek yerine size özel bir teklif var.
        </p>
      </div>

      <div style={{
        padding: '1.5rem', textAlign: 'center',
        background: 'rgba(56,242,150,0.04)',
        border: '1px solid rgba(56,242,150,0.18)',
        borderRadius: 'var(--r-md)',
      }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'rgba(56,242,150,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem',
        }}>
          <Heart size={24} style={{ color: 'var(--status-success)' }} />
        </div>
        <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--status-success)', marginBottom: '0.625rem' }}>
          2 Ay Ücretsiz Pro Üyelik
        </h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
          İptal işlemini durdurun ve sistemi 2 ay daha ücretsiz kullanın. Herhangi bir kart ücreti çekilmeyecektir.
        </p>
        <Button variant="glow-green" style={{ width: '100%' }} onClick={onClose}>
          Teklifi Kabul Et ve Devam Et
        </Button>
      </div>

      <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <button
          onClick={() => setCancelStep(3)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.8125rem', color: 'var(--text-muted)',
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.5rem',
          }}
        >
          Hayır, iptal ve iade işlemine devam et <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );

  const renderCancelStep3 = () => (
    <div className="stack-md animate-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '50%',
        background: 'rgba(56,242,150,0.1)',
        border: '1px solid rgba(56,242,150,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto',
      }}>
        <CheckCircle size={32} style={{ color: 'var(--status-success)' }} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
        İptal ve İade Talebi Alındı
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '360px', margin: '0 auto' }}>
        İade talebiniz işleme alınmıştır. Bankanızın süreçlerine bağlı olarak ücret iadesi 3-5 iş günü içerisinde kartınıza yansıyacaktır.
      </p>
      <Button variant="outline" style={{ width: '100%', marginTop: '0.5rem' }} onClick={onClose}>
        Panoya Dön
      </Button>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-panel settings-modal-panel">

        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: 'var(--r-sm)',
              background: 'rgba(13,211,255,0.08)', border: '1px solid rgba(13,211,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Settings size={16} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                Hesap &amp; Ayarlar
              </h2>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginTop: '0.1rem' }}>
                Sistem tercihlerinizi yönetin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', cursor: 'pointer',
              color: 'var(--text-muted)', padding: '0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px', borderRadius: 'var(--r-sm)',
              transition: 'all 0.15s ease', flexShrink: 0,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-main)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Nav — scrollable on mobile, sidebar on desktop */}
        <div className="settings-tab-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { setActiveTab(item.key); setCancelStep(1); }}
              className={`settings-tab-btn ${activeTab === item.key ? 'active' : ''} ${item.danger ? 'danger' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="modal-body settings-modal-body">
          {activeTab === 'general' && renderGeneral()}
          {activeTab === 'subscription' && renderSubscription()}
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
  );
}
