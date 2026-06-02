import { useEffect, useState } from 'react';
import { getRecords, getLeadCaptures } from '../../lib/db';
import type { IntelligenceRecord, LeadCaptureRecord } from '../../lib/db';

function formatUSD(n: number) {
  return '$' + n.toLocaleString('en-US');
}

interface BarProps {
  label: string;
  count: number;
  total: number;
  color: string;
}

function BarRow({ label, count, total, color }: BarProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ marginBottom: '0.875rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
          {count} <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>({pct}%)</span>
        </span>
      </div>
      <div
        style={{
          height: '8px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: '4px',
            transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel" style={{ overflow: 'visible' }}>
      <div
        style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          letterSpacing: '0.04em',
        }}
      >
        {title}
      </div>
      <div style={{ padding: '1.25rem 1.5rem' }}>{children}</div>
    </div>
  );
}

export function AdminAnalytics() {
  const [records, setRecords] = useState<IntelligenceRecord[]>([]);
  const [leads,   setLeads]   = useState<LeadCaptureRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [recs, ldrs] = await Promise.all([getRecords(), getLeadCaptures()]);
      setRecords(recs);
      setLeads(ldrs);
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

  const total = records.length;

  // Category counts
  const catCounts = {
    ABANDONED_OPPORTUNITY: records.filter((r) => r.category === 'ABANDONED_OPPORTUNITY').length,
    SUBSCRIPTION_DECAY:    records.filter((r) => r.category === 'SUBSCRIPTION_DECAY').length,
    COLD_RELATIONSHIP:     records.filter((r) => r.category === 'COLD_RELATIONSHIP').length,
  };

  // Urgency counts
  const urgCounts = {
    CRITICAL: records.filter((r) => r.urgency === 'CRITICAL').length,
    MEDIUM:   records.filter((r) => r.urgency === 'MEDIUM').length,
    LOW:      records.filter((r) => r.urgency === 'LOW').length,
  };

  // Revenue by status
  const totalRisk      = records.reduce((s, r) => s + r.revenueImpact, 0);
  const actionTakenRisk = records
    .filter((r) => r.status === 'ACTION_TAKEN')
    .reduce((s, r) => s + r.revenueImpact, 0);
  const recoveredRisk  = records
    .filter((r) => r.status === 'CLOSED' && r.outcome === 'recovered')
    .reduce((s, r) => s + r.revenueImpact, 0);
  const pendingRisk    = records
    .filter((r) => r.status === 'PENDING')
    .reduce((s, r) => s + r.revenueImpact, 0);

  // Recent leads
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime())
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Category Distribution */}
      <SectionCard title="📂 Category Distribution">
        <BarRow label="Abandoned Opportunity"  count={catCounts.ABANDONED_OPPORTUNITY} total={total} color="var(--status-danger)"  />
        <BarRow label="Subscription Decay"   count={catCounts.SUBSCRIPTION_DECAY}    total={total} color="var(--status-warning)" />
        <BarRow label="Cooling Relationship"      count={catCounts.COLD_RELATIONSHIP}     total={total} color="var(--status-info)"    />
      </SectionCard>

      {/* Urgency Distribution */}
      <SectionCard title="🚨 Urgency Distribution">
        <BarRow label="Critical" count={urgCounts.CRITICAL} total={total} color="var(--status-danger)"  />
        <BarRow label="Medium"   count={urgCounts.MEDIUM}   total={total} color="var(--status-warning)" />
        <BarRow label="Low"  count={urgCounts.LOW}      total={total} color="var(--status-success)" />
      </SectionCard>

      {/* Revenue Risk */}
      <SectionCard title="💰 Total Revenue Risk">
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          {[
            { label: 'Total Risk',   value: formatUSD(totalRisk),       color: 'var(--status-danger)'  },
            { label: 'Pending',      value: formatUSD(pendingRisk),     color: 'var(--status-warning)' },
            { label: 'In Action',     value: formatUSD(actionTakenRisk), color: 'var(--accent-primary)' },
            { label: 'Recovered',   value: formatUSD(recoveredRisk),   color: 'var(--status-success)' },
          ].map((item) => (
            <div key={item.label}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '0.375rem' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '1.375rem', fontWeight: 800, color: item.color }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Lead Timeline */}
      <SectionCard title="🕐 Lead Timeline (Last 5)">
        {recentLeads.length === 0 ? (
          <p style={{ color: 'var(--text-faint)', fontSize: '0.8125rem' }}>No leads yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.625rem 0.875rem',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 'var(--r-sm)',
                  border: '1px solid var(--border)',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 500 }}>
                  {lead.email}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', flexShrink: 0 }}>
                  {lead.capturedAt}
                </span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
