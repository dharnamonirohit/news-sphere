import React from 'react';
import { X, Sparkles, Compass, CheckCircle2, Sliders, Info, BarChart2 } from 'lucide-react';
import { ScoredArticle } from '../types';

interface WhyThisModalProps {
  scoredArticle: ScoredArticle | null;
  onClose: () => void;
}

export const WhyThisModal: React.FC<WhyThisModalProps> = ({ scoredArticle, onClose }) => {
  if (!scoredArticle) return null;

  const { article, scores, reason, is_diversity_boosted } = scoredArticle;

  const scorePct = (val?: number) => Math.round((val || 0) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl max-w-lg w-full shadow-2xl overflow-hidden transition-all transform scale-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark bg-stone-50/60 dark:bg-surface-dark">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              {is_diversity_boosted ? <Compass className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <h3 id="modal-title" className="text-base font-semibold text-charcoal dark:text-charcoal-dark">
                Why Am I Seeing This Article?
              </h3>
              <p className="text-xs text-charcoal-muted">Explainable AI Scoring & Transparency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-charcoal-muted hover:text-charcoal dark:hover:text-charcoal-dark hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close explanation modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Article brief */}
          <div className="border-l-2 border-blue-500 pl-3 py-1">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
              {article.category}
            </span>
            <h4 className="text-sm font-serif font-bold text-charcoal dark:text-charcoal-dark line-clamp-2 mt-0.5">
              {article.title}
            </h4>
          </div>

          {/* Primary Reason */}
          <div className={`p-4 rounded-lg border ${
            is_diversity_boosted 
              ? 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/50 text-purple-900 dark:text-purple-200'
              : 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/50 text-blue-900 dark:text-blue-200'
          }`}>
            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${is_diversity_boosted ? 'text-purple-600' : 'text-blue-600'}`} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1">
                  {is_diversity_boosted ? 'Exploration & Diversity Factor' : 'Dominant Ranking Signal'}
                </p>
                <p className="text-sm font-medium leading-relaxed">{reason}</p>
              </div>
            </div>
          </div>

          {/* Mathematical Multi-Signal Scoring Breakdown */}
          {scores && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-charcoal dark:text-charcoal-dark">
                <span className="flex items-center space-x-1">
                  <BarChart2 className="w-4 h-4 text-charcoal-muted" />
                  <span>Recommendation Component Scores</span>
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  Overall Match: {scorePct(scores.combined_score)}%
                </span>
              </div>

              {/* Progress bars */}
              <div className="space-y-2 text-xs">
                {/* Category match */}
                <div>
                  <div className="flex justify-between text-charcoal-muted mb-1">
                    <span>Category / Interest Match (35%)</span>
                    <span className="font-medium text-charcoal dark:text-charcoal-dark">{scorePct(scores.category_score)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                      style={{ width: `${scorePct(scores.category_score)}%` }}
                    />
                  </div>
                </div>

                {/* Behavioral engagement */}
                <div>
                  <div className="flex justify-between text-charcoal-muted mb-1">
                    <span>Behavioral Affinity (30%)</span>
                    <span className="font-medium text-charcoal dark:text-charcoal-dark">{scorePct(scores.behavioral_score)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                      style={{ width: `${scorePct(scores.behavioral_score)}%` }}
                    />
                  </div>
                </div>

                {/* TF-IDF Content similarity */}
                <div>
                  <div className="flex justify-between text-charcoal-muted mb-1">
                    <span>TF-IDF Content Similarity (20%)</span>
                    <span className="font-medium text-charcoal dark:text-charcoal-dark">{scorePct(scores.content_similarity_score)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 rounded-full transition-all duration-500" 
                      style={{ width: `${scorePct(scores.content_similarity_score)}%` }}
                    />
                  </div>
                </div>

                {/* Recency decay */}
                <div>
                  <div className="flex justify-between text-charcoal-muted mb-1">
                    <span>Recency & Freshness (15%)</span>
                    <span className="font-medium text-charcoal dark:text-charcoal-dark">{scorePct(scores.recency_score)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                      style={{ width: `${scorePct(scores.recency_score)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer disclosure */}
          <div className="flex items-start space-x-2 text-[11px] text-charcoal-muted pt-2 border-t border-border-light dark:border-border-dark">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              NewsSphere computes real-time scores using TF-IDF token vectorization, cosine similarity, user feedback signals (likes, bookmarks, reading duration), and an exploratory diversity re-ranker.
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-6 py-3 bg-stone-50 dark:bg-surface-dark border-t border-border-light dark:border-border-dark flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-charcoal text-white dark:bg-stone-100 dark:text-charcoal hover:bg-black transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
