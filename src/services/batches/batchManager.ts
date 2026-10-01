/**
 * @file batchManager.ts
 * @description Manages batch records, SOAP DNA minting, and localStorage persistence.
 */

import { BatchFeedback, CleanserBatch, SoapDna } from '../../types/batch';
import { MachineFormula } from '../../types/formulation';
import { FormulationEngine } from '../formulation/engine';
import { QrGenerator } from '../qr/qrGenerator';

const BATCH_STORAGE_KEY = 'soapify_batch_records_v2';

export class BatchManager {
  /**
   * Creates a new queued batch with a standardized ID.
   */
  public static createBatch(formula: MachineFormula, isSimulated: boolean = true): CleanserBatch {
    const year = new Date().getFullYear();
    const existing = this.getAllBatches();
    const sequenceNumber = (existing.length + 124).toString().padStart(5, '0');
    const id = `SOAP-${year}-${sequenceNumber}`;

    const batch: CleanserBatch = {
      id,
      formula,
      status: 'QUEUED',
      startedAt: new Date().toISOString(),
      targetWeightG: formula.targetWeightG,
      actualWeightG: 0,
      weightAccuracyPct: 0,
      durationSeconds: 0,
      machineId: isSimulated ? 'SOAP-DISP-SIM-01' : 'SOAP-DISP-UNIT-ESP32-A1',
      isSimulated,
    };

    const updated = [batch, ...existing];
    this.saveBatches(updated);
    return batch;
  }

  /**
   * Finalizes a completed batch and mints its immutable SOAP DNA profile.
   */
  public static completeBatch(
    batchId: string,
    actualWeightG: number,
    durationSeconds: number
  ): CleanserBatch | null {
    const batches = this.getAllBatches();
    const idx = batches.findIndex((b) => b.id === batchId);
    if (idx === -1) return null;

    const current = batches[idx];
    const target = current.formula.targetWeightG;
    const accuracy = Number((100 - (Math.abs(actualWeightG - target) / target) * 100).toFixed(2));

    const soapDna = this.generateSoapDna(current, actualWeightG);

    const completed: CleanserBatch = {
      ...current,
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
      actualWeightG,
      weightAccuracyPct: Math.min(100, Math.max(92, accuracy)),
      durationSeconds,
      soapDna,
    };

    batches[idx] = completed;
    this.saveBatches(batches);
    return completed;
  }

  /**
   * Generates a unique, scannable SOAP DNA record with canonical public URL.
   */
  public static generateSoapDna(batch: CleanserBatch, actualWeightG: number): SoapDna {
    // Generate clean 8-character DNA code: e.g. "SFY-7A92-24K"
    const hex1 = Math.floor(0x1000 + Math.random() * 0xefff).toString(16).toUpperCase();
    const hex2 = Math.floor(10 + Math.random() * 89).toString();
    const letter = ['K', 'X', 'B', 'M', 'R'][Math.floor(Math.random() * 5)];
    const dnaCode = `SFY-${hex1}-${hex2}${letter}`;

    const { preferences, moisturizingScore, cleansingPowerScore, viscosityIndexCps } = batch.formula;

    const intensity = preferences.fragranceIntensity ?? 60;
    const intensityLabel = intensity <= 35 ? 'Subtle' : intensity <= 70 ? 'Medium' : 'Intense';

    const dominantNotes: string[] = [preferences.fragrance];
    if (preferences.fragrance === 'LAVENDER') dominantNotes.push('Wild Herbaceous', 'French Sage');
    else if (preferences.fragrance === 'ROSE') dominantNotes.push('Petal Dew', 'Damask Bloom');
    else if (preferences.fragrance === 'CITRUS') dominantNotes.push('Crushed Bergamot', 'Mandarin Peel');
    else if (preferences.fragrance === 'VANILLA') dominantNotes.push('Bourbon Orchid', 'Cream');
    else if (preferences.fragrance === 'OCEAN') dominantNotes.push('Marine Salt', 'Coastal Kelp');
    else dominantNotes.push('Pure Cleanse', 'Hypoallergenic');

    const keyActives = [`${preferences.skinType} Skin Complex`, `${preferences.color} Mineral Tint`];

    const publicUrl = QrGenerator.getPublicSoapUrl(dnaCode);

    return {
      dnaCode,
      batchId: batch.id,
      formulaId: batch.formula.formulaId,
      signature: `SIG-ESP32-ECC256-${hex1}`,
      timestamp: new Date().toISOString(),
      machineSerial: batch.machineId,
      volumeMl: batch.formula.targetVolumeMl,
      profileHex: `#${hex1.slice(0, 6)}`,
      skinType: preferences.skinType,
      color: preferences.color,
      fragrance: preferences.fragrance,
      fragranceIntensity: intensity,
      intensityLabel,
      formulaVersion: 'v1.0',
      publicUrl,
      attributeMatrix: {
        moisturizationScore: moisturizingScore,
        fragranceScore: intensity,
        textureIndex: Math.round(viscosityIndexCps / 30),
        clarifyingPower: cleansingPowerScore,
        phBalance: Number(batch.formula.targetPh.toFixed(1)),
      },
      dominantNotes,
      keyActives,
      qrPayload: publicUrl,
    };
  }

