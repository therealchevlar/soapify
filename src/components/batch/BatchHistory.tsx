/**
 * @file BatchHistory.tsx
 * @description Consumer-friendly "My Soaps" catalog displaying previous personalized blends,
 * color-coded cards, and direct links to their verified SOAP DNA records.
 * Supports light & dark modes.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BatchManager } from '../../services/batches/batchManager';
import { CleanserBatch } from '../../types/batch';
import { COLOR_CONFIG } from '../creator/LiveBottlePreview';
import { Button } from '../ui/Button';
import { Sparkles, QrCode, RefreshCw, Star } from 'lucide-react';

export const BatchHistory: React.FC = () => {
  const { inspectBatchDna, recreateFormula, setFeedbackModalBatchId, setCurrentView } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED'>('ALL');

  const batches = BatchManager.getAllBatches();
  const filtered = filter === 'ALL' ? batches : batches.filter((b) => b.status === 'COMPLETED');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 select-none transition-colors duration-200">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Product Collection
            </span>
            <span>·</span>
            <span>Formulation Ledger</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Soaps</h1>
        </div>

        {/* Filter segment */}
        <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs transition-colors">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filter === 'ALL'
                ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            All Cleansers ({batches.length})
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filter === 'COMPLETED'
                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Completed ({batches.filter((b) => b.status === 'COMPLETED').length})
          </button>
        </div>
      </div>

      {/* Grid of Visual Cleanser Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <p className="text-slate-500 dark:text-slate-400 text-sm">You haven't formulated any cleansers yet.</p>
          <Button onClick={() => setCurrentView('creator')}>Design Your First Soap</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((batch: CleanserBatch) => {
            const { soapDna, formula } = batch;
            const colorKey = soapDna?.color || formula.preferences.color || 'BLUE';
            const colorCfg = COLOR_CONFIG[colorKey] || COLOR_CONFIG.BLUE;
            const fragTitle = soapDna?.fragrance || formula.preferences.fragrance || 'Lavender';
            const skinTitle = soapDna?.skinType || formula.preferences.skinType || 'Dry';

            return (
              <div
                key={batch.id}
                className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-500/50 hover:shadow-lg transition-all shadow-xs group"
              >
                <div>
                  {/* Top Swatch & Batch Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 transition-colors">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3.5 w-3.5 rounded-full ring-2 ring-slate-100 dark:ring-slate-800 shadow-xs"
                        style={{ backgroundColor: colorCfg.hex }}
                      />
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                        {colorCfg.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-sky-700 dark:text-sky-300 font-bold bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 px-2.5 py-0.5 rounded-full">
                      {soapDna?.dnaCode || batch.id}
                    </span>
                  </div>

                  {/* Cleanser Name & Notes */}
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-1.5 tracking-tight">
                    {formula.preferences.customName || `${fragTitle} Cleanser`}
                  </h3>
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400 space-y-1 mb-6">
                    <div className="font-semibold text-slate-700 dark:text-slate-300">
                      {skinTitle} Skin · {formula.targetVolumeMl} ml
                    </div>
                    <div className="text-slate-400 dark:text-slate-500">
                      Created{' '}
                      {new Date(batch.startedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 transition-colors">
                  <div className="flex items-center gap-2">
                    {soapDna && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => inspectBatchDna(batch.id)}
                        className="flex-1 text-xs font-mono cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>SOAP DNA</span>
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => recreateFormula(formula)}
                      className="flex-1 text-xs font-bold cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Re-Order</span>
                    </Button>
                  </div>

                  <button
                    onClick={() => setFeedbackModalBatchId(batch.id)}
                    className="w-full text-center text-xs font-mono text-slate-400 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 py-1 cursor-pointer transition-colors flex items-center justify-center gap-1"
                  >
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>Rate Cleanser Experience</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BatchHistory;
