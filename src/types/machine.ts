/**
 * @file machine.ts
 * @description Hardware and controller interfaces for SOAPIFY dispensing unit.
 * Architected for seamless drop-in replacement with real ESP32 microcontrollers.
 */

export type MachineMode =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'IDLE'
  | 'READY'
  | 'CALIBRATING'
  | 'DISPENSING'
  | 'MIXING'
  | 'FILLING'
  | 'COMPLETED'
  | 'PAUSED'
  | 'ERROR'
  | 'EMERGENCY_STOP';

export type PumpState = 'IDLE' | 'DOSING' | 'PAUSED' | 'ERROR' | 'PURGING';

export interface PumpTelemetry {
  pumpId: number;
  label: string;
  reservoirId: number;
  state: PumpState;
  targetWeightG: number;
  dispensedWeightG: number;
  remainingWeightG: number;
  flowRateMlPerSec: number;
  rpm: number;
  currentMa: number;
  temperatureC: number;
  stepsPerGramCalibration: number;
}

export interface ReservoirStatus {
  reservoirId: number;
  pumpId: number;
  label: string;
  ingredientName: string;
  currentLevelPct: number; // 0 to 100
  currentVolumeMl: number;
  capacityMl: number;
  isLowWarning: boolean;
  colorHex: string;
}

export interface LoadCellTelemetry {
  tareOffset: number;
  rawAdcCounts: number;
  currentGrams: number;
  targetGrams: number;
  isSettled: boolean;
  driftErrorDetected: boolean;
}

export interface MixingTelemetry {
  active: boolean;
  targetRpm: number;
  currentRpm: number;
  durationSec: number;
  elapsedSec: number;
  viscosityTorqueEstimateNm: number;
}

export interface FillingTelemetry {
  active: boolean;
  bottlePresent: boolean;
  nozzleLowered: boolean;
  flowRateMlPerSec: number;
  volumeFilledMl: number;
}

export interface HardwareHealth {
  esp32Online: boolean;
  esp32FirmwareVersion: string;
  ipAddress: string;
  macAddress: string;
  wifiRssi: number; // in dBm
  hx711Online: boolean;
  pumpsOnline: boolean;
  mixingMotorOnline: boolean;
  emergencyStopEngaged: boolean;
  enclosureTempC: number;
  voltageRailV: number;
  lastHeartbeatEpochMs: number;
}

export interface MachineStatus {
  connected: boolean;
  isSimulated: boolean;
  mode: MachineMode;
  batchId: string | null;
  formulaId: string | null;
  overallProgressPct: number;
  currentStageIndex: number;
  totalStages: number;
  stageName: string;
  activePumpId: number | null;
  loadCell: LoadCellTelemetry;
  pumps: PumpTelemetry[];
  reservoirs: ReservoirStatus[];
  mixing: MixingTelemetry;
  filling: FillingTelemetry;
  health: HardwareHealth;
  errorMessage: string | null;
  errorActionAdvice: string | null;
  errorCode: string | null;
}

export type MachineCommand =
  | { type: 'CONNECT'; host?: string; isSimulation?: boolean }
  | { type: 'DISCONNECT' }
  | { type: 'START_BATCH'; batchId: string; formula: any }
  | { type: 'PAUSE_BATCH' }
  | { type: 'RESUME_BATCH' }
  | { type: 'ABORT_BATCH'; reason?: string }
  | { type: 'EMERGENCY_STOP' }
  | { type: 'RESET_EMERGENCY_STOP' }
  | { type: 'TARE_SCALE' }
  | { type: 'PURGE_PUMP'; pumpId: number; durationSec: number }
  | { type: 'SET_SIMULATION_SPEED'; multiplier: number }
  | { type: 'INJECT_FAULT'; fault: 'RESERVOIR_EMPTY' | 'SCALE_DRIFT' | 'PUMP_JAM' | 'COMM_TIMEOUT' | 'BOTTLE_MISSING' };
