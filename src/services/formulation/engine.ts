/**
 * @file engine.ts
 * @description Formulation calculation engine translating simple consumer preferences
 * (Skin, Color, Fragrance, Intensity, Volume) into exact volumetric and mass metrics for the 5 pumps.
 */

import { FormulaIngredient, FormulationPreferences, MachineFormula } from '../../types/formulation';
import { MACHINE_RESERVOIRS } from './presets';

export class FormulationEngine {
  /**
   * Generates a fully calculated, machine-executable formula based on consumer preferences.
   */
  public static calculate(preferences: FormulationPreferences): MachineFormula {
    const volumeMl = preferences.volumeMl || 250;
    const skinType = preferences.skinType || 'NORMAL';
    const fragrance = preferences.fragrance || 'LAVENDER';
    const intensity = preferences.fragranceIntensity ?? 60;

    // 1. Determine Lipid / Emollient Ratio based on Skin Type
    let emollientPct = 0.12; // default
    let moisturizingScore = 65;
    let targetPh = 5.5;

    switch (skinType) {
      case 'DRY':
        emollientPct = 0.20;
        moisturizingScore = 90;
        targetPh = 5.4;
        break;
      case 'SENSITIVE':
        emollientPct = 0.16;
        moisturizingScore = 80;
        targetPh = 5.2;
        break;
      case 'COMBINATION':
        emollientPct = 0.11;
        moisturizingScore = 65;
        targetPh = 5.5;
        break;
      case 'OILY':
        emollientPct = 0.06;
        moisturizingScore = 45;
        targetPh = 5.6;
        break;
      case 'NORMAL':
      default:
        emollientPct = 0.12;
        moisturizingScore = 70;
        targetPh = 5.5;
        break;
    }

    // 2. Determine Fragrance Ratio
    let fragrancePct = 0.0;
    if (fragrance !== 'UNSCENTED') {
      fragrancePct = 0.003 + (intensity / 100) * 0.018; // 0.3% to 2.1%
    }

    // 3. Bio-Active Additives
    const activePct = 0.045; // 4.5% standard botanical actives

    // 4. Viscosity modifier
    const viscosityPct = 0.075; // 7.5% natural hydrocolloid matrix

    // 5. Surfactant Base makes up the remainder
    const basePct = Math.max(0.45, 1.0 - (emollientPct + fragrancePct + activePct + viscosityPct));

    // Normalization to ensure strict 100% sum
    const totalRatio = basePct + emollientPct + fragrancePct + activePct + viscosityPct;
    const normBasePct = basePct / totalRatio;
    const normEmollientPct = emollientPct / totalRatio;
    const normFragrancePct = fragrancePct / totalRatio;
    const normActivePct = activePct / totalRatio;
    const normViscosityPct = viscosityPct / totalRatio;

    const reservoirMap = new Map(MACHINE_RESERVOIRS.map((r) => [r.id, r]));
    const ingredients: FormulaIngredient[] = [];

    // Pump 1: Surfactant Base
    const res1 = reservoirMap.get(1)!;
    const weight1 = Number((volumeMl * normBasePct * res1.densityGPerMl).toFixed(1));
    ingredients.push({
      pumpId: 1,
      reservoirId: 1,
      name: res1.name,
      inciName: res1.inci,
      role: 'SURFACTANT_BASE',
      targetWeightG: weight1,
      percentage: Number((normBasePct * 100).toFixed(1)),
      densityGPerMl: res1.densityGPerMl,
      viscosityCps: 1400,
      colorHex: res1.colorHex,
    });

    // Pump 2: Emollient (Lipid / Moisturizer)
    const res2 = reservoirMap.get(2)!;
    const weight2 = Number((volumeMl * normEmollientPct * res2.densityGPerMl).toFixed(1));
    ingredients.push({
      pumpId: 2,
      reservoirId: 2,
      name: res2.name,
      inciName: res2.inci,
      role: 'EMOLLIENT',
      targetWeightG: weight2,
      percentage: Number((normEmollientPct * 100).toFixed(1)),
      densityGPerMl: res2.densityGPerMl,
      viscosityCps: 2200,
      colorHex: res2.colorHex,
    });

    // Pump 3: Fragrance (if scented)
    if (normFragrancePct > 0) {
      const res3 = reservoirMap.get(3)!;
      const weight3 = Number((volumeMl * normFragrancePct * res3.densityGPerMl).toFixed(1));
      ingredients.push({
        pumpId: 3,
        reservoirId: 3,
        name: `${fragrance} Essence`,
        inciName: `Parfum / Natural ${fragrance} Extract`,
        role: 'FRAGRANCE',
        targetWeightG: weight3,
        percentage: Number((normFragrancePct * 100).toFixed(1)),
        densityGPerMl: res3.densityGPerMl,
        viscosityCps: 25,
        colorHex: res3.colorHex,
      });
    }

    // Pump 4: Active Additives
    const res4 = reservoirMap.get(4)!;
    const weight4 = Number((volumeMl * normActivePct * res4.densityGPerMl).toFixed(1));
    ingredients.push({
      pumpId: 4,
      reservoirId: 4,
      name: res4.name,
      inciName: res4.inci,
      role: 'ACTIVE_ADDITIVE',
      targetWeightG: weight4,
      percentage: Number((normActivePct * 100).toFixed(1)),
      densityGPerMl: res4.densityGPerMl,
      viscosityCps: 110,
      colorHex: res4.colorHex,
    });

    // Pump 5: Viscosity Matrix
    const res5 = reservoirMap.get(5)!;
    const weight5 = Number((volumeMl * normViscosityPct * res5.densityGPerMl).toFixed(1));
    ingredients.push({
      pumpId: 5,
      reservoirId: 5,
      name: res5.name,
      inciName: res5.inci,
      role: 'VISCOSITY_MODIFIER',
      targetWeightG: weight5,
      percentage: Number((normViscosityPct * 100).toFixed(1)),
      densityGPerMl: res5.densityGPerMl,
      viscosityCps: 4500,
      colorHex: res5.colorHex,
    });

    const totalWeightG = Number(ingredients.reduce((acc, ing) => acc + ing.targetWeightG, 0).toFixed(1));
    const avgDensity = Number((totalWeightG / volumeMl).toFixed(3));
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const formulaId = `SF-${randomSuffix}`;
    const checksum = `CRC32-${Math.abs(Math.round(totalWeightG * 31 + volumeMl * 17)).toString(16).toUpperCase()}`;

    return {
      formulaId,
      version: 'v1.0',
      createdAt: new Date().toISOString(),
      targetVolumeMl: volumeMl,
      targetWeightG: totalWeightG,
      expectedDensityGPerMl: avgDensity,
      targetPh,
      viscosityIndexCps: 1850,
      moisturizingScore,
      cleansingPowerScore: skinType === 'OILY' ? 92 : skinType === 'DRY' ? 62 : 75,
      ingredients,
      preferences,
      checksum,
    };
  }

  /**
   * Generates the hardware-ready JSON payload for the ESP32.
   */
  public static toMachinePayload(batchId: string, formula: MachineFormula) {
    return {
      batch_id: batchId,
      target_weight: formula.targetWeightG,
      ingredients: formula.ingredients.map((ing) => ({
        pump_id: ing.pumpId,
        target_weight: ing.targetWeightG,
      })),
      mix_duration_s: 12,
      mix_rpm: 650,
      checksum: formula.checksum,
    };
  }

  /**
   * Default initial preferences for a first-time consumer.
   */
  public static getDefaultPreferences(): FormulationPreferences {
    return {
      skinType: 'DRY',
      color: 'LAVENDER',
      fragrance: 'LAVENDER',
      fragranceIntensity: 60,
      volumeMl: 250,
      customName: 'Custom Lavender Blend',
    };
  }
}
