import { useState } from 'react';
import { UploadView } from './views/UploadView';
import { LoadingEngine } from './views/LoadingEngine';
import { DiagnosisView } from './views/DiagnosisView';
import { AuthView } from './views/AuthView';
import { PipelineView } from './views/PipelineView';
import { initializeDB } from './lib/db';

type AppState = 'upload' | 'analyzing' | 'diagnosis' | 'pipeline';

function App() {
  const [appState, setAppState] = useState<AppState>('upload');
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
        />
      )}
      {appState === 'pipeline' && (
        <PipelineView
          onNavigateDiagnosis={showDiagnosis}
          onReset={resetState}
          userEmail={userEmail}
          onLogout={handleLogout}
        />
      )}
    </main>
  );
}

export default App;
