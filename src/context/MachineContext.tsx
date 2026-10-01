/**
 * @file MachineContext.tsx
 * @description React Context offering real-time reactive access to the SOAPIFY machine status,
 * telemetry stream, and control operations.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getActiveDriverType,
  getMachineService,
  setMachineDriverType,
} from '../services/machine';
import { IMachineService } from '../services/machine/IMachineService';
import { MachineFormula } from '../types/formulation';
import { MachineStatus } from '../types/machine';

interface MachineContextType {
  status: MachineStatus;
  driverType: 'SIMULATION' | 'REAL_ESP32';
  service: IMachineService;
  startBatch: (batchId: string, formula: MachineFormula) => Promise<boolean>;
  pauseBatch: () => Promise<boolean>;
  resumeBatch: () => Promise<boolean>;
  stopBatch: (reason?: string) => Promise<boolean>;
  emergencyStop: () => Promise<boolean>;
  resetEmergencyStop: () => Promise<boolean>;
  tareScale: () => Promise<boolean>;
  purgePump: (pumpId: number, durationSec?: number) => Promise<boolean>;
  setSimulationSpeed: (multiplier: number) => void;
  injectFault: (fault: 'RESERVOIR_EMPTY' | 'SCALE_DRIFT' | 'PUMP_JAM' | 'COMM_TIMEOUT' | 'BOTTLE_MISSING') => void;
  clearFault: () => void;
  switchDriver: (type: 'SIMULATION' | 'REAL_ESP32', esp32Host?: string) => void;
  reconnect: () => Promise<boolean>;
}

const MachineContext = createContext<MachineContextType | undefined>(undefined);

export const MachineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [driverType, setDriverTypeState] = useState<'SIMULATION' | 'REAL_ESP32'>(getActiveDriverType());
  const [service, setService] = useState<IMachineService>(() => getMachineService());
  const [status, setStatus] = useState<MachineStatus>(() => service.getStatus());

  useEffect(() => {
    const unsub = service.subscribe((nextStatus) => {
      setStatus(nextStatus);
    });
    return () => unsub();
  }, [service]);

  const switchDriver = (type: 'SIMULATION' | 'REAL_ESP32', esp32Host?: string) => {
    const newService = setMachineDriverType(type, esp32Host);
    setDriverTypeState(type);
    setService(newService);
    setStatus(newService.getStatus());
  };

  const reconnect = async () => {
    return service.connect();
  };

  const startBatch = async (batchId: string, formula: MachineFormula) => {
    return service.startBatch(batchId, formula);
  };

  const pauseBatch = async () => {
    return service.pauseBatch();
  };

  const resumeBatch = async () => {
    return service.resumeBatch();
  };

  const stopBatch = async (reason?: string) => {
    return service.stopBatch(reason);
  };

  const emergencyStop = async () => {
    return service.emergencyStop();
  };

  const resetEmergencyStop = async () => {
    return service.resetEmergencyStop();
  };

  const tareScale = async () => {
    return service.tareScale();
  };

  const purgePump = async (pumpId: number, durationSec?: number) => {
    return service.purgePump(pumpId, durationSec);
  };

  const setSimulationSpeed = (multiplier: number) => {
    service.setSimulationSpeed(multiplier);
  };

  const injectFault = (fault: 'RESERVOIR_EMPTY' | 'SCALE_DRIFT' | 'PUMP_JAM' | 'COMM_TIMEOUT' | 'BOTTLE_MISSING') => {
    service.injectFault(fault);
  };

  const clearFault = () => {
    service.clearFault();
  };

  return (
    <MachineContext.Provider
      value={{
        status,
        driverType,
        service,
        startBatch,
        pauseBatch,
        resumeBatch,
        stopBatch,
        emergencyStop,
        resetEmergencyStop,
        tareScale,
        purgePump,
        setSimulationSpeed,
        injectFault,
        clearFault,
        switchDriver,
        reconnect,
      }}
    >
      {children}
    </MachineContext.Provider>
  );
};

export const useMachine = (): MachineContextType => {
  const context = useContext(MachineContext);
  if (!context) {
    throw new Error('useMachine must be used within a MachineProvider');
  }
  return context;
};
