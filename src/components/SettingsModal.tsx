import { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, ArrowRight, Settings, CreditCard, Heart, Save, Shield } from 'lucide-react';
import { Button } from './Button';
import { getUserPlan } from '../lib/db';
import type { PlanType } from '../lib/db';
import { auth } from '../lib/firebase';
import { updatePassword } from 'firebase/auth';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'subscription' | 'cancel' | 'security'>('general');
  const [cancelStep, setCancelStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState('');
  const [companyName, setCompanyName] = useState(() => localStorage.getItem('rrs_setting_company') || 'RRIO');
  const [replyTone, setReplyTone] = useState(() => localStorage.getItem('rrs_setting_tone') || 'formal');
  const [selectedCurrency, setSelectedCurrency] = useState(() => localStorage.getItem('rrs_setting_currency') || 'USD');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');

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
    key: 'general' | 'subscription' | 'security' | 'cancel';
    icon: React.ReactNode;
    label: string;
    danger?: boolean;
  }> = [
    { key: 'general', icon: <Settings size={15} />, label: 'General Settings' },
    { key: 'subscription', icon: <CreditCard size={15} />, label: 'Subscription' },
    { key: 'security', icon: <Shield size={15} />, label: 'Security' },
    { key: 'cancel', icon: <AlertTriangle size={15} />, label: 'Cancel & Refund', danger: true },
  ];

  const renderGeneral = () => (
    <div className="stack-md animate-in">
      <div>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.375rem' }}>
          General System Settings
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Customize platform-wide defaults and AI studio tone.
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">Company Name</label>
        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
          className="form-input" />
      </div>

      <div className="form-group">
        <label className="form-label">Default Communication Tone</label>
        <select value={replyTone} onChange={(e) => setReplyTone(e.target.value)} className="form-select">
          <option value="formal">Corporate & Serious (Default)</option>
          <option value="friendly">Friendly & Warm</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Currency</label>
          <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)} className="form-select">
            <option value="USD">Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="TRY">Turkish Lira (₺)</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Working Principle</label>
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
            Recovery Alerts
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Get notified on critical leakage detections
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
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button variant="glow-blue" onClick={handleSaveSettings}>
          <Save size={14} /> {isSaved ? '✓ Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus('');
    if (!auth.currentUser) {
      setPasswordStatus('Error: You are not logged in as Admin.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus('Error: Password must be at least 6 characters.');
      return;
    }
    try {
      await updatePassword(auth.currentUser, newPassword);
      setPasswordStatus('Success: Password updated securely!');
      setNewPassword('');
    } catch (err: any) {
      console.error(err);
      setPasswordStatus('Error: ' + err.message);
    }
  };

  const renderSecurity = () => (
    <div className="stack-md animate-in">
      <div>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.375rem' }}>
          Security & Admin Credentials
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Update your Admin password here. Ensure you choose a strong password.
        </p>
      </div>

      <form onSubmit={handlePasswordChange} className="stack-md" style={{
        background: 'rgba(5,6,15,0.5)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-sm)', padding: '1.5rem',
      }}>
        {passwordStatus && (
          <div style={{
            padding: '0.75rem 1rem', marginBottom: '1rem',
            borderRadius: 'var(--r-sm)',
            background: passwordStatus.startsWith('Success') ? 'rgba(56,242,150,0.08)' : 'rgba(255,82,119,0.08)',
            border: `1px solid ${passwordStatus.startsWith('Success') ? 'rgba(56,242,150,0.22)' : 'rgba(255,82,119,0.22)'}`,
            color: passwordStatus.startsWith('Success') ? 'var(--status-success)' : 'var(--status-danger)',
            fontSize: '0.8125rem', fontWeight: 500,
          }}>
            {passwordStatus}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">New Password</label>
          <input 
            type="password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-input" 
            placeholder="Minimum 6 characters"
          />
        </div>

        <Button variant="glow-blue" type="submit" style={{ width: '100%' }}>
          <Shield size={14} style={{ marginRight: '0.5rem' }} /> Update Password
        </Button>
      </form>
    </div>
  );

  const renderSubscription = () => {
    const currentPlan: PlanType = getUserPlan();

    const getPlanDisplay = (plan: PlanType) => {
      if (plan === 'PRO') return { name: 'Pro Plan', desc: '$97/Mo · Unlimited analysis' };
      if (plan === 'AGENCY') return { name: 'Agency Plan', desc: '$197/Mo · Multiple accounts' };
      return { name: 'Free Plan', desc: 'Limited analysis capacity' };
    };

    const planDisplay = getPlanDisplay(currentPlan);

    const plans = [
      { name: 'Pro Plan', desc: 'Unlimited Companies, AI Reply Studio, PDF Reporting', price: '$97 / Mo', planKey: 'PRO' as PlanType },
      { name: 'Agency Plan', desc: 'Private Database, Integration API, Dedicated VPS', price: '$197 / Mo', planKey: 'AGENCY' as PlanType },
      { name: 'Enterprise VPS', desc: 'Dedicated Server, Unlimited Integrations, 24/7 Support', price: 'Contact Us', planKey: null },
    ];

    return (
      <div className="stack-md animate-in">
        <div>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.375rem' }}>
            Subscription & Limits
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            View your active package and explore other plans.
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
            <span className="badge badge-success">Active</span>
          </div>
          <span style={{
            display: 'block', fontSize: '0.65rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-primary)',
            marginBottom: '0.375rem',
          }}>
            Current Plan
          </span>
          <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            {planDisplay.name}
          </span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {planDisplay.desc} &nbsp;·&nbsp;
            <span style={{ color: 'var(--status-warning)', fontStyle: 'italic' }}>
              (Payment is not active in Demo environment)
            </span>
          </span>
        </div>

        {/* Plan list */}
        <div className="stack-xs">
          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
            All Packages
          </span>

          {plans.map((plan) => {
            const isActive = plan.planKey === currentPlan;
            return (
              <div key={plan.name} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.875rem 1rem',
                background: isActive ? 'rgba(13,211,255,0.04)' : 'rgba(5,6,15,0.5)',
                border: `1px solid ${isActive ? 'rgba(13,211,255,0.18)' : 'var(--border)'}`,
                borderRadius: 'var(--r-sm)',
                gap: '1rem',
              }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                    {plan.name} {isActive && <span className="badge badge-primary" style={{ fontSize: '0.6rem', marginLeft: '0.375rem' }}>Active</span>}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{plan.desc}</div>
                </div>
                <div style={{
                  fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-main)',
                }}>
                  {plan.price}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  };

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
          Cancel Subscription & Request Refund
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
          We are sad to see you go. Please share your reason for leaving so we can improve our service.
        </p>
      </div>

      <div className="stack-xs">
        {["Price is too high", "Didn't get the desired result", "Found the system complicated", "Just wanted to try it out"].map((reason) => (
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
        <Button variant="outline" style={{ flex: 1 }} onClick={onClose}>Cancel</Button>
        <Button variant="glow-orange" style={{ flex: 1 }} disabled={!selectedReason} onClick={() => setCancelStep(2)}>
          Continue <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );

  const renderCancelStep2 = () => (
    <div className="stack-md animate-in">
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          Maybe you'll change your mind?
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Instead of canceling your subscription, we have a special offer for you.
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
          2 Months Free Pro Membership
        </h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
          Stop the cancellation process and use the system for another 2 months for free. No card fee will be charged.
        </p>
        <Button variant="glow-green" style={{ width: '100%' }} onClick={onClose}>
          Accept Offer & Continue
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
          No, continue with cancellation and refund <ArrowRight size={13} />
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
        Cancellation and Refund Request Received
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '360px', margin: '0 auto' }}>
        Your refund request has been processed. Depending on your bank's processes, the refund will be reflected on your card within 3-5 business days.
      </p>
      <Button variant="outline" style={{ width: '100%', marginTop: '0.5rem' }} onClick={onClose}>
        Return to Dashboard
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
                Account & Settings
              </h2>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginTop: '0.1rem' }}>
                Manage your system preferences
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
          {activeTab === 'security' && renderSecurity()}
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
