import { useEffect, useState } from 'react';
import { getRecords, getUserPlan, initializeDB, getFeedbacks } from '../../lib/db';
import type { IntelligenceRecord } from '../../lib/db';

interface AdminUsersProps {
  onDemoReset: () => void;
}

export function AdminUsers({ onDemoReset }: AdminUsersProps) {
  const [records, setRecords]     = useState<IntelligenceRecord[]>([]);
  const [loading, setLoading]     = useState(true);
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    (async () => {
      const recs = await getRecords();
      setRecords(recs);
      
      const feedbacks = await getFeedbacks();
      setFeedbackCount(feedbacks.length);
      
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

  const activeEmail     = localStorage.getItem('rrs_active_session') ?? '—';
  const userPlan        = getUserPlan();
  const feedbackSent    = localStorage.getItem('rrio_feedback_shown') === 'true';
  const limitHit        = localStorage.getItem('rrio_limit_hit') === 'true';
  const freeLimit       = localStorage.getItem('rrio_free_limit') ?? '15';

  const lastCSVDate = records.length > 0
    ? (() => {
        const sorted = [...records].sort(
          (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
        return new Date(sorted[0].lastUpdated).toLocaleDateString('tr-TR');
      })()
    : '—';

  const handleDemoReset = () => {
    if (
      !window.confirm(
        'All demo data will be deleted and your session will be logged out. Are you sure?'
      )
    )
      return;

    const keysToRemove = [
      'rrio_revenue_records',
      'rrio_lead_captures',
      'rrio_limit_hit',
      'rrs_automation_active',
      'rrs_active_session',
      'rrio_user_plan',
      'rrs_setting_company',
      'rrs_setting_tone',
      'rrs_setting_currency',
    ];
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    initializeDB();
    onDemoReset();
  };

  const rows = [
    { label: 'Active Session Email',  value: activeEmail },
    { label: 'Current Plan',              value: userPlan },
    { label: 'Total Records Count',      value: String(records.length) },
    { label: 'Last CSV Upload',        value: lastCSVDate },
    { label: 'Sent Feedback?',    value: feedbackSent ? 'Yes' : 'No' },
    { label: 'Total Feedback Sent', value: String(feedbackCount) },
    { label: 'Free Plan Row Limit',  value: freeLimit + ' Rows' },
    { label: "Hit Limit?",      value: limitHit    ? 'Yes' : 'No' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header with reset button */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Active Session Info
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
            localStorage based — real user tracking
          </p>
        </div>
        <button
          className="btn btn-danger"
          onClick={handleDemoReset}
          style={{ minHeight: '40px', padding: '0.5rem 1.125rem', fontSize: '0.75rem' }}
        >
          🔄 Reset Demo
        </button>
      </div>

      {/* Info rows */}
      <div className="glass-panel">
        {rows.map((row, i) => (
          <div
            key={row.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
              gap: '1rem',
            }}
          >
            <span
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
              }}
            >
              {row.label}
            </span>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                textAlign: 'right',
              }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div
        style={{
          padding: '1rem 1.25rem',
          background: 'rgba(13,211,255,0.04)',
          border: '1px solid rgba(13,211,255,0.14)',
          borderRadius: 'var(--r-md)',
          fontSize: '0.75rem',
          color: 'var(--text-faint)',
          lineHeight: 1.65,
        }}
      >
        ℹ️{' '}
        <strong style={{ color: 'var(--text-muted)' }}>
          Multi-user tracking
        </strong>{' '}
        will be active with real backend integration. Currently, only data from the active browser session can be read.
        oturumundaki veriler okunabilmektedir.
      </div>
    </div>
  );
}
