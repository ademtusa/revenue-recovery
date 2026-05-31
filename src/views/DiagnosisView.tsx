import { useState, useEffect } from 'react';
import {
  DollarSign, Download, Clock, Target, Users, Zap, CheckCircle,
  Activity, MessageSquare, AlertCircle, Award, XCircle, Check,
  Settings, Cpu, Mail, ShieldAlert, LogOut, ArrowRight, Phone
} from 'lucide-react';
import { Button } from '../components/Button';
import { SettingsModal } from '../components/SettingsModal';
import { PricingModal } from '../components/PricingModal';
import { getRecords, updateRecord, saveLeadCapture, getLeadCaptures, getUserPlan } from '../lib/db';
import type { IntelligenceRecord, Category, ActionType, OutcomeType, LeadCaptureRecord, PlanType } from '../lib/db';

const Linkedin = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface DiagnosisViewProps {
  onReset: () => void;
  userEmail: string;
  onLogout: () => void;
  onNavigatePipeline: () => void;
}

export function DiagnosisView({ onReset, userEmail, onLogout, onNavigatePipeline }: DiagnosisViewProps) {
  const [activeView, setActiveView] = useState<'diagnose' | 'outcomes'>('diagnose');
  const [activeTab, setActiveTab] = useState<Category>('ABANDONED_OPPORTUNITY');
  const [records, setRecords] = useState<IntelligenceRecord[]>([]);
  const [leadCaptures, setLeadCaptures] = useState<LeadCaptureRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  
  const [userPlan, setUserPlanState] = useState<PlanType>(getUserPlan());
  const [limitHit, setLimitHit] = useState(false);

  useEffect(() => {
    setUserPlanState(getUserPlan());
    setLimitHit(localStorage.getItem('rrio_limit_hit') === 'true');
  }, []);

  const [isAutomationActive, setIsAutomationActive] = useState(() => {
    return localStorage.getItem('rrs_automation_active') === 'true';
  });
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadEmail, setLeadEmail] = useState('');
  const [isLeadCaptured, setIsLeadCaptured] = useState(false);

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'ACTION_TAKEN' | 'CLOSED'>('ALL');
  const [sortBy, setSortBy] = useState<'PRIORITY_DESC' | 'REVENUE_DESC' | 'DATE_DESC'>('PRIORITY_DESC');

  const [activeAction, setActiveAction] = useState<{ id: string; type: 'email' | 'whatsapp' | 'phone' | 'linkedin' } | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');

  const [selectedOutcome, setSelectedOutcome] = useState<Record<string, OutcomeType>>({});
  const [draftTones, setDraftTones] = useState<Record<string, 'formal' | 'friendly'>>({});

  const loadData = async () => {
    setLoading(true);
    const data = await getRecords();
    setRecords(data);
    const leads = await getLeadCaptures();
    setLeadCaptures(leads);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    Promise.all([getRecords(), getLeadCaptures()]).then(([data, leads]) => {
      if (active) {
        setRecords(data);
        setLeadCaptures(leads);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const handleAutomationToggle = (value: boolean) => {
    setIsAutomationActive(value);
    localStorage.setItem('rrs_automation_active', String(value));
  };

  const handleQuickAction = async (record: IntelligenceRecord, type: 'phone' | 'linkedin') => {
    const actionType: ActionType = type === 'phone' ? 'Telefonla Arandı' : 'Sosyal Ağ / LinkedIn';
    await updateRecord(record.id, { status: 'ACTION_TAKEN', actionType });
    if (type === 'phone' && record.clientPhone) {
      window.open(`tel:${record.clientPhone}`, '_blank');
    } else if (type === 'linkedin') {
      const name = record.contactPerson.split('(')[0].trim();
      const q = encodeURIComponent(`${name} ${record.clientName}`);
      window.open(`https://www.linkedin.com/search/results/people/?keywords=${q}`, '_blank');
    }
    await loadData();
  };

  const startAction = (record: IntelligenceRecord, type: 'email' | 'whatsapp' | 'phone' | 'linkedin') => {
    if (type === 'phone' || type === 'linkedin') {
      handleQuickAction(record, type);
      return;
    }
    setActiveAction({ id: record.id, type });
    setRecipientEmail(record.clientEmail || '');
    setRecipientPhone(record.clientPhone || '');
    setEditedSubject(`${record.clientName} - ${record.context} Takip`);
    const tone = draftTones[record.id] || 'formal';
    const bodyText = tone === 'friendly'
      ? record.draftMessage.replace('Ahmet Bey merhaba', 'Ahmet Bey selamlar').replace('Selin Hanım', 'Selin selam').replace('kontrol etmek istedim', 'bir yazayım istedim').replace('bekleriz', 'bekliyorum, sevgiler')
      : record.draftMessage;
    setEditedBody(bodyText);
  };

  const handleToneChange = (recordId: string, tone: 'formal' | 'friendly') => {
    setDraftTones(prev => ({ ...prev, [recordId]: tone }));
    if (activeAction?.id === recordId) {
      const record = records.find(r => r.id === recordId);
      if (record) {
        const bodyText = tone === 'friendly'
          ? record.draftMessage.replace('Ahmet Bey merhaba', 'Ahmet Bey selamlar').replace('Selin Hanım', 'Selin selam').replace('kontrol etmek istedim', 'bir yazayım istedim').replace('bekleriz', 'bekliyorum, sevgiler')
          : record.draftMessage;
        setEditedBody(bodyText);
      }
    }
  };

  const executeAction = async (record: IntelligenceRecord) => {
    if (!activeAction) return;
    const emailToSave = activeAction.type === 'email' ? recipientEmail : record.clientEmail;
    const phoneToSave = activeAction.type === 'whatsapp' ? recipientPhone : record.clientPhone;
    const actionLabel = activeAction.type === 'email' ? 'E-Posta Gönderildi' : 'WhatsApp / SMS';
    await updateRecord(record.id, {
      status: 'ACTION_TAKEN',
      actionType: actionLabel as ActionType,
      clientEmail: emailToSave,
      clientPhone: phoneToSave,
    });
    if (activeAction.type === 'email') {
      const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(editedSubject)}&body=${encodeURIComponent(editedBody)}`;
      window.open(mailtoUrl, '_blank');
    } else {
      const cleanPhone = recipientPhone.replace(/\D/g, '');
      const waUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(cleanPhone)}&text=${encodeURIComponent(editedBody)}`;
      window.open(waUrl, '_blank');
    }
    setActiveAction(null);
    await loadData();
  };

  const handleCloseLoop = async (id: string) => {
    const outcome = selectedOutcome[id];
    if (!outcome) return;
    await updateRecord(id, { status: 'CLOSED', outcome });
    await loadData();
  };

  // Metrics
  const totalLeakage = records.reduce((sum, r) => sum + r.revenueImpact, 0);
  const recoverablePotential = Math.round(totalLeakage * 0.45);
  const recoveredRevenue = records.filter(r => r.status === 'CLOSED' && r.outcome === 'recovered').reduce((sum, r) => sum + r.revenueImpact, 0);
  const preservedRevenue = records.filter(r => r.status === 'CLOSED' && (r.outcome === 'replied' || r.outcome === 'reopened')).reduce((sum, r) => sum + r.revenueImpact, 0);
  const churnedRevenue = records.filter(r => r.status === 'CLOSED' && r.outcome === 'churned').reduce((sum, r) => sum + r.revenueImpact, 0);
  const totalClosed = records.filter(r => r.status === 'CLOSED').length;
  const successCount = records.filter(r => r.status === 'CLOSED' && r.outcome !== 'churned' && r.outcome !== 'no_response').length;
  const successRate = totalClosed > 0 ? Math.round((successCount / totalClosed) * 100) : 0;

  const filteredRecords = records
    .filter(r => r.category === activeTab)
    .filter(r => filterStatus === 'ALL' || r.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'PRIORITY_DESC') return (b.priorityScore || 0) - (a.priorityScore || 0);
      if (sortBy === 'REVENUE_DESC') return b.revenueImpact - a.revenueImpact;
      if (sortBy === 'DATE_DESC') return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      return 0;
    });

  const getOutcomeBadgeClass = (outcome?: OutcomeType) => {
    if (!outcome) return 'badge-gray';
    if (outcome === 'recovered') return 'badge-success';
    if (outcome === 'replied') return 'badge-info';
    if (outcome === 'reopened') return 'badge-warning';
    if (outcome === 'no_response') return 'badge-gray';
    if (outcome === 'churned') return 'badge-danger';
    return 'badge-gray';
  };

  const getOutcomeIcon = (outcome?: OutcomeType) => {
    if (!outcome) return <AlertCircle size={12} />;
    if (outcome === 'recovered') return <Award size={12} />;
    if (outcome === 'replied') return <MessageSquare size={12} />;
    if (outcome === 'reopened') return <Activity size={12} />;
    if (outcome === 'no_response') return <Clock size={12} />;
    if (outcome === 'churned') return <XCircle size={12} />;
    return <AlertCircle size={12} />;
  };

  const getOutcomeLabel = (outcome?: OutcomeType) => {
    if (outcome === 'recovered') return 'Kurtarıldı';
    if (outcome === 'replied') return 'Yanıt Alındı';
    if (outcome === 'reopened') return 'Yeniden Açıldı';
    if (outcome === 'no_response') return 'Cevap Yok';
    if (outcome === 'churned') return 'Kayıp / Churn';
    return outcome || '';
  };

  const handleExportLeads = () => {
    let csv = 'data:text/csv;charset=utf-8,E-Posta,Tarih,Firma Sayisi,Hesaplanan Kacak Tutari\n';
    leadCaptures.forEach(lc => {
      csv += `"${lc.email}","${lc.capturedAt}","${lc.companyCount}","${lc.estimatedLoss}"\n`;
    });
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `rrio_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (!isLeadCaptured && leadCaptures.length === 0) {
      setShowLeadCapture(true);
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const tableRows = records.map(r => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:13px;">
          <strong>${r.clientName}</strong><br/>
          <small style="color:#64748b;">Yetkili: ${r.contactPerson} | ${r.context}</small>
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:13px;">
          ${r.category === 'ABANDONED_OPPORTUNITY' ? 'Terk Edilmiş Fırsat' : r.category === 'SUBSCRIPTION_DECAY' ? 'Abonelik Çürümesi' : 'Soğuk İlişki'}
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:13px;font-weight:bold;color:${r.urgency === 'CRITICAL' ? '#ef4444' : r.urgency === 'MEDIUM' ? '#f97316' : '#64748b'};">
          ${r.urgency === 'CRITICAL' ? 'Kritik' : r.urgency === 'MEDIUM' ? 'Orta' : 'Düşük'}
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:13px;font-weight:bold;text-align:right;">$${r.revenueImpact.toLocaleString()}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:13px;text-align:right;">
          ${r.status === 'PENDING' ? 'Bekliyor' : r.status === 'ACTION_TAKEN' ? 'İletişimde' : `Sonuçlandı (${getOutcomeLabel(r.outcome)})`}
        </td>
      </tr>`).join('');

    printWindow.document.write(`
      <html><head><title>RRS Executive Report</title>
      <style>
        body{font-family:'Helvetica Neue',sans-serif;color:#1e293b;padding:40px;background:#fff;}
        .header{border-bottom:2px solid #0f172a;padding-bottom:20px;margin-bottom:30px;}
        .header h1{margin:0;font-size:22px;font-weight:800;}
        .header p{margin:5px 0 0;color:#64748b;font-size:12px;}
        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:40px;}
        .stat{border:1px solid #e2e8f0;padding:18px;border-radius:8px;background:#f8fafc;}
        .stat span{font-size:10px;font-weight:700;text-transform:uppercase;color:#64748b;display:block;margin-bottom:5px;}
        .stat strong{font-size:22px;color:#0f172a;font-weight:800;}
        table{width:100%;border-collapse:collapse;}
        th{padding:10px 8px;text-align:left;background:#f1f5f9;font-size:11px;font-weight:700;text-transform:uppercase;color:#475569;border-bottom:2px solid #cbd5e1;}
        .footer{text-align:center;font-size:10px;color:#94a3b8;margin-top:60px;border-top:1px solid #e2e8f0;padding-top:20px;}
      </style></head><body>
      <div class="header"><h1>REVENUE RECOVERY SYSTEM (RRS)</h1>
      <p>Yönetici Raporu | ${new Date().toLocaleDateString('tr-TR')} | ${userEmail}</p></div>
      <div class="stats">
        <div class="stat" style="border-left:4px solid #ef4444;"><span>Toplam Sızıntı</span><strong>$${totalLeakage.toLocaleString()}</strong></div>
        <div class="stat" style="border-left:4px solid #10b981;"><span>Kurtarılabilir (%45)</span><strong>$${recoverablePotential.toLocaleString()}</strong></div>
        <div class="stat" style="border-left:4px solid #3b82f6;"><span>Kurtarılan Ciro</span><strong>$${recoveredRevenue.toLocaleString()}</strong></div>
      </div>
      <div style="font-size:16px;font-weight:700;margin-bottom:15px;border-left:4px solid #3b82f6;padding-left:10px;">Tespit Edilen Riskler</div>
      <table><thead><tr><th>Müşteri / Proje</th><th>Kategori</th><th>Aciliyet</th><th style="text-align:right;">Risk ($)</th><th style="text-align:right;">Durum</th></tr></thead>
      <tbody>${tableRows}</tbody></table>
      <div class="footer"><p>RRS Zeka Teşhis Motoru © ${new Date().getFullYear()}</p></div>
      <script>window.onload=function(){window.print();setTimeout(function(){window.close();},500);}</script>
      </body></html>`);
    printWindow.document.close();
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail || !leadEmail.includes('@')) { alert('Lütfen geçerli bir e-posta girin.'); return; }
    await saveLeadCapture(leadEmail, recoverablePotential, records.length);
    setIsLeadCaptured(true);
    setShowLeadCapture(false);
    const leads = await getLeadCaptures();
    setLeadCaptures(leads);
    setTimeout(handleExportPDF, 500);
  };

  const getBehavioralReminders = () => {
    const pending = records.filter(r => r.status === 'PENDING');
    const alerts = [];
    const decayAlert = pending.find(r => r.category === 'SUBSCRIPTION_DECAY');
    if (decayAlert) alerts.push({ id: decayAlert.id, title: `Abonelik Riski: ${decayAlert.clientName}`, description: 'Sisteme giriş sıklığında düşüş saptandı. Değer hatırlatıcı temas öneriliyor.', record: decayAlert });
    const oppAlert = pending.find(r => r.category === 'ABANDONED_OPPORTUNITY');
    if (oppAlert) alerts.push({ id: oppAlert.id, title: `Kaçırılan Teklif: ${oppAlert.clientName}`, description: 'Müşteri teklifi açtı ancak 14 gündür takip yapılmadı. Hızlı aksiyon öneriliyor.', record: oppAlert });
    return alerts;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner spinner-lg" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Teşhis verileri analiz ediliyor...</p>
        </div>
      </div>
    );
  }

  const reminders = getBehavioralReminders();

  return (
    <>
      {/* ── MODALS — rendered outside animate-in to prevent fixed positioning bug ── */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
        />
      )}
      
      {showPricing && (
        <PricingModal 
          onClose={() => setShowPricing(false)}
          onPlanUpdated={() => {
            setUserPlanState(getUserPlan());
            setLimitHit(false); // They upgraded, limit is lifted
            loadData();
          }}
        />
      )}

      {showLeadCapture && (
        <div className="modal-overlay">
          <div className="modal-panel" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontWeight: 700, fontSize: '1.0625rem', color: 'var(--text-main)' }}>
                <Mail size={20} style={{ color: 'var(--neon-orange)' }} /> Raporunuzu İndirin
              </h3>
              <button onClick={() => setShowLeadCapture(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.65 }}>
                Toplam <strong style={{ color: 'var(--text-main)' }}>{records.length} kritik sızıntı</strong> ve{' '}
                <strong style={{ color: 'var(--status-success)' }}>${recoverablePotential.toLocaleString()}</strong>{' '}
                geri kazanılabilir ciro tespit edildi. PDF raporu için e-posta adresinizi girin.
              </p>
              <form onSubmit={handleLeadSubmit} className="stack-md">
                <div className="form-group">
                  <label className="form-label">E-Posta Adresiniz</label>
                  <input type="email" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="name@company.com" className="form-input" required />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowLeadCapture(false)}>İptal</Button>
                  <Button type="submit" variant="glow-orange" className="flex-1">
                    <Download size={14} /> Raporu İndir
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="page-full animate-in">

      {/* ── TOPBAR ── */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="topbar-brand">
            <div className="topbar-brand-icon">
              <Cpu size={17} className="animate-pulse-slow" />
            </div>
            <div>
              <span className="topbar-brand-name">RRIO</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginLeft: '0.375rem', fontWeight: 500 }}>
                Recovery Intelligence
              </span>
            </div>
          </div>

          <div className="topbar-actions">
            {userPlan === 'FREE' && (
              <button className="btn btn-glow-orange" style={{ padding: '0.5rem 1rem', minHeight: '40px', fontSize: '0.75rem', fontWeight: 700 }}
                onClick={() => setShowPricing(true)}>
                🚀 Sınırsız Analiz İçin Yükselt
              </button>
            )}
            <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', minHeight: '40px', fontSize: '0.75rem' }}
              onClick={onReset}>
              Yeniden Tara
            </button>
            <button className="btn btn-glow-blue" style={{ padding: '0.5rem 1rem', minHeight: '40px', fontSize: '0.75rem' }}
              onClick={userPlan === 'FREE' ? () => alert('Gelişmiş Pipeline (Outcomes Center) sadece Pro planda kullanılabilir. Lütfen yükseltin.') : onNavigatePipeline}>
              📊 Pipeline
            </button>
            <Button variant="glow-blue" className="btn-icon" onClick={() => setShowSettings(true)} title="Ayarlar">
              <Settings size={17} />
            </Button>
            <Button variant="glow-blue" onClick={handleExportPDF}
              style={{ padding: '0.5rem 1rem', minHeight: '40px', fontSize: '0.75rem' }}>
              <Download size={14} /> PDF
            </Button>
            <Button variant="outline" className="btn-icon" onClick={onLogout} title="Çıkış">
              <LogOut size={17} />
            </Button>
          </div>
        </div>
      </header>

      <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-gray" style={{ marginBottom: '0.75rem' }}>Gelir Rehabilitasyon Operasyonu</span>
          <h1 style={{
            fontSize: 'clamp(1.375rem, 3vw, 1.875rem)',
            fontWeight: 800, letterSpacing: '-0.025em',
            marginBottom: '0.375rem', color: 'var(--text-main)',
            lineHeight: 1.25,
          }}>
            RRIO <span style={{ color: 'var(--accent-primary)', textShadow: '0 0 20px var(--glow-primary)' }}>Recovery Intelligence</span> Operations
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '560px' }}>
            Müşteri veritabanınızdaki sessiz gelir kayıpları ve kurtarma radarı.
          </p>
        </div>

        {/* ── FREEMIUM PAYWALL BANNER ── */}
        {limitHit && userPlan === 'FREE' && (
          <div style={{
            background: 'rgba(255, 126, 71, 0.1)',
            border: '1px solid rgba(255, 126, 71, 0.4)',
            borderRadius: 'var(--r-lg)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
          }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neon-orange)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} /> Sadece İlk 50 Kayıt Analiz Edildi
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', margin: 0, opacity: 0.9 }}>
                Ücretsiz planda olduğunuz için dosyanızın sadece ilk 50 satırı işlendi. Kalan kayıtlardaki riskleri görmek ve kurtarma operasyonunu yönetmek için planınızı yükseltin.
              </p>
            </div>
            <button className="btn btn-glow-orange" style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: 700 }}
              onClick={() => setShowPricing(true)}>
              Pro Plana Geç (<DollarSign size={14} style={{ marginLeft: -2 }}/>97/ay)
            </button>
          </div>
        )}

        {/* ── SUB-NAV TABS ── */}
        <div className="tabs-underline" style={{ marginBottom: '1.75rem' }}>
          <button
            onClick={() => setActiveView('diagnose')}
            className={`tab-underline-btn ${activeView === 'diagnose' ? 'active' : ''}`}
          >
            🔍 Zeka Teşhis Raporu
          </button>
          <button
            onClick={() => setActiveView('outcomes')}
            className={`tab-underline-btn ${activeView === 'outcomes' ? 'active' : ''}`}
          >
            📈 Geri Kazanım & Sonuç Merkezi
          </button>
        </div>

        {/* ── RECOVERY PROGRESS BANNER ── */}
        {records.length > 0 && !loading && (
          <div style={{
            display: 'flex', alignItems: 'stretch', gap: '0',
            marginBottom: '1.75rem',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)',
            overflow: 'hidden',
            background: 'rgba(5,6,15,0.6)',
            backdropFilter: 'blur(12px)',
          }}>
            {/* Totals cell */}
            <div style={{
              padding: '0.875rem 1.25rem', flexShrink: 0,
              borderRight: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '0.2rem' }}>
                Toplam
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {records.length}
              </div>
            </div>

            {/* Progress area */}
            <div style={{ flex: 1, padding: '0.75rem 1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
              {/* Labels */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  {[
                    { color: 'var(--status-warning)', label: 'Bekleyen', count: records.filter(r => r.status === 'PENDING').length },
                    { color: 'var(--accent-primary)', label: 'İşlemde', count: records.filter(r => r.status === 'ACTION_TAKEN').length },
                    { color: 'var(--status-success)', label: 'Kapatıldı', count: records.filter(r => r.status === 'CLOSED').length },
                  ].map(item => (
                    <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: 'var(--text-faint)' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: item.color, display: 'inline-block', flexShrink: 0 }} />
                      {item.label}: <strong style={{ color: item.color }}>{item.count}</strong>
                    </span>
                  ))}
                </div>
                <span style={{
                  fontSize: '0.68rem', fontWeight: 800, whiteSpace: 'nowrap',
                  color: records.filter(r => r.status === 'CLOSED').length > 0 ? 'var(--status-success)' : 'var(--text-faint)',
                }}>
                  %{Math.round((records.filter(r => r.status === 'CLOSED').length / records.length) * 100)} Tamamlandı
                </span>
              </div>

              {/* Segmented progress bar */}
              <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.04)', overflow: 'hidden', display: 'flex' }}>
                <div style={{
                  height: '100%', background: 'var(--status-warning)',
                  width: `${(records.filter(r => r.status === 'PENDING').length / records.length) * 100}%`,
                  opacity: 0.75, transition: 'width 0.6s ease',
                  borderRadius: '3px 0 0 3px',
                }} />
                <div style={{
                  height: '100%', background: 'var(--accent-primary)',
                  width: `${(records.filter(r => r.status === 'ACTION_TAKEN').length / records.length) * 100}%`,
                  opacity: 0.75, transition: 'width 0.6s ease',
                }} />
                <div style={{
                  height: '100%', background: 'var(--status-success)',
                  width: `${(records.filter(r => r.status === 'CLOSED').length / records.length) * 100}%`,
                  opacity: 0.85, transition: 'width 0.6s ease',
                  borderRadius: '0 3px 3px 0',
                }} />
              </div>
            </div>
          </div>
        )}

        {/* ── LIFECYCLE STEPPER ── */}

        <div className="lifecycle-wrap" style={{ marginBottom: '1.75rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem',
          }}>
            <span style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--accent-primary)',
            }}>
              <Cpu size={12} className="animate-pulse" /> RRS Operational Lifecycle
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Uçtan Uca Kurtarma Süreç Akışı</span>
          </div>
          <div className="lifecycle-grid">
            {[
              { cls: 'ls-detect', num: '1', name: 'DETECT', desc: 'Sızıntıyı Yakala' },
              { cls: 'ls-classify', num: '2', name: 'CLASSIFY', desc: 'Kategoriyi Sınıfla' },
              { cls: 'ls-explain', num: '3', name: 'EXPLAIN', desc: 'Nedeni Analiz Et' },
              { cls: 'ls-recommend', num: '4', name: 'RECOMMEND', desc: 'Strateji Belirle' },
              { cls: 'ls-action', num: '5', name: 'ACTION', desc: 'Teması Başlat' },
              { cls: 'ls-track', num: '6', name: 'TRACK', desc: 'Süreci İzle' },
              { cls: 'ls-recovery', num: '7', name: 'RECOVERY', desc: 'Geliri Kurtar' },
            ].map((s) => (
              <div key={s.num} className={`lifecycle-step ${s.cls}`}>
                <span className="ls-step-num">{s.num}. {s.name}</span>
                <span className="ls-name">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── DIAGNOSE VIEW ── */}
        {activeView === 'diagnose' ? (
          <>
            {/* Behavioral Reminders */}
            {reminders.length > 0 && (
              <div className="reminder-banner" style={{ marginBottom: '1.75rem' }}>
                <h4 style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'var(--status-warning)', marginBottom: '0.875rem',
                }}>
                  <ShieldAlert size={14} /> Davranışsal Hatırlatıcı İstihbaratı
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.875rem' }}>
                  {reminders.map((alert, i) => (
                    <div key={i} className="reminder-item">
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>{alert.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{alert.description}</div>
                      <button
                        onClick={() => {
                          setActiveTab(alert.record.category);
                          setTimeout(() => {
                            document.getElementById(`record-${alert.record.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }, 100);
                        }}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                          fontSize: '0.7rem', fontWeight: 700, color: 'var(--status-warning)',
                          background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '0.25rem',
                        }}
                      >
                        Kartı Göster <ArrowRight size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KPI Cards */}
            <div className="grid-3" style={{ marginBottom: '1.75rem' }}>
              <div className="kpi-card kpi-danger">
                <span className="kpi-label">Toplam Sızıntı Tutarı</span>
                <div className="kpi-value kv-danger">
                  <DollarSign size={22} /> {totalLeakage.toLocaleString()}
                </div>
                <span className="kpi-note">Unutulmuş ve askıya alınmış fırsatların toplamı.</span>
              </div>

              <div className="kpi-card kpi-success">
                <span className="kpi-label">Kurtarılabilir Gelir Potansiyeli</span>
                <div className="kpi-value kv-success">
                  <DollarSign size={22} /> {recoverablePotential.toLocaleString()}
                </div>
                <span className="kpi-note">AI Geri Kazanım Kural Motoru başarı tahmini (%45).</span>
              </div>

              <div className="kpi-card kpi-primary">
                <span className="kpi-label">Döngüsü Kurtarılan Ciro</span>
                <div className="kpi-value kv-primary">
                  <DollarSign size={22} /> {recoveredRevenue.toLocaleString()}
                </div>
                <span className="kpi-note">Geri kazanılmış ve loop döngüsü kapatılmış ciro.</span>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="tabs-scroll-container" style={{ marginBottom: '1.25rem' }}>
              {[
                { key: 'ABANDONED_OPPORTUNITY', label: 'Terk Edilmiş Fırsatlar', icon: <Zap size={15} /> },
                { key: 'SUBSCRIPTION_DECAY', label: 'Abonelik Çürümesi', icon: <Activity size={15} /> },
                { key: 'COLD_RELATIONSHIP', label: 'Soğuyan İlişkiler', icon: <Users size={15} /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as Category)}
                  className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                >
                  {tab.icon}
                  {tab.label}
                  <span className="tab-count">
                    ({records.filter(r => r.category === tab.key).length})
                  </span>
                </button>
              ))}
            </div>

            {/* Automation Toggle */}
            <div className="automation-row" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                <Zap size={18} style={{ color: isAutomationActive ? 'var(--neon-orange)' : 'var(--text-faint)', flexShrink: 0 }}
                  className={isAutomationActive ? 'animate-pulse-slow' : ''} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                    Döngü Otomasyon Modu
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Aksiyon mesajlarının arka planda otomatik zamanlanmasını simüle edin.
                  </div>
                </div>
              </div>
              <label className="toggle-label" style={{ flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={isAutomationActive}
                  onChange={(e) => handleAutomationToggle(e.target.checked)}
                />
                <div className="toggle-track">
                  <div className="toggle-thumb" />
                </div>
              </label>
            </div>

            {/* Filter & Sort */}
            <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
              <div className="filter-group">
                <span className="filter-label">Durum</span>
                <select
                  className="filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                >
                  <option value="ALL">Tüm Fırsatlar</option>
                  <option value="PENDING">Bekleyenler</option>
                  <option value="ACTION_TAKEN">Takip Başlatılanlar</option>
                  <option value="CLOSED">Kapatılanlar</option>
                </select>
              </div>
              <div className="filter-group">
                <span className="filter-label">Sıralama</span>
                <select
                  className="filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                >
                  <option value="PRIORITY_DESC">Öncelik (Yüksek)</option>
                  <option value="REVENUE_DESC">Risk Tutarı (Yüksek)</option>
                  <option value="DATE_DESC">Son İşlem Tarihi</option>
                </select>
              </div>
            </div>

            {/* Record Cards */}
            <div className="stack-md" style={{ marginBottom: '3rem' }}>
              {filteredRecords.length === 0 && (
                <div className="glass-panel empty-state" style={{ border: '1px dashed var(--border-hover)' }}>
                  <CheckCircle size={36} style={{ color: 'var(--border-hover)' }} />
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>Tebrikler!</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Bu kategoride acil risk tespiti bulunamadı.</p>
                </div>
              )}

              {filteredRecords.map(record => (
                <div key={record.id} id={`record-${record.id}`} className="record-card" style={{ scrollMarginTop: '80px' }}>

                  <div className="record-content">

                      <h3 style={{
                        fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em',
                        color: 'var(--text-main)', marginBottom: '0.3rem',
                      }}>
                        {record.clientName}
                      </h3>
                      <p style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.375rem',
                      }}>
                        <Users size={13} style={{ flexShrink: 0 }} />
                        Yetkili: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{record.contactPerson}</span>
                      </p>

                      {/* Stats mini-grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div className="premium-panel">
                          <span style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '0.3rem' }}>
                            Proje / Kapsam
                          </span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.3 }}>
                            {record.context}
                          </span>
                        </div>
                        <div className="premium-panel">
                          <span style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '0.3rem' }}>
                            Riskteki Gelir
                          </span>
                          <span style={{
                            display: 'flex', alignItems: 'center', gap: '0.2rem',
                            fontSize: '1.125rem', fontWeight: 800,
                            color: 'var(--status-danger)',
                            textShadow: '0 0 12px var(--glow-danger)',
                          }}>
                            <DollarSign size={15} /> {record.revenueImpact.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                        <h4 style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                          textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '1rem',
                        }}>
                          <Activity size={13} style={{ color: 'var(--accent-primary)' }} />
                          Olay Güdümlü Zaman Tüneli
                        </h4>
                        <div className="timeline">
                          {record.eventHistory?.map((ev, i) => {
                            let dotCls = 'dot-default';
                            if (ev.type.includes('triggered')) dotCls = 'dot-orange';
                            else if (ev.type.includes('missed') || ev.type.includes('inactive') || ev.type.includes('risk') || ev.type === 'customer_churned') dotCls = 'dot-red';
                            else if (ev.type.includes('sent') || ev.type.includes('viewed') || ev.type.includes('contacted') || ev.type === 'customer_replied' || ev.type === 'recovery_action_taken') dotCls = 'dot-cyan';
                            else if (ev.type.includes('completed') || ev.type.includes('won') || ev.type.includes('recovered') || ev.type === 'recovery_completed') dotCls = 'dot-green';
                            return (
                              <div key={i} className="timeline-item">
                                <div className={`timeline-dot ${dotCls}`} />
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                  {ev.title}
                                  <span style={{ fontSize: '0.68rem', color: 'var(--text-faint)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 400 }}>
                                    ({ev.date})
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                                  {ev.description}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                  </div>

                  {/* RIGHT: Intelligence & Action */}
                  <div className="record-action-area">
                      <div style={{ flex: 1 }}>
                        {/* Confidence badge */}
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem',
                        }}>
                          <h4 style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                            textTransform: 'uppercase', color: 'var(--text-faint)',
                          }}>
                            <ShieldAlert size={13} style={{ color: 'var(--accent-primary)' }} /> İstihbarat Teşhisi
                          </h4>
                          <span className={`conf-badge ${(record.confidenceScore || 90) >= 90 ? 'conf-high' : (record.confidenceScore || 90) >= 75 ? 'conf-med' : 'conf-low'}`}>
                            {(record.confidenceScore || 90) >= 90 ? 'Yüksek Güvenilirlik' : (record.confidenceScore || 90) >= 75 ? 'Orta Güvenilirlik' : 'Düşük Güvenilirlik'}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.65, marginBottom: '1.25rem', opacity: 0.9 }}>
                          {record.subCause}
                        </p>

                        <h4 style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                          textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '0.5rem',
                        }}>
                          <Target size={13} style={{ color: 'var(--accent-primary)' }} /> Önerilen Strateji
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.65, marginBottom: '1.25rem', opacity: 0.9 }}>
                          {record.strategy}
                        </p>

                        {/* Draft message with tone switcher */}
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          marginBottom: '0.625rem', flexWrap: 'wrap', gap: '0.5rem',
                        }}>
                          <h4 style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                            textTransform: 'uppercase', color: 'var(--text-faint)',
                          }}>
                            <MessageSquare size={13} style={{ color: 'var(--accent-primary)' }} /> Kurtarma Şablonu
                          </h4>
                          <div className="tone-switcher">
                            <button
                              className={`tone-btn ${(!draftTones[record.id] || draftTones[record.id] === 'formal') ? 'active' : ''}`}
                              onClick={() => handleToneChange(record.id, 'formal')}
                              disabled={isAutomationActive}
                            >
                              Kurumsal
                            </button>
                            <button
                              className={`tone-btn ${draftTones[record.id] === 'friendly' ? 'active' : ''}`}
                              onClick={() => handleToneChange(record.id, 'friendly')}
                              disabled={isAutomationActive}
                            >
                              Samimi
                            </button>
                          </div>
                        </div>

                        <div className="draft-block" style={{ marginBottom: '1.5rem' }}>
                          "{draftTones[record.id] === 'friendly'
                            ? record.draftMessage.replace('Ahmet Bey merhaba', 'Ahmet Bey selamlar').replace('Selin Hanım', 'Selin selam').replace('kontrol etmek istedim', 'bir yazayım istedim').replace('bekleriz', 'bekliyorum, sevgiler')
                            : record.draftMessage}"
                        </div>
                      </div>

                      {/* ── Action Zone ── */}
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: 'auto' }}>

                        {/* PENDING */}
                        {record.status === 'PENDING' && (
                          <>
                            {isAutomationActive ? (
                              <div className="auto-active-banner">
                                <Zap size={18} style={{ color: 'var(--neon-orange)', flexShrink: 0 }} className="animate-pulse-slow" />
                                <div>
                                  <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--neon-orange)' }}>
                                    Otomatik Kurtarma Sırasında
                                  </span>
                                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                                    Sistem 2 saat içinde otomatik şablonu tetikleyecektir.
                                  </span>
                                </div>
                              </div>
                            ) : activeAction?.id !== record.id ? (
                              <div className="stack-xs">
                                <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)', marginBottom: '0.25rem' }}>
                                  Aksiyon Başlat
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                  <Button variant="glow-blue" onClick={() => startAction(record, 'email')}
                                    style={{ fontSize: '0.72rem', padding: '0.5rem 0.75rem', minHeight: '40px' }}>
                                    <Mail size={13} /> E-Posta
                                  </Button>
                                  <Button variant="glow-orange" onClick={() => startAction(record, 'whatsapp')}
                                    style={{ fontSize: '0.72rem', padding: '0.5rem 0.75rem', minHeight: '40px' }}>
                                    <MessageSquare size={13} /> WhatsApp
                                  </Button>
                                  <Button variant="outline" onClick={() => startAction(record, 'phone')}
                                    style={{ fontSize: '0.72rem', padding: '0.5rem 0.75rem', minHeight: '40px' }}>
                                    <Phone size={13} /> Telefon
                                  </Button>
                                  <Button variant="outline" onClick={() => startAction(record, 'linkedin')}
                                    style={{ fontSize: '0.72rem', padding: '0.5rem 0.75rem', minHeight: '40px', color: 'var(--status-info)', borderColor: 'rgba(167,139,250,0.3)' }}>
                                    <Linkedin size={13} /> LinkedIn
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              /* Compose Panel */
                              <div className="compose-panel">
                                <div className="compose-header">
                                  <span style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                                    letterSpacing: '0.1em', color: 'var(--accent-primary)',
                                  }}>
                                    {activeAction.type === 'email' ? <Mail size={12} /> : <MessageSquare size={12} />}
                                    {activeAction.type === 'email' ? 'E-POSTA ASİSTANI' : 'WHATSAPP ASİSTANI'}
                                  </span>
                                  <button onClick={() => setActiveAction(null)}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                                    İptal
                                  </button>
                                </div>

                                <div className="stack-sm">
                                  {activeAction.type === 'email' ? (
                                    <>
                                      <div className="form-group">
                                        <label className="form-label">Alıcı E-Posta</label>
                                        <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)}
                                          placeholder="ornek@sirket.com" className="form-input" style={{ minHeight: '40px', padding: '0.5rem 0.875rem', fontSize: '0.8125rem' }} />
                                      </div>
                                      <div className="form-group">
                                        <label className="form-label">E-Posta Konusu</label>
                                        <input type="text" value={editedSubject} onChange={(e) => setEditedSubject(e.target.value)}
                                          className="form-input" style={{ minHeight: '40px', padding: '0.5rem 0.875rem', fontSize: '0.8125rem' }} />
                                      </div>
                                    </>
                                  ) : (
                                    <div className="form-group">
                                      <label className="form-label">WhatsApp Numarası</label>
                                      <input type="text" value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)}
                                        placeholder="+905551234567" className="form-input" style={{ minHeight: '40px', padding: '0.5rem 0.875rem', fontSize: '0.8125rem' }} />
                                    </div>
                                  )}

                                  <div className="form-group">
                                    <label className="form-label">Mesaj Taslağı</label>
                                    <textarea value={editedBody} onChange={(e) => setEditedBody(e.target.value)}
                                      rows={5} className="form-textarea" style={{ minHeight: '100px', fontSize: '0.75rem', padding: '0.625rem 0.875rem' }} />
                                  </div>

                                  <Button variant="glow-green" style={{ width: '100%', fontSize: '0.8rem', minHeight: '44px' }}
                                    onClick={() => executeAction(record)}>
                                    Aksiyonu Kaydet & Tetikle <Zap size={14} />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {/* ACTION TAKEN */}
                        {record.status === 'ACTION_TAKEN' && (
                          <div className="stack-sm">
                            <div className="action-taken-panel">
                              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                                <CheckCircle size={15} /> Aksiyon Alındı: {record.actionType}
                              </p>
                              {(record.clientEmail || record.clientPhone) && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.375rem', paddingLeft: '1.5rem' }}>
                                  {record.clientEmail && <div>E-Posta: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{record.clientEmail}</span></div>}
                                  {record.clientPhone && <div>Tel: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{record.clientPhone}</span></div>}
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="form-label" style={{ marginBottom: '0.5rem' }}>Döngüyü Kapatmak İçin Sonuç Seçin:</label>
                              <div className="outcome-row">
                                <select
                                  className="filter-select"
                                  style={{ flex: 1, minWidth: '160px' }}
                                  value={selectedOutcome[record.id] || ''}
                                  onChange={(e) => setSelectedOutcome({ ...selectedOutcome, [record.id]: e.target.value as OutcomeType })}
                                >
                                  <option value="" disabled>Sonucu seçin...</option>
                                  <option value="recovered">✅ Kurtarıldı (Gelir Geri Kazanıldı)</option>
                                  <option value="replied">💬 Yanıt Alındı (İletişim Aktif)</option>
                                  <option value="reopened">🔄 Yeniden Açıldı</option>
                                  <option value="no_response">⏳ Cevap Yok</option>
                                  <option value="churned">❌ Kayıp / Churn</option>
                                </select>
                                <Button variant="glow-green" disabled={!selectedOutcome[record.id]}
                                  onClick={() => handleCloseLoop(record.id)}
                                  style={{ minHeight: '40px', padding: '0.5rem 1.25rem', fontSize: '0.8rem', flexShrink: 0 }}>
                                  <Check size={14} /> Kaydet
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CLOSED */}
                        {record.status === 'CLOSED' && (
                          <div className="closed-panel">
                            <div>
                              <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)', marginBottom: '0.375rem' }}>
                                Döngü Sonucu
                              </span>
                              <span className={`badge ${getOutcomeBadgeClass(record.outcome)}`} style={{ fontSize: '0.7rem' }}>
                                {getOutcomeIcon(record.outcome)} {getOutcomeLabel(record.outcome)}
                              </span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)', marginBottom: '0.375rem' }}>
                                Gerçekleşen Aksiyon
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', justifyContent: 'flex-end' }}>
                                <CheckCircle size={13} /> {record.actionType}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                </div>
              ))}
            </div>

            {/* Global Ledger Table */}
            <div style={{ marginBottom: '3rem' }}>
              <div className="section-title-row">
                <span className="section-title-text">
                  <Activity size={18} style={{ color: 'var(--accent-primary)' }} />
                  Global İstihbarat Kaydı
                </span>
              </div>
              <div className="glass-panel">
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Müşteri / Proje</th>
                        <th>Kategori</th>
                        <th>Risk Tutarı</th>
                        <th style={{ textAlign: 'right' }}>Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.length === 0 ? (
                        <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>Henüz analiz edilmiş veri bulunmamaktadır.</td></tr>
                      ) : records.map((r) => (
                        <tr key={r.id}>
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.15rem' }}>{r.clientName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.context}</div>
                          </td>
                          <td>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                              {r.category === 'ABANDONED_OPPORTUNITY' && <Zap size={12} style={{ color: 'var(--accent-primary)' }} />}
                              {r.category === 'SUBSCRIPTION_DECAY' && <Activity size={12} style={{ color: 'var(--accent-primary)' }} />}
                              {r.category === 'COLD_RELATIONSHIP' && <Users size={12} style={{ color: 'var(--accent-primary)' }} />}
                              {r.category === 'ABANDONED_OPPORTUNITY' ? 'Terk Edilmiş Fırsat' : r.category === 'SUBSCRIPTION_DECAY' ? 'Abonelik Çürümesi' : 'Soğuk İlişki'}
                            </span>
                          </td>
                          <td>
                            <span style={{
                              fontWeight: 700,
                              color: r.urgency === 'CRITICAL' ? 'var(--status-danger)' : r.urgency === 'MEDIUM' ? 'var(--status-warning)' : 'var(--text-muted)',
                            }}>
                              ${r.revenueImpact.toLocaleString()}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {r.status === 'PENDING' && <span className="badge badge-gray"><Clock size={11} /> Bekliyor</span>}
                            {r.status === 'ACTION_TAKEN' && <span className="badge badge-info"><CheckCircle size={11} /> İşlemde</span>}
                            {r.status === 'CLOSED' && <span className={`badge ${getOutcomeBadgeClass(r.outcome)}`}>{getOutcomeIcon(r.outcome)} {getOutcomeLabel(r.outcome)}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : userPlan === 'FREE' ? (
          <div className="stack-lg animate-in" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
            <div style={{
              background: 'rgba(255, 126, 71, 0.05)',
              border: '1px solid rgba(255, 126, 71, 0.3)',
              borderRadius: 'var(--r-xl)',
              padding: '4rem 2rem',
              maxWidth: '680px',
              margin: '0 auto',
            }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 126, 71, 0.1)', color: 'var(--neon-orange)', marginBottom: '1.5rem' }}>
                <Target size={32} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
                Gelişmiş Kurtarma ve Sonuç Merkezi
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
                Ücretsiz planda sadece teşhis yapabilirsiniz. "Geri Kazanım & Sonuç Merkezi" (Outcomes Center); kurtarılan ciroları, before/after dönüşümlerini ve operasyonel başarı oranlarını takip etmek içindir ve sadece <b>Pro</b> planda mevcuttur.
              </p>
              <button className="btn btn-glow-orange" style={{ padding: '0.875rem 2rem', fontSize: '1rem', fontWeight: 700 }}
                onClick={() => setShowPricing(true)}>
                Pro Plana Geç (<DollarSign size={16} style={{ marginLeft: -2 }}/>97/ay)
              </button>
            </div>
          </div>
        ) : (
          /* ── OUTCOMES VIEW ── */
          <div className="stack-lg animate-in">

            {/* Exec summary cards */}
            <div className="grid-4">
              <div className="kpi-card kpi-success">
                <span className="kpi-label">Kurtarılan Ciro</span>
                <div className="kpi-value kv-success"><DollarSign size={20} /> {recoveredRevenue.toLocaleString()}</div>
                <span className="kpi-note">Tahsil edilmiş kesin gelir.</span>
              </div>
              <div className="kpi-card kpi-primary">
                <span className="kpi-label">Korunan Ciro</span>
                <div className="kpi-value kv-primary"><DollarSign size={20} /> {preservedRevenue.toLocaleString()}</div>
                <span className="kpi-note">İlişkisi tazelenmiş değer.</span>
              </div>
              <div className="kpi-card kpi-danger">
                <span className="kpi-label">Kaybedilen / Churn</span>
                <div className="kpi-value kv-danger"><DollarSign size={20} /> {churnedRevenue.toLocaleString()}</div>
                <span className="kpi-note">Ulaşılamayan bütçe tutarı.</span>
              </div>
              <div className="kpi-card kpi-warning">
                <span className="kpi-label">Başarı Oranı</span>
                <div className="kpi-value kv-warning">%{successRate}</div>
                <span className="kpi-note">Kapatılmış döngü başarısı.</span>
              </div>
            </div>

            {/* Before/After transition panels */}
            <div>
              <div className="section-title-row">
                <span className="section-title-text"><Zap size={18} style={{ color: 'var(--accent-primary)' }} /> Dönüşüm Analizi</span>
              </div>
              <div className="grid-3">
                {[
                  { icon: <Zap size={18} style={{ color: 'var(--accent-primary)' }} />, title: 'Terk Edilmiş Fırsat → Kurtarma', before: 'Teklif İlgisiz & Unutulmuş', after: 'Takip Başlatıldı & Gelir Kurtarıldı', count: records.filter(r => r.category === 'ABANDONED_OPPORTUNITY' && r.status === 'CLOSED' && r.outcome === 'recovered').length },
                  { icon: <Activity size={18} style={{ color: 'var(--accent-primary)' }} />, title: 'Abonelik Çürümesi → Stabilize', before: 'Login Oranı Düşük (%40 Churn Riski)', after: 'Temas Kuruldu & İlişki Tazelendi', count: records.filter(r => r.category === 'SUBSCRIPTION_DECAY' && r.status === 'CLOSED' && (r.outcome === 'replied' || r.outcome === 'reopened')).length },
                  { icon: <Users size={18} style={{ color: 'var(--accent-primary)' }} />, title: 'Soğuk İlişki → Yeniden Aktif', before: '6+ Aydır Sıfır Temas & Unutulmuş', after: 'Kahve Sohbeti & Yeni Proje Fırsatı', count: records.filter(r => r.category === 'COLD_RELATIONSHIP' && r.status === 'CLOSED' && r.outcome !== 'churned').length },
                ].map((panel, i) => (
                  <div key={i} className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
                      {panel.icon}
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>{panel.title}</h4>
                    </div>
                    <div className="stack-sm">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.35)', padding: '0.625rem 0.875rem', borderRadius: 'var(--r-xs)', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Öncesi:</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--status-danger)' }}>{panel.before}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.35)', padding: '0.625rem 0.875rem', borderRadius: 'var(--r-xs)', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sonrası:</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--status-success)' }}>{panel.after}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.625rem', borderTop: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-faint)' }}>Sonuçlanan:</span>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{panel.count} Firma</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Closed loop records table */}
            <div>
              <div className="section-title-row">
                <span className="section-title-text"><CheckCircle size={18} style={{ color: 'var(--status-success)' }} /> Kapatılmış Kurtarma Döngüleri</span>
              </div>
              <div className="glass-panel">
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Müşteri / Proje</th>
                        <th>Kategori</th>
                        <th>İyileşen Gelir</th>
                        <th style={{ textAlign: 'right' }}>Kapatılma Durumu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.filter(r => r.status === 'CLOSED').length === 0 ? (
                        <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>Henüz hiçbir kurtarma döngüsü sonuçlandırılmadı.</td></tr>
                      ) : records.filter(r => r.status === 'CLOSED').map(r => (
                        <tr key={r.id}>
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.15rem' }}>{r.clientName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.context}</div>
                          </td>
                          <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                            {r.category === 'ABANDONED_OPPORTUNITY' ? 'Terk Edilmiş Fırsat' : r.category === 'SUBSCRIPTION_DECAY' ? 'Abonelik Çürümesi' : 'Soğuk İlişki'}
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>${r.revenueImpact.toLocaleString()}</td>
                          <td style={{ textAlign: 'right' }}>
                            <span className={`badge ${getOutcomeBadgeClass(r.outcome)}`}>{getOutcomeIcon(r.outcome)} {getOutcomeLabel(r.outcome)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lead Capture Database */}
        <div style={{ marginTop: '3rem' }}>
          <div className="section-title-row">
            <span className="section-title-text">
              <Users size={18} style={{ color: 'var(--neon-orange)' }} />
              Lead Kayıt Havuzu
            </span>
            {leadCaptures.length > 0 && (
              <Button variant="outline" onClick={handleExportLeads}
                style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', minHeight: '38px' }}>
                <Download size={14} /> CSV Dışa Aktar
              </Button>
            )}
          </div>
          <div className="glass-panel">
            {leadCaptures.length === 0 ? (
              <div className="empty-state" style={{ padding: '2.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Henüz toplanmış lead kaydı bulunmamaktadır.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>E-Posta Adresi</th>
                      <th>Teşhis Tarihi</th>
                      <th>Firma Sayısı</th>
                      <th style={{ textAlign: 'right' }}>Kurtarılabilir Kayıp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadCaptures.map((lc) => (
                      <tr key={lc.id}>
                        <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{lc.email}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lc.capturedAt}</td>
                        <td style={{ color: 'var(--text-main)' }}>{lc.companyCount} Firma</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--status-success)' }}>
                          ${lc.estimatedLoss.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  </>
);
}
