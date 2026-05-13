import React, { useState } from 'react';
import LoginPage     from './pages/LoginPage';
import Dashboard     from './pages/Dashboard';
import MRIPage       from './pages/MRIPage';
import XrayPage      from './pages/XrayPage';

function App() {
  const [isLoggedIn,  setIsLoggedIn]  = useState(false);
  const [currentMode, setCurrentMode] = useState(null); // null | 'MRI' | 'XRAY'

  if (!isLoggedIn)        return <LoginPage  onLoginSuccess={() => setIsLoggedIn(true)} />;
  if (currentMode === 'MRI')  return <MRIPage   onBack={() => setCurrentMode(null)} />;
  if (currentMode === 'XRAY') return <XrayPage  onBack={() => setCurrentMode(null)} />;

  return (
    <Dashboard
      onModeSelect={(mode) => setCurrentMode(mode)}
      onLogout={() => { setIsLoggedIn(false); setCurrentMode(null); }}
    />
  );
}

export default App;
