/**
 * @file HardwareStatus.tsx
 * @description Engineering diagnostics console displaying low-level ESP32 pinouts,
 * HX711 load cell telemetry, stepper driver metrics, fault injector, and hardware contracts.
 * Supports light & dark modes.
 */

import React, { useState } from 'react';
import { useMachine } from '../../context/MachineContext';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { Cpu, Scale, Activity, Wrench, AlertTriangle, CheckCircle2, RotateCw } from 'lucide-react';

export const HardwareStatus: React.FC = () => {
  const {
    status,
    driverType,
    switchDriver,
    setSimulationSpeed,
    injectFault,
    clearFault,
    purgePump,
    tareScale,
  } = useMachine();

  const [simSpeed, setSimSpeed] = useState<number>(1.5);
  const [esp32HostInput, setEsp32HostInput] = useState<string>('192.168.4.1');
  const [purgingPumpId, setPurgingPumpId] = useState<number | null>(null);

  const handleSpeedChange = (speed: number) => {
    setSimSpeed(speed);
    setSimulationSpeed(speed);
  };

  const handlePurge = async (pumpId: number) => {
    setPurgingPumpId(pumpId);
    await purgePump(pumpId, 2);
    setPurgingPumpId(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 select-none transition-colors duration-200">
      {/* Page Title & Driver Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              Engineering Diagnostics & Hardware Abstraction
            </span>
            <span>·</span>
            <span>ESP32 Controller</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Machine Telemetry & Sensors</h1>
        </div>

        {/* Driver Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs transition-colors">
            <button
              onClick={() => switchDriver('SIMULATION')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                driverType === 'SIMULATION'
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              SIMULATION MODE
            </button>
            <button
              onClick={() => switchDriver('REAL_ESP32', esp32HostInput)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                driverType === 'REAL_ESP32'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              REAL ESP32 BRIDGE
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Control & Fault Injector Ribbon */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3 transition-colors">
          <div>
            <h3 className="text-sm font-bold font-mono text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>{driverType === 'SIMULATION' ? 'Active Machine Simulator Controls' : 'ESP32 Bridge Host Configuration'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {driverType === 'SIMULATION'
                ? 'Adjust virtual formulation clock or simulate physical sensor malfunctions for demonstration.'
                : 'Connects directly to the ESP32 WebSocket daemon over WiFi.'}
            </p>
          </div>

          {/* Speed multiplier buttons */}
          {driverType === 'SIMULATION' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">Speed:</span>
              {[1, 1.5, 3, 5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg border cursor-pointer transition-colors ${
                    simSpeed === speed
                      ? 'bg-sky-50 dark:bg-sky-950/70 border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 font-bold shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fault Injection Buttons */}
        {driverType === 'SIMULATION' ? (
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400 font-medium mr-2 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulate Fault:</span>
            </span>
            <button
              onClick={() => injectFault('RESERVOIR_EMPTY')}
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/90 cursor-pointer shadow-xs transition-colors"
            >
              Empty Reservoir 02
            </button>
            <button
              onClick={() => injectFault('SCALE_DRIFT')}
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/90 cursor-pointer shadow-xs transition-colors"
            >
              Scale Jitter & Drift
            </button>
            <button
              onClick={() => injectFault('PUMP_JAM')}
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/90 cursor-pointer shadow-xs transition-colors"
            >
              Pump 01 Stepper Jam
            </button>
            <button
              onClick={() => injectFault('BOTTLE_MISSING')}
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/90 cursor-pointer shadow-xs transition-colors"
            >
              Missing Bottle Interlock
            </button>
            <button
              onClick={() => clearFault()}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/90 cursor-pointer font-bold ml-auto shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Clear Faults / Restore OK</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={esp32HostInput}
              onChange={(e) => setEsp32HostInput(e.target.value)}
              placeholder="192.168.4.1"
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
            <Button size="sm" onClick={() => switchDriver('REAL_ESP32', esp32HostInput)}>
              Reconnect Bridge
            </Button>
          </div>
        )}
      </div>

      {/* Main Hardware Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: ESP32 Microcontroller */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>ESP32 Main Controller</span>
            </h3>
            <StatusBadge mode={status.connected ? 'ONLINE' : 'OFFLINE'} size="sm" />
          </div>
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Firmware:</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">{status.health.esp32FirmwareVersion}</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">IP Endpoint:</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">{status.health.ipAddress}</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">MAC Hardware:</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">{status.health.macAddress}</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">WiFi Signal (RSSI):</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">{status.health.wifiRssi} dBm (Nominal)</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Chassis Temp:</span>
              <span className="text-sky-700 dark:text-sky-400 font-bold">{status.health.enclosureTempC.toFixed(1)} °C</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">DC Voltage Rail:</span>
              <span className="text-sky-700 dark:text-sky-400 font-bold">{status.health.voltageRailV.toFixed(2)} V</span>
            </div>
          </div>
        </div>

        {/* Card 2: HX711 Load Cell Scale */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase flex items-center gap-2">
              <Scale className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>HX711 24-bit ADC Scale</span>
            </h3>
            <StatusBadge
              mode={status.loadCell.driftErrorDetected ? 'ERROR' : 'ONLINE'}
              label={status.loadCell.driftErrorDetected ? 'DRIFT ERROR' : 'CALIBRATED'}
              size="sm"
            />
          </div>
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Active Grams:</span>
              <span className="text-base font-bold text-sky-600 dark:text-sky-400">
                {status.loadCell.currentGrams.toFixed(2)} g
              </span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Tare Offset Counts:</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">{status.loadCell.tareOffset}</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Raw 24-bit ADC:</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">
                {Math.round(status.loadCell.tareOffset + status.loadCell.currentGrams * 2140)}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Scale Stability:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {status.loadCell.isSettled ? 'SETTLED' : 'MEASURING'}
              </span>
            </div>
            <div className="pt-1">
              <Button size="sm" variant="outline" className="w-full text-xs font-mono cursor-pointer flex items-center justify-center gap-1.5" onClick={() => tareScale()}>
                <RotateCw className="w-3.5 h-3.5" />
                <span>Trigger Zero Tare (0.00g)</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Card 3: Mixing & Actuators */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Mixer & Safety Interlocks</span>
            </h3>
            <StatusBadge
              mode={status.health.emergencyStopEngaged ? 'EMERGENCY_STOP' : 'ONLINE'}
              label={status.health.emergencyStopEngaged ? 'STOPPED' : 'NORMAL'}
              size="sm"
            />
          </div>
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Mixing Motor:</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">
                {status.mixing.active ? `${status.mixing.currentRpm} RPM (ACTIVE)` : 'STANDBY (0 RPM)'}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Container Detection:</span>
              <span className={status.filling.bottlePresent ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
                {status.filling.bottlePresent ? 'OPTICAL SENSOR DETECTED' : 'NO BOTTLE FOUND'}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Filling Nozzle Servo:</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">{status.filling.nozzleLowered ? 'LOWERED (DISPENSING)' : 'PARKED'}</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Physical E-Stop Circuit:</span>
              <span className={status.health.emergencyStopEngaged ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-emerald-700 dark:text-emerald-400 font-bold'}>
                {status.health.emergencyStopEngaged ? 'OPEN CIRCUIT (TRIGGERED)' : 'CLOSED (SECURE)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Peristaltic Pumps Status Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono uppercase">
          Peristaltic Stepper Pump Array (Pumps 01 - 05)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="py-2.5">PUMP</th>
                <th className="py-2.5">ASSIGNED INGREDIENT</th>
                <th className="py-2.5">DRIVER STATE</th>
                <th className="py-2.5 text-right">RPM</th>
                <th className="py-2.5 text-right">FLOW RATE</th>
                <th className="py-2.5 text-right">MOTOR CURRENT</th>
                <th className="py-2.5 text-right">MAINTENANCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {status.pumps.map((pump) => {
                const res = status.reservoirs.find((r) => r.pumpId === pump.pumpId);
                const isPurging = purgingPumpId === pump.pumpId;
                return (
                  <tr key={pump.pumpId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-bold text-sky-700 dark:text-sky-400">Pump 0{pump.pumpId}</td>
                    <td className="py-3 text-slate-800 dark:text-slate-200 font-medium">{res?.ingredientName || 'Auxiliary Line'}</td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                          pump.state === 'DOSING'
                            ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800 animate-pulse'
                            : pump.state === 'PURGING'
                            ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 animate-pulse'
                            : pump.state === 'ERROR'
                            ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {pump.state}
                      </span>
                    </td>
                    <td className="py-3 text-right text-slate-800 dark:text-slate-200">{pump.rpm}</td>
                    <td className="py-3 text-right text-slate-800 dark:text-slate-200">{pump.flowRateMlPerSec.toFixed(1)} ml/s</td>
                    <td className="py-3 text-right text-slate-500 dark:text-slate-400">{pump.currentMa} mA</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handlePurge(pump.pumpId)}
                        disabled={isPurging}
                        className="text-[11px] text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-sky-950/50 cursor-pointer disabled:opacity-50 transition-colors"
                      >
                        {isPurging ? 'Purging...' : 'Flush 2s'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hardware Contract & ESP32 Code Specification Box */}
      <div className="p-6 rounded-3xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/80 space-y-3 font-mono text-xs transition-colors">
        <div className="flex items-center justify-between text-sky-900 dark:text-sky-300 border-b border-sky-200/60 dark:border-sky-800/60 pb-2">
          <span className="font-bold uppercase flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-700 dark:text-sky-400" />
            <span>Hardware Integration Contract</span>
          </span>
          <span className="text-[11px] text-sky-700 dark:text-sky-400">Target Architecture: ESP32 + FreeRTOS + WebSocket</span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          The frontend connects to the physical machine by opening a WebSocket to <code className="text-sky-700 dark:text-sky-300 font-mono font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800">ws://&lt;esp32_ip&gt;:81/ws</code>.
          When a batch starts, it sends the exact JSON payload generated by <code className="text-sky-700 dark:text-sky-300 font-mono font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800">FormulationEngine.toMachinePayload()</code>.
          The ESP32 firmware reads the load cell on <code className="text-sky-700 dark:text-sky-300 font-mono font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800">GPIO 16/4</code>, steps TMC2209 drivers on <code className="text-sky-700 dark:text-sky-300 font-mono font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800">GPIO 18, 19, 21, 22, 23</code>, and broadcasts telemetry at 10 Hz.
        </p>
      </div>
    </div>
  );
};

export default HardwareStatus;
