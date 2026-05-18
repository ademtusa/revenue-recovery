import { useState } from 'react';
import { UploadView } from './views/UploadView';
import { LoadingEngine } from './views/LoadingEngine';
import { DiagnosisView } from './views/DiagnosisView';

type AppState = 'upload' | 'analyzing' | 'diagnosis';

function App() {
  const [appState, setAppState] = useState<AppState>('upload');

  const startDiagnosis = () => {
    setAppState('analyzing');
  };

  const showDiagnosis = () => {
    setAppState('diagnosis');
  };

  const resetState = () => {
    setAppState('upload');
  };

  return (
    <main>
      {appState === 'upload' && <UploadView onStartDiagnosis={startDiagnosis} />}
      {appState === 'analyzing' && <LoadingEngine onComplete={showDiagnosis} />}
      {appState === 'diagnosis' && <DiagnosisView onReset={resetState} />}
    </main>
  );
}

export default App;
