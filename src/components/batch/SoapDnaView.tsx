/**
 * @file SoapDnaView.tsx
 * @description Digital product identity passport displaying the unique SOAP DNA profile,
 * real scannable QR code (via qrcode.react), Code 128 batch barcode (via jsbarcode),
 * label print preview, and re-order hub.
 * Supports both light & dark laboratory aesthetic.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BatchManager } from '../../services/batches/batchManager';
import { SoapifyLogo } from '../brand/SoapifyLogo';
import { COLOR_CONFIG } from '../creator/LiveBottlePreview';
import { BarcodeComponent } from '../BarcodeComponent';
import { QRCodeComponent } from '../QRCodeComponent';
import { Button } from '../ui/Button';
import { SoapLabelPrint } from './SoapLabelPrint';
import { ShieldCheck, Sparkles, Printer, Copy, Check, RefreshCw } from 'lucide-react';

export const SoapDnaView: React.FC = () => {
  const { selectedDnaBatch, activeBatch, recreateFormula, setFeedbackModalBatchId, setCurrentView, theme } =
    useApp();
  const [copied, setCopied] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // If no specific batch selected, fall back to active batch or latest history batch
  const batch = selectedDnaBatch || activeBatch || BatchManager.getAllBatches()[0];

  if (!batch || !batch.soapDna) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center px-4 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">No SOAP DNA Record Selected</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Complete a formulation batch to mint a cryptographic SOAP DNA record.
        </p>
        <Button onClick={() => setCurrentView('creator')}>Create a Cleanser</Button>
      </div>
    );
  }

  const { soapDna, formula } = batch;
  const colorCfg = COLOR_CONFIG[soapDna.color] || COLOR_CONFIG.BLUE;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(soapDna.dnaCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 select-none transition-colors duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              SOAPIFY IDENTITY
            </span>
            <span>·</span>
            <span>DIGITAL PRODUCT PASSPORT</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">SOAP DNA Profile</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPrintModal(true)}
            className="font-mono text-xs cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>Print Label</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => recreateFormula(formula)}
            className="font-mono text-xs cursor-pointer font-bold shadow-md shadow-sky-500/20 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recreate This Soap</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Prominent Scannable QR Code Card (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-5 transition-colors">
            <SoapifyLogo variant="full" size="sm" theme={theme === 'dark' ? 'dark' : 'light'} showTagline={false} className="mx-auto" />

            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 block font-semibold">
                YOUR BESPOKE CLEANSER
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {formula.preferences.customName || `${soapDna.fragrance} Cleanser`}
              </h2>
            </div>

            {/* The Real Scannable QR Code with Download & Print */}
            <div className="py-2 flex justify-center">
              <QRCodeComponent
                value={soapDna.publicUrl}
                size={180}
                showDownload={true}
                showPrint={true}
                downloadFilename={`SOAP-DNA-${soapDna.dnaCode}`}
              />
            </div>

            {/* SOAP DNA Code & Verification Tag */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-base text-sky-700 dark:text-sky-300 font-extrabold bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 px-3.5 py-1 rounded-xl shadow-xs">
                  {soapDna.dnaCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs font-mono text-slate-700 dark:text-slate-300 font-semibold">
                {soapDna.volumeMl} ML · {soapDna.fragrance.toUpperCase()} · {soapDna.skinType.toUpperCase()} SKIN
              </div>

              <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 break-all pt-1">
                {soapDna.publicUrl}
              </p>
            </div>

            {/* Print Label Action */}
            <div className="pt-2">
              <Button
                variant="secondary"
                size="md"
                className="w-full text-xs font-mono cursor-pointer flex items-center justify-center gap-2"
                onClick={() => setShowPrintModal(true)}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Cosmetic Bottle Label (3" × 5") ↗</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Formulation Specification & Barcode (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold block mb-0.5">
                  FORMULA PASSPORT
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Verified Formulation</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    AUTHENTIC
                  </span>
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Created: {new Date(soapDna.timestamp).toLocaleDateString()}
              </span>
            </div>

            {/* Clean Consumer Specifications */}
            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px] uppercase font-bold block mb-1">
                  SKIN PROFILE
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white">{soapDna.skinType} Skin</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px] uppercase font-bold block mb-1">
                  COLOR AESTHETIC
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="h-3.5 w-3.5 rounded-full ring-2 ring-slate-200 dark:ring-slate-700 shadow-xs"
                    style={{ backgroundColor: colorCfg.hex }}
                  />
                  <span className="text-base font-bold text-slate-900 dark:text-white">{colorCfg.label}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px] uppercase font-bold block mb-1">
                  FRAGRANCE NOTE
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white">{soapDna.fragrance}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px] uppercase font-bold block mb-1">
                  SCENT INTENSITY
                </span>
                <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                  {soapDna.intensityLabel} ({soapDna.fragranceIntensity}%)
                </span>
              </div>
            </div>

            {/* 1D Industrial Batch Barcode (Code 128) */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                <span>INDUSTRIAL CODE 128 BARCODE</span>
                <span>BATCH: {batch.id}</span>
              </div>
              <div className="flex justify-center py-1">
                <BarcodeComponent
                  value={batch.id}
                  height={42}
                  width={2}
                  showDownload={true}
                  showPrint={true}
                />
              </div>
            </div>

            {/* Feedback & Reorder Row */}
            <div className="pt-2 flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                className="flex-1 font-bold cursor-pointer shadow-md shadow-sky-500/20"
                onClick={() => recreateFormula(formula)}
              >
                Recreate This Formula
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="cursor-pointer text-xs font-mono"
                onClick={() => setFeedbackModalBatchId(batch.id)}
              >
                Rate Cleanser
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showPrintModal && <SoapLabelPrint batch={batch} onClose={() => setShowPrintModal(false)} />}
    </div>
  );
};

export default SoapDnaView;
