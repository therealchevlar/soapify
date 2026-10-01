/**
 * @file presets.ts
 * @description Catalog of botanical active ingredients, reservoir definitions, and formulation presets.
 */

import { ActiveAdditive, FragranceFamily, ProductType, TextureViscosity } from '../../types/formulation';

export interface ReservoirConfig {
  id: number;
  pumpId: number;
  name: string;
  chemicalName: string;
  inci: string;
  category: 'SURFACTANT' | 'MOISTURIZER' | 'FRAGRANCE' | 'ADDITIVE' | 'VISCOSITY';
  densityGPerMl: number;
  colorHex: string;
  defaultCapacityMl: number;
}

export const MACHINE_RESERVOIRS: ReservoirConfig[] = [
  {
    id: 1,
    pumpId: 1,
    name: 'Glucoside Surfactant Base',
    chemicalName: 'Decyl & Coco-Glucoside Clean Bio-Matrix',
    inci: 'Decyl Glucoside (and) Coco-Glucoside (and) Aqua',
    category: 'SURFACTANT',
    densityGPerMl: 1.04,
    colorHex: '#38BDF8', // Sky cyan
    defaultCapacityMl: 2000,
  },
  {
    id: 2,
    pumpId: 2,
    name: 'Ceramide Squalane Emollient',
    chemicalName: 'Phytosqualane & Biomimetic Ceramide Complex',
    inci: 'Squalane (and) Ceramide NP (and) Glycerin',
    category: 'MOISTURIZER',
    densityGPerMl: 1.06,
    colorHex: '#34D399', // Emerald
    defaultCapacityMl: 1000,
  },
  {
    id: 3,
    pumpId: 3,
    name: 'Aromatic Botanical Essence',
    chemicalName: 'Cold-Pressed Terpene & Botanical Fragrance Isolate',
    inci: 'Parfum / Natural Essential Oil Complex',
    category: 'FRAGRANCE',
    densityGPerMl: 0.94,
    colorHex: '#FBBF24', // Amber gold
    defaultCapacityMl: 500,
  },
  {
    id: 4,
    pumpId: 4,
    name: 'Hyaluronic & Botanical Actives',
    chemicalName: 'Triple-Molecular Weight Hyaluronate & Niacinamide',
    inci: 'Sodium Hyaluronate (and) Niacinamide (and) Camellia Sinensis',
    category: 'ADDITIVE',
    densityGPerMl: 1.01,
    colorHex: '#A78BFA', // Violet
    defaultCapacityMl: 750,
  },
  {
    id: 5,
    pumpId: 5,
    name: 'Natural Rheology Viscosity Matrix',
    chemicalName: 'Xanthan & Cellulose Hydrocolloid Gel Base',
    inci: 'Xanthan Gum (and) Hydroxyethylcellulose (and) Citric Acid',
    category: 'VISCOSITY',
    densityGPerMl: 1.08,
    colorHex: '#F472B6', // Rose
    defaultCapacityMl: 1000,
  },
];

export const ACTIVE_ADDITIVES: ActiveAdditive[] = [
  {
    id: 'HYALURONIC_COMPLEX',
    name: 'Multi-Depth Hyaluronic Complex',
    category: 'HYDRATION',
    concentration: '1.5% Tri-Molecular',
    description: 'Binds moisture at stratum corneum depth for persistent 24h supple hydration.',
    pumpId: 4,
  },
  {
    id: 'NIACINAMIDE_2PCT',
    name: 'Niacinamide (Vitamin B3)',
    category: 'PURIFYING',
    concentration: '2.0% Pharmaceutical Grade',
    description: 'Soothes inflammation, refines pores, and balances sebum production.',
    pumpId: 4,
  },
  {
    id: 'ALOE_VERA_CONCENTRATE',
    name: 'Aloe Barbadensis Leaf Juice (200x)',
    category: 'CALMING',
    concentration: '10.0% Equivalent',
    description: 'Polysaccharide-rich cold-processed leaf gel to soothe sensitized skin barriers.',
    pumpId: 4,
  },
  {
    id: 'GREEN_TEA_POLYPHENOLS',
    name: 'Green Tea (EGCG) Polyphenols',
    category: 'ANTIOXIDANT',
    concentration: '0.8% Standardized',
    description: 'Potent cellular antioxidant neutralizing environmental urban stressors.',
    pumpId: 4,
  },
  {
    id: 'VITAMIN_E_TOCOPHEROL',
    name: 'D-Alpha Tocopherol',
    category: 'ANTIOXIDANT',
    concentration: '0.5% Active Complex',
    description: 'Lipid-soluble antioxidant preventing oxidative breakdown of delicate skin lipids.',
    pumpId: 4,
  },
  {
    id: 'SALICYLIC_MICRODOSE',
    name: 'Salicylic Micro-Dose (BHA)',
    category: 'PURIFYING',
    concentration: '0.5% Encapsulated',
    description: 'Gentle lipophilic micro-exfoliation to dissolve follicular congestion without stripping.',
    pumpId: 4,
  },
];

