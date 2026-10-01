/**
 * @file index.ts
 * @description Central factory and provider for the machine communication layer.
 * Allows instant seamless switching between Simulated Machine and Real ESP32 Bridge.
 */

import { Esp32MachineService } from './Esp32MachineService';
import { IMachineService } from './IMachineService';
import { SimulatedMachineService } from './SimulatedMachineService';

let activeDriverType: 'SIMULATION' | 'REAL_ESP32' = 'SIMULATION';
const simulatedInstance = new SimulatedMachineService();
let esp32Instance: Esp32MachineService | null = null;

export function getMachineService(): IMachineService {
  if (activeDriverType === 'REAL_ESP32') {
    if (!esp32Instance) {
      esp32Instance = new Esp32MachineService();
    }
    return esp32Instance;
  }
  return simulatedInstance;
}

export function setMachineDriverType(type: 'SIMULATION' | 'REAL_ESP32', esp32Host?: string): IMachineService {
  activeDriverType = type;
  if (type === 'REAL_ESP32') {
    esp32Instance = new Esp32MachineService(esp32Host || '192.168.4.1');
    return esp32Instance;
  }
  return simulatedInstance;
}

export function getActiveDriverType(): 'SIMULATION' | 'REAL_ESP32' {
  return activeDriverType;
}

export * from './Esp32MachineService';
export * from './IMachineService';
export * from './SimulatedMachineService';
