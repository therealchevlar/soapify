/**
 * @file MachineDashboard.tsx
 * @description Industrial real-time telemetry console and control center for the SOAPIFY machine.
 * Displays live load cell mass, active peristaltic dosing, homogenization status, and pipeline stages.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { useMachine } from '../../context/MachineContext';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { MachineIllustration } from './MachineIllustration';

export const MachineDashboard: React.FC = () => {
  const { activeBatch, activeFormula, setCurrentView } = useApp();
  const { status, pauseBatch, resumeBatch, stopBatch, emergencyStop, resetEmergencyStop, tareScale } =
    useMachine();

  const isPaused = status.mode === 'PAUSED';
  const isEmergency = status.mode === 'EMERGENCY_STOP';
  const isComplete = status.mode === 'COMPLETED';
  const isRunning =
    status.mode === 'DISPENSING' || status.mode === 'MIXING' || status.mode === 'FILLING' || status.mode === 'CALIBRATING';

  const currentGrams = status.loadCell.currentGrams;
  const targetGrams = status.loadCell.targetGrams || (activeFormula ? activeFormula.targetWeightG : 250.0);
  const progressPct = status.overallProgressPct;

  // Active ingredient details
  const activePump = status.pumps.find((p) => p.pumpId === status.activePumpId);
  const activeIngredient = activeFormula?.ingredients.find((i) => i.pumpId === status.activePumpId);

  // Pipeline stages
  const pipeline = [
    { label: 'BASE', id: 1, type: 'SURFACTANT' },
    { label: 'MOISTURIZER', id: 2, type: 'EMOLLIENT' },
    { label: 'FRAGRANCE', id: 3, type: 'FRAGRANCE' },
    { label: 'ADDITIVES', id: 4, type: 'ACTIVE' },
    { label: 'MIXING', id: 'mix', type: 'MIX' },
    { label: 'FILLING', id: 'fill', type: 'FILL' },
  ];

  const getStageState = (stageId: number | string) => {
    if (isComplete) return 'DONE';
    if (typeof stageId === 'number') {
      const ingIndex = activeFormula?.ingredients.findIndex((i) => i.pumpId === stageId);
      if (ingIndex === undefined || ingIndex === -1) return 'SKIPPED';
      if (status.mode === 'MIXING' || status.mode === 'FILLING') return 'DONE';
      if (status.activePumpId === stageId) return 'ACTIVE';
      const activeIdx = activeFormula?.ingredients.findIndex((i) => i.pumpId === status.activePumpId);
      if (activeIdx !== undefined && activeIdx > ingIndex) return 'DONE';
      return 'PENDING';
    } else if (stageId === 'mix') {
      if (status.mode === 'MIXING') return 'ACTIVE';
      if (status.mode === 'FILLING' || isComplete) return 'DONE';
      return 'PENDING';
    } else if (stageId === 'fill') {
      if (status.mode === 'FILLING') return 'ACTIVE';
      if (isComplete) return 'DONE';
      return 'PENDING';
    }
    return 'PENDING';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Telemetry Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-cyan-400">
            01
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white tracking-tight">SOAPIFY DISPENSING UNIT</h2>
              <StatusBadge mode={status.mode} />
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-0.5">
              <span>CONTROLLER: {status.health.esp32FirmwareVersion}</span>
              <span>·</span>
              <span>TEMP: {status.health.enclosureTempC.toFixed(1)}°C</span>
              <span>·</span>
              <span>BUS: {status.health.voltageRailV.toFixed(1)}V</span>
            </div>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {isRunning && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => pauseBatch()}
              className="cursor-pointer font-mono"
            >
              PAUSE BATCH
            </Button>
          )}

          {isPaused && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => resumeBatch()}
              className="cursor-pointer font-mono bg-amber-400 text-slate-950 font-bold"
            >
              RESUME DISPENSE
            </Button>
          )}

          {isRunning && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => stopBatch('Manual User Abort')}
              className="cursor-pointer text-slate-400 hover:text-rose-400"
            >
              ABORT
            </Button>
          )}

          {isComplete && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCurrentView('soap-dna')}
              className="cursor-pointer bg-emerald-400 text-slate-950 font-bold"
            >
              INSPECT SOAP DNA →
            </Button>
          )}

          {/* Emergency Stop Cutoff */}
          {!isEmergency ? (
            <button
              onClick={() => emergencyStop()}
              className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg border border-rose-400/40 ring-2 ring-rose-900/50 cursor-pointer active:scale-95 transition-all"
              title="Immediate physical interlock motor cutoff"
            >
              EMERGENCY STOP
            </button>
          ) : (
            <button
              onClick={() => resetEmergencyStop()}
              className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg cursor-pointer active:scale-95"
            >
              RESET E-STOP
            </button>
          )}
        </div>
      </div>

      {/* Error or Alert Banner if any */}
      {status.errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-200 text-xs font-mono flex items-start justify-between">
          <div className="space-y-1">
            <div className="font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span>{status.errorMessage}</span>
            </div>
            {status.errorActionAdvice && (
              <p className="text-rose-300/80 pl-4">{status.errorActionAdvice}</p>
            )}
          </div>
        </div>
      )}

      {/* Real-time Pipeline Visualizer */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-3">
          Automated Formulation Pipeline Execution
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {pipeline.map((step) => {
            const state = getStageState(step.id);
            return (
              <div
                key={step.label}
                className={`p-3 rounded-xl border text-center transition-all ${
                  state === 'ACTIVE'
                    ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300 ring-2 ring-cyan-400/20'
                    : state === 'DONE'
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[10px] font-mono uppercase font-bold tracking-wider">
                  {step.label}
                </div>
                <div className="mt-1 text-sm font-mono">
                  {state === 'DONE' && '✓ COMPLETED'}
                  {state === 'ACTIVE' && <span className="animate-pulse">● DOSING</span>}
                  {state === 'PENDING' && '○ QUEUED'}
                  {state === 'SKIPPED' && '— N/A'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Machine Telemetry & Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Metrics & Live Dosing View (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Real-time Weight Display Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block">
                  Digital Load Cell Telemetry
                </span>
                <span className="text-sm font-mono text-cyan-400">HX711 24-bit Micro-Scale</span>
              </div>
              <Button size="sm" variant="outline" onClick={() => tareScale()} className="font-mono text-xs">
                Tare Scale (0.0g)
              </Button>
            </div>

            {/* Mass Gauge Readout */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Current Mass</span>
                <span className="text-3xl font-mono font-bold text-white">
                  {currentGrams.toFixed(1)} <span className="text-xs text-slate-400">g</span>
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Target Mass</span>
                <span className="text-3xl font-mono font-bold text-slate-300">
                  {targetGrams.toFixed(1)} <span className="text-xs text-slate-400">g</span>
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Completed</span>
                <span className="text-3xl font-mono font-bold text-cyan-400">
                  {progressPct} <span className="text-xs text-cyan-500">%</span>
                </span>
              </div>
            </div>

            {/* Overall Progress Linear Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>{status.stageName}</span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-200"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Active Dosing Ingredient Panel */}
          {activePump && activeIngredient ? (
            <div className="p-6 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-900/50 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-mono text-xs font-bold text-cyan-300 uppercase">
                    ACTIVE DOSING · PUMP 0{activePump.pumpId}
                  </span>
                </div>
                <span className="text-xs font-mono text-cyan-400">{activePump.flowRateMlPerSec.toFixed(1)} ml/s</span>
              </div>

              <div>
                <h4 className="text-xl font-bold text-white mb-1">{activeIngredient.name}</h4>
                <p className="text-xs text-slate-400 font-mono">{activeIngredient.inciName}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-cyan-900/40">
                  <span className="text-slate-400 block text-[10px]">PUMP TARGET</span>
                  <span className="text-base font-bold text-slate-100">{activePump.targetWeightG.toFixed(1)} g</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-cyan-900/40">
                  <span className="text-slate-400 block text-[10px]">DISPENSED</span>
                  <span className="text-base font-bold text-cyan-400">{activePump.dispensedWeightG.toFixed(1)} g</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-cyan-900/40">
                  <span className="text-slate-400 block text-[10px]">REMAINING</span>
                  <span className="text-base font-bold text-amber-300">{activePump.remainingWeightG.toFixed(1)} g</span>
                </div>
              </div>
            </div>
          ) : status.mode === 'MIXING' ? (
            <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-spin" />
                <span className="font-mono text-xs font-bold text-amber-300 uppercase">
                  HOMOGENIZATION IN PROGRESS
                </span>
              </div>
              <h4 className="text-lg font-bold text-white">Magnetic Micro-Agitation Matrix</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Shearing micellar emulsion at 650 RPM to integrate lipid nanoparticles and botanical actives into a stable suspension.
              </p>
            </div>
          ) : status.mode === 'FILLING' ? (
            <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="font-mono text-xs font-bold text-indigo-300 uppercase">
                  TRANSFERRING TO CONTAINER
                </span>
              </div>
              <h4 className="text-lg font-bold text-white">Precision Clean-Room Bottling</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Anti-drip solenoid valve actuated. Lowering peristaltic dispensing wand directly into container neck.
              </p>
            </div>
          ) : isComplete ? (
            <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-4 text-center">
              <div className="inline-flex h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Formulation Successfully Completed</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Batch target weight achieved with 99.9% accuracy. SOAP DNA profile minted and ready for inspection.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setCurrentView('soap-dna')}
                className="cursor-pointer bg-emerald-400 text-slate-950 font-bold"
              >
                Inspect SOAP DNA & Print Label
              </Button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-xs font-mono">
              System Standby · Waiting for Command
            </div>
          )}
        </div>

        {/* Right Column: Interactive Machine Illustration & Reservoirs (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <MachineIllustration />

          {/* Reservoir Status Gauges */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-3">
              Ingredient Reservoirs Telemetry
            </span>
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
              {status.reservoirs.map((res) => (
                <div key={res.reservoirId} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div
                    className="h-16 w-3 mx-auto rounded-full bg-slate-800 overflow-hidden flex flex-col justify-end p-0.5 mb-2"
                  >
                    <div
                      className="w-full rounded-full transition-all duration-300"
                      style={{ height: `${res.currentLevelPct}%`, backgroundColor: res.colorHex }}
                    />
                  </div>
                  <span className="block text-[10px] text-slate-400">R-0{res.reservoirId}</span>
                  <span className="font-bold text-slate-200">{res.currentLevelPct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
