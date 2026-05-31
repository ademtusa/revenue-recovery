import { useState } from 'react';
import { X, MessageSquare, CheckCircle, Smile, Meh, Frown, Users, Activity, Zap, DollarSign } from 'lucide-react';
import { Button } from './Button';

interface FeedbackModalProps {
  onClose: () => void;
  userEmail: string;
}

export function FeedbackModal({ onClose, userEmail }: FeedbackModalProps) {
  const [wasUseful, setWasUseful] = useState<'very' | 'somewhat' | 'not' | null>(null);
  const [mostValuable, setMostValuable] = useState<'lost_customers' | 'membership_decay' | 'opportunities' | 'revenue_estimate' | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasUseful || !mostValuable) {
      alert('Lütfen tüm soruları yanıtlayın.');
      return;
    }

    const newResponse = {
      email: userEmail,
      timestamp: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      wasUseful: wasUseful === 'very' ? 'Çok Faydalı' : wasUseful === 'somewhat' ? 'Biraz Faydalı' : 'Faydalı Değil',
      mostValuable: mostValuable === 'lost_customers' ? 'Kayıp Müşteriler' 
        : mostValuable === 'membership_decay' ? 'Abonelik Çürümesi' 
        : mostValuable === 'opportunities' ? 'Terk Edilmiş Fırsatlar' 
        : 'Gelir Tahmini',
      comment,
    };

    const existingResponsesStr = localStorage.getItem('rrio_feedback_responses');
    const existingResponses = existingResponsesStr ? JSON.parse(existingResponsesStr) : [];
    localStorage.setItem('rrio_feedback_responses', JSON.stringify([newResponse, ...existingResponses]));
    localStorage.setItem('rrio_feedback_shown', 'true');

    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 300 }}>
      <div className="modal-panel animate-in" style={{ maxWidth: '500px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <MessageSquare size={18} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Demo Geri Bildirimi
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: '0.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '32px', height: '32px', borderRadius: 'var(--r-xs)',
          }}>
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '3rem 2.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '68px', height: '68px', borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-success)',
              border: '1px solid rgba(16, 185, 129, 0.22)',
              marginBottom: '1.5rem',
              boxShadow: '0 0 24px rgba(16, 185, 129, 0.15)',
            }}>
              <CheckCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 850, color: 'var(--text-main)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              Değerli Katkınız İçin Teşekkür Ederiz!
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Geri bildiriminiz yerel veritabanına başarıyla kaydedildi. Görüşleriniz RRIO'nun sonraki 6 aylık ürün yol haritasını şekillendirecektir.
            </p>
            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', minHeight: '44px' }}>
              Kapat
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body" style={{ padding: '1.75rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              İlk 50 gerçek kullanıcı arasına katıldığınız için teşekkürler! Ürünü sizin için mükemmelleştirmemiz adına aşağıdaki soruları yanıtlar mısınız?
            </p>

            {/* Question 1 */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block', fontSize: '0.8125rem', fontWeight: 700 }}>
                1. RRIO Teşhis Raporu işletmeniz için ne kadar faydalı oldu?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem' }}>
                {[
                  { key: 'very', label: 'Çok Faydalı', icon: <Smile size={18} />, color: 'var(--status-success)', bgActive: 'rgba(16, 185, 129, 0.08)', borderActive: 'rgba(16, 185, 129, 0.5)' },
                  { key: 'somewhat', label: 'Biraz Faydalı', icon: <Meh size={18} />, color: 'var(--status-warning)', bgActive: 'rgba(255, 126, 71, 0.08)', borderActive: 'rgba(255, 126, 71, 0.5)' },
                  { key: 'not', label: 'Faydalı Değil', icon: <Frown size={18} />, color: 'var(--status-danger)', bgActive: 'rgba(239, 68, 68, 0.08)', borderActive: 'rgba(239, 68, 68, 0.5)' },
                ].map((opt) => {
                  const isActive = wasUseful === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setWasUseful(opt.key as any)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.875rem 0.5rem',
                        background: isActive ? opt.bgActive : 'rgba(0,0,0,0.25)',
                        border: isActive ? `1px solid ${opt.borderActive}` : '1px solid var(--border)',
                        borderRadius: 'var(--r-md)',
                        color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: isActive ? `0 0 12px ${opt.bgActive}` : 'none',
                      }}
                    >
                      <span style={{ color: isActive ? opt.color : 'inherit', transition: 'color 0.2s' }}>{opt.icon}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 2 */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block', fontSize: '0.8125rem', fontWeight: 700 }}>
                2. Sizce en değerli içgörü/özellik hangisiydi?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                {[
                  { key: 'lost_customers', label: 'Kayıp Müşteriler (İlişkiler)', icon: <Users size={14} />, color: 'var(--accent-primary)', bgActive: 'rgba(13, 211, 255, 0.08)' },
                  { key: 'membership_decay', label: 'Abonelik Çürümesi', icon: <Activity size={14} />, color: 'var(--accent-primary)', bgActive: 'rgba(13, 211, 255, 0.08)' },
                  { key: 'opportunities', label: 'Askıda Kalan Fırsatlar', icon: <Zap size={14} />, color: 'var(--neon-orange)', bgActive: 'rgba(255, 126, 71, 0.08)' },
                  { key: 'revenue_estimate', label: 'Ciro & Kaçak Tahmini', icon: <DollarSign size={14} />, color: 'var(--status-success)', bgActive: 'rgba(16, 185, 129, 0.08)' },
                ].map((opt) => {
                  const isActive = mostValuable === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setMostValuable(opt.key as any)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.875rem 0.75rem',
                        background: isActive ? opt.bgActive : 'rgba(0,0,0,0.25)',
                        border: isActive ? `1px solid ${opt.color}` : '1px solid var(--border)',
                        borderRadius: 'var(--r-md)',
                        color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'left',
                        boxShadow: isActive ? `0 0 12px ${opt.bgActive}` : 'none',
                      }}
                    >
                      <span style={{ color: isActive ? opt.color : 'inherit', flexShrink: 0 }}>{opt.icon}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Comment */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block', fontSize: '0.8125rem', fontWeight: 700 }}>
                Varsa diğer önerileriniz (İsteğe bağlı)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Örn: AI şablonları özelleştirilebilmeli veya otomatik e-posta gönderimi eklenmeli..."
                className="form-textarea"
                rows={3}
                style={{ fontSize: '0.75rem', minHeight: '80px', padding: '0.625rem 0.875rem' }}
              />
            </div>

            <Button
              type="submit"
              variant="glow-blue"
              style={{ width: '100%', minHeight: '44px', fontWeight: 700 }}
              disabled={!wasUseful || !mostValuable}
            >
              Geri Bildirimi Gönder 🚀
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
