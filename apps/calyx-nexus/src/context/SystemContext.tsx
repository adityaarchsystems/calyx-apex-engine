'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type SystemHealth = 'OPTIMAL' | 'STRESSED' | 'LOCKED' | 'SCANNING';

interface SystemState {
  isStressTestActive: boolean;
  isLockdownActive: boolean;
  isDiagnosticsActive: boolean;
  systemHealth: SystemHealth;
  toggleStressTest: () => void;
  toggleLockdown: () => void;
  runDiagnostics: () => void;
}

const SystemContext = createContext<SystemState | undefined>(undefined);

export function SystemProvider({ children }: { children: ReactNode }) {
  const [isStressTestActive, setIsStressTestActive] = useState(false);
  const [isLockdownActive, setIsLockdownActive] = useState(false);
  const [isDiagnosticsRunning, setIsDiagnosticsRunning] = useState(false);

  const systemHealth: SystemHealth = isDiagnosticsRunning
    ? 'SCANNING'
    : isLockdownActive 
      ? 'LOCKED' 
      : isStressTestActive 
        ? 'STRESSED' 
        : 'OPTIMAL';

  const toggleStressTest = () => setIsStressTestActive(prev => !prev);
  const toggleLockdown = () => setIsLockdownActive(prev => !prev);
  
  const runDiagnostics = () => {
    setIsDiagnosticsRunning(true);
    setTimeout(() => setIsDiagnosticsRunning(false), 3000);
  };

  // Propagation Layer: Inject state into DOM for CSS-level reactions
  useEffect(() => {
    const root = document.documentElement;
    if (isStressTestActive) root.classList.add('system-stress');
    else root.classList.remove('system-stress');

    if (isLockdownActive) root.classList.add('system-lockdown');
    else root.classList.remove('system-lockdown');

    if (isDiagnosticsRunning) root.classList.add('system-diag');
    else root.classList.remove('system-diag');
  }, [isStressTestActive, isLockdownActive, isDiagnosticsRunning]);

  return (
    <SystemContext.Provider value={{ 
      isStressTestActive, 
      isLockdownActive, 
      isDiagnosticsActive: isDiagnosticsRunning,
      systemHealth, 
      toggleStressTest, 
      toggleLockdown,
      runDiagnostics
    }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
}
