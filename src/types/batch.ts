/**
 * @file batch.ts
 * @description Types for SOAPIFY batch tracking, SOAP DNA, and product feedback.
 */

import { MachineFormula, SkinType, SoapColor } from './formulation';

export type BatchStatus = 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'ABORTED' | 'FAILED';

export interface SoapDna {
  dnaCode: string; // e.g. "SFY-7A92-24K"
  batchId: string;
  formulaId: string;
  signature: string;
  timestamp: string;
  machineSerial: string;
  volumeMl: number;
  profileHex: string;
  
  // Consumer Product Identity
  skinType: SkinType;
  color: SoapColor;
  fragrance: string;
  fragranceIntensity: number;
  intensityLabel: 'Subtle' | 'Medium' | 'Intense';
  formulaVersion: string; // "v1.0"
  publicUrl: string; // e.g. "https://domain.com/soap/SFY-7A92-24K"

  // Laboratory Telemetry & Matrix
  attributeMatrix: {
    moisturizationScore: number;
    fragranceScore: number;
    textureIndex: number;
    clarifyingPower: number;
    phBalance: number;
  };
  dominantNotes: string[];
  keyActives: string[];
  qrPayload: string;
}

export interface BatchFeedback {
  batchId: string;
  submittedAt: string;
  ratingOverall: number; // 1-5
  ratingTexture: number; // 1-5
  ratingFragrance: number; // 1-5
  ratingMoisturization: number; // 1-5
  ratingCleansing: number; // 1-5
  skinReaction: 'HYDRATED' | 'BALANCED' | 'SQUEAKY_CLEAN' | 'NEUTRAL';
  notes?: string;
  wouldReorder: boolean;
}

export interface TelemetrySample {
  timestampRelMs: number;
  weightG: number;
  stage: string;
  pumpId: number | null;
  rpm: number;
}

export interface CleanserBatch {
  id: string; // e.g. "SOAP-2026-00124"
  formula: MachineFormula;
  status: BatchStatus;
  startedAt: string;
  completedAt?: string;
  targetWeightG: number;
  actualWeightG: number;
  weightAccuracyPct: number;
  durationSeconds: number;
  machineId: string;
  isSimulated: boolean;
  soapDna?: SoapDna;
  feedback?: BatchFeedback;
  telemetryLog?: TelemetrySample[];
}
