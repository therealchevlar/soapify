/**
 * @file SimulatedMachineService.ts
 * @description High-fidelity simulation of the SOAPIFY physical cleanser dispensing machine.
 * Emulates ESP32 control of 5 peristaltic pumps, HX711 24-bit ADC load cell,
 * magnetic high-torque mixer, and nozzle actuation with realistic fluid dynamics.
 */

import { MachineFormula } from '../../types/formulation';
import {
  HardwareHealth,
  LoadCellTelemetry,
  MachineMode,
  MachineStatus,
  PumpTelemetry,
  ReservoirStatus,
} from '../../types/machine';
import { MACHINE_RESERVOIRS } from '../formulation/presets';
import { IMachineService, MachineStatusListener } from './IMachineService';

export class SimulatedMachineService implements IMachineService {
  private listeners: Set<MachineStatusListener> = new Set();
  private timer: any = null;
  private speedMultiplier: number = 1.5; // Default slightly faster than real-time for snappy UX

  // Machine internal state
  private status: MachineStatus;
  private currentFormula: MachineFormula | null = null;
  private currentBatchId: string | null = null;
  private activeIngredientIndex: number = 0;
  private stageStartTime: number = 0;
  private mixingElapsedMs: number = 0;
  private fillingElapsedMs: number = 0;

  constructor() {
    this.status = this.getInitialStatus();
  }

  private getInitialStatus(): MachineStatus {
    const reservoirs: ReservoirStatus[] = MACHINE_RESERVOIRS.map((r, idx) => ({
      reservoirId: r.id,
      pumpId: r.pumpId,
      label: `Reservoir 0${r.id}`,
      ingredientName: r.name,
      currentLevelPct: [88, 76, 92, 64, 82][idx] ?? 80,
      currentVolumeMl: Math.round(r.defaultCapacityMl * 0.8),
      capacityMl: r.defaultCapacityMl,
      isLowWarning: false,
      colorHex: r.colorHex,
    }));

    const pumps: PumpTelemetry[] = [1, 2, 3, 4, 5].map((id) => ({
      pumpId: id,
      label: `Pump 0${id}`,
      reservoirId: id,
      state: 'IDLE',
      targetWeightG: 0,
      dispensedWeightG: 0,
      remainingWeightG: 0,
      flowRateMlPerSec: 0,
      rpm: 0,
      currentMa: 0,
      temperatureC: 24.2,
      stepsPerGramCalibration: 480,
    }));

    const loadCell: LoadCellTelemetry = {
      tareOffset: 842100,
      rawAdcCounts: 842100,
      currentGrams: 0.0,
      targetGrams: 0.0,
      isSettled: true,
      driftErrorDetected: false,
    };

    const health: HardwareHealth = {
      esp32Online: true,
      esp32FirmwareVersion: 'v1.4.2-SIM-SOAPIFY',
      ipAddress: '192.168.4.1 (ESP32-AP)',
      macAddress: '24:6F:28:B4:E9:12',
      wifiRssi: -48,
      hx711Online: true,
      pumpsOnline: true,
      mixingMotorOnline: true,
      emergencyStopEngaged: false,
      enclosureTempC: 25.4,
      voltageRailV: 12.04,
      lastHeartbeatEpochMs: Date.now(),
    };

    return {
      connected: true,
      isSimulated: true,
      mode: 'READY',
      batchId: null,
      formulaId: null,
      overallProgressPct: 0,
      currentStageIndex: 0,
      totalStages: 0,
      stageName: 'System Ready',
      activePumpId: null,
      loadCell,
      pumps,
      reservoirs,
      mixing: {
        active: false,
        targetRpm: 650,
        currentRpm: 0,
        durationSec: 10,
        elapsedSec: 0,
        viscosityTorqueEstimateNm: 0.04,
      },
      filling: {
        active: false,
        bottlePresent: true,
        nozzleLowered: false,
        flowRateMlPerSec: 0,
        volumeFilledMl: 0,
      },
      health,
      errorMessage: null,
      errorActionAdvice: null,
      errorCode: null,
    };
  }

