/**
 * @file PublicSoapView.tsx
 * @description Dedicated consumer destination page opened when scanning a bottle's QR code.
 * Displays the product identity, skin type, fragrance, and allows 1-click re-ordering.
 * Securely omits internal pump calibrations, machine IPs, or proprietary coefficients.
 * Supports light & dark modes.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BatchManager } from '../../services/batches/batchManager';
import { SoapifyLogo } from '../brand/SoapifyLogo';
import { COLOR_CONFIG, LiveBottlePreview } from '../creator/LiveBottlePreview';
import { BarcodeComponent } from '../BarcodeComponent';
import { QRCodeComponent } from '../QRCodeComponent';
import { Button } from '../ui/Button';
import { SoapLabelPrint } from './SoapLabelPrint';
import { ShieldCheck, Sparkles, Printer, RefreshCw } from 'lucide-react';

interface PublicSoapViewProps {
  dnaCode: string;
}

export const PublicSoapView: React.FC<PublicSoapViewProps> = ({ dnaCode }) => {
  const { recreateFormula, setCurrentView, setFeedbackModalBatchId, theme } = useApp();
  const [showLabelPrint, setShowLabelPrint] = useState(false);

  const batch = BatchManager.getBatchByDnaCode(dnaCode);

  // 404 / Unknown SOAP DNA State
  if (!batch || !batch.soapDna) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center space-y-6">
        <SoapifyLogo variant="compact" size="md" theme={theme === 'dark' ? 'dark' : 'light'} className="mx-auto" />
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="h-12 w-12 rounded-full bg-rose-50 dark:bg-rose-950/70 text-rose-500 mx-auto flex items-center justify-center text-xl font-bold">
            ✕
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">SOAP DNA Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            No active formula record was found matching code <code className="text-sky-600 dark:text-sky-400 font-mono font-bold">{dnaCode}</code>.
            Please verify the code on your bottle label or create a new personalized blend.
          </p>
          <div className="pt-2">
            <Button onClick={() => setCurrentView('creator')} className="cursor-pointer">
              Create Your Formula
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { soapDna, formula } = batch;
  const colorCfg = COLOR_CONFIG[soapDna.color] || COLOR_CONFIG.BLUE;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 select-none transition-colors duration-200">
      {/* Top Brand Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 transition-colors">
        <div>
          {/* <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1"> */}
            {/* <span className="flex items-center gap-1.5"> */}
              {/* <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> */}
              {/* SOAPIFY Identity */}
            {/* </span> */}
            {/* <span>·</span> */}
            {/* <span>Verified Product Record</span> */}
          {/* </div> */}
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">espoke Cleanser</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => recreateFormula(formula)}
            className="cursor-pointer font-bold shadow-md shadow-sky-500/20 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recreate This Soap</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLabelPrint(true)}
            className="cursor-pointer font-mono text-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>Print Label</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Bottle Representation (5 cols) */}
        <div className="md:col-span-5 flex justify-center">
          <div className="w-full max-w-sm p-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md transition-colors">
            <LiveBottlePreview
              color={soapDna.color}
              fragrance={soapDna.fragrance as any}
              volumeMl={soapDna.volumeMl}
              skinType={soapDna.skinType}
              customName={formula.preferences.customName}
            />
          </div>
        </div>

        {/* Right Column: Clean Consumer Specification (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm transition-colors">
            {/* SOAP DNA Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold block mb-0.5">
                  SOAP DNA
                </span>
                <span className="text-2xl font-mono font-black text-sky-700 dark:text-sky-300 tracking-wider">
                  {soapDna.dnaCode}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold block mb-0.5">
                  FORMULA VERSION
                </span>
                <span className="text-sm font-mono text-slate-700 dark:text-slate-300 font-bold">
                  {soapDna.formulaVersion}
                </span>
              </div>
            </div>

            {/* Core Consumer Attributes */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px] uppercase font-bold block mb-1">
                  SKIN PROFILE
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {soapDna.skinType} Skin
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px] uppercase font-bold block mb-1">
                  COLOR IDENTITY
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="h-3.5 w-3.5 rounded-full ring-2 ring-slate-200 dark:ring-slate-700 shadow-xs"
                    style={{ backgroundColor: colorCfg.hex }}
                  />
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {colorCfg.label}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px] uppercase font-bold block mb-1">
                  FRAGRANCE NOTE
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {soapDna.fragrance}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px] uppercase font-bold block mb-1">
                  SCENT INTENSITY
                </span>
                <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                  {soapDna.intensityLabel} ({soapDna.fragranceIntensity}%)
                </span>
              </div>
            </div>

            {/* Target Volume */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold block">
                  BOTTLE CAPACITY
                </span>
                <span className="text-xl font-mono font-bold text-slate-900 dark:text-white">
                  {soapDna.volumeMl} ml
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold block">
                  FORMULATED ON
                </span>
                <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                  {new Date(soapDna.timestamp).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Scannable Real QR Stamp */}
            <div className="flex items-center gap-5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <QRCodeComponent value={soapDna.publicUrl} size={90} includeMargin={false} />
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Official SOAPIFY QR Passport</span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Encodes your verified digital product record. Scan anytime with a phone camera to re-dispense.
                </p>
                <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 block break-all">
                  {soapDna.publicUrl}
                </span>
              </div>
            </div>

            

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                className="flex-1 font-bold cursor-pointer shadow-md shadow-sky-500/20"
                onClick={() => recreateFormula(formula)}
              >
                Recreate This Cleanser
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="cursor-pointer text-xs font-mono"
                onClick={() => setFeedbackModalBatchId(batch.id)}
              >
                Rate Cleanser
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showLabelPrint && <SoapLabelPrint batch={batch} onClose={() => setShowLabelPrint(false)} />}
    </div>
  );
};

export default PublicSoapView;
