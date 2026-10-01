/**
 * @file SoapLabelPrint.tsx
 * @description Printable cosmetic bottle label with real scannable QR code,
 * Code 128 batch barcode, and official SOAPIFY brand identity.
 * Crisp, clean aesthetic adhering to the SOAPIFY design system.
 */

import React from 'react';
import { CleanserBatch } from '../../types/batch';
import { SoapifyLogo } from '../brand/SoapifyLogo';
import { BarcodeComponent } from '../BarcodeComponent';
import { QRCodeComponent } from '../QRCodeComponent';

interface SoapLabelPrintProps {
  batch: CleanserBatch;
  onClose: () => void;
}

export const SoapLabelPrint: React.FC<SoapLabelPrintProps> = ({ batch, onClose }) => {
  const { soapDna } = batch;
  if (!soapDna) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm print:p-0 print:bg-white overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-900 dark:text-white shadow-2xl space-y-6 print:border-none print:shadow-none print:bg-white print:text-black my-8 transition-colors">
        {/* Modal Controls (hidden on print) */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 print:hidden">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            Printable Cosmetic Product Label
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-mono bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl cursor-pointer shadow-md transition-colors"
            >
              Print Label (3" × 5")
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-2 py-1 text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* The Physical Label Design (Printable) */}
        <div className="border-2 border-slate-300 bg-white text-slate-900 rounded-2xl p-6 shadow-md flex flex-col justify-between select-none mx-auto w-full max-w-[340px] space-y-4">
          {/* Top Brand Header */}
          <div className="text-center space-y-1 border-b border-slate-200 pb-3">
            <SoapifyLogo variant="full" size="sm" theme="light" showTagline={false} className="mx-auto" />
            <span className="text-[8px] font-mono tracking-[0.28em] text-slate-500 uppercase block font-semibold">
              Personalized for you
            </span>
          </div>

          {/* Cleanser Name & Notes */}
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
              {batch.formula.preferences.customName || `${soapDna.fragrance} Cleanser`}
            </h3>
            <p className="text-[11px] font-mono text-slate-600">
              {soapDna.skinType} Skin · {soapDna.fragrance} ({soapDna.intensityLabel})
            </p>
          </div>

          {/* Centered Real Scannable 2D QR Code */}
          <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-xl border border-slate-200">
            <QRCodeComponent value={soapDna.publicUrl} size={120} includeMargin={false} />
            <span className="text-[9px] font-mono font-bold text-slate-800 mt-1.5 tracking-wider">
              SOAP DNA: {soapDna.dnaCode}
            </span>
            <span className="text-[7.5px] font-mono text-slate-500">
              Scan with camera for formula passport
            </span>
          </div>

          {/* Real 1D Code 128 Barcode for Batch Tracking */}
          <div className="flex flex-col items-center justify-center pt-1 border-t border-slate-200">
            <BarcodeComponent value={batch.id} height={32} width={1.5} />
          </div>

          {/* Label Bottom Details */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] font-mono text-slate-500 font-semibold">
            <span>VOLUME: {soapDna.volumeMl} ML</span>
            <span>FORMULA {soapDna.formulaVersion}</span>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 print:hidden font-mono">
          Ready for laser, thermal sticker, or direct label printer
        </p>
      </div>
    </div>
  );
};