  public async connect(_host?: string): Promise<boolean> {
    this.status.mode = 'CONNECTING';
    this.notify();
    await new Promise((r) => setTimeout(r, 600));

    this.status.connected = true;
    this.status.mode = 'READY';
    this.status.stageName = 'System Ready';
    this.status.health.esp32Online = true;
    this.status.health.hx711Online = true;
    this.status.health.lastHeartbeatEpochMs = Date.now();
    this.notify();
    return true;
  }

  public async disconnect(): Promise<void> {
    this.stopTicker();
    this.status.connected = false;
    this.status.mode = 'DISCONNECTED';
    this.status.stageName = 'Offline';
    this.status.health.esp32Online = false;
    this.status.health.lastHeartbeatEpochMs = Date.now();
    this.notify();
  }

  public getStatus(): MachineStatus {
    return { ...this.status };
  }

  public getReservoirStatus(): ReservoirStatus[] {
    return [...this.status.reservoirs];
  }

  public async startBatch(batchId: string, formula: MachineFormula): Promise<boolean> {
    if (this.status.health.emergencyStopEngaged) {
      this.status.errorMessage = 'Cannot start batch while Emergency Stop is engaged';
      this.status.errorActionAdvice = 'Release physical emergency switch and click Reset in UI';
      this.notify();
      return false;
    }

    this.currentBatchId = batchId;
    this.currentFormula = formula;
    this.activeIngredientIndex = 0;
    this.stageStartTime = Date.now();
    this.mixingElapsedMs = 0;
    this.fillingElapsedMs = 0;

    // Reset pump metrics
    this.status.pumps.forEach((p) => {
      const ing = formula.ingredients.find((i) => i.pumpId === p.pumpId);
      p.state = 'IDLE';
      p.targetWeightG = ing ? ing.targetWeightG : 0;
      p.dispensedWeightG = 0;
      p.remainingWeightG = p.targetWeightG;
      p.flowRateMlPerSec = 0;
      p.rpm = 0;
    });

    // Reset load cell
    this.status.loadCell.currentGrams = 0.0;
    this.status.loadCell.targetGrams = formula.targetWeightG;
    this.status.loadCell.isSettled = true;

    // Stages: 1 calibration + N ingredients + 1 mixing + 1 filling
    this.status.batchId = batchId;
    this.status.formulaId = formula.formulaId;
    this.status.totalStages = formula.ingredients.length + 3;
    this.status.currentStageIndex = 1;
    this.status.overallProgressPct = 2;
    this.status.mode = 'CALIBRATING';
    this.status.stageName = 'Tare Calibration & Bottle Check';
    this.status.errorMessage = null;

    this.notify();
    this.startTicker();
    return true;
  }

  public async pauseBatch(): Promise<boolean> {
    if (this.status.mode === 'DISPENSING' || this.status.mode === 'MIXING' || this.status.mode === 'FILLING') {
      this.status.mode = 'PAUSED';
      this.status.pumps.forEach((p) => {
        if (p.state === 'DOSING') p.state = 'PAUSED';
        p.flowRateMlPerSec = 0;
        p.rpm = 0;
      });
      this.status.mixing.active = false;
      this.status.mixing.currentRpm = 0;
      this.notify();
      return true;
    }
    return false;
  }

  public async resumeBatch(): Promise<boolean> {
    if (this.status.mode === 'PAUSED') {
      // Restore previous mode based on active stage
      if (this.status.currentStageIndex <= (this.currentFormula?.ingredients.length ?? 0) + 1) {
        this.status.mode = 'DISPENSING';
      } else if (this.status.currentStageIndex === (this.currentFormula?.ingredients.length ?? 0) + 2) {
        this.status.mode = 'MIXING';
      } else {
        this.status.mode = 'FILLING';
      }
      this.notify();
      return true;
    }
    return false;
  }

