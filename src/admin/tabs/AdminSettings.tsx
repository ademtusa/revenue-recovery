import { useState, useEffect } from 'react';
import { clearRecords, getRecords, initializeDB, clearLeadCaptures, clearFeedbacks } from '../../lib/db';
import type { IntelligenceRecord } from '../../lib/db';

const ADMIN_PASSWORD_KEY = 'rrio_admin_password';
const DEFAULT_PASSWORD   = 'admin2024rrio';
const FREE_LIMIT_KEY     = 'rrio_free_limit';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: '0.8125rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--border)',
        marginBottom: '1.25rem',
      }}
    >
      {children}
    </h3>
  );
}

export function AdminSettings() {
  const [records, setRecords] = useState<IntelligenceRecord[]>([]);
  const [storageKB, setStorageKB] = useState(0);

  // Section 1 — Password change
  const [currentPwd, setCurrentPwd]   = useState('');
  const [newPwd,     setNewPwd]       = useState('');
  const [confirmPwd, setConfirmPwd]   = useState('');
  const [pwdMsg,     setPwdMsg]       = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Section 2 — Free limit
  const [freeLimit, setFreeLimit] = useState<number>(() => {
    return parseInt(localStorage.getItem(FREE_LIMIT_KEY) ?? '50', 10);
  });
  const [limitSaved, setLimitSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const recs = await getRecords();
      setRecords(recs);

      // Calculate localStorage usage
      let totalChars = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) ?? '';
        totalChars += key.length + (localStorage.getItem(key)?.length ?? 0);
      }
      setStorageKB(Math.round(totalChars / 1024));
    })();
  }, []);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);

    const stored = localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD;
    if (currentPwd !== stored) {
      setPwdMsg({ type: 'error', text: 'Current password is incorrect.' });
      return;
    }
    if (newPwd.length < 6) {
      setPwdMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    localStorage.setItem(ADMIN_PASSWORD_KEY, newPwd);
    setPwdMsg({ type: 'success', text: 'Password updated successfully.' });
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
  };

  const handleSaveFreeLimit = () => {
    localStorage.setItem(FREE_LIMIT_KEY, String(freeLimit));
    setLimitSaved(true);
    setTimeout(() => setLimitSaved(false), 2000);
  };

  const handleDemoReset = () => {
    if (!window.confirm('All demo data will be deleted and you will be logged out. Are you sure?')) return;
    const keysToRemove = [
      'rrio_revenue_records', 'rrio_lead_captures', 'rrio_limit_hit',
      'rrs_automation_active', 'rrs_active_session', 'rrio_user_plan',
      'rrs_setting_company', 'rrs_setting_tone', 'rrs_setting_currency',
    ];
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    initializeDB();
    window.location.hash = '';
    window.location.reload();
  };

  const handleClearLeads = async () => {
    if (!window.confirm('All leads will be deleted. Are you sure?')) return;
    await clearLeadCaptures();
    alert('Leads cleared.');
  };

  const handleClearFeedback = async () => {
    if (!window.confirm('All feedback will be deleted. Are you sure?')) return;
    await clearFeedbacks();
    alert('Feedback cleared.');
  };

  const handleClearRecords = async () => {
    if (!window.confirm('All records will be reset (demo data will return). Are you sure?')) return;
    await clearRecords();
    const recs = await getRecords();
    setRecords(recs);
    alert('Records reset.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '640px' }}>

      {/* ── Section 1 — Admin Password ── */}
      <section>
        <SectionTitle>🔐 Admin Info</SectionTitle>
        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password (Tekrar)</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                required
              />
            </div>
          </div>

          {pwdMsg && (
            <div
              style={{
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--r-sm)',
                fontSize: '0.8rem',
                background: pwdMsg.type === 'success'
                  ? 'rgba(56,242,150,0.08)' : 'rgba(255,82,119,0.08)',
                border: `1px solid ${pwdMsg.type === 'success' ? 'rgba(56,242,150,0.22)' : 'rgba(255,82,119,0.22)'}`,
                color: pwdMsg.type === 'success' ? 'var(--status-success)' : 'var(--status-danger)',
              }}
            >
              {pwdMsg.text}
            </div>
          )}

          <div>
            <button type="submit" className="btn btn-glow-blue" style={{ minHeight: '40px', padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>
              Update Password
            </button>
          </div>
        </form>
      </section>

      {/* ── Section 2 — Demo Configuration ── */}
      <section>
        <SectionTitle>⚙️ Demo Configuration</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">FREE Plan Record Limit</label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="number"
                className="form-input"
                value={freeLimit}
                min={1}
                max={1000}
                onChange={(e) => setFreeLimit(Number(e.target.value))}
                style={{ maxWidth: '140px' }}
              />
              <button
                className="btn btn-glow-blue"
                onClick={handleSaveFreeLimit}
                style={{ minHeight: '40px', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              >
                {limitSaved ? '✓ Saved' : 'Save'}
              </button>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginTop: '0.375rem' }}>
              FREE plan users cannot upload CSV rows above this limit.
            </p>
          </div>

          <div>
            <button className="btn btn-danger" onClick={handleDemoReset} style={{ minHeight: '40px', padding: '0.5rem 1.125rem', fontSize: '0.8rem' }}>
              🔄 Reset Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── Section 3 — Data Management ── */}
      <section>
        <SectionTitle>🗄️ Data Management</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {[
            { label: "Clear All Leads",      action: handleClearLeads,   cls: 'btn btn-danger' },
            { label: "Clear All Feedback",  action: handleClearFeedback,cls: 'btn btn-danger' },
            { label: "Reset All Records",      action: handleClearRecords, cls: 'btn btn-danger' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.875rem 1rem',
                background: 'rgba(255,82,119,0.04)',
                border: '1px solid rgba(255,82,119,0.14)',
                borderRadius: 'var(--r-md)',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{item.label}</span>
              <button
                className={item.cls}
                onClick={item.action}
                style={{ minHeight: '36px', padding: '0.375rem 0.875rem', fontSize: '0.75rem' }}
              >
                Clear
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 4 — System Info ── */}
      <section>
        <SectionTitle>ℹ️ System Info</SectionTitle>
        <div className="glass-panel">
          {[
            { label: 'localStorage Usage', value: `~${storageKB} KB` },
            { label: 'Total Records Count',    value: String(records.length) },
            { label: 'Version',               value: 'RRIO RRS v1.0 — Demo' },
          ].map((row, i) => (
            <div
              key={row.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.875rem 1.25rem',
                borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                gap: '1rem',
              }}
            >
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{row.label}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
