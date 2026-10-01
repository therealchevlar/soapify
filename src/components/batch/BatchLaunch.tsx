/**
 * @file BatchLaunch.tsx
 * @description Pre-flight verification and production launch gate for personalized cleanser batches.
 * Supports light & dark modes.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMachine } from '../../context/MachineContext';
import { Button } from '../ui/Button';
import { CheckCircle2, AlertTriangle, ShieldCheck, ArrowLeft, Play } from 'lucide-react';

export const BatchLaunch: React.FC = () => {
  const { activeBatch, activeFormula, setCurrentView } = useApp();
  const { status, startBatch } = useMachine();
  const [isStarting, setIsStarting] = useState(false);

  if (!activeBatch) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center px-4 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">No Active Batch Prepared</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Please configure your personal cleanser formula first.</p>
        <Button onClick={() => setCurrentView('creator')}>Open Formula Creator</Button>
      </div>
    );
  }

  const handleStartProduction = async () => {
    setIsStarting(true);
    const success = await startBatch(activeBatch.id, activeFormula);
    setIsStarting(false);
    if (success) {
      setCurrentView('machine-dashboard');
    }
  };

  const allReservoirsOk = status.reservoirs.every((r) => r.currentLevelPct >= 10);
  const bottleDetected = status.filling.bottlePresent;
  const loadCellOk = status.health.hx711Online && !status.loadCell.driftErrorDetected;
  const machineReady = status.connected && status.health.esp32Online && !status.health.emergencyStopEngaged;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 select-none transition-colors duration-200">
      {/* Title & Batch ID */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8 text-center sm:text-left sm:flex sm:items-end sm:justify-between transition-colors">
        <div>
          <span className="text-xs font-mono text-sky-600 dark:text-sky-400 uppercase tracking-widest font-bold block mb-1">
            Production Stage 01 // Pre-Flight Calibration
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Ready for Production</h1>
        </div>
        <div className="mt-4 sm:mt-0 font-mono text-right">
          <span className="text-xs text-slate-400 dark:text-slate-500 block font-semibold">Assigned Batch ID</span>
          <span className="text-xl font-bold text-sky-600 dark:text-sky-400">{activeBatch.id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Batch Recipe Summary (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span>Formulation Specifications</span>
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500 font-medium">Formula {activeFormula.formulaId}</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] mb-1 uppercase font-bold">TARGET VOLUME</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">{activeFormula.targetVolumeMl} ml</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] mb-1 uppercase font-bold">TOTAL MASS TARGET</span>
                <span className="text-base font-bold text-sky-600 dark:text-sky-400">{activeFormula.targetWeightG.toFixed(1)} g</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] mb-1 uppercase font-bold">EST. DISPENSE TIME</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">~68 seconds</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] mb-1 uppercase font-bold">TARGET PH</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{activeFormula.targetPh} pH</span>
              </div>
            </div>

            {/* Micro ingredient pills */}
            <div className="space-y-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Planned Fluid Pipeline:</span>
              <div className="space-y-1.5">
                {activeFormula.ingredients.map((ing) => (
                  <div
                    key={ing.pumpId}
                    className="flex items-center justify-between text-xs py-2 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
                  >
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      Pump 0{ing.pumpId} · {ing.name}
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">{ing.targetWeightG.toFixed(1)} g</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pre-Flight Hardware Checklist (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Hardware Interlocks</span>
            </h3>

            <div className="space-y-3.5 text-xs font-mono">
              {/* Check 1: Machine status */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-300 font-medium">ESP32 Controller</span>
                <span className={`flex items-center gap-1 font-bold ${machineReady ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {machineReady ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{machineReady ? 'ONLINE' : 'OFFLINE'}</span>
                </span>
              </div>

              {/* Check 2: Load cell */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-300 font-medium">HX711 Strain Gauge</span>
                <span className={`flex items-center gap-1 font-bold ${loadCellOk ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {loadCellOk ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{loadCellOk ? 'TARED (0.0g)' : 'UNCALIBRATED'}</span>
                </span>
              </div>

              {/* Check 3: Reservoirs */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Ingredient Levels</span>
                <span className={`flex items-center gap-1 font-bold ${allReservoirsOk ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {allReservoirsOk ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{allReservoirsOk ? 'OPTIMAL' : 'LOW WARN'}</span>
                </span>
              </div>

              {/* Check 4: Bottle detect */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Glass Container</span>
                <span className={`flex items-center gap-1 font-bold ${bottleDetected ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {bottleDetected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{bottleDetected ? 'DETECTED' : 'MISSING'}</span>
                </span>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full text-base font-bold shadow-lg shadow-sky-500/20 cursor-pointer flex items-center justify-center gap-2"
                onClick={handleStartProduction}
                isLoading={isStarting}
                disabled={!machineReady}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Production Batch</span>
              </Button>

              <button
                type="button"
                onClick={() => setCurrentView('creator')}
                className="w-full text-center text-xs font-mono font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white py-1.5 cursor-pointer transition-colors flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Formula Editor</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchLaunch;
