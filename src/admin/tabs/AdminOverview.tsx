import { useEffect, useState } from 'react';
import { getRecords, getLeadCaptures, getFeedbacks } from '../../lib/db';
import type { IntelligenceRecord, LeadCaptureRecord } from '../../lib/db';

function formatUSD(amount: number) {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0 });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    PENDING:      { label: 'Pending',  cls: 'badge badge-warning' },
    ACTION_TAKEN: { label: 'In Action', cls: 'badge badge-info' },
    CLOSED:       { label: 'Closed', cls: 'badge badge-success' },
  };
  const entry = map[status] ?? { label: status, cls: 'badge badge-gray' };
  return <span className={entry.cls}>{entry.label}</span>;
}

export function AdminOverview() {
  const [records, setRecords]   = useState<IntelligenceRecord[]>([]);
  const [leads, setLeads]       = useState<LeadCaptureRecord[]>([]);
  const [feedback, setFeedback] = useState<unknown[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      const [recs, ldrs, fb] = await Promise.all([getRecords(), getLeadCaptures(), getFeedbacks()]);
      setRecords(recs);
      setLeads(ldrs);
      setFeedback(fb);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div style={{ color: 'var(--text-faint)', padding: '2rem', textAlign: 'center' }}>
        Loading...
      </div>
    );
  }

  const recoveredTotal = records
    .filter((r) => r.status === 'CLOSED' && r.outcome === 'recovered')
    .reduce((sum, r) => sum + r.revenueImpact, 0);

  // Simulated accounts count
  const simAccounts = localStorage.getItem('rrs_simulated_accounts');
  let userCount = 0;
  if (simAccounts) {
    try {
      userCount = Object.keys(JSON.parse(simAccounts)).length;
    } catch { userCount = 0; }
  }

  // Sort records by lastUpdated for recent activity
  const recent = [...records]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 5);

  // Plan distribution (only active plan readable)
  const activePlan = localStorage.getItem('rrio_user_plan') || 'FREE';

  const kpiCards = [
    {
      label: 'Total Users',
      value: userCount,
      cls: 'kpi-card kpi-primary',
      valueColor: 'var(--accent-primary)',
      note: 'From simulated accounts',
    },
    {
      label: "Total Leads",
      value: leads.length,
      cls: 'kpi-card kpi-info',
      valueColor: 'var(--status-info)',
      note: 'Lead capture record',
    },
    {
      label: 'Total Feedback',
      value: feedback.length,
      cls: 'kpi-card kpi-warning',
      valueColor: 'var(--status-warning)',
      note: 'Feedback response',
    },
    {
      label: 'Recovered Revenue',
      value: formatUSD(recoveredTotal),
      cls: 'kpi-card kpi-success',
      valueColor: 'var(--status-success)',
      note: 'CLOSED + recovered records',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* KPI Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {kpiCards.map((card) => (
          <div key={card.label} className={card.cls}>
            <span className="kpi-label">{card.label}</span>
            <div className="kpi-value" style={{ color: card.valueColor, fontSize: '1.75rem' }}>
              {card.value}
            </div>
            <div className="kpi-note">{card.note}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity + Plan Distribution side by side */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* Recent Activity */}
        <div className="glass-panel" style={{ overflow: 'visible' }}>
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              letterSpacing: '0.04em',
            }}
          >
            Recent Activities
          </div>
          {recent.length === 0 ? (
            <div style={{ padding: '1.5rem', color: 'var(--text-faint)', fontSize: '0.8125rem' }}>
              No records yet.
            </div>
          ) : (
            <div>
              {recent.map((rec, i) => (
                <div
                  key={rec.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.875rem 1.5rem',
                    borderBottom:
                      i < recent.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'var(--surface-elevated)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {rec.clientName}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>
                      {new Date(rec.lastUpdated).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <StatusBadge status={rec.status} />
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: 'var(--status-warning)',
                      flexShrink: 0,
                    }}
                  >
                    {formatUSD(rec.revenueImpact)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Plan Distribution */}
        <div
          className="glass-panel"
          style={{ padding: '1.5rem', minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              letterSpacing: '0.04em',
            }}
          >
            Plan Distribution
          </div>

          {['FREE', 'PRO', 'AGENCY'].map((plan) => (
            <div
              key={plan}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{plan}</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color:
                    activePlan === plan ? 'var(--accent-primary)' : 'var(--text-faint)',
                }}
              >
                {activePlan === plan ? '1' : '—'}
              </span>
            </div>
          ))}

          <p
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-faint)',
              lineHeight: 1.5,
              borderTop: '1px solid var(--border)',
              paddingTop: '0.75rem',
            }}
          >
            Note: Only active session plan can be viewed.
          </p>
        </div>
      </div>
    </div>
  );
}
