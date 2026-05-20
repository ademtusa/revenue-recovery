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
    // Initialize mock DB on startup
    initializeDB();

    // Check active session
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
      <div className="min-h-screen flex justify-center items-center bg-[#050814]">
        <div className="w-10 h-10 border-4 border-zinc-900 border-t-blue-500 rounded-full animate-spin"></div>
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
