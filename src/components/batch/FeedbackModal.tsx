/**
 * @file FeedbackModal.tsx
 * @description Clean, minimalist post-use satisfaction evaluation modal for consumers.
 * Captures 5-star ratings for Fragrance, Feel, Cleansing, and Overall satisfaction.
 * Supports light & dark modes.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BatchManager } from '../../services/batches/batchManager';
import { BatchFeedback } from '../../types/batch';
import { Button } from '../ui/Button';
import { Check, Star, X } from 'lucide-react';

export const FeedbackModal: React.FC = () => {
  const { feedbackModalBatchId, setFeedbackModalBatchId } = useApp();

  const [ratingOverall, setRatingOverall] = useState<number>(5);
  const [ratingFragrance, setRatingFragrance] = useState<number>(5);
  const [ratingFeel, setRatingFeel] = useState<number>(5);
  const [ratingCleansing, setRatingCleansing] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!feedbackModalBatchId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feedback: BatchFeedback = {
      batchId: feedbackModalBatchId,
      submittedAt: new Date().toISOString(),
      ratingOverall,
      ratingTexture: ratingFeel,
      ratingFragrance,
      ratingMoisturization: ratingFeel,
      ratingCleansing,
      skinReaction: 'HYDRATED',
      notes,
      wouldReorder: ratingOverall >= 4,
    };

    BatchManager.submitFeedback(feedbackModalBatchId, feedback);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFeedbackModalBatchId(null);
    }, 1500);
  };

  const renderStars = (value: number, setValue: (v: number) => void) => (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setValue(star)}
          className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
            star <= value
              ? 'bg-amber-400 text-white shadow-md shadow-amber-400/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:text-slate-400'
          }`}
        >
          <Star className={`w-4 h-4 ${star <= value ? 'fill-white' : ''}`} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-6 transition-colors">
        <button
          onClick={() => setFeedbackModalBatchId(null)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-base cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-xl font-bold shadow-xs">
              <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thank You!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your feedback is saved. Future formulas will continuously adapt to your skin preferences.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-sky-600 dark:text-sky-400 font-bold block mb-1">
                Product Review
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">How was your SOAP?</h3>
            </div>

            {/* 4 Clean Rating Axes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Overall</span>
                {renderStars(ratingOverall, setRatingOverall)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Fragrance</span>
                {renderStars(ratingFragrance, setRatingFragrance)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Skin Feel</span>
                {renderStars(ratingFeel, setRatingFeel)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cleansing</span>
                {renderStars(ratingCleansing, setRatingCleansing)}
              </div>
            </div>

            {/* Structured Commentary */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                Additional Comments (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="How did your skin feel after 2-3 days of daily use?"
                className="w-full text-xs font-sans p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-bold shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                Submit Feedback
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
