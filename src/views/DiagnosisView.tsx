import { useState, useEffect } from 'react';
import { 
  DollarSign, Download, Clock, Target, Users, Zap, CheckCircle, 
  Activity, MessageSquare, AlertCircle, Award, XCircle, Check, 
  Settings, Cpu, Mail, ShieldAlert, LogOut, ArrowRight
} from 'lucide-react';
import { Button } from '../components/Button';
import { SettingsModal } from '../components/SettingsModal';
import { getRecords, updateRecord, saveLeadCapture, getLeadCaptures } from '../lib/db';
import type { IntelligenceRecord, Category, ActionType, OutcomeType, LeadCaptureRecord } from '../lib/db';

interface DiagnosisViewProps {
  onReset: () => void;
  userEmail: string;
  onLogout: () => void;
}

export function DiagnosisView({ onReset, userEmail, onLogout }: DiagnosisViewProps) {
  const [activeView, setActiveView] = useState<'diagnose' | 'outcomes'>('diagnose');
  const [activeTab, setActiveTab] = useState<Category>('ABANDONED_OPPORTUNITY');
  const [records, setRecords] = useState<IntelligenceRecord[]>([]);
  const [leadCaptures, setLeadCaptures] = useState<LeadCaptureRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  // Hybrid Automation Toggle
  const [isAutomationActive, setIsAutomationActive] = useState(false);

  // Lead capture flows
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadEmail, setLeadEmail] = useState('');
  const [isLeadCaptured, setIsLeadCaptured] = useState(false);

  // Sorting & Filtering States
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'ACTION_TAKEN' | 'CLOSED'>('ALL');
  const [sortBy, setSortBy] = useState<'PRIORITY_DESC' | 'REVENUE_DESC' | 'DATE_DESC'>('PRIORITY_DESC');

  // Action Panel States
  const [activeAction, setActiveAction] = useState<{ id: string; type: 'email' | 'whatsapp' } | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');

  // Local state for dropdowns per record ID
  const [selectedOutcome, setSelectedOutcome] = useState<Record<string, OutcomeType>>({});
  const [draftTones, setDraftTones] = useState<Record<string, 'formal' | 'friendly'>>({});

  useEffect(() => {
    loadData();
    // Load automation setting from local storage if set
    const savedAuto = localStorage.getItem('rrs_automation_active');
    if (savedAuto === 'true') {
      setIsAutomationActive(true);
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getRecords();
    setRecords(data);
    const leads = await getLeadCaptures();
    setLeadCaptures(leads);
    setLoading(false);
  };

  const handleAutomationToggle = (value: boolean) => {
    setIsAutomationActive(value);
    localStorage.setItem('rrs_automation_active', String(value));
  };

  const startAction = (record: IntelligenceRecord, type: 'email' | 'whatsapp') => {
    setActiveAction({ id: record.id, type });
    setRecipientEmail(record.clientEmail || '');
    setRecipientPhone(record.clientPhone || '');
    setEditedSubject(`${record.clientName} - ${record.context} Takip ve Detaylar`);
    
    const tone = draftTones[record.id] || 'formal';
    const bodyText = tone === 'friendly' ? 
      record.draftMessage.replace('Ahmet Bey merhaba', 'Ahmet Bey selamlar').replace('Selin Hanım', 'Selin selam').replace('Caner Bey merhaba', 'Caner Bey selamlar').replace('kontrol etmek istedim', 'bir yazayım istedim').replace('bekleriz', 'bekliyorum, sevgiler') 
      : record.draftMessage;
      
    setEditedBody(bodyText);
  };

  const handleToneChange = (recordId: string, tone: 'formal' | 'friendly') => {
    setDraftTones(prev => ({ ...prev, [recordId]: tone }));
    
    if (activeAction && activeAction.id === recordId) {
      const record = records.find(r => r.id === recordId);
      if (record) {
        const bodyText = tone === 'friendly' ? 
          record.draftMessage.replace('Ahmet Bey merhaba', 'Ahmet Bey selamlar').replace('Selin Hanım', 'Selin selam').replace('Caner Bey merhaba', 'Caner Bey selamlar').replace('kontrol etmek istedim', 'bir yazayım istedim').replace('bekleriz', 'bekliyorum, sevgiler') 
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
      clientPhone: phoneToSave
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

    await updateRecord(id, { status: 'CLOSED', outcome: outcome });
    await loadData();
  };

  // Metric calculations
  const totalLeakage = records.reduce((sum, r) => sum + r.revenueImpact, 0);
  const recoverablePotential = Math.round(totalLeakage * 0.45);
  
  // RRS Outcomes statistics
  const recoveredRevenue = records
    .filter(r => r.status === 'CLOSED' && r.outcome === 'recovered')
    .reduce((sum, r) => sum + r.revenueImpact, 0);

  const preservedRevenue = records
    .filter(r => r.status === 'CLOSED' && (r.outcome === 'replied' || r.outcome === 'reopened'))
    .reduce((sum, r) => sum + r.revenueImpact, 0);

  const churnedRevenue = records
    .filter(r => r.status === 'CLOSED' && r.outcome === 'churned')
    .reduce((sum, r) => sum + r.revenueImpact, 0);

  const totalClosed = records.filter(r => r.status === 'CLOSED').length;
  const successCount = records.filter(r => r.status === 'CLOSED' && r.outcome !== 'churned' && r.outcome !== 'no_response').length;
  const successRate = totalClosed > 0 ? Math.round((successCount / totalClosed) * 100) : 0;

  // Dynamic sorting and filtering
  const filteredRecords = records
    .filter(r => r.category === activeTab)
    .filter(r => filterStatus === 'ALL' || r.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'PRIORITY_DESC') {
        return (b.priorityScore || 0) - (a.priorityScore || 0);
      }
      if (sortBy === 'REVENUE_DESC') {
        return b.revenueImpact - a.revenueImpact;
      }
      if (sortBy === 'DATE_DESC') {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
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
    if (!outcome) return <AlertCircle size={14} />;
    if (outcome === 'recovered') return <Award size={14} />;
    if (outcome === 'replied') return <MessageSquare size={14} />;
    if (outcome === 'reopened') return <Activity size={14} />;
    if (outcome === 'no_response') return <Clock size={14} />;
    if (outcome === 'churned') return <XCircle size={14} />;
    return <AlertCircle size={14} />;
  };

  const getOutcomeLabel = (outcome?: OutcomeType) => {
    if (!outcome) return '';
    if (outcome === 'recovered') return 'Kurtarıldı';
    if (outcome === 'replied') return 'Yanıt Alındı';
    if (outcome === 'reopened') return 'Yeniden Açıldı';
    if (outcome === 'no_response') return 'Cevap Yok';
    if (outcome === 'churned') return 'Kayıp / Churn';
    return outcome;
  };

  // Zero-Cost CSV Exporter for Leads
  const handleExportLeads = () => {
    let csvContent = "data:text/csv;charset=utf-8,E-Posta,Tarih,Firma Sayisi,Hesaplanan Kacak Tutari\n";
    leadCaptures.forEach(lc => {
      csvContent += `"${lc.email}","${lc.capturedAt}","${lc.companyCount}","${lc.estimatedLoss}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `creaizen_captured_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Executive Report Printing (Zero-Cost, Print-Optimized Layout)
  const handleExportPDF = () => {
    if (!isLeadCaptured && leadCaptures.length === 0) {
      setShowLeadCapture(true);
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const totalLeakageFormatted = totalLeakage.toLocaleString();
    const recoverablePotentialFormatted = recoverablePotential.toLocaleString();
    const recoveredRevenueFormatted = recoveredRevenue.toLocaleString();

    const tableRows = records.map(r => `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">
          <strong>${r.clientName}</strong><br/>
          <small style="color: #64748b;">Yetkili: ${r.contactPerson} | Kapsam: ${r.context}</small>
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px;">
          ${r.category === 'ABANDONED_OPPORTUNITY' ? 'Terk Edilmiş Fırsat' : r.category === 'SUBSCRIPTION_DECAY' ? 'Abonelik Çürümesi' : 'Soğuk İlişki'}
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: bold; color: ${r.urgency === 'CRITICAL' ? '#ef4444' : r.urgency === 'MEDIUM' ? '#f97316' : '#64748b'};">
          ${r.urgency === 'CRITICAL' ? 'Kritik' : r.urgency === 'MEDIUM' ? 'Orta' : 'Düşük'}
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: bold; text-align: right;">
          $${r.revenueImpact.toLocaleString()}
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: right;">
          ${r.status === 'PENDING' ? 'Bekliyor' : r.status === 'ACTION_TAKEN' ? 'İletişimde' : `Sonuçlandı (${getOutcomeLabel(r.outcome)})`}
        </td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>RRS Executive Revenue Recovery Report</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; padding: 40px; background: #fff; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
            .header p { margin: 5px 0 0 0; color: #64748b; font-size: 12px; font-weight: 500; }
            .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
            .stat-card { border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; background: #f8fafc; }
            .stat-card span { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 5px; letter-spacing: 0.5px; }
            .stat-card strong { font-size: 24px; color: #0f172a; font-weight: 800; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { padding: 12px 8px; text-align: left; background: #f1f5f9; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #475569; border-bottom: 2px solid #cbd5e1; }
            .section-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 10px; }
            .recommendations { background: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 8px; margin-top: 30px; page-break-inside: avoid; }
            .recommendations h3 { margin-top: 0; font-size: 14px; color: #0369a1; font-weight: 700; }
            .recommendations ul { margin: 0; padding-left: 20px; font-size: 13px; color: #0369a1; }
            .recommendations li { margin-bottom: 8px; }
            .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            @media print {
              body { padding: 0; }
              .stat-card { background: #f8fafc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .recommendations { background: #f0f9ff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>REVENUE RECOVERY SYSTEM (RRS)</h1>
            <p>Yönetici Gelir İyileştirme Raporu | Tarih: ${new Date().toLocaleDateString('tr-TR')} | Yetkili: ${userEmail}</p>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card" style="border-left: 4px solid #ef4444;">
              <span>Toplam Sızıntı Tutarı</span>
              <strong>$${totalLeakageFormatted}</strong>
            </div>
            <div class="stat-card" style="border-left: 4px solid #10b981;">
              <span>Kurtarılabilir Gelir Potansiyeli (%45)</span>
              <strong>$${recoverablePotentialFormatted}</strong>
            </div>
            <div class="stat-card" style="border-left: 4px solid #3b82f6;">
              <span>Döngüsü Kurtarılan Ciro</span>
              <strong>$${recoveredRevenueFormatted}</strong>
            </div>
          </div>

          <div class="section-title">Tespit Edilen Riskler ve Sızıntılar</div>
          <table>
            <thead>
              <tr>
                <th>Müşteri / Proje Yetkilisi</th>
                <th>Kategori</th>
                <th>Aciliyet</th>
                <th style="text-align: right;">Risk Tutarı</th>
                <th style="text-align: right;">Durum</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div class="recommendations">
            <h3>DespSeek Recovery Intelligence Stratejik Yol Haritası</h3>
            <ul>
              <li><strong>Terk Edilmiş Fırsatlar (Kritik):</strong> Teklif iletildikten sonra 14 gün boyunca aranmayan fırsatlara Kurtarma İletişim Şablonu kullanılarak pürüz giderici mesajlar acilen iletilmelidir.</li>
              <li><strong>Üyelik Çürümesi (Orta):</strong> Platform login oranlarında %40+ düşüş saptanan Lumina Mimarlık gibi hesaplara ücretsiz durum değerlendirme randevusu tanımlanmalıdır.</li>
              <li><strong>Soğuyan İlişkiler (Düşük):</strong> Son 6 aydır temassız kalan Nexus Lojistik benzeri geçmiş müşterilere satış kokmayan, "ilişki tazeleyici" bir kahve daveti yapılmalıdır.</li>
            </ul>
          </div>

          <div class="footer">
            <p>Bu rapor, RRS Zeka Teşhis Motoru tarafından otomatik üretilmiştir. Tüm Hakları Saklıdır © ${new Date().getFullYear()}</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Lead Submission
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail || !leadEmail.includes('@')) {
      alert('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    await saveLeadCapture(leadEmail, recoverablePotential, records.length);
    setIsLeadCaptured(true);
    setShowLeadCapture(false);
    
    const leads = await getLeadCaptures();
    setLeadCaptures(leads);

    setTimeout(handleExportPDF, 500);
  };

  // Generate Behavioral Reminders based on pending records
  const getBehavioralReminders = () => {
    const pending = records.filter(r => r.status === 'PENDING');
    const alerts = [];
    
    const decayAlert = pending.find(r => r.category === 'SUBSCRIPTION_DECAY');
    if (decayAlert) {
      alerts.push({
        id: decayAlert.id,
        title: `Abonelik Çürüme Riski: ${decayAlert.clientName}`,
        description: `Sisteme giriş sıklığında son dönem düşüşü saptandı. Değer hatırlatıcı temas yapılması öneriliyor.`,
        actionText: 'Samimi Hatırlatıcı Gönder',
        record: decayAlert
      });
    }

    const opportunityAlert = pending.find(r => r.category === 'ABANDONED_OPPORTUNITY');
    if (opportunityAlert) {
      alerts.push({
        id: opportunityAlert.id,
        title: `Kaçırılan Teklif Takibi: ${opportunityAlert.clientName}`,
        description: `Müşteri teklifi açtı ancak 14 gündür takip aranması yapılmadı. Hızlı aksiyon öneriliyor.`,
        actionText: 'Takip Araması Hazırla',
        record: opportunityAlert
      });
    }

    return alerts;
  };

  if (loading) {
    return (
      <div className="container py-24 flex justify-center items-center bg-[#050814]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-zinc-900 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="text-muted text-sm font-medium animate-pulse">Teşhis verileri analiz ediliyor...</div>
        </div>
      </div>
    );
  }

  const reminders = getBehavioralReminders();

  return (
    <div className="container py-12 md:py-16 animate-in">
      
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* --- LEAD CAPTURE BARRIER MODAL --- */}
      {showLeadCapture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-8 relative border-[rgba(249,115,22,0.25)]">
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <Mail className="text-orange" size={24} /> Raporunuzu İndirin
            </h3>
            <p className="text-sm text-muted mb-6 leading-relaxed">
              Zeka Teşhis Motoru taramasını tamamladı. Toplam **{records.length} kritik sızıntı** ve **${recoverablePotential.toLocaleString()}** geri kazanılabilir ciro tespit edildi. Analiz raporunu PDF olarak indirmek için e-posta adresinizi girin.
            </p>

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-faint uppercase tracking-widest block mb-2">E-Posta Adresiniz</label>
                <input 
                  type="email" 
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="form-input bg-black/50 border border-zinc-800 rounded focus:border-orange-500 w-full pl-3 text-sm py-2"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowLeadCapture(false)}>İptal</Button>
                <Button type="submit" variant="glow-orange" className="flex-1 gap-2">
                  Raporu İndir <Download size={14} />
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 relative z-10">
        <div>
          <span className="badge badge-gray mb-3 text-[10px] tracking-widest text-faint border-zinc-800">GELİR REHABİLİTASYON OPERASYONU</span>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight text-white">
            DespSeek <span className="text-primary font-bold">Recovery Intelligence Operations</span>
          </h1>
          <p className="text-muted text-sm leading-relaxed">Müşteri veritabanınız ve iletişim loglarınız üzerinden tespit edilen sessiz gelir kayıpları ve kurtarma radarı.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="p-2" onClick={() => setShowSettings(true)} title="Plan ve Ayarlar">
            <Settings size={18} />
          </Button>
          <Button variant="outline" className="flex-1 md:flex-none" onClick={onReset}>Yeniden Tara</Button>
          <Button variant="glow-blue" className="flex items-center justify-center gap-2 flex-1 md:flex-none" onClick={handleExportPDF}>
            <Download size={16} /> Raporu PDF İndir
          </Button>
          <Button variant="outline" className="p-2 text-rose-450 border-rose-900/30 hover:bg-rose-950/20" onClick={onLogout} title="Oturumu Kapat">
            <LogOut size={18} />
          </Button>
        </div>
      </div>

      {/* --- DASHBOARD SUB-NAVIGATION TABS --- */}
      <div className="flex border-b border-zinc-800/80 mb-6 relative z-10">
        <button
          onClick={() => setActiveView('diagnose')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all ${activeView === 'diagnose' ? 'border-primary text-white' : 'border-transparent text-muted hover:text-white'}`}
        >
          🔍 Zeka Teşhis Raporu
        </button>
        <button
          onClick={() => setActiveView('outcomes')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all ${activeView === 'outcomes' ? 'border-primary text-white' : 'border-transparent text-muted hover:text-white'}`}
        >
          📈 Geri Kazanım Analiz & Sonuç Merkezi
        </button>
      </div>

      {/* --- 7-STEP RECOVERY INTELLIGENCE LIFECYCLE STEPPER --- */}
      <div className="relative z-10 mb-8 glass-panel p-5 bg-zinc-950/20 border-zinc-900 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <span className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Cpu size={12} className="animate-pulse" /> RRS Operational Lifecycle / Kurtarma İstihbarat Döngüsü
          </span>
          <span className="text-[9px] text-muted font-medium">Gelir Sızıntılarının Kurtarılmasındaki Uçtan Uca Operasyonel Süreç Akışı</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { step: '1', name: 'DETECT', desc: 'Sızıntıyı Yakala', color: 'border-blue-500/20 text-blue-400 bg-blue-950/5' },
            { step: '2', name: 'CLASSIFY', desc: 'Kategori Sınıfla', color: 'border-indigo-500/20 text-indigo-400 bg-indigo-950/5' },
            { step: '3', name: 'EXPLAIN', desc: 'Nedeni Analiz Et', color: 'border-purple-500/20 text-purple-400 bg-purple-950/5' },
            { step: '4', name: 'RECOMMEND', desc: 'Strateji Belirle', color: 'border-pink-500/20 text-pink-400 bg-pink-950/5' },
            { step: '5', name: 'ACTION TAKEN', desc: 'Teması Başlat', color: 'border-orange-500/20 text-orange-400 bg-orange-950/5' },
            { step: '6', name: 'OUTCOME TRACK', desc: 'Süreci İzle', color: 'border-amber-500/20 text-amber-400 bg-amber-950/5' },
            { step: '7', name: 'RECOVERY', desc: 'Geliri Kurtar', color: 'border-emerald-500/20 text-emerald-400 bg-emerald-950/5' },
          ].map((s, idx) => (
            <div key={idx} className={`p-2.5 rounded border text-center transition-all duration-300 ${s.color}`}>
              <div className="text-[9px] font-bold tracking-widest font-mono opacity-80 mb-1">{s.step}. {s.name}</div>
              <div className="text-xs text-white font-bold whitespace-nowrap">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {activeView === 'diagnose' ? (
        <>
          {/* --- BEHAVIORAL REMINDER INTELLIGENCE ALERTS --- */}
          {reminders.length > 0 && (
            <div className="mb-8 relative z-10 animate-in">
              <div className="glass-panel border-l-4 border-l-orange-500 bg-orange-950/5 p-5">
                <h4 className="text-xs font-bold text-orange uppercase tracking-wider flex items-center gap-2 mb-3">
                  <ShieldAlert size={16} /> Davranışsal Hatırlatıcı İstihbaratı
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reminders.map((alert, i) => (
                    <div key={i} className="bg-black/40 border border-zinc-850 p-4 rounded-lg flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-white mb-1">{alert.title}</div>
                        <div className="text-[11px] text-muted leading-relaxed mb-4">{alert.description}</div>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveTab(alert.record.category);
                          setTimeout(() => {
                            const el = document.getElementById(`record-${alert.record.id}`);
                            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }, 100);
                        }}
                        className="text-[10px] font-bold text-orange hover:text-orange-400 text-left flex items-center gap-1 mt-auto"
                      >
                        Kartı Göster ve Aksiyon Al <ArrowRight size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ROI Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
            <div className="glass-panel p-6 border-l-4 border-l-rose-500 bg-zinc-950/30">
              <span className="text-[10px] text-faint font-bold uppercase tracking-widest block mb-1">Toplam Sızıntı Tutarı</span>
              <span className="text-3xl font-extrabold text-danger flex items-center gap-0.5">
                <DollarSign size={24} /> {totalLeakage.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted block mt-1">Unutulmuş ve askıya alınmış fırsatların toplamı.</span>
            </div>

            <div className="glass-panel p-6 border-l-4 border-l-emerald-500 bg-zinc-950/30">
              <span className="text-[10px] text-faint font-bold uppercase tracking-widest block mb-1">Kurtarılabilir Gelir Potansiyeli</span>
              <span className="text-3xl font-extrabold text-success flex items-center gap-0.5">
                <DollarSign size={24} /> {recoverablePotential.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted block mt-1">AI Geri Kazanım Kural Motoru başarı tahmini (%45).</span>
            </div>

            <div className="glass-panel p-6 border-l-4 border-l-blue-500 bg-zinc-950/30">
              <span className="text-[10px] text-faint font-bold uppercase tracking-widest block mb-1">Döngüsü Kurtarılan Ciro</span>
              <span className="text-3xl font-extrabold text-primary flex items-center gap-0.5">
                <DollarSign size={24} /> {recoveredRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted block mt-1">Geri kazanılmış ve loop döngüsü kapatılmış ciro tutarı.</span>
            </div>
          </div>

          {/* Tabs - Strict 3 Columns */}
          <div className="grid grid-cols-3 gap-2 mb-8 glass-panel p-1.5 relative z-10">
            <button 
              onClick={() => setActiveTab('ABANDONED_OPPORTUNITY')}
              className={`tab-btn ${activeTab === 'ABANDONED_OPPORTUNITY' ? 'active' : ''}`}
            >
              <Zap size={16} className={activeTab === 'ABANDONED_OPPORTUNITY' ? 'text-primary' : ''} />
              Terk Edilmiş Fırsatlar
              <span className="ml-2 text-xs opacity-50">({records.filter(r => r.category === 'ABANDONED_OPPORTUNITY').length})</span>
            </button>
            <button 
              onClick={() => setActiveTab('SUBSCRIPTION_DECAY')}
              className={`tab-btn ${activeTab === 'SUBSCRIPTION_DECAY' ? 'active' : ''}`}
            >
              <Activity size={16} className={activeTab === 'SUBSCRIPTION_DECAY' ? 'text-primary' : ''} />
              Abonelik Çürümesi
              <span className="ml-2 text-xs opacity-50">({records.filter(r => r.category === 'SUBSCRIPTION_DECAY').length})</span>
            </button>
            <button 
              onClick={() => setActiveTab('COLD_RELATIONSHIP')}
              className={`tab-btn ${activeTab === 'COLD_RELATIONSHIP' ? 'active' : ''}`}
            >
              <Users size={16} className={activeTab === 'COLD_RELATIONSHIP' ? 'text-primary' : ''} />
              Soğuyan İlişkiler
              <span className="ml-2 text-xs opacity-50">({records.filter(r => r.category === 'COLD_RELATIONSHIP').length})</span>
            </button>
          </div>

          {/* --- HYBRID AUTOMATION MODULE TOGGLE --- */}
          <div className="flex justify-between items-center gap-4 mb-6 relative z-10 bg-zinc-950/20 border border-zinc-900 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Zap className={isAutomationActive ? "text-orange-400 animate-pulse" : "text-muted"} size={18} />
              <div>
                <div className="text-xs font-bold text-white">Döngü Otomasyon Modu (Manuel-First Hybrid)</div>
                <div className="text-[10px] text-muted mt-0.5">Önerilen aksiyon mesajlarının arka planda otomatik zamanlanmasını simüle edin.</div>
              </div>
            </div>
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isAutomationActive}
                  onChange={(e) => handleAutomationToggle(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500 peer-checked:after:bg-white peer-checked:after:border-transparent"></div>
              </label>
            </div>
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 relative z-10 bg-zinc-950/20 border border-[var(--border)] rounded-[var(--radius-lg)] p-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs text-muted font-bold uppercase tracking-wider">Durum Filtresi:</span>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="form-select bg-black/60 py-1.5 px-3 max-w-[200px] text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--border)] focus:border-primary"
              >
                <option value="ALL">Tüm Fırsatlar</option>
                <option value="PENDING">Bekleyenler (Aksiyon Gerekli)</option>
                <option value="ACTION_TAKEN">Takip Başlatılanlar (İletişimde)</option>
                <option value="CLOSED">Döngüsü Kapatılanlar</option>
              </select>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span className="text-xs text-muted font-bold uppercase tracking-wider">Sıralama:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="form-select bg-black/60 py-1.5 px-3 max-w-[200px] text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--border)] focus:border-primary"
              >
                <option value="PRIORITY_DESC">Öncelik Puanı (% - Yüksek)</option>
                <option value="REVENUE_DESC">Riskteki Ciro ($ - Yüksek)</option>
                <option value="DATE_DESC">Son İşlem Tarihi</option>
              </select>
            </div>
          </div>

          {/* Cards Area */}
          <div className="flex flex-col gap-6 mb-16 relative z-10">
            {filteredRecords.length === 0 && (
              <div className="glass-panel text-center py-16 text-muted border-dashed">
                <CheckCircle size={32} className="mx-auto mb-3 text-[var(--border-hover)]" />
                <p className="text-lg font-semibold text-main tracking-tight">Tebrikler!</p>
                <p className="text-sm">Bu kategoride acil risk tespiti bulunamadı.</p>
              </div>
            )}
            
            {filteredRecords.map(record => (
              <div key={record.id} id={`record-${record.id}`} className="glass-panel group scroll-mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
                  
                  {/* Left Column: Context & Timeline */}
                  <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-[var(--border)] transition-colors duration-500 group-hover:border-[var(--border-hover)]">
                    <div className="flex justify-between items-center mb-6">
                      <span className={`badge ${record.urgency === 'CRITICAL' ? 'badge-danger' : record.urgency === 'MEDIUM' ? 'badge-warning' : 'badge-info'}`}>
                        {record.urgency === 'CRITICAL' ? 'Kritik Aciliyet' : record.urgency === 'MEDIUM' ? 'Orta Aciliyet' : 'Düşük Aciliyet'}
                      </span>
                      <span className="badge badge-gray text-orange border-orange/20 text-[10px]">
                        ÖNCELİK PUANI: {record.priorityScore || 50}/100
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-1 tracking-tight text-main">{record.clientName}</h3>
                    <p className="text-muted text-sm mb-6 flex items-center gap-2">
                      <Users size={14} className="text-faint"/> Yetkili: <span className="text-main font-medium">{record.contactPerson}</span>
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="premium-panel bg-[var(--surface)]">
                        <span className="text-[10px] text-faint font-semibold uppercase tracking-widest block mb-1">Proje / Kapsam</span>
                        <span className="text-sm font-semibold text-main">{record.context}</span>
                      </div>
                      <div className="premium-panel bg-[var(--surface)]">
                        <span className="text-[10px] text-faint font-semibold uppercase tracking-widest block mb-1">Riskteki Gelir</span>
                        <span className="text-lg font-bold text-danger flex items-center gap-1">
                          <DollarSign size={16}/> {record.revenueImpact.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Event History Timeline */}
                    <div className="mt-8 border-t border-[var(--border)] pt-6">
                      <h4 className="text-[10px] text-faint font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                        <Activity size={14} className="text-primary animate-pulse-slow" /> Olay Güdümlü Geçmiş Zaman Tüneli
                      </h4>
                      <div className="relative pl-6 border-l border-[var(--border)] space-y-5 ml-2.5">
                        {record.eventHistory && record.eventHistory.map((ev, i) => {
                          let nodeColor = 'bg-zinc-700 border-zinc-600';
                          if (ev.type.includes('triggered')) nodeColor = 'bg-orange-500 border-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.4)]';
                          else if (ev.type.includes('missed') || ev.type.includes('inactive') || ev.type.includes('risk') || ev.type === 'customer_churned') nodeColor = 'bg-rose-500 border-rose-400 shadow-[0_0_8px_rgba(225,29,72,0.4)]';
                          else if (ev.type.includes('sent') || ev.type.includes('viewed') || ev.type.includes('contacted') || ev.type === 'customer_replied' || ev.type === 'recovery_action_taken') nodeColor = 'bg-blue-500 border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.3)]';
                          else if (ev.type.includes('completed') || ev.type.includes('won') || ev.type.includes('recovered') || ev.type === 'recovery_completed') nodeColor = 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
                          
                          return (
                            <div key={i} className="relative text-xs">
                              <div className={`absolute -left-[31px] top-0.5 w-2.5 h-2.5 rounded-full border-2 ${nodeColor}`}></div>
                              <div className="flex flex-col">
                                <span className="font-bold text-main flex items-center gap-2">
                                  {ev.title}
                                  <span className="text-[9px] text-faint font-medium font-mono">({ev.date})</span>
                                </span>
                                <span className="text-muted mt-1 leading-relaxed text-[11px]">{ev.description}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Intelligence & Action Tracking */}
                  <div className="p-6 md:p-8 flex flex-col justify-between bg-black/40">
                    <div className="mb-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                        <h4 className="text-[10px] text-faint font-semibold uppercase tracking-widest flex items-center gap-2">
                          <ShieldAlert size={14} className="text-primary" /> İstihbarat Teşhisi
                        </h4>
                        <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded border ${
                          (record.confidenceScore || 90) >= 90
                            ? 'text-emerald-400 bg-emerald-950/40 border-emerald-900/40'
                            : (record.confidenceScore || 90) >= 75
                            ? 'text-amber-400 bg-amber-950/40 border-amber-900/40'
                            : 'text-rose-400 bg-rose-950/40 border-rose-900/40'
                        }`}>
                          {(record.confidenceScore || 90) >= 90 ? 'Yüksek Güvenilirlik (High Confidence)' : 
                           (record.confidenceScore || 90) >= 75 ? 'Orta Güvenilirlik (Medium Confidence)' : 
                           'Düşük Güvenilirlik (Low Confidence)'}
                        </span>
                      </div>
                      <p className="text-sm text-main mb-6 leading-relaxed opacity-90">{record.subCause}</p>
 
                      <h4 className="text-[10px] text-faint font-semibold uppercase tracking-widest flex items-center gap-2 mb-2">
                        <Target size={14} className="text-primary" /> Önerilen Strateji & İletişim
                      </h4>
                      <p className="text-sm text-main mb-6 leading-relaxed opacity-90">{record.strategy}</p>
 
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[10px] text-faint font-semibold uppercase tracking-widest flex items-center gap-2">
                          <MessageSquare size={14} className="text-primary" /> Kurtarma İletişim Şablonu
                        </h4>
                        <div className="flex bg-black/40 rounded-full p-0.5 border border-[var(--border)]">
                          <button 
                            disabled={isAutomationActive}
                            onClick={() => handleToneChange(record.id, 'formal')}
                            className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-all ${isAutomationActive ? 'opacity-40 cursor-not-allowed' : ''} ${(!draftTones[record.id] || draftTones[record.id] === 'formal') ? 'bg-primary text-white' : 'text-muted hover:text-white'}`}
                          >
                            Kurumsal
                          </button>
                          <button 
                            disabled={isAutomationActive}
                            onClick={() => handleToneChange(record.id, 'friendly')}
                            className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-all ${isAutomationActive ? 'opacity-40 cursor-not-allowed' : ''} ${(draftTones[record.id] === 'friendly') ? 'bg-primary text-white' : 'text-muted hover:text-white'}`}
                          >
                            Samimi
                          </button>
                        </div>
                      </div>
                      
                      <div className="premium-panel bg-[var(--surface)] border-l-2 border-l-[var(--accent-primary)] border-y-0 border-r-0 rounded-l-none text-sm italic text-muted leading-relaxed relative group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="badge badge-gray text-[8px] flex items-center gap-1"><Cpu size={10}/> Kurtarma İstihbaratı</span>
                        </div>
                        "{draftTones[record.id] === 'friendly' ? 
                            record.draftMessage.replace('Ahmet Bey merhaba', 'Ahmet Bey selamlar').replace('Selin Hanım', 'Selin selam').replace('Caner Bey merhaba', 'Caner Bey selamlar').replace('kontrol etmek istedim', 'bir yazayım istedim').replace('bekleriz', 'bekliyorum, sevgiler') 
                            : record.draftMessage}"
                      </div>
                    </div>

                    {/* Action Tracking UI */}
                    <div className="mt-auto border-t border-[var(--border)] pt-6">
                      
                      {record.status === 'PENDING' && (
                        <>
                          {isAutomationActive ? (
                            <div className="bg-orange-950/20 border border-orange-900/30 p-4 rounded-lg flex items-center gap-3">
                              <Zap className="text-orange-400 animate-pulse" size={18} />
                              <div>
                                <span className="text-[10px] font-bold text-orange uppercase tracking-wider block">Otomatik Kurtarma Sırasında</span>
                                <span className="text-[11px] text-muted block mt-0.5">Sistem bu kart için 2 saat içinde otomatik şablonu tetikleyecektir.</span>
                              </div>
                            </div>
                          ) : activeAction?.id !== record.id ? (
                            <div className="space-y-4">
                              <label className="text-[10px] font-bold text-faint uppercase tracking-widest block">Kurtarma Aksiyonu Seçin (Manuel Kontrol):</label>
                              <div className="grid grid-cols-2 gap-3">
                                <Button 
                                  variant="glow-blue" 
                                  className="py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 w-full"
                                  onClick={() => startAction(record, 'email')}
                                >
                                  <Mail size={14} /> E-Posta Hazırla
                                </Button>
                                <Button 
                                  variant="glow-orange" 
                                  className="py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 w-full"
                                  onClick={() => startAction(record, 'whatsapp')}
                                >
                                  <MessageSquare size={14} /> WhatsApp Hazırla
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4 bg-zinc-950/80 p-4 rounded-lg border border-[rgba(59,130,246,0.3)] shadow-[0_0_15px_rgba(59,130,246,0.1)] animate-in">
                              <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
                                <span className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center gap-1">
                                  {activeAction.type === 'email' ? <Mail size={12} className="text-blue-400" /> : <MessageSquare size={12} className="text-orange-400" />}
                                  {activeAction.type === 'email' ? 'E-POSTA ASİSTANI' : 'WHATSAPP ASİSTANI'}
                                </span>
                                <button 
                                  onClick={() => setActiveAction(null)}
                                  className="text-xs text-muted hover:text-white font-bold"
                                >
                                  İptal
                                </button>
                              </div>

                              {activeAction.type === 'email' ? (
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-[9px] font-bold text-faint uppercase tracking-widest block mb-1">Alıcı E-Posta</label>
                                    <input 
                                      type="email"
                                      value={recipientEmail}
                                      onChange={(e) => setRecipientEmail(e.target.value)}
                                      placeholder="ornek@sirket.com"
                                      className="form-input bg-black/60 py-1.5 px-3 text-xs w-full border border-[var(--border)] focus:border-primary text-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-bold text-faint uppercase tracking-widest block mb-1">E-Posta Konusu</label>
                                    <input 
                                      type="text"
                                      value={editedSubject}
                                      onChange={(e) => setEditedSubject(e.target.value)}
                                      className="form-input bg-black/60 py-1.5 px-3 text-xs w-full border border-[var(--border)] focus:border-primary text-white"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <label className="text-[9px] font-bold text-faint uppercase tracking-widest block mb-1">WhatsApp Numarası</label>
                                  <input 
                                    type="text"
                                    value={recipientPhone}
                                    onChange={(e) => setRecipientPhone(e.target.value)}
                                    placeholder="+905551234567"
                                    className="form-input bg-black/60 py-1.5 px-3 text-xs w-full border border-[var(--border)] focus:border-primary text-white"
                                  />
                                </div>
                              )}

                              <div>
                                <label className="text-[9px] font-bold text-faint uppercase tracking-widest block mb-1">Mesaj Taslağını Düzenle</label>
                                <textarea 
                                  value={editedBody}
                                  onChange={(e) => setEditedBody(e.target.value)}
                                  rows={5}
                                  className="form-input bg-black/60 py-2 px-3 text-xs w-full font-mono leading-relaxed resize-none border border-[var(--border)] focus:border-primary text-white"
                                />
                              </div>

                              <Button 
                                variant="glow-green" 
                                className="w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
                                onClick={() => executeAction(record)}
                              >
                                Aksiyonu Kaydet & Tetikle <Zap size={14} />
                              </Button>
                            </div>
                          )}
                        </>
                      )}

                      {record.status === 'ACTION_TAKEN' && (
                        <div className="space-y-4">
                          <div className="premium-panel bg-[rgba(59,130,246,0.05)] border-[rgba(59,130,246,0.1)] py-2">
                            <p className="text-sm font-medium flex items-center gap-2 text-primary">
                              <CheckCircle size={16}/> 
                              Aksiyon Alındı: {record.actionType}
                            </p>
                            {(record.clientEmail || record.clientPhone) && (
                              <div className="text-[10px] text-muted mt-1 space-y-0.5 pl-6">
                                {record.clientEmail && <div>E-Posta: <span className="text-main font-semibold">{record.clientEmail}</span></div>}
                                {record.clientPhone && <div>Telefon: <span className="text-main font-semibold">{record.clientPhone}</span></div>}
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-[10px] font-semibold text-faint uppercase tracking-widest block mb-2">Döngüyü Kapatmak İçin Sonucu İşaretleyin:</label>
                            <div className="grid grid-cols-[1fr_auto] gap-3">
                              <select 
                                className="form-select bg-black/50 text-xs text-white"
                                value={selectedOutcome[record.id] || ''}
                                onChange={(e) => setSelectedOutcome({...selectedOutcome, [record.id]: e.target.value as OutcomeType})}
                              >
                                <option value="" disabled>Sonuç seçin...</option>
                                <option value="recovered">Kurtarıldı (Gelir Geri Kazanıldı)</option>
                                <option value="replied">Yanıt Alındı (İletişim Aktif)</option>
                                <option value="reopened">Yeniden Açıldı (Süreç Baştan Başladı)</option>
                                <option value="no_response">Cevap Yok (Takip Bitti)</option>
                                <option value="churned">Kayıp / Churn (İptal Edildi)</option>
                              </select>
                              <Button 
                                variant="glow-green"
                                className="gap-2 px-6 py-1.5 text-xs font-bold"
                                disabled={!selectedOutcome[record.id]}
                                onClick={() => handleCloseLoop(record.id)}
                              >
                                Kaydet <Check size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {record.status === 'CLOSED' && (
                        <div className="premium-panel bg-black/50 border-[var(--border)] py-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-faint uppercase tracking-widest font-semibold block mb-1">Döngü Sonucu</span>
                              <div className="flex items-center gap-2 font-bold text-xs text-main">
                                <span className={`badge ${getOutcomeBadgeClass(record.outcome)} inline-flex items-center gap-1`}>
                                  {getOutcomeIcon(record.outcome)}
                                  {getOutcomeLabel(record.outcome)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-faint uppercase tracking-widest block mb-1">Gerçekleşen Aksiyon</span>
                              <span className="text-xs font-semibold text-muted flex items-center justify-end gap-1">
                                <CheckCircle size={12}/> {record.actionType}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Global Ledger (Tüm Sorunların Listesi) */}
          <div className="relative z-10 mb-16 animate-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <Activity size={20} className="text-primary" /> Global İstihbarat Kaydı
            </h3>
            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-black/40 border-b border-[var(--border)] text-faint">
                    <tr>
                      <th className="px-6 py-4 font-semibold tracking-widest uppercase text-[10px]">Müşteri / Proje</th>
                      <th className="px-6 py-4 font-semibold tracking-widest uppercase text-[10px]">Kategori</th>
                      <th className="px-6 py-4 font-semibold tracking-widest uppercase text-[10px]">Risk Tutarı</th>
                      <th className="px-6 py-4 font-semibold tracking-widest uppercase text-[10px] text-right">Durum & Aksiyon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {records.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-muted">
                          Henüz sistemde analiz edilmiş veri bulunmamaktadır.
                        </td>
                      </tr>
                    ) : (
                      records.map((r) => (
                        <tr key={r.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-bold text-main">{r.clientName}</div>
                            <div className="text-xs text-muted mt-0.5">{r.context}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="flex items-center gap-1.5 text-xs">
                              {r.category === 'ABANDONED_OPPORTUNITY' && <Zap size={12} className="text-primary" />}
                              {r.category === 'SUBSCRIPTION_DECAY' && <Activity size={12} className="text-primary" />}
                              {r.category === 'COLD_RELATIONSHIP' && <Users size={12} className="text-primary" />}
                              <span className="opacity-90">
                                {r.category === 'ABANDONED_OPPORTUNITY' ? 'Terk Edilmiş Fırsat' : 
                                 r.category === 'SUBSCRIPTION_DECAY' ? 'Abonelik Çürümesi' : 'Soğuk İlişki'}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-semibold ${r.urgency === 'CRITICAL' ? 'text-danger' : r.urgency === 'MEDIUM' ? 'text-warning' : 'text-main'}`}>
                              ${r.revenueImpact.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {r.status === 'PENDING' && (
                              <span className="badge badge-gray inline-flex items-center gap-1">
                                <Clock size={12} /> Bekliyor
                              </span>
                            )}
                            {r.status === 'ACTION_TAKEN' && (
                              <span className="badge badge-info inline-flex items-center gap-1">
                                <CheckCircle size={12} /> İşlemde ({r.actionType?.split(' ')[0]})
                              </span>
                            )}
                            {r.status === 'CLOSED' && (
                              <span className={`badge ${getOutcomeBadgeClass(r.outcome)} inline-flex items-center gap-1`}>
                                {getOutcomeIcon(r.outcome)} {getOutcomeLabel(r.outcome)}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* --- RECOVERY OUTCOMES CENTER VIEW --- */
        <div className="space-y-8 relative z-10 animate-in">
          
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 border-l-4 border-l-emerald-500 bg-emerald-950/5">
              <span className="text-[10px] text-faint font-bold uppercase tracking-widest block mb-1">Döngüsü Kurtarılan Ciro</span>
              <span className="text-3xl font-extrabold text-emerald-400 flex items-center gap-0.5">
                <DollarSign size={24} /> {recoveredRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted block mt-1">Müşterilerden tahsil edilmiş kesin gelir.</span>
            </div>

            <div className="glass-panel p-6 border-l-4 border-l-blue-500 bg-blue-950/5">
              <span className="text-[10px] text-faint font-bold uppercase tracking-widest block mb-1">Korunan Ciro Değeri</span>
              <span className="text-3xl font-extrabold text-blue-400 flex items-center gap-0.5">
                <DollarSign size={24} /> {preservedRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted block mt-1">İlişkisi tazelenmiş veya yeniden açılmış fırsat değeri.</span>
            </div>

            <div className="glass-panel p-6 border-l-4 border-l-rose-500 bg-rose-950/5">
              <span className="text-[10px] text-faint font-bold uppercase tracking-widest block mb-1">Kaybedilen / Churn Ciro</span>
              <span className="text-3xl font-extrabold text-rose-400 flex items-center gap-0.5">
                <DollarSign size={24} /> {churnedRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted block mt-1">Kayıp (churn) veya ulaşılamayan bütçe tutarı.</span>
            </div>

            <div className="glass-panel p-6 border-l-4 border-l-orange-500 bg-orange-950/5">
              <span className="text-[10px] text-faint font-bold uppercase tracking-widest block mb-1">Kurtarma Başarı Oranı</span>
              <span className="text-3xl font-extrabold text-orange-400 flex items-center">
                %{successRate}
              </span>
              <span className="text-[10px] text-muted block mt-1">Sonuçlandırılmış döngülerin başarı yüzdesi.</span>
            </div>
          </div>

          {/* Before ➔ After conversion logs grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Transition Panel 1 */}
            <div className="glass-panel p-6 border border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="text-primary" size={20} />
                <h4 className="text-sm font-bold text-white">Terk Edilmiş Fırsat ➔ Kurtarılmış Ciro</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-black/40 p-3 rounded border border-zinc-900">
                  <span className="text-xs text-muted">Öncesi:</span>
                  <span className="text-xs font-bold text-rose-400">Teklif İlgisiz & Unutulmuş (%0 Kuralı)</span>
                </div>
                <div className="flex justify-between items-center bg-black/40 p-3 rounded border border-zinc-900">
                  <span className="text-xs text-muted">Sonrası:</span>
                  <span className="text-xs font-bold text-emerald-400">Takip Başlatıldı & Gelir Kurtarıldı</span>
                </div>
                <div className="pt-2 flex justify-between items-center border-t border-zinc-850">
                  <span className="text-xs text-faint font-bold uppercase">Sonuçlanan Fırsat:</span>
                  <span className="text-sm font-bold text-white">
                    {records.filter(r => r.category === 'ABANDONED_OPPORTUNITY' && r.status === 'CLOSED' && r.outcome === 'recovered').length} Firma
                  </span>
                </div>
              </div>
            </div>

            {/* Transition Panel 2 */}
            <div className="glass-panel p-6 border border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-primary" size={20} />
                <h4 className="text-sm font-bold text-white">Abonelik Çürümesi ➔ Stabilize Edilmiş</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-black/40 p-3 rounded border border-zinc-900">
                  <span className="text-xs text-muted">Öncesi:</span>
                  <span className="text-xs font-bold text-rose-400">Login Oranı Düşük (%40 Churn Riski)</span>
                </div>
                <div className="flex justify-between items-center bg-black/40 p-3 rounded border border-zinc-900">
                  <span className="text-xs text-muted">Sonrası:</span>
                  <span className="text-xs font-bold text-emerald-400">Temas Kuruldu & İlişki Tazelendi</span>
                </div>
                <div className="pt-2 flex justify-between items-center border-t border-zinc-850">
                  <span className="text-xs text-faint font-bold uppercase">Stabilize Olan:</span>
                  <span className="text-sm font-bold text-white">
                    {records.filter(r => r.category === 'SUBSCRIPTION_DECAY' && r.status === 'CLOSED' && (r.outcome === 'replied' || r.outcome === 'reopened')).length} Firma
                  </span>
                </div>
              </div>
            </div>

            {/* Transition Panel 3 */}
            <div className="glass-panel p-6 border border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Users className="text-primary" size={20} />
                <h4 className="text-sm font-bold text-white">Soğuk İlişki ➔ Yeniden Aktif İlişki</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-black/40 p-3 rounded border border-zinc-900">
                  <span className="text-xs text-muted">Öncesi:</span>
                  <span className="text-xs font-bold text-rose-400">6+ Aydır Sıfır Temas & Unutulmuş</span>
                </div>
                <div className="flex justify-between items-center bg-black/40 p-3 rounded border border-zinc-900">
                  <span className="text-xs text-muted">Sonrası:</span>
                  <span className="text-xs font-bold text-emerald-400">Kahve Sohbeti & Yeni Proje Fırsatı</span>
                </div>
                <div className="pt-2 flex justify-between items-center border-t border-zinc-850">
                  <span className="text-xs text-faint font-bold uppercase">Yeniden Isınan:</span>
                  <span className="text-sm font-bold text-white">
                    {records.filter(r => r.category === 'COLD_RELATIONSHIP' && r.status === 'CLOSED' && r.outcome !== 'churned').length} Firma
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* List of Closed Loop Records */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-400" /> Kapatılmış Kurtarma Döngüleri
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-black/40 border-b border-zinc-800 text-faint">
                  <tr>
                    <th className="px-6 py-3 font-semibold uppercase text-[10px] tracking-wider">Müşteri / Proje</th>
                    <th className="px-6 py-3 font-semibold uppercase text-[10px] tracking-wider">Kategori</th>
                    <th className="px-6 py-3 font-semibold uppercase text-[10px] tracking-wider">İyileşen Gelir</th>
                    <th className="px-6 py-3 font-semibold uppercase text-[10px] tracking-wider text-right">Kapatılma Durumu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {records.filter(r => r.status === 'CLOSED').length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted">
                        Henüz hiçbir kurtarma döngüsü sonuçlandırılmadı. Analiz paneline dönüp müşteri kartlarını güncelleyin.
                      </td>
                    </tr>
                  ) : (
                    records.filter(r => r.status === 'CLOSED').map(r => (
                      <tr key={r.id} className="hover:bg-white/[0.01]">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">{r.clientName}</div>
                          <div className="text-xs text-muted">{r.context}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs">
                            {r.category === 'ABANDONED_OPPORTUNITY' ? 'Terk Edilmiş Fırsat' : 
                             r.category === 'SUBSCRIPTION_DECAY' ? 'Abonelik Çürümesi' : 'Soğuk İlişki'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-white">
                          ${r.revenueImpact.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`badge ${getOutcomeBadgeClass(r.outcome)} inline-flex items-center gap-1`}>
                            {getOutcomeIcon(r.outcome)} {getOutcomeLabel(r.outcome)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* --- LEAD CAPTURE DATABASE VIEW --- */}
      <div className="relative z-10 animate-in mt-12 mb-16" style={{ animationDelay: '0.3s' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-white">
            <Users size={20} className="text-orange" /> Lead Kayıt Havuzu (Zero-Cost Lead Capture)
          </h3>
          {leadCaptures.length > 0 && (
            <Button variant="outline" onClick={handleExportLeads} className="text-xs py-1.5 flex items-center gap-2">
              <Download size={14} /> Kayıtları CSV Dışa Aktar
            </Button>
          )}
        </div>
        <div className="glass-panel p-6">
          {leadCaptures.length === 0 ? (
            <p className="text-sm text-muted text-center py-6">
              Henüz toplanmış lead kaydı bulunmamaktadır. Rapor indirme bariyerini deneyerek yeni bir lead oluşturabilirsiniz.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-black/40 border-b border-[var(--border)] text-faint">
                  <tr>
                    <th className="px-6 py-3 font-semibold tracking-widest uppercase text-[10px]">E-Posta Adresi</th>
                    <th className="px-6 py-3 font-semibold tracking-widest uppercase text-[10px]">Teşhis Tarihi</th>
                    <th className="px-6 py-3 font-semibold tracking-widest uppercase text-[10px]">Firma Sayısı</th>
                    <th className="px-6 py-3 font-semibold tracking-widest uppercase text-[10px] text-right">Kurtarılabilir Kayıp Tutarı</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {leadCaptures.map((lc) => (
                    <tr key={lc.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-3 font-semibold text-main">{lc.email}</td>
                      <td className="px-6 py-3 text-muted text-xs">{lc.capturedAt}</td>
                      <td className="px-6 py-3 text-main font-medium">{lc.companyCount} Firma</td>
                      <td className="px-6 py-3 text-right font-semibold text-success">${lc.estimatedLoss.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
