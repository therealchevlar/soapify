/**
 * @file App.tsx
 * @description Main application controller for SOAPIFY.
 * Cleanly routes between Consumer Mode, Dedicated Machine Touchscreen Mode,
 * Engineering Mode, and the Public /soap/:soapDNA destination.
 */

import React from 'react';
import { BatchHistory } from './components/batch/BatchHistory';
import { BatchLaunch } from './components/batch/BatchLaunch';
import { FeedbackModal } from './components/batch/FeedbackModal';
import { PublicSoapView } from './components/batch/PublicSoapView';
import { SoapDnaView } from './components/batch/SoapDnaView';
import { FormulaCreator } from './components/creator/FormulaCreator';
import { GuidedDemoOverlay } from './components/demo/GuidedDemoOverlay';
import { HardwareStatus } from './components/hardware/HardwareStatus';
import { LandingPage } from './components/landing/LandingPage';
import { ConsumerProductionView } from './components/machine/ConsumerProductionView';
import { MachineModeTouch } from './components/machine/MachineModeTouch';
import { MobileNav } from './components/navigation/MobileNav';
import { TopNav } from './components/navigation/TopNav';
import { AppProvider, useApp } from './context/AppContext';
import { MachineProvider } from './context/MachineContext';

const AppContent: React.FC = () => {
  const { currentView, displayMode, publicSoapDna, theme } = useApp();

  // If in dedicated Machine Mode (7-10 inch touchscreen installed on the physical machine),
  // render the dedicated high-contrast glove-friendly touchscreen interface.
  if (displayMode === 'MACHINE') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500/20">
        <MachineModeTouch />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        theme === 'dark'
          ? 'dark bg-slate-950 text-slate-100 selection:bg-sky-500/30'
          : 'bg-slate-50 text-slate-900 selection:bg-sky-500/20'
      }`}
    >
      {/* 3-Zone Top Navigation Contract */}
      <TopNav />

      {/* Main View Router */}
      <main className="flex-1 pb-20 md:pb-8">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'creator' && <FormulaCreator />}
        {currentView === 'batch-launch' && <BatchLaunch />}
        {currentView === 'machine-dashboard' && <ConsumerProductionView />}
        {currentView === 'batch-history' && <BatchHistory />}
        {currentView === 'soap-dna' && <SoapDnaView />}
        {currentView === 'soap-dna-public' && <PublicSoapView dnaCode={publicSoapDna || ''} />}
        {currentView === 'hardware' && <HardwareStatus />}
      </main>

      {/* Mobile Sticky Thumb Navigation (<= 768px) */}
      <MobileNav />

      {/* Evaluation Feedback Modal */}
      <FeedbackModal />

      {/* Guided University FYP Presentation Assistant */}
      <GuidedDemoOverlay />
    </div>
  );
};

export default function App() {
  return (
    <MachineProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </MachineProvider>
  );
}
