import { useState, useEffect } from 'react';
import {
  Cpu, DollarSign, Zap, Activity, Users, Clock,
  CheckCircle, LogOut, ArrowLeft, RefreshCw, TrendingUp,
  BarChart2, AlertTriangle, User
} from 'lucide-react';
import { getRecords } from '../lib/db';
import type { IntelligenceRecord, Category } from '../lib/db';
import { Button } from '../components/Button';

interface PipelineViewProps {
  onNavigateDiagnosis: () => void;
  onReset: () => void;
  userEmail: string;
  onLogout: () => void;
}

const CATEGORY_CONFIG: Record<Category, { label: string; icon: React.ReactNode; color: string; rgb: string }> = {
  ABANDONED_OPPORTUNITY: {
    label: 'Terk Edilmiş Fırsat',
    icon: <Zap size={11} />,
    color: 'var(--accent-primary)',
    rgb: '13,211,255',
  },
  SUBSCRIPTION_DECAY: {
    label: 'Abonelik Çürümesi',
    icon: <Activity size={11} />,
    color: 'var(--neon-orange)',
    rgb: '255,126,71',
  },
  COLD_RELATIONSHIP: {
    label: 'Soğuk İlişki',
    icon: <Users size={11} />,
    color: 'var(--status-info)',
    rgb: '167,139,250',
  },
};

interface KanbanColumn {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  records: IntelligenceRecord[];
}

const OUTCOME_LABELS: Record<string, string> = {
  recovered: '✅ Kurtarıldı',
  replied: '💬 Yanıt Alındı',
  reopened: '🔄 Yeniden Açıldı',
  no_response: '⏳ Cevap Yok',
  churned: '❌ Churn',
};

const OUTCOME_COLORS: Record<string, string> = {
  recovered: 'var(--status-success)',
  replied: 'var(--accent-primary)',
  reopened: 'var(--status-warning)',
  no_response: 'var(--text-faint)',
  churned: 'var(--status-danger)',
};

