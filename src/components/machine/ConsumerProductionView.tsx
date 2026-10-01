/**
 * @file ConsumerProductionView.tsx
 * @description Beautiful, clean, non-technical production progress view for consumers.
 * Supports light & dark modes.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { useMachine } from '../../context/MachineContext';
import { LiveBottlePreview } from '../creator/LiveBottlePreview';
import {
  IconDroplet,
  IconMixerVortex,
  IconSparkleCheck,
} from '../ui/Animaticons';
import { Button } from '../ui/Button';

export const ConsumerProductionView: React.FC = () => {
  const { activeBatch, activeFormula, setCurrentView } = useApp();
  const { status, pauseBatch, resumeBatch, stopBatch } = useMachine();

  const isPaused = status.mode === 'PAUSED';
  const isComplete = status.mode === 'COMPLETED';
  const isRunning =
    status.mode === 'DISPENSING' || status.mode === 'MIXING' || status.mode === 'FILLING' || status.mode === 'CALIBRATING';

  const progressPct = status.overallProgressPct;

  // Consumer friendly step description
  let stepTitle = 'Preparing Machine Dispenser';
  let stepSub = 'Taring precision load cell and checking fluid lines...';
  let stepIcon = <IconDroplet className="w-6 h-6" color="#0284c7" />;

  if (status.mode === 'DISPENSING') {
    const activeIng = activeFormula.ingredients.find((i) => i.pumpId === status.activePumpId);
    if (activeIng) {
      if (activeIng.role === 'FRAGRANCE') {
        stepTitle = `Adding ${activeFormula.preferences.fragrance.toLowerCase()} essence...`;
        stepSub = 'Micro-dosing natural cold-pressed aromatic botanical isolates...';
      } else if (activeIng.role === 'EMOLLIENT') {
        stepTitle = `Adding ${activeFormula.preferences.skinType.toLowerCase()} hydration lipids...`;
        stepSub = 'Dosing biomimetic squalane and barrier-restoring ceramides...';
      } else if (activeIng.role === 'ACTIVE_ADDITIVE') {
        stepTitle = 'Infusing bio-active complexes...';
        stepSub = 'Dispensing concentrated botanical extracts...';
      } else if (activeIng.role === 'VISCOSITY_MODIFIER') {
        stepTitle = 'Calibrating silky texture...';
        stepSub = 'Blending natural plant cellulose hydrocolloid matrix...';
      } else {
        stepTitle = 'Dosing clean bio-surfactant base...';
        stepSub = 'Metering ultra-mild glucoside micellar cleansing fluid...';
      }
    } else {
      stepTitle = 'Dispensing cleanser base...';
      stepSub = 'Precision peristaltic dosing in progress...';
    }
  } else if (status.mode === 'MIXING') {
    stepTitle = 'Mixing & Homogenizing...';
    stepSub = 'Vortex magnetic mixing active ingredients into a silky emulsion...';
    stepIcon = <IconMixerVortex className="w-6 h-6" color="#f59e0b" />;
  } else if (status.mode === 'FILLING') {
    stepTitle = 'Filling your bottle...';
    stepSub = 'Lowering precision anti-drip wand into your personal container...';
    stepIcon = <IconDroplet className="w-6 h-6" color="#0284c7" />;
  } else if (isComplete) {
    stepTitle = 'Your SOAP is Ready!';
    stepSub = 'Formulation completed with 100% precision. Your SOAP DNA passport is minted.';
    stepIcon = <IconSparkleCheck className="w-6 h-6" color="#059669" />;
  }

  const batchId = activeBatch?.id || 'SOAP-2026-00124';

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 select-none transition-colors duration-200">
      {/* Top Consumer Header */}
      <div className="text-center space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/70 border border-sky-100 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-mono font-bold tracking-wider uppercase mb-1">
          <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
          <span>CREATING YOUR SOAP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {activeFormula.preferences.customName || `${activeFormula.preferences.fragrance} Cleanser`}
        </h1>
        <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>{batchId}</span>
          <span>·</span>
          <span>{activeFormula.targetVolumeMl} ML</span>
          <span>·</span>
          <span className="capitalize">{activeFormula.preferences.skinType.toLowerCase()} skin</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Column: Live Bottle filling representation (5 cols) */}
        <div className="md:col-span-5 flex justify-center">
          <div className="w-full max-w-sm p-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md transition-colors">
            <LiveBottlePreview
              color={activeFormula.preferences.color}
              fragrance={activeFormula.preferences.fragrance}
              volumeMl={activeFormula.targetVolumeMl}
              skinType={activeFormula.preferences.skinType}
              customName={activeFormula.preferences.customName}
            />
          </div>
        </div>

        {/* Right Column: Clean Consumer Step Progress (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">
                <span className="uppercase font-bold tracking-wider text-sky-700 dark:text-sky-400">CURRENT OPERATION</span>
                <span className="text-sky-600 dark:text-sky-400 font-bold text-sm">{progressPct}%</span>
              </div>
              <div className="flex items-center gap-3">
                {stepIcon}
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{stepTitle}</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed pl-9">{stepSub}</p>
            </div>

            {/* Smooth Progress Bar */}
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 rounded-full transition-all duration-300 ease-out shadow-xs"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold">
                <span>DISPENSING</span>
                <span>MIXING</span>
                <span>FILLING</span>
                <span>READY</span>
              </div>
            </div>

            {/* Simple Step Timeline */}
            <div className="grid grid-cols-4 gap-2.5 pt-2 text-center text-xs font-mono">
              <div
                className={`p-3 rounded-2xl border transition-all ${
                  status.mode === 'DISPENSING' || status.mode === 'CALIBRATING'
                    ? 'bg-sky-50 dark:bg-sky-950/70 border-sky-400 dark:border-sky-500 text-sky-900 dark:text-sky-200 font-bold shadow-xs'
                    : progressPct > 70
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                1. Dosing
              </div>
              <div
                className={`p-3 rounded-2xl border transition-all ${
                  status.mode === 'MIXING'
                    ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-400 dark:border-amber-500 text-amber-900 dark:text-amber-200 font-bold shadow-xs'
                    : progressPct > 85
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                2. Mixing
              </div>
              <div
                className={`p-3 rounded-2xl border transition-all ${
                  status.mode === 'FILLING'
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-400 dark:border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold shadow-xs'
                    : progressPct === 100
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                3. Bottling
              </div>
              <div
                className={`p-3 rounded-2xl border transition-all ${
                  isComplete
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 border-emerald-500 dark:border-emerald-500 text-emerald-900 dark:text-emerald-200 font-extrabold shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                4. Ready
              </div>
            </div>

            {/* Consumer Friendly Control Buttons */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 transition-colors">
              {isRunning && !isComplete && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => (isPaused ? resumeBatch() : pauseBatch())}
                    className="font-mono text-xs cursor-pointer"
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <button
                    onClick={() => stopBatch('User Stopped')}
                    className="text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer transition-colors"
                  >
                    Cancel Batch
                  </button>
                </>
              )}

              {isComplete && (
                <Button
                  variant="mint"
                  size="lg"
                  onClick={() => setCurrentView('soap-dna')}
                  className="w-full font-bold cursor-pointer"
                >
                  View Your SOAP DNA & QR Code →
                </Button>
              )}

              {/* Technical Mode peek */}
              <button
                onClick={() => setCurrentView('hardware')}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 ml-auto cursor-pointer transition-colors"
              >
                Engineering View ↗
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerProductionView;
