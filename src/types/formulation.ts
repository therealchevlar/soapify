/**
 * @file formulation.ts
 * @description Types for SOAPIFY personal cleanser formulation chemistry.
 * Supports both clean consumer preferences (Skin, Color, Fragrance, Intensity, Volume)
 * and deep technical/machine formulas for the ESP32 controller.
 */

export type SkinType = 'NORMAL' | 'DRY' | 'OILY' | 'COMBINATION' | 'SENSITIVE';

export type SoapColor = 'CLEAR' | 'WHITE' | 'PINK' | 'BLUE' | 'GREEN' | 'LAVENDER' | 'AMBER';

export type ConsumerFragrance = 'LAVENDER' | 'ROSE' | 'CITRUS' | 'VANILLA' | 'OCEAN' | 'UNSCENTED';

export type ProductType = 
  | 'FACIAL_CLEANSER'
  | 'BODY_WASH'
  | 'HAND_WASH'
  | 'SENSITIVE_MICELLAR'
  | 'EXFOLIATING_BOTANICAL';

export type MoisturizationLevel = 'LIGHT' | 'BALANCED' | 'RICH' | 'ULTRA_EMOLLIENT';

export type FragranceFamily = 
  | 'FRAGRANCE_FREE'
  | 'NORDIC_PINE_CEDAR'
  | 'MEDITERRANEAN_BERGAMOT'
  | 'FRENCH_LAVENDER_SAGE'
  | 'JAPANESE_YUZU_HINOKI'
  | 'CRISP_WHITE_TEA'
  | 'EUCALYPTUS_MINT';

export type TextureViscosity = 'LIGHT_FLUID' | 'BALANCED_GEL' | 'RICH_VISCOUS' | 'VELVET_CREAM';

export type CleansingCharacteristic = 
  | 'GENTLE_LOW_FOAM'
  | 'MICRO_BUBBLE_LATHER'
  | 'DEEP_CLARIFYING'
  | 'BARRIER_REPAIR_CERAMIDE';

export type ActiveAdditiveId = 
  | 'NIACINAMIDE_2PCT'
  | 'HYALURONIC_COMPLEX'
  | 'ALOE_VERA_CONCENTRATE'
  | 'GREEN_TEA_POLYPHENOLS'
  | 'VITAMIN_E_TOCOPHEROL'
  | 'SALICYLIC_MICRODOSE';

export interface ActiveAdditive {
  id: ActiveAdditiveId;
  name: string;
  category: 'HYDRATION' | 'CALMING' | 'PURIFYING' | 'ANTIOXIDANT';
  concentration: string;
  description: string;
  pumpId: number;
}

export interface FormulationPreferences {
  // Consumer Choices
  skinType: SkinType;
  color: SoapColor;
  fragrance: ConsumerFragrance;
  fragranceIntensity: number; // 0 to 100%
  volumeMl: number; // 100, 250, 500, or custom
  customName?: string;

  // Internal Chemical Derivations (calculated by engine)
  productType?: ProductType;
  moisturization?: MoisturizationLevel;
  texture?: TextureViscosity;
  cleansingProfile?: CleansingCharacteristic;
  additives?: ActiveAdditiveId[];
  phTarget?: number;
}

export interface FormulaIngredient {
  pumpId: number;
  reservoirId: number;
  name: string;
  inciName: string;
  role: 'SURFACTANT_BASE' | 'EMOLLIENT' | 'FRAGRANCE' | 'ACTIVE_ADDITIVE' | 'VISCOSITY_MODIFIER' | 'BUFFER';
  targetWeightG: number;
  percentage: number;
  densityGPerMl: number;
  viscosityCps: number;
  colorHex: string;
}

export interface MachineFormula {
  formulaId: string;
  version: string;
  createdAt: string;
  targetVolumeMl: number;
  targetWeightG: number;
  expectedDensityGPerMl: number;
  targetPh: number;
  viscosityIndexCps: number;
  moisturizingScore: number; // 0 - 100
  cleansingPowerScore: number; // 0 - 100
  ingredients: FormulaIngredient[];
  preferences: FormulationPreferences;
  checksum: string; // SHA-like validation for ESP32 integrity
}
