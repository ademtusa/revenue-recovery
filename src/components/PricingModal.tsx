import { useState } from 'react';
import { Check, X, Zap, AlertTriangle, CreditCard, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { setUserPlan } from '../lib/db';
import type { PlanType } from '../lib/db';

interface PricingModalProps {
  onClose: () => void;
  onPlanUpdated: () => void;
}

export function PricingModal({ onClose, onPlanUpdated }: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const handleSelectPlan = (plan: PlanType) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handleDemoFill = () => {
    setCardName('John Doe');
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('123');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setPaymentStatus('processing');

    // Simulate Stripe payment gateway latency
    setTimeout(() => {
      setUserPlan(selectedPlan);
      localStorage.removeItem('rrio_limit_hit');
      setPaymentStatus('success');

      setTimeout(() => {
        onPlanUpdated();
        onClose();
      }, 1500);
    }, 1800);
  };

  const getPlanPrice = (plan: PlanType) => {
    if (plan === 'PRO') return billingPeriod === 'monthly' ? 49 : 39;
    if (plan === 'AGENCY') return billingPeriod === 'monthly' ? 149 : 119;
    return 0;
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget && paymentStatus !== 'processing') onClose(); }} style={{ zIndex: 300 }}>
      <div className="modal-panel animate-in" style={{ maxWidth: showCheckout ? '500px' : '840px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>

        {/* Header */}
        <div className="modal-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'rgba(13,211,255,0.1)', color: 'var(--accent-primary)', flexShrink: 0,
            }}>
              <Zap size={20} className="animate-pulse-slow" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                {showCheckout ? 'Secure Checkout Payment' : 'Upgrade Your SaaS Plan'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.125rem' }}>
                {showCheckout ? "Stripe Secure Sandbox Checkout" : "Stop your business's revenue leaks instantly."}
              </p>
            </div>
          </div>
          {paymentStatus !== 'processing' && (
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', cursor: 'pointer',
              color: 'var(--text-muted)', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px', borderRadius: 'var(--r-sm)',
              transition: 'all 0.15s ease', flexShrink: 0,
            }}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Demo Warning Banner */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
          padding: '0.75rem 1.5rem',
          background: 'rgba(13,211,255,0.05)',
          borderBottom: '1px solid rgba(13,211,255,0.15)',
        }}>
          <AlertTriangle size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '1px' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
            <strong>Demo Sandbox:</strong> This checkout screen is a simulation. No real charge will be made. For experience purposes only.
          </p>
        </div>

        {/* Content Body */}
        <div className="modal-body" style={{ padding: '1.75rem' }}>
          
          {!showCheckout ? (
            /* --- PRICING PAGE VIEW --- */
            <div>
              {/* Billing Cycle Switcher */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  padding: '0.25rem',
                  display: 'flex',
                  gap: '0.25rem',
                }}>
                  <button
                    className={`tone-btn ${billingPeriod === 'monthly' ? 'active' : ''}`}
                    onClick={() => setBillingPeriod('monthly')}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                  >
                    Monthly Billing
                  </button>
                  <button
                    className={`tone-btn ${billingPeriod === 'annual' ? 'active' : ''}`}
                    onClick={() => setBillingPeriod('annual')}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                  >
                    Annual Billing <span style={{ color: 'var(--status-success)', fontSize: '0.65rem', fontWeight: 800 }}>SAVE 20%</span>
                  </button>
                </div>
              </div>

              <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                
                {/* Free Plan */}
                <div style={{
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-lg)',
                  padding: '2rem',
                  display: 'flex', flexDirection: 'column',
                  opacity: 0.7,
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Starter — Free
                  </h3>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-muted)' }}>$0</span>
                    <span style={{ color: 'var(--text-faint)', fontSize: '0.8125rem' }}>/mo</span>
                    <p style={{ color: 'var(--text-faint)', fontSize: '0.8125rem', margin: '0.25rem 0 0 0' }}>Forever free</p>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                    {[
                      { text: 'Monthly 25 record analysis', active: true },
                      { text: '3 category diagnosis', active: true },
                      { text: 'Basic dashboard', active: true },
                      { text: 'PDF report (1 / month)', active: true },
                      { text: 'Pipeline / Kanban', active: false },
                      { text: 'Email/WhatsApp actions', active: false },
                      { text: 'Admin & team access', active: false },
                    ].map((feat, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: feat.active ? 'var(--text-muted)' : 'var(--text-faint)', opacity: feat.active ? 1 : 0.5 }}>
                        {feat.active ? <Check size={16} style={{ color: 'var(--status-success)', flexShrink: 0 }} /> : <span style={{ width: '16px', display: 'inline-block', textAlign: 'center' }}>—</span>}
                        <span style={{ textDecoration: feat.active ? 'none' : 'line-through' }}>{feat.text}</span>
                      </li>
                    ))}
                  </ul>

                  <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    Nurtures leads, builds trust. FREE → Essential for measuring Pro conversion rate.
                  </p>

                  <button className="btn btn-outline" disabled style={{ width: '100%', minHeight: '40px', cursor: 'not-allowed' }}>
                    Current Plan
                  </button>
                </div>

                {/* Pro Plan */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-hover)',
                  borderRadius: 'var(--r-lg)',
                  padding: '2rem',
                  display: 'flex', flexDirection: 'column',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)',
                    background: '#6366f1', color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                    padding: '0.25rem 0.875rem', borderRadius: '99px',
                    display: 'flex', alignItems: 'center', gap: '0.25rem'
                  }}>
                    ⭐ Most Popular
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Pro
                  </h3>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>${getPlanPrice('PRO')}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>/mo</span>
                    <p style={{ color: 'var(--status-success)', fontSize: '0.8125rem', margin: '0.25rem 0 0 0' }}>Annual payment $47/mo · 2 months free</p>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                    {[
                      { text: 'Unlimited record analysis', active: true },
                      { text: 'Full pipeline / Kanban', active: true },
                      { text: 'Email + WhatsApp actions', active: true },
                      { text: 'PDF Executive report', active: true },
                      { text: 'Priority & reliability scoring', active: true },
                      { text: 'Demo Reset + FeedbackModal', active: true },
                      { text: 'Multi-user / team', active: false },
                      { text: 'White-label & API', active: false },
                    ].map((feat, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: feat.active ? 'var(--text-main)' : 'var(--text-faint)', opacity: feat.active ? 1 : 0.5 }}>
                        {feat.active ? <Check size={16} style={{ color: 'var(--status-success)', flexShrink: 0 }} /> : <span style={{ width: '16px', display: 'inline-block', textAlign: 'center' }}>—</span>}
                        <span style={{ textDecoration: feat.active ? 'none' : 'line-through' }}>{feat.text}</span>
                      </li>
                    ))}
                  </ul>

                  <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--accent-primary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    Target buyer: solo founder, sales director, agency owner. 1 rescued customer = pays the bill.
                  </p>

                  <button
                    className="btn btn-glow-orange"
                    style={{ width: '100%', minHeight: '44px', fontWeight: 700 }}
                    onClick={() => handleSelectPlan('PRO')}
                  >
                    Upgrade to Pro <ArrowRight size={14} style={{ marginLeft: '0.25rem' }} />
                  </button>
                </div>

                {/* Agency Plan */}
                <div style={{
                  background: 'linear-gradient(180deg, rgba(13,211,255,0.06) 0%, rgba(13,211,255,0) 100%)',
                  border: '1px solid var(--accent-primary)',
                  borderRadius: 'var(--r-lg)',
                  padding: '2rem',
                  display: 'flex', flexDirection: 'column',
                  boxShadow: '0 8px 32px rgba(13,211,255,0.06)',
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Agency / Team
                  </h3>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>${getPlanPrice('AGENCY')}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>/mo</span>
                    <p style={{ color: 'var(--status-success)', fontSize: '0.8125rem', margin: '0.25rem 0 0 0' }}>Annual payment $119/mo · 2 months free</p>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                    {[
                      { text: 'Everything in Pro', active: true },
                      { text: '5 users / team members', active: true },
                      { text: 'Multiple client accounts', active: true },
                      { text: 'White-label report logo', active: true },
                      { text: 'Priority support (24h)', active: true },
                      { text: 'Custom onboarding call', active: true },
                      { text: 'API access (beta)', active: true },
                    ].map((feat, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                        <Check size={16} style={{ color: 'var(--status-success)', flexShrink: 0 }} />
                        <span>{feat.text}</span>
                      </li>
                    ))}
                  </ul>

                  <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--accent-primary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    For digital agencies and sales teams. Current $197 price is too high — $149 converts better.
                  </p>

                  <button
                    className="btn btn-glow-blue"
                    style={{ width: '100%', minHeight: '44px', fontWeight: 700 }}
                    onClick={() => handleSelectPlan('AGENCY')}
                  >
                    Upgrade to Agency <ArrowRight size={14} style={{ marginLeft: '0.25rem' }} />
                  </button>
                </div>

              </div>
            </div>
          ) : (
            /* --- SIMULATED STRIKE CHECKOUT VIEW --- */
            <div className="animate-in">
              {paymentStatus === 'success' ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: 'rgba(56,242,150,0.1)', color: 'var(--status-success)',
                    border: '1px solid rgba(56,242,150,0.25)', marginBottom: '1.5rem',
                    boxShadow: '0 0 24px rgba(56,242,150,0.2)',
                  }}>
                    <Check size={36} className="animate-bounce" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                    Payment Successfully Completed!
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    Your SaaS License was created instantly. <strong style={{ color: 'var(--accent-primary)' }}>{selectedPlan} Plan</strong> features have been unlocked!
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                    <Sparkles size={14} style={{ color: 'var(--neon-orange)' }} /> Page is refreshing and locks are being removed...
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePaymentSubmit} className="stack-md">
                  {/* Selected Plan Info Card */}
                  <div style={{
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-md)',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-faint)', display: 'block', marginBottom: '0.2rem' }}>
                        Selected Plan
                      </span>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>
                        {selectedPlan === 'PRO' ? '💎 Pro Version' : '🚀 Agency Version'}
                      </strong>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.375rem', fontWeight: 800, color: selectedPlan === 'PRO' ? 'var(--neon-orange)' : 'var(--accent-primary)' }}>
                        ${getPlanPrice(selectedPlan!)}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ay</span>
                    </div>
                  </div>

                  {/* Credit Card Input Form */}
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <CreditCard size={12} /> Cardholder Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                      className="form-input"
                      style={{ minHeight: '40px' }}
                      disabled={paymentStatus === 'processing'}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <CreditCard size={12} /> Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        val = val.substring(0, 16);
                        const parts = [];
                        for (let i = 0; i < val.length; i += 4) {
                          parts.push(val.substring(i, i + 4));
                        }
                        setCardNumber(parts.join(' '));
                      }}
                      placeholder="4242 4242 4242 4242"
                      className="form-input"
                      style={{ minHeight: '40px' }}
                      disabled={paymentStatus === 'processing'}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Expiration (MM/YY)</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) {
                            val = val.substring(0, 2) + '/' + val.substring(2, 4);
                          }
                          setCardExpiry(val.substring(0, 5));
                        }}
                        placeholder="12/28"
                        className="form-input"
                        style={{ minHeight: '40px' }}
                        disabled={paymentStatus === 'processing'}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Security Code (CVC)</label>
                      <input
                        type="password"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 3))}
                        placeholder="123"
                        className="form-input"
                        style={{ minHeight: '40px' }}
                        disabled={paymentStatus === 'processing'}
                      />
                    </div>
                  </div>

                  {/* Security trust badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-faint)', marginTop: '0.5rem' }}>
                    <Lock size={12} /> SSL 256-bit Secure Stripe Sandbox Connection
                  </div>

                  {/* Quick autofill helper */}
                  <button
                    type="button"
                    onClick={handleDemoFill}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 600,
                      textDecoration: 'underline', alignSelf: 'center', marginTop: '0.5rem',
                    }}
                    disabled={paymentStatus === 'processing'}
                  >
                    ⚡ Auto-fill Demo Card Details
                  </button>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    {paymentStatus !== 'processing' && (
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ flex: 1, minHeight: '44px' }}
                        onClick={() => setShowCheckout(false)}
                      >
                        Back
                      </button>
                    )}
                    <button
                      type="submit"
                      className="btn btn-glow-green"
                      style={{ flex: 2, minHeight: '44px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      disabled={paymentStatus === 'processing' || !cardName || cardNumber.length < 19}
                    >
                      {paymentStatus === 'processing' ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Make Secure Payment
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
