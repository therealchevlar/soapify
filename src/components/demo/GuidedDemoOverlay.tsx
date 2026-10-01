/**
 * @file GuidedDemoOverlay.tsx
 * @description Guided presentation tour controller for university engineering FYP demonstrations.
 * Walkthrough of the complete consumer journey, formulation animation, machine dispensing,
 * verified camera-scannable QR passport, and feedback loop.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { useMachine } from '../../context/MachineContext';
import { BatchManager } from '../../services/batches/batchManager';
import { Button } from '../ui/Button';

export const GuidedDemoOverlay: React.FC = () => {
  const {
    isDemoActive,
    demoStep,
    nextDemoStep,
    stopDemo,
    activeFormula,
    activeBatch,
    setActiveBatch,
    setCurrentView,
    setFeedbackModalBatchId,
  } = useApp();

  const { status, startBatch, setSimulationSpeed } = useMachine();

  if (!isDemoActive) return null;

  const stepsInfo = [
    {
      title: 'FYP Presentation Demo',
      desc: 'Experience the complete SOAPIFY product journey: Skin selection, color & fragrance configurator, automated dispensing, and verified SOAP DNA.',
      actionLabel: '1. Open Formulator',
      action: () => {
        setCurrentView('creator');
        nextDemoStep();
      },
    },
    {
      title: 'Step 1: Consumer Personalization',
      desc: 'The user chooses skin type (Dry), aesthetic color (Lavender), natural fragrance, and volume. The live bottle preview updates in real time.',
      actionLabel: '2. Create Soap',
      action: async () => {
        const batch = BatchManager.createBatch(activeFormula, true);
        setActiveBatch(batch);
        setSimulationSpeed(2.5); // Snappy demo speed
        await startBatch(batch.id, activeFormula);
        setCurrentView('machine-dashboard');
        nextDemoStep();
      },
    },
    {
      title: 'Step 2: Robotic Dosing & Mixing',
      desc: 'Watch the simulated ESP32 step the peristaltic pumps, meter mass on the 24-bit strain-gauge scale, homogenize at 650 RPM, and fill.',
      actionLabel: status.mode === 'COMPLETED' ? '3. View SOAP DNA' : 'Accelerate Batch',
      action: () => {
        if (status.mode === 'COMPLETED') {
          setCurrentView('soap-dna');
          nextDemoStep();
        } else {
          setSimulationSpeed(6.0); // Accelerate
        }
      },
    },
    {
      title: 'Step 3: SOAP DNA & Scannable QR',
      desc: 'Each completed bottle is minted with an ISO-compliant QR code encoding a public URL (/soap/SFY-7A92-24K) and Code 128 batch barcode.',
      actionLabel: '4. Open User Feedback',
      action: () => {
        if (activeBatch) {
          setFeedbackModalBatchId(activeBatch.id);
        }
        nextDemoStep();
      },
    },
    {
      title: 'Demo Complete',
      desc: 'The end-to-end SOAPIFY engineering cycle is complete. Thank you for viewing our University Startup Demonstration!',
      actionLabel: 'Finish Tour',
      action: () => {
        stopDemo();
        setCurrentView('landing');
      },
    },
  ];

  const currentInfo = stepsInfo[Math.min(demoStep, stepsInfo.length - 1)];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-5 rounded-3xl bg-slate-900/95 border-2 border-cyan-400 shadow-2xl backdrop-blur-md text-white font-sans animate-in fade-in slide-in-from-bottom-4 duration-300 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
            FYP PRESENTATION TOUR · STEP {demoStep + 1}/{stepsInfo.length}
          </span>
        </div>
        <button
          onClick={stopDemo}
          className="text-slate-400 hover:text-white text-xs font-mono uppercase cursor-pointer"
        >
          Exit
        </button>
      </div>

      <h4 className="text-base font-bold text-white mb-1">{currentInfo.title}</h4>
      <p className="text-xs text-slate-300 leading-relaxed mb-4">{currentInfo.desc}</p>

      <div className="flex items-center justify-between pt-2.5 border-t border-slate-800">
        <span className="text-[10px] font-mono text-slate-400">
          Machine: {status.mode} ({status.overallProgressPct}%)
        </span>
        <Button
          size="sm"
          variant="primary"
          onClick={currentInfo.action}
          className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs font-mono cursor-pointer"
        >
          {currentInfo.actionLabel} →
        </Button>
      </div>
    </div>
  );
};