  public static getBatchById(id: string): CleanserBatch | undefined {
    return this.getAllBatches().find((b) => b.id === id);
  }

  public static getBatchByDnaCode(dnaCode: string): CleanserBatch | undefined {
    const cleanDna = dnaCode.trim().toUpperCase();
    return this.getAllBatches().find(
      (b) => b.soapDna && b.soapDna.dnaCode.toUpperCase() === cleanDna
    );
  }

  public static updateBatchStatus(batchId: string, status: CleanserBatch['status']): void {
    const batches = this.getAllBatches();
    const batch = batches.find((b) => b.id === batchId);
    if (batch) {
      batch.status = status;
      this.saveBatches(batches);
    }
  }

  public static submitFeedback(batchId: string, feedback: BatchFeedback): void {
    const batches = this.getAllBatches();
    const batch = batches.find((b) => b.id === batchId);
    if (batch) {
      batch.feedback = feedback;
      this.saveBatches(batches);
    }
  }

  public static getAllBatches(): CleanserBatch[] {
    try {
      const stored = localStorage.getItem(BATCH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse batches from localStorage', e);
    }
    const initial = this.getSeedBatches();
    this.saveBatches(initial);
    return initial;
  }

  private static saveBatches(batches: CleanserBatch[]): void {
    try {
      localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(batches));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }

  /**
   * Pre-seeds authentic batches including the requested test record SFY-7A92-24K.
   */
  private static getSeedBatches(): CleanserBatch[] {
    const seed1Formula = FormulationEngine.calculate({
      skinType: 'DRY',
      color: 'LAVENDER',
      fragrance: 'LAVENDER',
      fragranceIntensity: 60,
      volumeMl: 250,
      customName: 'Lavender Serenade Wash',
    });

    const seed2Formula = FormulationEngine.calculate({
      skinType: 'OILY',
      color: 'BLUE',
      fragrance: 'OCEAN',
      fragranceIntensity: 75,
      volumeMl: 250,
      customName: 'Pacific Clarity Facial Gel',
    });

    const seed3Formula = FormulationEngine.calculate({
      skinType: 'SENSITIVE',
      color: 'PINK',
      fragrance: 'ROSE',
      fragranceIntensity: 45,
      volumeMl: 500,
      customName: 'Damask Rose Emollient Cleanser',
    });

    const testDna = 'SFY-7A92-24K';

    return [
      {
        id: 'SOAP-2026-00124',
        formula: seed1Formula,
        status: 'COMPLETED',
        startedAt: '2026-10-01T08:00:00.000Z',
        completedAt: '2026-10-01T08:01:14.000Z',
        targetWeightG: seed1Formula.targetWeightG,
        actualWeightG: Number((seed1Formula.targetWeightG + 0.1).toFixed(1)),
        weightAccuracyPct: 99.94,
        durationSeconds: 74,
        machineId: 'SOAP-DISP-UNIT-ESP32-A1',
        isSimulated: false,
        soapDna: {
          dnaCode: testDna,
          batchId: 'SOAP-2026-00124',
          formulaId: seed1Formula.formulaId,
          signature: 'SIG-ESP32-ECC256-7A92',
          timestamp: '2026-10-01T08:01:14.000Z',
          machineSerial: 'SOAP-DISP-UNIT-ESP32-A1',
          volumeMl: 250,
          profileHex: '#A78BFA',
          skinType: 'DRY',
          color: 'LAVENDER',
          fragrance: 'LAVENDER',
          fragranceIntensity: 60,
          intensityLabel: 'Medium',
          formulaVersion: 'v1.0',
          publicUrl: QrGenerator.getPublicSoapUrl(testDna),
          attributeMatrix: {
            moisturizationScore: 90,
            fragranceScore: 60,
            textureIndex: 62,
            clarifyingPower: 62,
            phBalance: 5.4,
          },
          dominantNotes: ['French Lavender', 'Wild Herbaceous'],
          keyActives: ['Dry Skin Lipid Complex', 'Lavender Mineral Tint'],
          qrPayload: QrGenerator.getPublicSoapUrl(testDna),
        },
        feedback: {
          batchId: 'SOAP-2026-00124',
          submittedAt: '2026-10-01T09:30:00.000Z',
          ratingOverall: 5,
          ratingTexture: 5,
          ratingFragrance: 5,
          ratingMoisturization: 5,
          ratingCleansing: 5,
          skinReaction: 'HYDRATED',
          notes: 'Unbelievably silky and hydrating on dry skin. Aroma is calming and natural.',
          wouldReorder: true,
        },
      },
      {
        id: 'SOAP-2026-00123',
        formula: seed2Formula,
        status: 'COMPLETED',
        startedAt: '2026-09-30T14:10:00.000Z',
        completedAt: '2026-09-30T14:11:18.000Z',
        targetWeightG: seed2Formula.targetWeightG,
        actualWeightG: Number((seed2Formula.targetWeightG - 0.2).toFixed(1)),
        weightAccuracyPct: 99.91,
        durationSeconds: 78,
        machineId: 'SOAP-DISP-UNIT-ESP32-A1',
        isSimulated: false,
        soapDna: {
          dnaCode: 'SFY-3B19-88M',
          batchId: 'SOAP-2026-00123',
          formulaId: seed2Formula.formulaId,
          signature: 'SIG-ESP32-ECC256-3B19',
          timestamp: '2026-09-30T14:11:18.000Z',
          machineSerial: 'SOAP-DISP-UNIT-ESP32-A1',
          volumeMl: 250,
          profileHex: '#38BDF8',
          skinType: 'OILY',
          color: 'BLUE',
          fragrance: 'OCEAN',
          fragranceIntensity: 75,
          intensityLabel: 'Intense',
          formulaVersion: 'v1.0',
          publicUrl: QrGenerator.getPublicSoapUrl('SFY-3B19-88M'),
          attributeMatrix: {
            moisturizationScore: 45,
            fragranceScore: 75,
            textureIndex: 55,
            clarifyingPower: 92,
            phBalance: 5.6,
          },
          dominantNotes: ['Marine Salt', 'Coastal Kelp'],
          keyActives: ['Niacinamide Pore Shield', 'Ocean Mineral Tint'],
          qrPayload: QrGenerator.getPublicSoapUrl('SFY-3B19-88M'),
        },
      },
      {
        id: 'SOAP-2026-00122',
        formula: seed3Formula,
        status: 'COMPLETED',
        startedAt: '2026-09-29T11:20:00.000Z',
        completedAt: '2026-09-29T11:21:40.000Z',
        targetWeightG: seed3Formula.targetWeightG,
        actualWeightG: seed3Formula.targetWeightG,
        weightAccuracyPct: 100.0,
        durationSeconds: 100,
        machineId: 'SOAP-DISP-SIM-01',
        isSimulated: true,
        soapDna: {
          dnaCode: 'SFY-9E44-12R',
          batchId: 'SOAP-2026-00122',
          formulaId: seed3Formula.formulaId,
          signature: 'SIG-ESP32-ECC256-9E44',
          timestamp: '2026-09-29T11:21:40.000Z',
          machineSerial: 'SOAP-DISP-SIM-01',
          volumeMl: 500,
          profileHex: '#F472B6',
          skinType: 'SENSITIVE',
          color: 'PINK',
          fragrance: 'ROSE',
          fragranceIntensity: 45,
          intensityLabel: 'Medium',
          formulaVersion: 'v1.0',
          publicUrl: QrGenerator.getPublicSoapUrl('SFY-9E44-12R'),
          attributeMatrix: {
            moisturizationScore: 80,
            fragranceScore: 45,
            textureIndex: 70,
            clarifyingPower: 65,
            phBalance: 5.2,
          },
          dominantNotes: ['Damask Rose', 'Petal Dew'],
          keyActives: ['Aloe Vera Soothing Gel', 'Rose Botanical Extract'],
          qrPayload: QrGenerator.getPublicSoapUrl('SFY-9E44-12R'),
        },
      },
    ];
  }
}
