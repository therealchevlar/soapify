/**
 * @file AppContext.tsx
 * @description Master application state managing navigation, URL routes (/soap/:dna),
 * formulation preferences, display mode (Web vs Machine Mode), and guided FYP presentation flow.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BatchManager } from '../services/batches/batchManager';
import { FormulationEngine } from '../services/formulation/engine';
import { CleanserBatch } from '../types/batch';
import { FormulationPreferences, MachineFormula } from '../types/formulation';
import { useMachine } from './MachineContext';

export type AppView =
  | 'landing'
  | 'creator'
  | 'batch-launch'
  | 'machine-dashboard'
  | 'batch-history'
  | 'soap-dna'
  | 'soap-dna-public'
  | 'hardware';

export type DisplayMode = 'WEB' | 'MACHINE';
export type ThemeMode = 'light' | 'dark';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  preferences: FormulationPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<FormulationPreferences>>;
  activeFormula: MachineFormula;
  updatePreferences: (updates: Partial<FormulationPreferences>) => void;
  activeBatch: CleanserBatch | null;
  setActiveBatch: (batch: CleanserBatch | null) => void;
  selectedDnaBatch: CleanserBatch | null;
  inspectBatchDna: (batchId: string) => void;
  recreateFormula: (formula: MachineFormula) => void;
  publicSoapDna: string | null;
  openPublicSoapDna: (dnaCode: string) => void;
  isDemoActive: boolean;
  demoStep: number;
  startDemo: () => void;
  stopDemo: () => void;
  nextDemoStep: () => void;
  feedbackModalBatchId: string | null;
  setFeedbackModalBatchId: (batchId: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentViewState] = useState<AppView>('landing');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('WEB');
  const [publicSoapDna, setPublicSoapDna] = useState<string | null>(null);

  // Theme Management (Light by default, persistent)
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('soapify-theme') as ThemeMode | null;
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('soapify-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const [preferences, setPreferences] = useState<FormulationPreferences>(() =>
    FormulationEngine.getDefaultPreferences()
  );
  const [activeFormula, setActiveFormula] = useState<MachineFormula>(() =>
    FormulationEngine.calculate(FormulationEngine.getDefaultPreferences())
  );
  const [activeBatch, setActiveBatch] = useState<CleanserBatch | null>(null);
  const [selectedDnaBatch, setSelectedDnaBatch] = useState<CleanserBatch | null>(null);
  const [feedbackModalBatchId, setFeedbackModalBatchId] = useState<string | null>(null);

  // Guided FYP presentation mode state
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);

  const { status, startBatch: machineStartBatch } = useMachine();

  // Route URL listener for /soap/:dnaCode or ?soap=... or #soap-...
  useEffect(() => {
    const handleUrlRoute = () => {
      if (typeof window === 'undefined') return;

      const path = window.location.pathname;
      const search = new URLSearchParams(window.location.search);
      const hash = window.location.hash;

      if (path.startsWith('/soap/')) {
        const dna = path.replace('/soap/', '').trim();
        if (dna) {
          setPublicSoapDna(dna);
          setCurrentViewState('soap-dna-public');
          return;
        }
      }

      const qSoap = search.get('soap');
      if (qSoap) {
        setPublicSoapDna(qSoap.trim());
        setCurrentViewState('soap-dna-public');
        return;
      }

      if (hash.startsWith('#soap-')) {
        const dna = hash.replace('#soap-', '').trim();
        if (dna) {
          setPublicSoapDna(dna);
          setCurrentViewState('soap-dna-public');
          return;
        }
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  const setCurrentView = (view: AppView) => {
    setCurrentViewState(view);
    if (view !== 'soap-dna-public' && typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/soap/')) {
        window.history.pushState(null, '', '/');
      }
    }
  };

  const openPublicSoapDna = (dnaCode: string) => {
    setPublicSoapDna(dnaCode);
    setCurrentViewState('soap-dna-public');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/soap/${dnaCode}`);
    }
  };

  // Re-calculate formula when preferences change
  const updatePreferences = (updates: Partial<FormulationPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updates };
      const computed = FormulationEngine.calculate(next);
      setActiveFormula(computed);
      return next;
    });
  };

  // Watch for machine completion to finalize batch and pop SOAP DNA
  useEffect(() => {
    if (activeBatch && status.mode === 'COMPLETED' && activeBatch.status !== 'COMPLETED') {
      const finalWeight = status.loadCell.currentGrams || activeBatch.targetWeightG;
      const completedBatch = BatchManager.completeBatch(activeBatch.id, finalWeight, 68);
      if (completedBatch) {
        setActiveBatch(completedBatch);
        setSelectedDnaBatch(completedBatch);
      }
    }
  }, [status.mode, activeBatch, status.loadCell.currentGrams]);

  const inspectBatchDna = (batchId: string) => {
    const batch = BatchManager.getBatchById(batchId);
    if (batch) {
      setSelectedDnaBatch(batch);
      setCurrentView('soap-dna');
    }
  };

  const recreateFormula = (formula: MachineFormula) => {
    setPreferences(formula.preferences);
    setActiveFormula(formula);
    setCurrentView('creator');
  };

  // Automated Guided FYP Demo
  const startDemo = () => {
    setIsDemoActive(true);
    setDemoStep(1);
    setCurrentView('creator');
  };

  const stopDemo = () => {
    setIsDemoActive(false);
    setDemoStep(0);
  };

  const nextDemoStep = () => {
    setDemoStep((prev) => {
      const next = prev + 1;
      if (next === 2) {
        // Step 2: Next step in creator
      } else if (next === 3) {
        // Step 3: Launch batch
        const batch = BatchManager.createBatch(activeFormula, true);
        setActiveBatch(batch);
        setCurrentView('batch-launch');
      } else if (next === 4) {
        // Step 4: Start dispensing
        if (activeBatch) {
          machineStartBatch(activeBatch.id, activeFormula);
          setCurrentView('machine-dashboard');
        }
      } else if (next === 5) {
        // Step 5: Completed, show SOAP DNA
        setCurrentView('soap-dna');
      }
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        displayMode,
        setDisplayMode,
        theme,
        setTheme,
        toggleTheme,
        preferences,
        setPreferences,
        activeFormula,
        updatePreferences,
        activeBatch,
        setActiveBatch,
        selectedDnaBatch,
        inspectBatchDna,
        recreateFormula,
        publicSoapDna,
        openPublicSoapDna,
        isDemoActive,
        demoStep,
        startDemo,
        stopDemo,
        nextDemoStep,
        feedbackModalBatchId,
        setFeedbackModalBatchId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
