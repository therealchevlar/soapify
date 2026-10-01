/**
 * @file IMachineService.ts
 * @description Standard hardware communication abstraction for SOAPIFY machine controllers.
 * Both the simulated machine and the real ESP32 driver implement this exact interface.
 */

import { MachineFormula } from '../../types/formulation';
import { HardwareHealth, LoadCellTelemetry, MachineStatus, ReservoirStatus } from '../../types/machine';

export type MachineStatusListener = (status: MachineStatus) => void;

export interface IMachineService {
  /** Connects to the machine (simulated or real ESP32) */
  connect(host?: string): Promise<boolean>;

  /** Disconnects from the machine */
  disconnect(): Promise<void>;

  /** Returns current synchronous machine status snapshot */
  getStatus(): MachineStatus;

  /** Returns current reservoir levels and capacities */
  getReservoirStatus(): ReservoirStatus[];

  /** Initiates a personalized formulation batch */
  startBatch(batchId: string, formula: MachineFormula): Promise<boolean>;

  /** Pauses the currently running batch */
  pauseBatch(): Promise<boolean>;

  /** Resumes a paused batch */
  resumeBatch(): Promise<boolean>;

  /** Aborts the active batch safely */
  stopBatch(reason?: string): Promise<boolean>;

  /** Immediate emergency stop cutoff of all motors and pumps */
  emergencyStop(): Promise<boolean>;

  /** Clears emergency stop after physical verification */
  resetEmergencyStop(): Promise<boolean>;

  /** Tares the load cell scale to 0.0g */
  tareScale(): Promise<boolean>;

  /** Runs a momentary purge/flush on a specific pump */
  purgePump(pumpId: number, durationSec?: number): Promise<boolean>;

  /** Returns current batch progress percentage (0 - 100) */
  getBatchProgress(): number;

  /** Returns current live load cell weight and ADC telemetry */
  getSensorData(): LoadCellTelemetry;

  /** Returns overall machine hardware diagnostics */
  getMachineHealth(): HardwareHealth;

  /** Subscribes to high-frequency telemetry updates */
  subscribe(listener: MachineStatusListener): () => void;

  /** Sets simulation speed multiplier (e.g. 1x, 2x, 5x, 10x) */
  setSimulationSpeed(multiplier: number): void;

  /** Injects a simulated hardware fault for testing */
  injectFault(faultType: 'RESERVOIR_EMPTY' | 'SCALE_DRIFT' | 'PUMP_JAM' | 'COMM_TIMEOUT' | 'BOTTLE_MISSING'): void;

  /** Clears any active fault */
  clearFault(): void;
}