  public async stopBatch(reason: string = 'User Abort'): Promise<boolean> {
    this.stopTicker();
    this.status.mode = 'IDLE';
    this.status.stageName = `Batch Cancelled: ${reason}`;
    this.status.activePumpId = null;
    this.status.pumps.forEach((p) => {
      p.state = 'IDLE';
      p.rpm = 0;
      p.flowRateMlPerSec = 0;
    });
    this.status.mixing.active = false;
    this.status.mixing.currentRpm = 0;
    this.status.filling.active = false;
    this.notify();
    return true;
  }

  public async emergencyStop(): Promise<boolean> {
    this.stopTicker();
    this.status.mode = 'EMERGENCY_STOP';
    this.status.stageName = 'EMERGENCY STOP TRIGGERED';
    this.status.health.emergencyStopEngaged = true;
    this.status.activePumpId = null;
    this.status.pumps.forEach((p) => {
      p.state = 'ERROR';
      p.rpm = 0;
      p.flowRateMlPerSec = 0;
      p.currentMa = 0;
    });
    this.status.mixing.active = false;
    this.status.mixing.currentRpm = 0;
    this.status.filling.active = false;
    this.status.errorMessage = 'Emergency Stop Activated: Hardware isolated';
    this.status.errorActionAdvice = 'Verify physical safety, clear workspace, then press Reset Emergency Stop';
    this.notify();
    return true;
  }

  public async resetEmergencyStop(): Promise<boolean> {
    this.status.health.emergencyStopEngaged = false;
    this.status.mode = 'READY';
    this.status.stageName = 'System Ready';
    this.status.errorMessage = null;
    this.status.errorActionAdvice = null;
    this.status.pumps.forEach((p) => (p.state = 'IDLE'));
    this.notify();
    return true;
  }

  public async tareScale(): Promise<boolean> {
    this.status.loadCell.currentGrams = 0.0;
    this.status.loadCell.isSettled = true;
    this.notify();
    return true;
  }

  public async purgePump(pumpId: number, durationSec: number = 2): Promise<boolean> {
    const pump = this.status.pumps.find((p) => p.pumpId === pumpId);
    if (!pump) return false;

    pump.state = 'PURGING';
    pump.rpm = 240;
    pump.flowRateMlPerSec = 3.2;
    this.notify();

    setTimeout(() => {
      pump.state = 'IDLE';
      pump.rpm = 0;
      pump.flowRateMlPerSec = 0;
      this.notify();
    }, (durationSec * 1000) / this.speedMultiplier);

    return true;
  }

  public getBatchProgress(): number {
    return this.status.overallProgressPct;
  }

  public getSensorData(): LoadCellTelemetry {
    return { ...this.status.loadCell };
  }

  public getMachineHealth(): HardwareHealth {
    return { ...this.status.health, lastHeartbeatEpochMs: Date.now() };
  }

  public subscribe(listener: MachineStatusListener): () => void {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => this.listeners.delete(listener);
  }

  public setSimulationSpeed(multiplier: number): void {
    this.speedMultiplier = Math.max(0.5, Math.min(10, multiplier));
  }

  public injectFault(faultType: 'RESERVOIR_EMPTY' | 'SCALE_DRIFT' | 'PUMP_JAM' | 'COMM_TIMEOUT' | 'BOTTLE_MISSING'): void {
    switch (faultType) {
      case 'RESERVOIR_EMPTY':
        this.status.reservoirs[1].currentLevelPct = 1;
        this.status.reservoirs[1].isLowWarning = true;
        this.status.errorMessage = 'Low Reservoir Warning: Emollient (Reservoir 02) below 5%';
        this.status.errorActionAdvice = 'Top up Reservoir 02 with Ceramide Squalane fluid before starting batch';
        break;
      case 'SCALE_DRIFT':
        this.status.loadCell.driftErrorDetected = true;
        this.status.errorMessage = 'Load Cell Drift Error: Signal jitter exceeds 0.25g variance';
        this.status.errorActionAdvice = 'Check scale isolation feet for vibration; perform zero-point tare calibration';
        break;
      case 'PUMP_JAM':
        this.status.pumps[0].state = 'ERROR';
        this.status.errorMessage = 'Peristaltic Pump 01 Stall: Overcurrent detected on stepper driver';
        this.status.errorActionAdvice = 'Inspect silicon tube line for mechanical pinch or crystallization';
        break;
      case 'COMM_TIMEOUT':
        this.status.connected = false;
        this.status.mode = 'ERROR';
        this.status.errorMessage = 'ESP32 Bridge Connection Lost: Keep-Alive heartbeat timeout';
        this.status.errorActionAdvice = 'Verify 2.4GHz WiFi link or USB-UART cable to ESP32 mainboard';
        break;
      case 'BOTTLE_MISSING':
        this.status.filling.bottlePresent = false;
        this.status.errorMessage = 'Safety Interlock: Dispense target bottle not detected on stage';
        this.status.errorActionAdvice = 'Place 250ml or 500ml glass pump bottle directly onto center platform';
        break;
    }
    this.notify();
  }

