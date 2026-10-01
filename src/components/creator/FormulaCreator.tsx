/**
 * @file FormulaCreator.tsx
 * @description Consumer-first personalized cleanser configurator.
 * Supports both crisp light and sleek dark mode:
 * Light: Crisp White + Sky Blue + Soft Mint + Sunny Yellow.
 * Dark: Obsidian/Deep Slate + Neon Sky + Emerald Mint + Warm Amber.
 * 1. Skin Type → 2. Color → 3. Fragrance → 4. Intensity → 5. Volume → 6. Review & Create.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMachine } from '../../context/MachineContext';
import { BatchManager } from '../../services/batches/batchManager';
import { ConsumerFragrance, SkinType, SoapColor } from '../../types/formulation';
import { FormulationTransition } from '../batch/FormulationTransition';
import {
  IconBottleSilhouette,
  IconDroplet,
  IconScentWaves,
  IconSkinShield,
  IconSparkleCheck,
} from '../ui/Animaticons';
import { Button } from '../ui/Button';
import { COLOR_CONFIG, LiveBottlePreview } from './LiveBottlePreview';

export const FormulaCreator: React.FC = () => {
  const { preferences, updatePreferences, activeFormula, setActiveBatch, setCurrentView, theme } = useApp();
  const { startBatch, setSimulationSpeed } = useMachine();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const totalSteps = 6;

  // Step 1: Skin Type Options
  const skinTypes: { id: SkinType; title: string; desc: string }[] = [
    {
      id: 'NORMAL',
      title: 'NORMAL',
      desc: 'Comfortable balance and natural oil equilibrium.',
    },
    {
      id: 'DRY',
      title: 'DRY',
      desc: 'Comforting hydration and a softer, nourished feel.',
    },
    {
      id: 'OILY',
      title: 'OILY',
      desc: 'Clarifying botanical lift and refreshing pore balance.',
    },
    {
      id: 'COMBINATION',
      title: 'COMBINATION',
      desc: 'Dual-zone adaptive moisture and gentle cleansing.',
    },
    {
      id: 'SENSITIVE',
      title: 'SENSITIVE',
      desc: 'Hypoallergenic calming lipids with zero sting.',
    },
  ];

  // Step 2: Color Options
  const colors: SoapColor[] = ['CLEAR', 'WHITE', 'PINK', 'BLUE', 'GREEN', 'LAVENDER', 'AMBER'];

  // Step 3: Fragrance Options
  const fragrances: { id: ConsumerFragrance; title: string; notes: string; aroma: string }[] = [
    {
      id: 'LAVENDER',
      title: 'LAVENDER',
      notes: 'Calming wild herbs & Provencal floral peace',
      aroma: 'Soothing floral',
    },
    {
      id: 'ROSE',
      title: 'ROSE',
      notes: 'Morning petal dew & soft Damask bloom',
      aroma: 'Delicate floral',
    },
    {
      id: 'CITRUS',
      title: 'CITRUS',
      notes: 'Sparkling Italian bergamot peel & solar zest',
      aroma: 'Uplifting zesty',
    },
    {
      id: 'VANILLA',
      title: 'VANILLA',
      notes: 'Warm Madagascar bean & velvety orchid cream',
      aroma: 'Comforting warm',
    },
    {
      id: 'OCEAN',
      title: 'OCEAN',
      notes: 'Crisp sea salt & coastal morning breeze',
      aroma: 'Fresh aquatic',
    },
    {
      id: 'UNSCENTED',
      title: 'UNSCENTED',
      notes: 'Hypoallergenic dermatological pure base',
      aroma: 'Zero fragrance',
    },
  ];

  // Handle "CREATE MY SOAP"
  const handleInitiateBatch = () => {
    setIsTransitioning(true);
  };

  const handleTransitionComplete = async () => {
    setIsTransitioning(false);
    const batch = BatchManager.createBatch(activeFormula, true);
    setActiveBatch(batch);
    setSimulationSpeed(2.0);
    await startBatch(batch.id, activeFormula);
    setCurrentView('machine-dashboard');
  };

  const intensityVal = preferences.fragranceIntensity ?? 60;
  const intensityText =
    preferences.fragrance === 'UNSCENTED'
      ? 'None'
      : intensityVal <= 35
      ? 'Subtle'
      : intensityVal <= 70
      ? 'Medium'
      : 'Intense';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 select-none transition-colors duration-200">
      {/* Intelligent Transition Animation Screen */}
      {isTransitioning && (
        <FormulationTransition
          customName={preferences.customName}
          onComplete={handleTransitionComplete}
        />
      )}

      {/* Top Progress Track */}
      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1.5">
              <span>FORMULA CREATOR</span>
              <span>·</span>
              <span>STEP 0{currentStep} OF 0{totalSteps}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentStep === 1 && 'YOUR SKIN'}
              {currentStep === 2 && 'YOUR COLOR'}
              {currentStep === 3 && 'YOUR FRAGRANCE'}
              {currentStep === 4 && 'FRAGRANCE INTENSITY'}
              {currentStep === 5 && 'YOUR VOLUME'}
              {currentStep === 6 && 'YOUR SOAP'}
            </h1>
          </div>

          {/* Stepper bar with glowing pill */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <button
                key={s}
                onClick={() => setCurrentStep(s)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  s === currentStep
                    ? 'w-10 bg-sky-500 shadow-sm shadow-sky-500/30'
                    : s < currentStep
                    ? 'w-4 bg-emerald-500'
                    : 'w-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
                aria-label={`Jump to step ${s}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Interactive Selection Stage (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: YOUR SKIN */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                How does your skin feel most of the day?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skinTypes.map((item) => {
                  const isSelected = preferences.skinType === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => updatePreferences({ skinType: item.id })}
                      className={`p-6 rounded-3xl border text-left cursor-pointer transition-all duration-200 select-none ${
                        isSelected
                          ? 'bg-sky-50/80 dark:bg-sky-950/60 border-sky-400 dark:border-sky-500 ring-2 ring-sky-300/40 dark:ring-sky-500/30 shadow-md shadow-sky-500/10 -translate-y-0.5'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <IconSkinShield
                            className="w-6 h-6"
                            color={isSelected ? '#0284c7' : theme === 'dark' ? '#94a3b8' : '#64748b'}
                          />
                          <span className={`text-base font-extrabold tracking-tight ${isSelected ? 'text-sky-950 dark:text-sky-200' : 'text-slate-800 dark:text-slate-200'}`}>
                            {item.title}
                          </span>
                        </div>
                        {isSelected && <IconSparkleCheck className="w-5 h-5" color="#059669" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: YOUR COLOR */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                Choose your cleanser liquid shade:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {colors.map((cKey) => {
                  const cfg = COLOR_CONFIG[cKey];
                  const isSelected = preferences.color === cKey;
                  return (
                    <div
                      key={cKey}
                      onClick={() => updatePreferences({ color: cKey })}
                      className={`p-5 rounded-3xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-sky-50/80 dark:bg-sky-950/60 border-sky-400 dark:border-sky-500 ring-2 ring-sky-300/40 dark:ring-sky-500/30 shadow-md -translate-y-0.5'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                      }`}
                    >
                      <div className="relative mb-3">
                        <div
                          className="w-14 h-14 rounded-full shadow-inner border border-black/5 transition-transform duration-200 hover:scale-105"
                          style={{
                            backgroundColor: cfg.hex,
                            boxShadow: `0 4px 16px ${cfg.hex}50`,
                          }}
                        />
                        {isSelected && (
                          <div className="absolute inset-0 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                            <IconSparkleCheck className="w-5 h-5 shadow-sm" color="#059669" />
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{cfg.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: YOUR FRAGRANCE */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                Select your signature botanical aroma:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fragrances.map((frag) => {
                  const isSelected = preferences.fragrance === frag.id;
                  return (
                    <div
                      key={frag.id}
                      onClick={() => updatePreferences({ fragrance: frag.id })}
                      className={`p-6 rounded-3xl border text-left cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-amber-50/80 dark:bg-amber-950/50 border-amber-400 dark:border-amber-500 ring-2 ring-amber-300/40 dark:ring-amber-500/30 shadow-md -translate-y-0.5'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <IconScentWaves
                            className="w-5 h-5"
                            color={isSelected ? '#d97706' : theme === 'dark' ? '#94a3b8' : '#64748b'}
                          />
                          <span className="font-extrabold text-base text-slate-900 dark:text-white">{frag.title}</span>
                        </div>
                        {isSelected ? (
                          <IconSparkleCheck className="w-5 h-5" color="#059669" />
                        ) : (
                          <span className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800">
                            {frag.aroma}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">{frag.notes}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: FRAGRANCE INTENSITY */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {preferences.fragrance === 'UNSCENTED' ? (
                <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs transition-colors">
                  <IconDroplet className="w-10 h-10 mx-auto" color="#10b981" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pure Unscented Cleanser</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    You have chosen an unscented formula. Scent intensity is calibrated to zero for complete hypoallergenic pure care.
                  </p>
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">Aroma Intensity</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Adjust how present the {preferences.fragrance.toLowerCase()} essence feels.
                      </p>
                    </div>
                    <span className="text-base font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 px-3 py-1 rounded-full">
                      {intensityText} ({intensityVal}%)
                    </span>
                  </div>

                  <div className="space-y-4 pt-2">
                    <input
                      type="range"
                      min="15"
                      max="100"
                      step="5"
                      value={intensityVal}
                      onChange={(e) =>
                        updatePreferences({ fragranceIntensity: Number(e.target.value) })
                      }
                      className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <div className="flex justify-between text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                      <span>SUBTLE</span>
                      <span>BALANCED</span>
                      <span>INTENSE</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: YOUR VOLUME */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                Choose your bottle volume:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { ml: 100, label: 'Travel Vial', desc: 'Compact frosted cylinder' },
                  { ml: 250, label: 'Standard Bottle', desc: 'Daily luxury pump bottle' },
                  { ml: 500, label: 'Family Dispenser', desc: 'Extended countertop size' },
                ].map((vol) => {
                  const isSelected = preferences.volumeMl === vol.ml;
                  return (
                    <button
                      key={vol.ml}
                      type="button"
                      onClick={() => updatePreferences({ volumeMl: vol.ml })}
                      className={`p-7 rounded-3xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50/80 dark:bg-sky-950/60 border-sky-400 dark:border-sky-500 ring-2 ring-sky-300/40 dark:ring-sky-500/30 shadow-md text-sky-950 dark:text-sky-200 -translate-y-0.5'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                      }`}
                    >
                      <IconBottleSilhouette
                        className="w-8 h-8 mx-auto mb-2"
                        color={isSelected ? '#0284c7' : theme === 'dark' ? '#94a3b8' : '#64748b'}
                      />
                      <div className="text-3xl font-mono font-black mb-1">{vol.ml} ml</div>
                      <div className="text-sm font-bold">{vol.label}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{vol.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: YOUR SOAP (REVIEW) */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest block mb-1">
                    YOUR BESPOKE CLEANSER
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {preferences.customName || `${preferences.fragrance} Cleanser`}
                  </h3>
                </div>

                {/* Clean Consumer Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 dark:text-slate-500 block mb-1 text-[10px]">SKIN TYPE</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{preferences.skinType}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 dark:text-slate-500 block mb-1 text-[10px]">COLOR</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{preferences.color}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 dark:text-slate-500 block mb-1 text-[10px]">FRAGRANCE</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{preferences.fragrance}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 dark:text-slate-500 block mb-1 text-[10px]">INTENSITY</span>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{intensityText}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 dark:text-slate-500 block mb-1 text-[10px]">VOLUME</span>
                    <span className="text-sm font-bold text-sky-600 dark:text-sky-400">{preferences.volumeMl} ml</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 dark:text-slate-500 block mb-1 text-[10px]">PRECISION</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">0.1 g</span>
                  </div>
                </div>

                {/* Big Action CTA */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <Button
                    variant="primary"
                    size="xl"
                    className="w-full text-lg font-bold shadow-lg shadow-sky-500/25 cursor-pointer bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={handleInitiateBatch}
                  >
                    CREATE MY SOAP →
                  </Button>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="w-full text-center text-xs font-mono font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-1 cursor-pointer transition-colors"
                  >
                    ← Edit Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Footer Controls */}
          {currentStep < 6 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 transition-colors">
              {currentStep > 1 ? (
                <Button variant="outline" size="sm" onClick={() => setCurrentStep(currentStep - 1)}>
                  ← Back
                </Button>
              ) : (
                <div />
              )}
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="cursor-pointer font-bold shadow-md shadow-sky-500/20"
              >
                Continue →
              </Button>
            </div>
          )}
        </div>

        {/* Right Sticky Preview: Live Product Bottle Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="p-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md transition-colors">
            <LiveBottlePreview
              color={preferences.color}
              fragrance={preferences.fragrance}
              volumeMl={preferences.volumeMl}
              skinType={preferences.skinType}
              customName={preferences.customName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulaCreator;
