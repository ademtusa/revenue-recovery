import { useEffect, useState } from 'react';
import { MessageSquare, Trash2, Download, Lightbulb, HelpCircle, ShieldAlert } from 'lucide-react';

import { getFeedbacks, clearFeedbacks } from '../../lib/db';

interface FeedbackEntry {
  id?: string;
  email?: string;
  timestamp?: string;
  feedbackType?: 'BUG' | 'SUGGESTION' | 'QUESTION';
  wasUseful?: string;
  mostValuable?: string;
  comment?: string;
}

export function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>([]);
  const [filterType, setFilterType] = useState<'ALL' | 'BUG' | 'SUGGESTION' | 'QUESTION'>('ALL');

  const loadFeedbacks = async () => {
    const data = await getFeedbacks();
    setFeedbackList(data);
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete all user feedback? This action cannot be undone.')) return;
    await clearFeedbacks();
    loadFeedbacks();
  };

  const handleExportCSV = () => {
    if (feedbackList.length === 0) return;
    let csv = 'data:text/csv;charset=utf-8,Email,Date,Type,Usefulness,Most Valuable,Comment/Bug Detail\n';
    feedbackList.forEach(fb => {
      const safeComment = (fb.comment || '').replace(/"/g, '""');
      csv += `"${fb.email || ''}","${fb.timestamp || ''}","${fb.feedbackType || ''}","${fb.wasUseful || ''}","${fb.mostValuable || ''}","${safeComment}"\n`;
    });
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `rrio_feedbacks_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalCount = feedbackList.length;
  const bugCount = feedbackList.filter(f => f.feedbackType === 'BUG').length;
  const suggestionCount = feedbackList.filter(f => f.feedbackType === 'SUGGESTION').length;
  const questionCount = feedbackList.filter(f => f.feedbackType === 'QUESTION').length;

  const filteredList = feedbackList.filter(f => {
    if (filterType === 'ALL') return true;
    return f.feedbackType === filterType;
  });

  const getFeedbackTypeBadge = (type?: 'BUG' | 'SUGGESTION' | 'QUESTION') => {
    if (type === 'BUG') return { label: '🪲 Bug Report', color: 'var(--status-danger)', bg: 'rgba(239, 68, 68, 0.08)' };
    if (type === 'SUGGESTION') return { label: '💡 Suggestion/Idea', color: 'var(--accent-primary)', bg: 'rgba(13, 211, 255, 0.08)' };
    if (type === 'QUESTION') return { label: '❓ Question/Help', color: 'var(--status-warning)', bg: 'rgba(255, 126, 71, 0.08)' };
    return { label: 'Feedback', color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.03)' };
  };

  const getHelpfulnessBadge = (wasUseful?: string) => {
    if (wasUseful === 'Very Useful') return 'badge-success';
    if (wasUseful === 'Somewhat Useful') return 'badge-warning';
    return 'badge-danger';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Action Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            User Feedbacks & Bug Reports
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
            Real-time field data collected from live test users
          </p>
        </div>
        
        {totalCount > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleExportCSV}
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', minHeight: '38px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <Download size={13} /> Export CSV
            </button>
            <button
              onClick={handleClearAll}
              className="btn btn-danger"
              style={{ padding: '0.5rem 1rem', minHeight: '38px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <Trash2 size={13} /> Clear All
            </button>
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      {totalCount > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
                Total Responses
              </span>
              <MessageSquare size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem', lineHeight: 1 }}>
              {totalCount}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '3px solid var(--status-danger)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
                🪲 Bugs
              </span>
              <ShieldAlert size={16} style={{ color: 'var(--status-danger)' }} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-danger)', marginTop: '0.5rem', lineHeight: 1 }}>
              {bugCount}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '3px solid var(--accent-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
                💡 Suggestion/Feature
              </span>
              <Lightbulb size={16} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.5rem', lineHeight: 1 }}>
              {suggestionCount}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '3px solid var(--status-warning)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
                ❓ Questions
              </span>
              <HelpCircle size={16} style={{ color: 'var(--status-warning)' }} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-warning)', marginTop: '0.5rem', lineHeight: 1 }}>
              {questionCount}
            </div>
          </div>

        </div>
      )}

      {/* Filter Tabs */}
      {totalCount > 0 && (
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: 'var(--r-xs)', width: 'fit-content' }}>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'BUG', label: '🪲 Bugs' },
            { id: 'SUGGESTION', label: '💡 Suggestions' },
            { id: 'QUESTION', label: '❓ Questions' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`tone-btn ${filterType === tab.id ? 'active' : ''}`}
              style={{ padding: '0.375rem 0.875rem', fontSize: '0.72rem' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Feedback List */}
      {filteredList.length === 0 ? (
        <div
          className="glass-panel"
          style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-faint)', fontSize: '0.875rem' }}
        >
          {totalCount === 0 ? 'There is no feedback from test users yet.' : 'There are no records in this filter type.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {filteredList.map((fb, i) => {
            const typeInfo = getFeedbackTypeBadge(fb.feedbackType);
            return (
              <div
                key={i}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderLeft: `3px solid ${typeInfo.color}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {fb.email || 'example-tester@company.com'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '0.15rem' }}>
                      🕒 {fb.timestamp || 'Unknown Date'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.625rem',
                        background: typeInfo.bg,
                        color: typeInfo.color,
                        borderRadius: 'var(--r-xs)',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        border: `1px solid rgba(${typeInfo.color === 'var(--status-danger)' ? '239,68,68' : typeInfo.color === 'var(--status-warning)' ? '255,126,71' : '13,211,255'}, 0.2)`,
                      }}
                    >
                      {typeInfo.label}
                    </span>
                    <span className={`badge ${getHelpfulnessBadge(fb.wasUseful)}`} style={{ fontSize: '0.68rem' }}>
                      {fb.wasUseful || 'N/A'}
                    </span>
                    <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                      ⭐ Most Valuable: {fb.mostValuable || 'N/A'}
                    </span>
                  </div>
                </div>

                {fb.comment && (
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.65,
                      borderLeft: `2px dashed rgba(255,255,255,0.08)`,
                      paddingLeft: '1rem',
                      margin: 0,
                      background: 'rgba(0,0,0,0.15)',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--r-xs)',
                    }}
                  >
                    "{fb.comment}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