  public clearFault(): void {
    this.status.errorMessage = null;
    this.status.errorActionAdvice = null;
    this.status.loadCell.driftErrorDetected = false;
    this.status.filling.bottlePresent = true;
    this.status.reservoirs.forEach((r) => (r.isLowWarning = false));
    this.status.pumps.forEach((p) => {
      if (p.state === 'ERROR') p.state = 'IDLE';
    });
    if (!this.status.connected) {
      this.status.connected = true;
      this.status.mode = 'READY';
    }
    this.notify();
  }

  // ----------------------------------------------------
  // SIMULATION TICKER ENGINE
  // ----------------------------------------------------

  private startTicker(): void {
    this.stopTicker();
    const intervalMs = 100;
    this.timer = setInterval(() => this.tick(intervalMs), intervalMs);
  }

  private stopTicker(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private tick(dtRealMs: number): void {
    if (this.status.mode === 'PAUSED' || this.status.mode === 'ERROR' || this.status.mode === 'EMERGENCY_STOP') {
      return;
    }

    const dtSimMs = dtRealMs * this.speedMultiplier;
    const formula = this.currentFormula;
    if (!formula) return;

    const totalIngredients = formula.ingredients.length;

    // Stage 1: Calibration / Pre-flight (takes ~1.2s sim)
    if (this.status.mode === 'CALIBRATING') {
      const elapsed = Date.now() - this.stageStartTime;
      if (elapsed * this.speedMultiplier > 1400) {
        this.status.mode = 'DISPENSING';
        this.activeIngredientIndex = 0;
        this.status.currentStageIndex = 2;
        this.prepareNextIngredient();
      }
      this.notify();
      return;
    }

    // Stage 2 .. N+1: Dispensing Ingredients sequentially
    if (this.status.mode === 'DISPENSING') {
      const currentIng = formula.ingredients[this.activeIngredientIndex];
      if (!currentIng) {
        // All ingredients finished, proceed to MIXING
        this.status.mode = 'MIXING';
        this.status.currentStageIndex = totalIngredients + 2;
        this.status.stageName = 'High-Torque Homogenization';
        this.status.activePumpId = null;
        this.status.mixing.active = true;
        this.status.mixing.currentRpm = 650;
        this.mixingElapsedMs = 0;
        this.notify();
        return;
      }

      const pump = this.status.pumps.find((p) => p.pumpId === currentIng.pumpId);
      if (pump) {
        // Dosing rate: ~3.5 grams per simulated second
        const ratePerMs = 0.0035 * (currentIng.role === 'FRAGRANCE' ? 0.6 : 1.0);
        const deltaG = ratePerMs * dtSimMs;

        const newDispensed = Math.min(currentIng.targetWeightG, pump.dispensedWeightG + deltaG);
        const actualDelta = newDispensed - pump.dispensedWeightG;

        pump.dispensedWeightG = Number(newDispensed.toFixed(1));
        pump.remainingWeightG = Number(Math.max(0, currentIng.targetWeightG - pump.dispensedWeightG).toFixed(1));
        pump.state = 'DOSING';
        pump.rpm = 220;
        pump.flowRateMlPerSec = Number((actualDelta / (dtSimMs / 1000) / currentIng.densityGPerMl).toFixed(1));
        pump.currentMa = 380;

        // Update load cell total
        this.status.loadCell.currentGrams = Number(
          (this.status.loadCell.currentGrams + actualDelta).toFixed(1)
        );

        // Update reservoir level slightly
        const res = this.status.reservoirs.find((r) => r.reservoirId === currentIng.reservoirId);
        if (res) {
          const mlDosed = actualDelta / currentIng.densityGPerMl;
          res.currentVolumeMl = Math.max(0, res.currentVolumeMl - mlDosed);
          res.currentLevelPct = Math.round((res.currentVolumeMl / res.capacityMl) * 100);
        }

        // Check if current ingredient target reached
        if (pump.dispensedWeightG >= currentIng.targetWeightG - 0.05) {
          pump.dispensedWeightG = currentIng.targetWeightG;
          pump.remainingWeightG = 0;
          pump.state = 'IDLE';
          pump.rpm = 0;
          pump.flowRateMlPerSec = 0;
          pump.currentMa = 0;

          this.activeIngredientIndex++;
          this.status.currentStageIndex++;
          this.prepareNextIngredient();
        }
      }

      this.updateOverallProgress();
      this.notify();
      return;
    }

    // Stage N+2: Mixing
    if (this.status.mode === 'MIXING') {
      this.mixingElapsedMs += dtSimMs;
      const targetDurationMs = 7000;
      this.status.mixing.elapsedSec = Math.round(this.mixingElapsedMs / 1000);

      if (this.mixingElapsedMs >= targetDurationMs) {
        this.status.mixing.active = false;
        this.status.mixing.currentRpm = 0;
        this.status.mode = 'FILLING';
        this.status.currentStageIndex = totalIngredients + 3;
        this.status.stageName = 'Precision Container Filling';
        this.status.filling.active = true;
        this.status.filling.nozzleLowered = true;
        this.status.filling.flowRateMlPerSec = 14.5;
        this.fillingElapsedMs = 0;
      }

      this.updateOverallProgress();
      this.notify();
      return;
    }

    // Stage N+3: Filling into customer bottle
    if (this.status.mode === 'FILLING') {
      this.fillingElapsedMs += dtSimMs;
      const fillDurationMs = 5000;
      this.status.filling.volumeFilledMl = Math.round(
        (this.fillingElapsedMs / fillDurationMs) * formula.targetVolumeMl
      );

      if (this.fillingElapsedMs >= fillDurationMs) {
        this.status.filling.active = false;
        this.status.filling.nozzleLowered = false;
        this.status.filling.volumeFilledMl = formula.targetVolumeMl;
        this.status.mode = 'COMPLETED';
        this.status.stageName = 'Batch Complete';
        this.status.overallProgressPct = 100;
        this.stopTicker();
      }

      this.updateOverallProgress();
      this.notify();
    }
  }

  private prepareNextIngredient(): void {
    const formula = this.currentFormula;
    if (!formula) return;
    const ing = formula.ingredients[this.activeIngredientIndex];
    if (ing) {
      this.status.activePumpId = ing.pumpId;
      this.status.stageName = `Dosing ${ing.name} (Pump 0${ing.pumpId})`;
    }
  }

  private updateOverallProgress(): void {
    const formula = this.currentFormula;
    if (!formula) return;

    if (this.status.mode === 'COMPLETED') {
      this.status.overallProgressPct = 100;
      return;
    }

    // Weight proportion: 75% of progress, mixing 15%, filling 10%
    const weightProgress = Math.min(1.0, this.status.loadCell.currentGrams / formula.targetWeightG);
    let overall = weightProgress * 75;

    if (this.status.mode === 'MIXING') {
      overall = 75 + Math.min(15, (this.mixingElapsedMs / 7000) * 15);
    } else if (this.status.mode === 'FILLING') {
      overall = 90 + Math.min(10, (this.fillingElapsedMs / 5000) * 10);
    }

    this.status.overallProgressPct = Math.min(99, Math.round(overall));
  }

  private notify(): void {
    const current = this.getStatus();
    this.listeners.forEach((l) => l(current));
  }
}
