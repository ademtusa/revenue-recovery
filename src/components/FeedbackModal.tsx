import { useState } from 'react';
import { X, MessageSquare, CheckCircle, Smile, Meh, Frown, Users, Activity, Zap, DollarSign } from 'lucide-react';
import { Button } from './Button';
import { saveFeedback } from '../lib/db';
interface FeedbackModalProps {
  onClose: () => void;
  userEmail: string;
}

export function FeedbackModal({ onClose, userEmail }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<'BUG' | 'SUGGESTION' | 'QUESTION'>('SUGGESTION');
  const [wasUseful, setWasUseful] = useState<'very' | 'somewhat' | 'not' | null>(null);
  const [mostValuable, setMostValuable] = useState<'lost_customers' | 'membership_decay' | 'opportunities' | 'revenue_estimate' | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasUseful || !mostValuable) {
      alert('Please answer all mandatory fields.');
      return;
    }

    const newResponse = {
      email: userEmail,
      timestamp: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      feedbackType, // BUG, SUGGESTION, QUESTION
      wasUseful: wasUseful === 'very' ? 'Very Useful' : wasUseful === 'somewhat' ? 'Somewhat Useful' : 'Not Useful',
      mostValuable: mostValuable === 'lost_customers' ? 'Lost Customers' 
        : mostValuable === 'membership_decay' ? 'Subscription Decay' 
        : mostValuable === 'opportunities' ? 'Abandoned Opportunities' 
        : 'Revenue Estimate',
      comment,
    };

    saveFeedback(newResponse);
    localStorage.setItem('rrio_feedback_shown', 'true');

    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 300 }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-panel animate-in" style={{ maxWidth: '500px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <MessageSquare size={18} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              Feedback & Bug Report
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: '0.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '32px', height: '32px', borderRadius: 'var(--r-xs)',
          }}>
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '3rem 2.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '68px', height: '68px', borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-success)',
              border: '1px solid rgba(16, 185, 129, 0.22)',
              marginBottom: '1.5rem',
              boxShadow: '0 0 24px rgba(16, 185, 129, 0.15)',
            }}>
              <CheckCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 850, color: 'var(--text-main)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              Thank You For Your Valuable Contribution!
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Your feedback has been successfully recorded. Your comments and bug reports have been forwarded to the admin dashboard.
            </p>
            <button className="btn btn-glow-blue" onClick={onClose} style={{ width: '100%', minHeight: '44px' }}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body" style={{ padding: '1.75rem' }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              We want to perfect your experience. Please share your feedback or any bugs you encountered with us.
            </p>

            {/* Feedback Category */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.625rem', display: 'block', fontSize: '0.8125rem', fontWeight: 700 }}>
                Feedback Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {[
                  { key: 'BUG', label: '🪲 Bug Report', color: 'var(--status-danger)', bgActive: 'rgba(239, 68, 68, 0.08)' },
                  { key: 'SUGGESTION', label: '💡 Suggestion/Idea', color: 'var(--accent-primary)', bgActive: 'rgba(13, 211, 255, 0.08)' },
                  { key: 'QUESTION', label: '❓ Question/Help', color: 'var(--status-warning)', bgActive: 'rgba(255, 126, 71, 0.08)' },
                ].map((opt) => {
                  const isActive = feedbackType === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setFeedbackType(opt.key as any)}
                      style={{
                        padding: '0.625rem 0.25rem',
                        background: isActive ? opt.bgActive : 'rgba(0,0,0,0.25)',
                        border: isActive ? `1px solid ${opt.color}` : '1px solid var(--border)',
                        borderRadius: 'var(--r-xs)',
                        color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: isActive ? 700 : 500,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 1 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.625rem', display: 'block', fontSize: '0.8125rem', fontWeight: 700 }}>
                1. How useful was the RRIO Diagnostic Report for your business? *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {[
                  { key: 'very', label: 'Very Useful', icon: <Smile size={18} />, color: 'var(--status-success)', bgActive: 'rgba(16, 185, 129, 0.08)', borderActive: 'rgba(16, 185, 129, 0.5)' },
                  { key: 'somewhat', label: 'Somewhat Useful', icon: <Meh size={18} />, color: 'var(--status-warning)', bgActive: 'rgba(255, 126, 71, 0.08)', borderActive: 'rgba(255, 126, 71, 0.5)' },
                  { key: 'not', label: 'Not Useful', icon: <Frown size={18} />, color: 'var(--status-danger)', bgActive: 'rgba(239, 68, 68, 0.08)', borderActive: 'rgba(239, 68, 68, 0.5)' },
                ].map((opt) => {
                  const isActive = wasUseful === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setWasUseful(opt.key as any)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.75rem 0.5rem',
                        background: isActive ? opt.bgActive : 'rgba(0,0,0,0.25)',
                        border: isActive ? `1px solid ${opt.borderActive}` : '1px solid var(--border)',
                        borderRadius: 'var(--r-md)',
                        color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ color: isActive ? opt.color : 'inherit' }}>{opt.icon}</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 2 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.625rem', display: 'block', fontSize: '0.8125rem', fontWeight: 700 }}>
                2. What do you think was the most valuable feature on the platform? *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {[
                  { key: 'lost_customers', label: 'Lost Customer Analysis', icon: <Users size={13} />, color: 'var(--accent-primary)', bgActive: 'rgba(13, 211, 255, 0.08)' },
                  { key: 'membership_decay', label: 'Subscription Decay', icon: <Activity size={13} />, color: 'var(--accent-primary)', bgActive: 'rgba(13, 211, 255, 0.08)' },
                  { key: 'opportunities', label: 'Pending Opportunities', icon: <Zap size={13} />, color: 'var(--neon-orange)', bgActive: 'rgba(255, 126, 71, 0.08)' },
                  { key: 'revenue_estimate', label: 'Revenue & Leakage Estimate', icon: <DollarSign size={13} />, color: 'var(--status-success)', bgActive: 'rgba(16, 185, 129, 0.08)' },
                ].map((opt) => {
                  const isActive = mostValuable === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setMostValuable(opt.key as any)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.75rem 0.5rem',
                        background: isActive ? opt.bgActive : 'rgba(0,0,0,0.25)',
                        border: isActive ? `1px solid ${opt.color}` : '1px solid var(--border)',
                        borderRadius: 'var(--r-md)',
                        color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ color: isActive ? opt.color : 'inherit', flexShrink: 0 }}>{opt.icon}</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Comment */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block', fontSize: '0.8125rem', fontWeight: 700 }}>
                Bug Details / Suggestions / Feedback
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="If you encountered a bug, you can write the steps or specify the features you want us to improve..."
                className="form-textarea"
                rows={3}
                style={{ fontSize: '0.75rem', minHeight: '80px', padding: '0.625rem 0.875rem' }}
              />
            </div>

            <Button
              type="submit"
              variant="glow-blue"
              style={{ width: '100%', minHeight: '44px', fontWeight: 700 }}
              disabled={!wasUseful || !mostValuable}
            >
              Submit 🚀
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
