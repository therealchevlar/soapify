/**
 * @file FormulationTransition.tsx
 * @description Intelligent transitional state animation played when the user initiates
 * a batch. Walks through personalizing, formulating, preparing machine, and ready states.
 * Styled in the bright, fresh, skincare-grade SOAPIFY visual language.
 */

import React, { useEffect, useState } from 'react';
import { SoapifyLogo } from '../brand/SoapifyLogo';
import { IconDroplet, IconMixerVortex, IconSparkleCheck } from '../ui/Animaticons';

interface FormulationTransitionProps {
  onComplete: () => void;
  customName?: string;
}

export const FormulationTransition: React.FC<FormulationTransitionProps> = ({
  onComplete,
  customName,
}) => {
  const [stepIndex, setStepIndex] = useState<number>(0);

  const steps = [
    {
      stage: 'PERSONALIZING YOUR SOAP',
      desc: 'Analyzing your skin condition & barrier hydration needs...',
      pct: 25,
      icon: <IconDroplet className="w-8 h-8 mx-auto" color="#0284c7" />,
    },
    {
      stage: 'CREATING YOUR FORMULATION',
      desc: 'Balancing surfactant micelle ratios & active lipid suspension...',
      pct: 55,
      icon: <IconMixerVortex className="w-8 h-8 mx-auto" color="#059669" />,
    },
    {
      stage: 'PREPARING SOAPIFY',
      desc: 'Generating closed-loop pump dosing sequence & scale tare calibration...',
      pct: 85,
      icon: <IconDroplet className="w-8 h-8 mx-auto" color="#f59e0b" />,
    },
    {
      stage: 'YOUR FORMULA IS READY',
      desc: 'Your personalized blend is validated and ready for dispensing.',
      pct: 100,
      icon: <IconSparkleCheck className="w-8 h-8 mx-auto" color="#059669" />,
    },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStepIndex(1), 1100);
    const timer2 = setTimeout(() => setStepIndex(2), 2200);
    const timer3 = setTimeout(() => setStepIndex(3), 3200);
    const timer4 = setTimeout(() => {
      onComplete();
    }, 4200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  const current = steps[stepIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md select-none">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
        <SoapifyLogo variant="mark-only" size="md" theme="light" className="mx-auto" />

        <div className="py-2">
          {current.icon}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-600 block">
            {current.stage}
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {customName || 'Bespoke Cleanser'}
          </h3>
          <p className="text-xs text-slate-500 min-h-[36px] flex items-center justify-center leading-relaxed">
            {current.desc}
          </p>
        </div>

        {/* Minimalist Progress Meter */}
        <div className="space-y-2 pt-2">
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${current.pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 font-semibold">
            <span>PRECISION ENGINE</span>
            <span>{current.pct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