export function PipelineView({ onNavigateDiagnosis, onReset, userEmail, onLogout }: PipelineViewProps) {
  const [records, setRecords] = useState<IntelligenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    else setLoading(true);
    const data = await getRecords();
    setRecords(data);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    let active = true;
    getRecords().then(data => {
      if (active) {
        setRecords(data);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  // Sorted columns
  const pending = records
    .filter(r => r.status === 'PENDING')
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const actionTaken = records
    .filter(r => r.status === 'ACTION_TAKEN')
    .sort((a, b) => b.revenueImpact - a.revenueImpact);

  const closed = records
    .filter(r => r.status === 'CLOSED')
    .sort((a, b) => b.revenueImpact - a.revenueImpact);

  // Aggregate metrics
  const totalLeakage = records.reduce((s, r) => s + r.revenueImpact, 0);
  const recoveredRevenue = records
    .filter(r => r.status === 'CLOSED' && r.outcome === 'recovered')
    .reduce((s, r) => s + r.revenueImpact, 0);
  const successRate = closed.length > 0
    ? Math.round((closed.filter(r => r.outcome !== 'churned' && r.outcome !== 'no_response').length / closed.length) * 100)
    : 0;

  const columns: KanbanColumn[] = [
    {
      id: 'PENDING',
      title: 'BEKLEYENLER',
      subtitle: 'Aksiyon alınmayı bekliyor',
      icon: <Clock size={15} />,
      color: 'var(--status-warning)',
      bgColor: 'rgba(255,208,67,0.04)',
      borderColor: 'rgba(255,208,67,0.18)',
      records: pending,
    },
    {
      id: 'ACTION_TAKEN',
      title: 'İŞLEMDE',
      subtitle: 'Temas kuruldu, yanıt bekleniyor',
      icon: <TrendingUp size={15} />,
      color: 'var(--accent-primary)',
      bgColor: 'rgba(13,211,255,0.04)',
      borderColor: 'rgba(13,211,255,0.18)',
      records: actionTaken,
    },
    {
      id: 'CLOSED',
      title: 'KAPATILDI',
      subtitle: 'Döngü sonuçlandı',
      icon: <CheckCircle size={15} />,
      color: 'var(--status-success)',
      bgColor: 'rgba(56,242,150,0.04)',
      borderColor: 'rgba(56,242,150,0.18)',
      records: closed,
    },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner spinner-lg" />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Pipeline yükleniyor...</p>
      </div>
    );
  }

  return (
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
                Pipeline
              </span>
            </div>
          </div>

          <div className="topbar-actions">
            <button
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', minHeight: '40px', fontSize: '0.75rem' }}
              onClick={onNavigateDiagnosis}
            >
              <ArrowLeft size={14} /> Teşhis Ekranı
            </button>
            <button
              className="btn btn-outline"
              style={{ padding: '0.5rem 0.875rem', minHeight: '40px', fontSize: '0.75rem' }}
              onClick={() => loadData(true)}
              disabled={refreshing}
            >
              <RefreshCw size={14} style={{ animation: refreshing ? 'spin-slow 1s linear infinite' : 'none' }} />
            </button>
            <button
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', minHeight: '40px', fontSize: '0.75rem' }}
              onClick={onReset}
            >
              Yeniden Tara
            </button>
            <span className="user-pill">
              <User size={12} />
              {userEmail.split('@')[0]}
            </span>
            <Button variant="outline" className="btn-icon" onClick={onLogout} title="Çıkış">
              <LogOut size={17} />
            </Button>
          </div>
        </div>
      </header>

      <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            <BarChart2 size={11} /> Recovery Pipeline Board
          </span>
          <h1 style={{
            fontSize: 'clamp(1.375rem, 3vw, 1.875rem)',
            fontWeight: 800, letterSpacing: '-0.025em',
            marginBottom: '0.375rem', color: 'var(--text-main)',
            lineHeight: 1.25,
          }}>
            Kurtarma{' '}
            <span style={{ color: 'var(--accent-primary)', textShadow: '0 0 20px var(--glow-primary)' }}>
              Pipeline Görünümü
            </span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '560px' }}>
            {records.length} kayıt — ${totalLeakage.toLocaleString()} toplam risk.
            Kurtarma süreçlerinin anlık durumu.
          </p>
        </div>

        {/* ── SUMMARY KPIS ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div className="kpi-card kpi-warning">
            <span className="kpi-label">Bekleyen</span>
            <div className="kpi-value kv-warning" style={{ fontSize: '2.25rem' }}>
              {pending.length}
            </div>
            <span className="kpi-note">Aksiyon bekliyor.</span>
          </div>
          <div className="kpi-card kpi-primary">
            <span className="kpi-label">İşlemde</span>
            <div className="kpi-value kv-primary" style={{ fontSize: '2.25rem' }}>
              {actionTaken.length}
            </div>
            <span className="kpi-note">Yanıt bekleniyor.</span>
          </div>
          <div className="kpi-card kpi-success">
            <span className="kpi-label">Kurtarılan Ciro</span>
            <div className="kpi-value kv-success">
              <DollarSign size={20} /> {recoveredRevenue.toLocaleString()}
            </div>
            <span className="kpi-note">Geri kazanılan toplam.</span>
          </div>
          <div className="kpi-card kpi-orange">
            <span className="kpi-label">Başarı Oranı</span>
            <div className="kpi-value kv-orange" style={{ fontSize: '2.25rem' }}>
              %{successRate}
            </div>
            <span className="kpi-note">Kapatılmış döngü başarısı.</span>
          </div>
        </div>

        {/* ── KANBAN BOARD ── */}
        <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(280px, 1fr))',
            gap: '1.25rem',
            alignItems: 'start',
            minWidth: '860px',
          }}>
            {columns.map(col => (
              <div
                key={col.id}
                style={{
                  background: col.bgColor,
                  border: `1px solid ${col.borderColor}`,
                  borderRadius: 'var(--r-lg)',
                  overflow: 'hidden',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Column Header */}
                <div style={{
                  padding: '1rem 1.25rem',
                  borderBottom: `1px solid ${col.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: `rgba(${col.id === 'PENDING' ? '255,208,67' : col.id === 'ACTION_TAKEN' ? '13,211,255' : '56,242,150'},0.1)`,
                      border: `1px solid ${col.borderColor}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: col.color, flexShrink: 0,
                    }}>
                      {col.icon}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: col.color,
                      }}>
                        {col.title}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)', marginTop: '0.1rem' }}>
                        {col.subtitle}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '1rem', fontWeight: 800, color: col.color,
                    background: 'rgba(0,0,0,0.3)',
                    border: `1px solid ${col.borderColor}`,
                    borderRadius: 'var(--r-full)',
                    padding: '0.15rem 0.625rem',
                    minWidth: '28px', textAlign: 'center',
                  }}>
                    {col.records.length}
                  </span>
                </div>

                {/* Cards */}
                <div style={{
                  padding: '0.875rem',
                  display: 'flex', flexDirection: 'column', gap: '0.75rem',
                  minHeight: '180px',
                }}>
                  {col.records.length === 0 && (
                    <div style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      padding: '2.5rem 1rem', gap: '0.5rem',
                      color: 'var(--text-faint)',
                    }}>
                      <CheckCircle size={28} style={{ opacity: 0.3 }} />
                      <span style={{ fontSize: '0.8125rem' }}>Bu sütunda kayıt yok.</span>
                    </div>
                  )}

                  {col.records.map(record => {
                    const catCfg = CATEGORY_CONFIG[record.category];
                    return (
                      <div
                        key={record.id}
                        onClick={onNavigateDiagnosis}
                        className="pipeline-card"
                        title="Detaylı görünüm için tıklayın"
                      >
                        {/* Category + Urgency row */}
                        <div style={{
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.75rem', gap: '0.375rem', flexWrap: 'wrap',
                        }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em',
                            textTransform: 'uppercase', color: catCfg.color,
                            background: `rgba(${catCfg.rgb},0.08)`,
                            border: `1px solid rgba(${catCfg.rgb},0.22)`,
                            padding: '0.2rem 0.5rem', borderRadius: 'var(--r-full)',
                          }}>
                            {catCfg.icon} {catCfg.label}
                          </span>
                          <span style={{
                            fontSize: '0.62rem', fontWeight: 700,
                            color: record.urgency === 'CRITICAL'
                              ? 'var(--status-danger)'
                              : record.urgency === 'MEDIUM'
                                ? 'var(--status-warning)'
                                : 'var(--text-faint)',
                          }}>
                            {record.urgency === 'CRITICAL' ? '🔴' : record.urgency === 'MEDIUM' ? '🟡' : '🔵'}
                            {' '}{record.urgency}
                          </span>
                        </div>

                        {/* Client name + contact */}
                        <div style={{
                          fontSize: '0.9375rem', fontWeight: 800,
                          color: 'var(--text-main)', marginBottom: '0.15rem', lineHeight: 1.2,
                        }}>
                          {record.clientName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.875rem' }}>
                          {record.contactPerson}
                        </div>

                        {/* Revenue + outcome/action info */}
                        <div style={{
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem',
                        }}>
                          <span style={{
                            display: 'flex', alignItems: 'center', gap: '0.15rem',
                            fontSize: '1.0625rem', fontWeight: 800,
                            color: record.status === 'CLOSED' && record.outcome === 'recovered'
                              ? 'var(--status-success)'
                              : record.status === 'CLOSED' && record.outcome === 'churned'
                                ? 'var(--status-danger)'
                                : 'var(--status-danger)',
                            textShadow: record.status === 'CLOSED' && record.outcome === 'recovered'
                              ? '0 0 10px var(--glow-success)' : 'none',
                          }}>
                            <DollarSign size={13} /> {record.revenueImpact.toLocaleString()}
                          </span>

                          {record.status === 'CLOSED' && record.outcome && (
                            <span style={{
                              fontSize: '0.62rem', fontWeight: 700,
                              color: OUTCOME_COLORS[record.outcome] || 'var(--text-muted)',
                              whiteSpace: 'nowrap',
                            }}>
                              {OUTCOME_LABELS[record.outcome] || record.outcome}
                            </span>
                          )}
                          {record.status === 'ACTION_TAKEN' && record.actionType && (
                            <span style={{
                              fontSize: '0.62rem', fontWeight: 600,
                              color: 'var(--accent-primary)',
                              background: 'rgba(13,211,255,0.07)',
                              border: '1px solid rgba(13,211,255,0.18)',
                              padding: '0.15rem 0.4rem',
                              borderRadius: 'var(--r-full)',
                              whiteSpace: 'nowrap',
                            }}>
                              {record.actionType}
                            </span>
                          )}
                          {record.status === 'PENDING' && (
                            <span style={{ fontSize: '0.62rem', color: 'var(--text-faint)' }}>
                              <AlertTriangle size={10} style={{ display: 'inline', marginRight: '3px', color: 'var(--status-warning)' }} />
                              Bekliyor
                            </span>
                          )}
                        </div>

                        {/* Priority bar */}
                        <div>
                          <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            marginBottom: '0.3rem',
                          }}>
                            <span style={{
                              fontSize: '0.58rem', fontWeight: 700,
                              textTransform: 'uppercase', letterSpacing: '0.07em',
                              color: 'var(--text-faint)',
                            }}>
                              Öncelik Skoru
                            </span>
                            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: col.color }}>
                              {record.priorityScore}/100
                            </span>
                          </div>
                          <div style={{
                            height: '3px', borderRadius: '2px',
                            background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
                          }}>
                            <div style={{
                              height: '100%', borderRadius: '2px',
                              background: col.color,
                              width: `${record.priorityScore}%`,
                              opacity: 0.75,
                              transition: 'width 0.6s ease',
                            }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Column Footer - total */}
                {col.records.length > 0 && (
                  <div style={{
                    padding: '0.75rem 1.25rem',
                    borderTop: `1px solid ${col.borderColor}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Toplam Risk
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: col.color }}>
                      ${col.records.reduce((s, r) => s + r.revenueImpact, 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM CTA ── */}
        <div style={{
          textAlign: 'center', marginTop: '2.5rem',
          padding: '1.25rem',
          background: 'rgba(13,211,255,0.04)',
          border: '1px solid rgba(13,211,255,0.12)',
          borderRadius: 'var(--r-lg)',
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
            Kart detayları, AI mesaj şablonları ve döngü kapatma için{' '}
            <strong style={{ color: 'var(--text-main)' }}>Teşhis Ekranı</strong>'na geçin.
          </p>
          <button
            className="btn btn-glow-blue"
            onClick={onNavigateDiagnosis}
            style={{ minHeight: '44px', padding: '0.625rem 1.75rem', fontSize: '0.875rem' }}
          >
            <ArrowLeft size={16} /> Teşhis Ekranına Dön
          </button>
        </div>

      </div>
    </div>
  );
}
