/**
 * @file LandingPage.tsx
 * @description Premium product presentation and startup launch website for SOAPIFY.
 * Supports both crisp light and sleek dark mode:
 * Light: Crisp White + Sky Blue + Soft Mint + Sunny Yellow accents.
 * Dark: Obsidian/Deep Slate + Neon Sky + Emerald Mint + Warm Amber accents.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { SoapifyLogo } from '../brand/SoapifyLogo';
import { LiveBottlePreview } from '../creator/LiveBottlePreview';
import { MachineIllustration } from '../machine/MachineIllustration';
import { Button } from '../ui/Button';

export const LandingPage: React.FC = () => {
  const { setCurrentView, preferences, startDemo, theme } = useApp();

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-28 py-6 select-none bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* ---------------------------------------------------- */}
      {/* 1. HERO SECTION                                     */}
      {/* ---------------------------------------------------- */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-12">
        {/* Soft background ambient blurs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-sky-100/70 dark:bg-sky-950/40 rounded-full blur-3xl -z-10 pointer-events-none transition-colors" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-emerald-100/50 dark:bg-emerald-950/30 rounded-full blur-3xl -z-10 pointer-events-none transition-colors" />
        <div className="absolute top-20 right-10 w-48 h-48 bg-amber-100/60 dark:bg-amber-950/20 rounded-full blur-2xl -z-10 pointer-events-none transition-colors" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Zone (6 cols) */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-800/80 shadow-xs mb-2 transition-colors">
              <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-xs font-mono font-semibold text-sky-800 dark:text-sky-300 tracking-wider uppercase">
                {/* Robotic Personal Care · 2026 Edition */}
              </span>
            </div>

            <div className="space-y-2">
              <SoapifyLogo variant="compact" size="md" theme={theme === 'dark' ? 'dark' : 'light'} showTagline={false} />

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.08] text-balance">
                PERSONALIZED CLEANSING.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500">
                  PRECISION FORMULATED.
                </span>
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Create a cleanser designed around you. Tell us about your skin, choose your color, and select your natural botanicals then watch the machine dose your batch in real time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                size="lg"
                variant="primary"
                onClick={() => setCurrentView('creator')}
                className="w-full sm:w-auto text-base font-bold shadow-lg shadow-sky-500/25 cursor-pointer"
              >
                CREATE YOUR SOAP
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto text-base font-semibold cursor-pointer"
              >
                HOW IT WORKS
              </Button>
            </div>

            {/* Quick Proof Metrics */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-6 text-center lg:text-left transition-colors">
              <div>
                {/* <span className="text-2xl sm:text-3xl font-mono font-black text-slate-900 dark:text-white block"></span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium"></span> */}
              </div>
              <div>
                {/* <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-600 dark:text-emerald-400 block"></span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Acid Mantle Safe</span> */}
              </div>
              <div>
                {/* <span className="text-2xl sm:text-3xl font-mono font-black text-sky-600 dark:text-sky-400 block">SOAP DNA</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Scannable QR Passport</span> */}
              </div>
            </div>
          </div>

          {/* Right Visual Zone: Floating Cleanser Bottle Preview (6 cols) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md animate-float">
              {/* Soft pedestal shadow */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-72 h-8 bg-slate-300/40 dark:bg-black/60 rounded-full blur-xl pointer-events-none" />
              
              <div className="p-2 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-sky-950/5 dark:shadow-black/50 transition-colors">
                <LiveBottlePreview
                  color={preferences.color}
                  fragrance={preferences.fragrance}
                  volumeMl={preferences.volumeMl}
                  skinType={preferences.skinType}
                  customName={preferences.customName}
                />
              </div>

              {/* Floating micro badges */}
              <div className="absolute -top-3 -right-3 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center gap-2 transition-colors">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {/* <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">100% Bespoke Formula</span> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 2. HOW IT WORKS (6 PHASES)                           */}
      {/* ---------------------------------------------------- */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5 mb-12 text-center flex-col sm:flex-row sm:items-end justify-between gap-4 transition-colors">
          <div>
            <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest block mb-1">
              {/* Automated Mechatronics */}
            </span>
           <h2 className="w-full text-center text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
  HOW SOAPIFY WORKS</h2>
        </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
            {/* From your skin condition to a formulated bottle on the platform in 75 seconds. */}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'PERSONALIZE',
              desc: 'Choose what you want. Select your skin condition, liquid color aesthetic, natural cold-pressed botanicals, and bottle size.',
              accent: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
            },
            {
              step: '02',
              title: 'FORMULATE',
              desc: 'SOAPIFY creates your formulation. The algorithm calculates micellar balance, skin lipids, and target mass down to 0.1 grams.',
              accent: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
            },
            {
              step: '03',
              title: 'DISPENSE',
              desc: 'The machine precisely measures each component. 5 closed-loop peristaltic pumps dose liquid on a 24-bit strain-gauge scale.',
              accent: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
            },
            {
              step: '04',
              title: 'MIX',
              desc: 'Your cleanser is blended. High-torque 650 RPM vortex homogenization shears the ingredients into a silky, stable skin-barrier suspension.',
              accent: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
            },
            {
              step: '05',
              title: 'FILL',
              desc: 'Your personalized bottle is ready. Precision anti-drip wands fill your container with clean cosmetic-grade accuracy.',
              accent: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
            },
            {
              step: '06',
              title: 'REMEMBER',
              desc: 'Your SOAP DNA keeps your formula. Every completed bottle receives an immutable digital record and camera-scannable QR code.',
              accent: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4"
            >
              <div className={`h-9 w-9 rounded-xl border flex items-center justify-center font-mono font-bold text-xs ${item.accent}`}>
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

   
      {/* ---------------------------------------------------- */}
      {/* 4. FINAL CALL TO ACTION                              */}
      {/* ---------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-sky-50 via-teal-50 to-emerald-50 dark:from-slate-900 dark:via-sky-950/40 dark:to-slate-900 border border-sky-100 dark:border-sky-900/50 text-center space-y-6 shadow-sm transition-colors">
          <SoapifyLogo variant="mark-only" size="lg" theme={theme === 'dark' ? 'dark' : 'light'} className="mx-auto" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ready to design your personal cleanser?
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            Experience automated personal care. In less than 2 minutes, formulate your bespoke bottle.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="primary"
              onClick={() => setCurrentView('creator')}
              className="px-9 font-bold cursor-pointer shadow-lg shadow-sky-500/20"
            >
              CREATE YOUR SOAP
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={startDemo}
              className="font-semibold cursor-pointer"
            >
              DEMO THE MACHINE
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. FOOTER                                           */}
      {/* ---------------------------------------------------- */}
      <footer className="border-t border-slate-200 dark:border-slate-800 pt-8 pb-12 bg-white dark:bg-slate-950 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex  items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <div className="text-center">
            <span>© 2026 SOAPIFY ENGINEERING. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
