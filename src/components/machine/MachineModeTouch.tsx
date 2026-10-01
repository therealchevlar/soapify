/**
 * @file MachineModeTouch.tsx
 * @description Dedicated high-contrast touchscreen interface for 7-10 inch displays
 * installed directly into the front chassis of the physical SOAPIFY machine.
 * Designed for glove-friendly interaction, zero typing, and rapid glanceability.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMachine } from '../../context/MachineContext';
import { BatchManager } from '../../services/batches/batchManager';
import { SoapifyLogo } from '../brand/SoapifyLogo';
import { Button } from '../ui/Button';

export const MachineModeTouch: React.FC = () => {
  const { setDisplayMode, activeFormula, activeBatch, setActiveBatch, setCurrentView } = useApp();
  const { status, startBatch, pauseBatch, resumeBatch, stopBatch, emergencyStop, resetEmergencyStop, tareScale } =
    useMachine();

  const [presetModalOpen, setPresetModalOpen] = useState(false);

  const isRunning =
    status.mode === 'DISPENSING' || status.mode === 'MIXING' || status.mode === 'FILLING' || status.mode === 'CALIBRATING';
  const isPaused = status.mode === 'PAUSED';
  const isEmergency = status.mode === 'EMERGENCY_STOP';
  const isComplete = status.mode === 'COMPLETED';

  const readyReservoirsCount = status.reservoirs.filter((r) => r.currentLevelPct >= 10).length;

  const handleStartCurrentBatch = async () => {
    let batch = activeBatch;
    if (!batch) {
      batch = BatchManager.createBatch(activeFormula, status.isSimulated);
      setActiveBatch(batch);
    }
    await startBatch(batch.id, activeFormula);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col p-4 sm:p-6 select-none overflow-hidden font-sans">
      {/* Top Bar for Machine Operator */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 shrink-0">
        <div className="flex items-center gap-4">
          <SoapifyLogo variant="compact" size="sm" theme="dark" />
          <div className="h-6 w-px bg-slate-800" />
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            TOUCHSCREEN MACHINE MODE // 7–10 INCH
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                status.connected ? 'bg-emerald-400' : 'bg-rose-500 animate-ping'
              }`}
            />
            <span className="uppercase text-slate-300">
              {status.isSimulated ? 'SIMULATOR ACTIVE' : 'ESP32 LINKED'}
            </span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setDisplayMode('WEB')}
            className="text-xs border-slate-700 text-slate-400 cursor-pointer"
          >
            Exit Machine Mode
          </Button>
        </div>
      </header>

      {/* Main Touchscreen Stage */}
      <div className="grid grid-cols-12 gap-5 flex-1 items-stretch min-h-0">
        {/* Left Column: Big Status, Stage, and Real-Time Weight (7 cols) */}
        <div className="col-span-7 flex flex-col justify-between p-6 rounded-3xl bg-slate-900/90 border border-slate-800">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                {isRunning ? 'CREATING SOAP' : 'SOAPIFY MACHINE'}
              </span>
              <span
                className={`text-sm font-mono font-bold uppercase px-3 py-1 rounded-full ${
                  isRunning
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : isComplete
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isEmergency
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {status.mode}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              {isRunning
                ? `CURRENT OPERATION: ${status.mode}`
                : isComplete
                ? 'BATCH COMPLETE'
                : 'MACHINE READY'}
            </h2>

            <p className="text-xs font-mono text-slate-400 mb-5">
              {status.stageName} · Batch {activeBatch?.id || 'SOAP-2026-00124'}
            </p>

            {/* Giant Mass Readout */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  CURRENT WEIGHT
                </span>
                <div className="text-5xl sm:text-6xl font-mono font-black text-cyan-400 tracking-tight">
                  {status.loadCell.currentGrams.toFixed(1)}
                  <span className="text-xl text-slate-400 ml-2 font-normal">g</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  TARGET WEIGHT
                </span>
                <div className="text-3xl sm:text-4xl font-mono font-bold text-slate-300">
                  {activeFormula.targetWeightG.toFixed(1)}
                  <span className="text-base text-slate-500 ml-1 font-normal">g</span>
                </div>
              </div>
            </div>

            {/* Hardware Readiness Checklist (when idle) */}
            {!isRunning && !isComplete && (
              <div className="grid grid-cols-3 gap-3 mt-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">MACHINE STATUS</span>
                  <span className="text-emerald-400 font-bold">{status.mode}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">RESERVOIRS</span>
                  <span className="text-emerald-400 font-bold">
                    {readyReservoirsCount}/5 READY
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">SYSTEM INTERLOCKS</span>
                  <span className="text-emerald-400 font-bold">NORMAL</span>
                </div>
              </div>
            )}
          </div>

          {/* Huge Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-base font-mono mb-2 font-bold">
              <span className="text-slate-300">Progress</span>
              <span className="text-cyan-400">{status.overallProgressPct}%</span>
            </div>
            <div className="h-5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-1">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-200"
                style={{ width: `${status.overallProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Giant Touch Action Buttons (5 cols) */}
        <div className="col-span-5 flex flex-col justify-between gap-4">
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {!isRunning && !isComplete && (
              <Button
                variant="touch-large"
                className="w-full h-24 text-2xl font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-2xl border-cyan-300 cursor-pointer"
                onClick={handleStartCurrentBatch}
              >
                START BATCH
              </Button>
            )}

            {isRunning && (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="touch-large"
                  className="w-full h-24 text-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer"
                  onClick={() => (isPaused ? resumeBatch() : pauseBatch())}
                >
                  {isPaused ? 'RESUME' : 'PAUSE'}
                </Button>
                <Button
                  variant="touch-large"
                  className="w-full h-24 text-xl font-bold bg-slate-800 hover:bg-slate-700 text-rose-300 border-slate-700 cursor-pointer"
                  onClick={() => stopBatch('Operator Touch Stop')}
                >
                  STOP
                </Button>
              </div>
            )}

            {isComplete && (
              <Button
                variant="touch-large"
                className="w-full h-24 text-xl font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 cursor-pointer"
                onClick={() => {
                  setDisplayMode('WEB');
                  setCurrentView('soap-dna');
                }}
              >
                VIEW SOAP DNA & QR →
              </Button>
            )}

            {/* Quick Actions (Tare & Presets) */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="secondary"
                size="lg"
                className="h-14 font-mono text-sm cursor-pointer"
                onClick={() => tareScale()}
              >
                TARE SCALE (0.0g)
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="h-14 font-mono text-sm cursor-pointer"
                onClick={() => setPresetModalOpen(true)}
              >
                SELECT PRESET
              </Button>
            </div>
          </div>

          {/* Physical Style Emergency Stop Button */}
          <div className="pt-2">
            {!isEmergency ? (
              <button
                onClick={() => emergencyStop()}
                className="w-full h-20 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-mono font-black text-2xl tracking-wider shadow-2xl border-2 border-rose-400 ring-4 ring-rose-950/60 uppercase cursor-pointer transition-all flex items-center justify-center gap-3"
              >
                <span className="h-4 w-4 rounded-full bg-white animate-ping" />
                <span>EMERGENCY STOP</span>
              </button>
            ) : (
              <button
                onClick={() => resetEmergencyStop()}
                className="w-full h-20 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-mono font-black text-xl tracking-wider uppercase cursor-pointer"
              >
                RESET EMERGENCY INTERLOCK
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preset Modal for fast kiosk dispensing */}
      {presetModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xl font-bold text-white">Select Kiosk Preset</h3>
              <button
                onClick={() => setPresetModalOpen(false)}
                className="text-slate-400 hover:text-white text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Lavender Calming Wash', vol: 250, frag: 'Lavender', skin: 'Dry' },
                { title: 'Ocean Breeze Clarifying Cleanser', vol: 250, frag: 'Ocean', skin: 'Oily' },
                { title: 'Damask Rose Emollient Gel', vol: 500, frag: 'Rose', skin: 'Sensitive' },
              ].map((p, i) => (
                <div
                  key={i}
                  onClick={() => setPresetModalOpen(false)}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-400 cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-white">{p.title}</h4>
                    <span className="text-xs font-mono text-slate-400">
                      {p.vol}ml · {p.frag} · {p.skin} skin
                    </span>
                  </div>
                  <span className="text-xs font-mono text-cyan-400">Select Preset →</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
