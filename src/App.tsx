import { useState, useEffect } from 'react';
import { UploadView } from './views/UploadView';
import { LoadingEngine } from './views/LoadingEngine';
import { DiagnosisView } from './views/DiagnosisView';
import { AuthView } from './views/AuthView';
import { PipelineView } from './views/PipelineView';
import { initializeDB } from './lib/db';
import { FeedbackModal } from './components/FeedbackModal';

type AppState = 'upload' | 'analyzing' | 'diagnosis' | 'pipeline';

function App() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [showFeedback, setShowFeedback] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    initializeDB();
    return localStorage.getItem('rrs_active_session');
  });


  const handleAuthSuccess = (email: string) => {
    localStorage.setItem('rrs_active_session', email);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('rrs_active_session');
    setUserEmail(null);
    setAppState('upload');
  };

  const handleDemoReset = () => {
    if (!window.confirm('Tüm demo verisi silinecek ve oturumunuz kapatılacak. Emin misiniz?')) return;

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
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    initializeDB();
    setUserEmail(null);
    setAppState('upload');
  };

  const startDiagnosis = () => {
    setAppState('analyzing');
  };

  const showDiagnosis = () => {
    setAppState('diagnosis');
  };

  const showPipeline = () => {
    setAppState('pipeline');
  };

  const resetState = () => {
    setAppState('upload');
  };

  useEffect(() => {
    if (appState !== 'diagnosis') return;
    const shown = localStorage.getItem('rrio_feedback_shown');
    if (shown) return;

    const timer = setTimeout(() => {
      setShowFeedback(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, [appState]);

  const handleCloseFeedback = () => {
    localStorage.setItem('rrio_feedback_shown', 'true');
    setShowFeedback(false);
  };

  if (!userEmail) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <main>
      {appState === 'upload' && (
        <UploadView
          onStartDiagnosis={startDiagnosis}
          userEmail={userEmail}
          onLogout={handleLogout}
        />
      )}
      {appState === 'analyzing' && <LoadingEngine onComplete={showDiagnosis} />}
      {appState === 'diagnosis' && (
        <DiagnosisView
          onReset={resetState}
          userEmail={userEmail}
          onLogout={handleLogout}
          onNavigatePipeline={showPipeline}
          onDemoReset={handleDemoReset}
        />
      )}
      {appState === 'pipeline' && (
        <PipelineView
          onNavigateDiagnosis={showDiagnosis}
          onReset={resetState}
          userEmail={userEmail}
          onLogout={handleLogout}
          onDemoReset={handleDemoReset}
        />
      )}

      {/* Floating Feedback Button */}
      <button
        onClick={() => setShowFeedback(true)}
        className="btn btn-glow-blue"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 150,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.625rem 1.125rem',
          borderRadius: 'var(--r-full)',
          fontSize: '0.8125rem',
          fontWeight: 700,
          opacity: 0.9,
          boxShadow: '0 0 20px rgba(13,211,255,0.25)',
          minHeight: '40px',
        }}
      >
        💬 Geri Bildirim
      </button>

      {/* Feedback Modal */}
      {showFeedback && (
        <FeedbackModal
          onClose={handleCloseFeedback}
          userEmail={userEmail}
        />
      )}
    </main>
  );
}

export default App;
