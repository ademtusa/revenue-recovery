import { useState } from 'react';
import { Cpu } from 'lucide-react';
import { AdminOverview } from './tabs/AdminOverview';
import { AdminUsers } from './tabs/AdminUsers';
import { AdminLeads } from './tabs/AdminLeads';
import { AdminFeedback } from './tabs/AdminFeedback';
import { AdminAnalytics } from './tabs/AdminAnalytics';
import { AdminSettings } from './tabs/AdminSettings';

type AdminTab = 'overview' | 'users' | 'leads' | 'feedback' | 'analytics' | 'settings';

interface AdminPanelProps {
  onExit: () => void;
}

const NAV_ITEMS: { id: AdminTab; icon: string; label: string }[] = [
  { id: 'overview', icon: '📊', label: 'Overview' },
  { id: 'users', icon: '👥', label: 'Users' },
  { id: 'leads', icon: '🎯', label: "Leads" },
  { id: 'feedback', icon: '💬', label: 'Feedback' },
  { id: 'analytics', icon: '📈', label: 'Analytics' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

export function AdminPanel({ onExit }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const handleExit = () => {
    window.location.hash = '';
    onExit();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':   return <AdminOverview />;
      case 'users':      return <AdminUsers onDemoReset={handleExit} />;
      case 'leads':      return <AdminLeads />;
      case 'feedback':   return <AdminFeedback />;
      case 'analytics':  return <AdminAnalytics />;
      case 'settings':   return <AdminSettings />;
      default:           return <AdminOverview />;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--bg)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        style={{
          width: '220px',
          flexShrink: 0,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {/* Sidebar Brand */}
        <div
          style={{
            padding: '1.25rem 1rem 1rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(13,211,255,0.1)',
              border: '1px solid rgba(13,211,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              flexShrink: 0,
            }}
          >
            <Cpu size={16} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: 'var(--text-main)',
              }}
            >
              RRIO Admin
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-faint)' }}>
              Control Panel
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '0.75rem 0' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: isActive ? 'rgba(13,211,255,0.06)' : 'transparent',
                  border: 'none',
                  borderLeft: isActive
                    ? '3px solid var(--accent-primary)'
                    : '3px solid transparent',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                  textAlign: 'left',
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Exit button */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleExit}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.625rem 0.75rem',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-sm)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-faint)',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-hover)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-faint)';
            }}
          >
            ← Back to Demo
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          background: 'var(--bg)',
          minHeight: '100vh',
        }}
      >
        {/* Content Header */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: 'rgba(5,5,8,0.92)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border)',
            padding: '0 1.75rem',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            {NAV_ITEMS.find((n) => n.id === activeTab)?.icon}{' '}
            {NAV_ITEMS.find((n) => n.id === activeTab)?.label}
          </h2>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '1.75rem' }}>{renderContent()}</div>
      </main>
    </div>
  );
}
