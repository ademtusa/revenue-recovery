import { useState, useEffect } from 'react';
import { DollarSign, Download, Clock, Target, Users, Zap, CheckCircle, Activity, MessageSquare, AlertCircle, Award, XCircle, Check, Settings, Cpu } from 'lucide-react';
import { Button } from '../components/Button';
import { SettingsModal } from '../components/SettingsModal';
import { getRecords, updateRecord } from '../lib/db';
import type { IntelligenceRecord, Category, ActionType, OutcomeType } from '../lib/db';

interface DiagnosisViewProps {
  onReset: () => void;
}

export function DiagnosisView({ onReset }: DiagnosisViewProps) {
  const [activeTab, setActiveTab] = useState<Category>('ABANDONED_OPPORTUNITY');
  const [records, setRecords] = useState<IntelligenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Local state for dropdowns per record ID
  const [selectedAction, setSelectedAction] = useState<Record<string, ActionType>>({});
  const [selectedOutcome, setSelectedOutcome] = useState<Record<string, OutcomeType>>({});
  const [draftTones, setDraftTones] = useState<Record<string, 'formal' | 'friendly'>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getRecords();
    setRecords(data);
    setLoading(false);
  };

  const handleLogAction = async (id: string) => {
    const action = selectedAction[id];
    if (!action) return;
    
    // Optimistic UI update
    setRecords(records.map(r => r.id === id ? { ...r, status: 'ACTION_TAKEN', actionType: action } : r));
    
    // DB update
    await updateRecord(id, { status: 'ACTION_TAKEN', actionType: action });
  };

  const handleCloseLoop = async (id: string) => {
    const outcome = selectedOutcome[id];
    if (!outcome) return;

    // Optimistic UI update
    setRecords(records.map(r => r.id === id ? { ...r, status: 'CLOSED', outcome: outcome } : r));
    
    // DB update
    await updateRecord(id, { status: 'CLOSED', outcome: outcome });
  };

  const filteredRecords = records.filter(r => r.category === activeTab);

  const getOutcomeBadgeClass = (outcome?: OutcomeType) => {
    if (!outcome) return 'badge-gray';
    if (outcome.includes('Kurtarıldı')) return 'badge-success';
    if (outcome.includes('Tazelendi')) return 'badge-info';
    if (outcome.includes('Reddedildi')) return 'badge-danger';
    return 'badge-warning';
  };

  const getOutcomeIcon = (outcome?: OutcomeType) => {
    if (!outcome) return <AlertCircle size={14} />;
    if (outcome.includes('Kurtarıldı')) return <Award size={14} />;
    if (outcome.includes('Tazelendi')) return <Target size={14} />;
    if (outcome.includes('Reddedildi')) return <XCircle size={14} />;
    return <Clock size={14} />;
  };

  if (loading) {
    return (
      <div className="container py-16 flex justify-center items-center">
        <div className="text-muted animate-pulse">Veriler Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16 animate-in">
      
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 relative z-10">
        <div>
          <span className="badge badge-gray mb-3 text-[10px] tracking-widest text-faint border-[var(--border-hover)]">GELİR KURTARMA MODÜLÜ</span>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">İstihbarat <span className="text-primary">Paneli</span></h1>
          <p className="text-muted text-sm md:text-base">Tespit edilen kayıplar analiz edildi ve stratejik kurtarma planları hazırlandı.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="p-2" onClick={() => setShowSettings(true)} title="Abonelik ve Ayarlar">
            <Settings size={18} />
          </Button>
          <Button variant="outline" className="flex-1 md:flex-none" onClick={onReset}>Yeniden Tara</Button>
          <Button variant="glow-blue" className="flex items-center justify-center gap-2 flex-1 md:flex-none">
            <Download size={16} /> Raporu İndir
          </Button>
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
          <div key={record.id} className="glass-panel group">
            
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
              
              {/* Left Column: Context */}
              <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-[var(--border)] transition-colors duration-500 group-hover:border-[var(--border-hover)]">
                
                <div className="flex justify-between items-center mb-6">
                  <span className={`badge ${record.urgency === 'CRITICAL' ? 'badge-danger' : record.urgency === 'MEDIUM' ? 'badge-warning' : 'badge-info'}`}>
                    {record.urgency === 'CRITICAL' ? 'Kritik Aciliyet' : record.urgency === 'MEDIUM' ? 'Orta Aciliyet' : 'Düşük Aciliyet'}
                  </span>
                  {record.status === 'PENDING' ? (
                    <span className="badge badge-gray text-[10px]">Aksiyon Bekleniyor</span>
                  ) : record.status === 'ACTION_TAKEN' ? (
                    <span className="badge badge-info text-[10px]">Sonuç Bekleniyor</span>
                  ) : (
                    <span className={`badge ${getOutcomeBadgeClass(record.outcome)} text-[10px]`}>
                      Döngü Kapatıldı
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold mb-1 tracking-tight text-main">{record.clientName}</h3>
                <p className="text-muted text-sm mb-8 flex items-center gap-2">
                  <Users size={14} className="text-faint"/> İletişim: <span className="text-main font-medium">{record.contactPerson}</span>
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="premium-panel bg-[var(--surface)]">
                    <span className="text-[10px] text-faint font-semibold uppercase tracking-widest block mb-1">Proje / Kapsam</span>
                    <span className="text-sm font-semibold text-main">{record.context}</span>
                  </div>
                  <div className="premium-panel bg-[var(--surface)]">
                    <span className="text-[10px] text-faint font-semibold uppercase tracking-widest block mb-1">Riskteki Gelir</span>
                    <span className="text-lg font-bold text-danger flex items-center gap-1">
                      <DollarSign size={16}/> {record.revenueImpact}
                    </span>
                  </div>
                </div>

              </div>

              {/* Right Column: Intelligence & Action Tracking */}
              <div className="p-6 md:p-8 flex flex-col justify-between bg-black/40">
                
                <div className="mb-6">
                  <h4 className="text-[10px] text-faint font-semibold uppercase tracking-widest flex items-center gap-2 mb-2">
                    <Target size={14} className="text-primary" /> İstihbarat Teşhisi
                  </h4>
                  <p className="text-sm text-main mb-6 leading-relaxed opacity-90">{record.subCause}</p>

                  <h4 className="text-[10px] text-faint font-semibold uppercase tracking-widest flex items-center gap-2 mb-2">
                    <Clock size={14} className="text-primary" /> Önerilen Strateji & Ton
                  </h4>
                  <p className="text-sm text-main mb-6 leading-relaxed opacity-90">{record.strategy}</p>

                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[10px] text-faint font-semibold uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare size={14} className="text-primary" /> Yapay Zeka Yanıt Stüdyosu
                    </h4>
                    <div className="flex bg-black/40 rounded-full p-0.5 border border-[var(--border)]">
                      <button 
                        onClick={() => setDraftTones({...draftTones, [record.id]: 'formal'})}
                        className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-all ${(!draftTones[record.id] || draftTones[record.id] === 'formal') ? 'bg-primary text-white' : 'text-muted hover:text-white'}`}
                      >
                        Kurumsal
                      </button>
                      <button 
                        onClick={() => setDraftTones({...draftTones, [record.id]: 'friendly'})}
                        className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-all ${(draftTones[record.id] === 'friendly') ? 'bg-primary text-white' : 'text-muted hover:text-white'}`}
                      >
                        Samimi
                      </button>
                    </div>
                  </div>
                  
                  <div className="premium-panel bg-[var(--surface)] border-l-2 border-l-[var(--accent-primary)] border-y-0 border-r-0 rounded-l-none text-sm italic text-muted leading-relaxed relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="badge badge-gray text-[8px] flex items-center gap-1"><Cpu size={10}/> AI Generated</span>
                    </div>
                    "{draftTones[record.id] === 'friendly' ? 
                        record.draftMessage.replace('Merhaba', 'Selamlar').replace('netleştirebiliriz', 'konuşalım derim').replace('bekleriz', 'bekliyorum, sevgiler') 
                        : record.draftMessage}"
                  </div>
                </div>

                {/* Advanced Action Tracking UI */}
                <div className="mt-auto border-t border-[var(--border)] pt-6">
                  
                  {record.status === 'PENDING' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-faint uppercase tracking-widest block mb-2">Yapay Zeka Taslağını Gönder & Aksiyonu Kaydet:</label>
                      <div className="grid grid-cols-[1fr_auto] gap-3">
                        <select 
                          className="form-select bg-black/50"
                          value={selectedAction[record.id] || ''}
                          onChange={(e) => setSelectedAction({...selectedAction, [record.id]: e.target.value as ActionType})}
                        >
                          <option value="" disabled>Kanal Seçin...</option>
                          <option value="E-Posta Gönderildi">E-Posta (Gmail)</option>
                          <option value="Telefonla Arandı">Telefonla Ara</option>
                          <option value="WhatsApp / SMS">WhatsApp / SMS</option>
                          <option value="Sosyal Ağ / LinkedIn">LinkedIn Message</option>
                        </select>
                        <Button 
                          variant="glow-orange"
                          className="gap-2 px-6"
                          disabled={!selectedAction[record.id]}
                          onClick={() => handleLogAction(record.id)}
                        >
                          Gönder <Check size={16} />
                        </Button>
                      </div>
                    </div>
                  )}

                  {record.status === 'ACTION_TAKEN' && (
                    <div className="space-y-4">
                      <div className="premium-panel bg-[rgba(59,130,246,0.05)] border-[rgba(59,130,246,0.1)] py-2">
                        <p className="text-sm font-medium flex items-center gap-2 text-primary">
                          <CheckCircle size={16}/> 
                          Geçmiş Aksiyon: {record.actionType}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold text-faint uppercase tracking-widest block mb-2">Döngüyü Kapatmak İçin Sonucu İşaretleyin:</label>
                        <div className="grid grid-cols-[1fr_auto] gap-3">
                          <select 
                            className="form-select bg-black/50"
                            value={selectedOutcome[record.id] || ''}
                            onChange={(e) => setSelectedOutcome({...selectedOutcome, [record.id]: e.target.value as OutcomeType})}
                          >
                            <option value="" disabled>Aksiyon Sonucunu Seçin...</option>
                            <option value="Kurtarıldı / Kazanıldı">Kazanıldı</option>
                            <option value="İlişki Tazelendi (Onore Edildi)">İlişki Tazelendi</option>
                            <option value="Ulaşılamadı / Cevap Yok">Cevap Yok</option>
                            <option value="Reddedildi / Kaybedildi">Reddedildi</option>
                          </select>
                          <Button 
                            variant="glow-green"
                            className="gap-2 px-6"
                            disabled={!selectedOutcome[record.id]}
                            onClick={() => handleCloseLoop(record.id)}
                          >
                            Sonlandır <Check size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {record.status === 'CLOSED' && (
                    <div className="premium-panel bg-black/50 flex items-center justify-between border-[var(--border)] py-3">
                      <div>
                        <span className="text-[10px] text-faint uppercase tracking-widest font-semibold block mb-1">Döngü Sonucu</span>
                        <div className="flex items-center gap-2 font-semibold text-sm text-main">
                          <span className={`text-${getOutcomeBadgeClass(record.outcome).split('-')[1]}`}>
                            {getOutcomeIcon(record.outcome)}
                          </span>
                          {record.outcome}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-faint uppercase tracking-widest block mb-1">Geçmiş Aksiyon</span>
                        <span className="text-sm font-medium text-muted flex items-center justify-end gap-1">
                          <CheckCircle size={12}/> {record.actionType}
                        </span>
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
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
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
                            {getOutcomeIcon(r.outcome)} {r.outcome?.split(' ')[0]}
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

    </div>
  );
}
