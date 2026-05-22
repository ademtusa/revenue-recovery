import { useState, useEffect } from 'react';
import { UploadView } from './views/UploadView';
import { LoadingEngine } from './views/LoadingEngine';
import { DiagnosisView } from './views/DiagnosisView';
import { AuthView } from './views/AuthView';
import { initializeDB } from './lib/db';

type AppState = 'upload' | 'analyzing' | 'diagnosis';

function App() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    initializeDB();
    const session = localStorage.getItem('rrs_active_session');
    if (session) {
      setUserEmail(session);
    }
    setCheckingSession(false);
  }, []);

  const handleAuthSuccess = (email: string) => {
    localStorage.setItem('rrs_active_session', email);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('rrs_active_session');
    setUserEmail(null);
    setAppState('upload');
  };

  const startDiagnosis = () => {
    setAppState('analyzing');
  };

  const showDiagnosis = () => {
    setAppState('diagnosis');
  };

  const resetState = () => {
    setAppState('upload');
  };

  if (checkingSession) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

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
        />
      )}
    </main>
  );
}

export default App;