export const FRAGRANCE_PRESETS: {
  id: FragranceFamily;
  title: string;
  origin: string;
  notes: string[];
  description: string;
}[] = [
  {
    id: 'FRAGRANCE_FREE',
    title: 'Pure Fragrance-Free',
    origin: 'Dermatological Clean',
    notes: ['Neutral', 'Hypoallergenic', 'Zero-Odor'],
    description: 'Clinical grade zero-fragrance formulation for hyper-reactive and eczema-prone skin.',
  },
  {
    id: 'MEDITERRANEAN_BERGAMOT',
    title: 'Mediterranean Bergamot & Petitgrain',
    origin: 'Calabria, Italy',
    notes: ['Sparkling Bergamot', 'Crisp Neroli', 'Sunlit Amber'],
    description: 'Crisp uplifting citrus peel with bitter floral undertones and solar warmth.',
  },
  {
    id: 'NORDIC_PINE_CEDAR',
    title: 'Nordic Pine Needle & Smoked Cedar',
    origin: 'Lapland, Finland',
    notes: ['Balsam Fir', 'Smoked Cedarwood', 'Crisp Glacier Moss'],
    description: 'Deep grounding sub-arctic boreal forest scent with resinous woody richness.',
  },
  {
    id: 'JAPANESE_YUZU_HINOKI',
    title: 'Japanese Yuzu & Hinoki Cypress',
    origin: 'Kochi Prefecture, Japan',
    notes: ['Tart Yuzu Peel', 'Steamed Hinoki Wood', 'Ginger Root'],
    description: 'Traditional onsen bath aromatic profile of zesty tart citrus and meditative sacred wood.',
  },
  {
    id: 'FRENCH_LAVENDER_SAGE',
    title: 'High-Altitude Lavender & Clary Sage',
    origin: 'Provence, France',
    notes: ['Wild Lavender Angustifolia', 'Crushed Clary Sage', 'White Thyme'],
    description: 'Herbaceous balancing aroma known for calming central nervous system arousal.',
  },
  {
    id: 'CRISP_WHITE_TEA',
    title: 'White Tea & Sparkling Mandarin',
    origin: 'Fujian Highlands',
    notes: ['Silver Needle Tea', 'Mandarin Blossom', 'Clean Musk'],
    description: 'Refined delicate white tea leaf notes with a soft translucent botanical breeze.',
  },
  {
    id: 'EUCALYPTUS_MINT',
    title: 'Tasmanian Eucalyptus & Wild Mint',
    origin: 'Victoria, Australia',
    notes: ['Blue Gum Eucalyptus', 'Peppermint Leaf', 'Menthol Frost'],
    description: 'Invigorating respiratory clarity and cooling sensation ideal for morning revival.',
  },
];

export const PRODUCT_TYPES_META: Record<
  ProductType,
  {
    title: string;
    subtitle: string;
    description: string;
    defaultVolumeMl: number;
    baseViscosityCps: number;
    recommendedPh: number;
  }
> = {
  FACIAL_CLEANSER: {
    title: 'Precision Facial Cleanser',
    subtitle: 'Micro-micellar skin barrier shield',
    description: 'Ultra-gentle low-irritation facial formula that purifies pores while preserving stratum corneum lipids.',
    defaultVolumeMl: 250,
    baseViscosityCps: 1800,
    recommendedPh: 5.4,
  },
  BODY_WASH: {
    title: 'Nourishing Body Cleanser',
    subtitle: 'Full-body restorative emulsion',
    description: 'Rich foaming botanical lather designed for full-body daily hygiene and barrier moisturization.',
    defaultVolumeMl: 500,
    baseViscosityCps: 2600,
    recommendedPh: 5.6,
  },
  HAND_WASH: {
    title: 'Frequent-Wash Hand Cleanser',
    subtitle: 'Non-stripping restorative wash',
    description: 'Engineered for repeated daily handwashing; combines antimicrobial cleanliness with intense barrier emollients.',
    defaultVolumeMl: 250,
    baseViscosityCps: 2100,
    recommendedPh: 5.5,
  },
  SENSITIVE_MICELLAR: {
    title: 'Sensitized Skin Micellar Gel',
    subtitle: 'Zero-irritation calming fluid',
    description: 'Minimalist hypoallergenic surfactant micelles calibrated for rosacea, dermatitis, and post-procedure skin.',
    defaultVolumeMl: 250,
    baseViscosityCps: 1200,
    recommendedPh: 5.2,
  },
  EXFOLIATING_BOTANICAL: {
    title: 'Botanical Resurfacing Wash',
    subtitle: 'Subtle micro-exfoliating radiance',
    description: 'Combines enzymatic fruit extracts and gentle botanical acids for smooth, glowing skin renewal.',
    defaultVolumeMl: 250,
    baseViscosityCps: 2300,
    recommendedPh: 4.8,
  },
};
