import React, { useState, useEffect } from 'react';
import { X, Sparkles, ExternalLink, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Article, ArticleSummary } from '../types';
import { RecommendationService } from '../services/recommendationService';

interface SummaryModalProps {
  article: Article | null;
  onClose: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({ article, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<ArticleSummary | null>(null);

  useEffect(() => {
    if (!article) return;
    let isMounted = true;
    setLoading(true);

    RecommendationService.summarizeArticle(article, 3)
      .then(res => {
        if (isMounted) {
          setSummaryData(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [article]);

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl max-w-lg w-full shadow-2xl overflow-hidden transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="summary-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark bg-stone-50/70 dark:bg-surface-dark">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 id="summary-title" className="text-base font-semibold text-charcoal dark:text-charcoal-dark">
                AI Article Summary
              </h3>
              <p className="text-xs text-charcoal-muted">Extractive NLP Salience Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-charcoal-muted hover:text-charcoal dark:hover:text-charcoal-dark hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
              {article.category} • {article.source_name}
            </span>
            <h4 className="text-base font-serif font-bold text-charcoal dark:text-charcoal-dark mt-1 leading-snug">
              {article.title}
            </h4>
          </div>

          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-3">
              <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-charcoal-muted font-medium">Extracting salient sentences from text...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Label Pill */}
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 text-charcoal-muted text-[11px] font-medium border border-border-light dark:border-border-dark">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                <span>{summaryData?.label || 'Summary of available excerpt'}</span>
              </div>

              {/* Summary Text Box */}
              <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-900/50 border border-border-light dark:border-border-dark">
                <p className="text-sm font-serif leading-relaxed text-charcoal dark:text-charcoal-dark">
                  {summaryData?.summary || article.description}
                </p>
              </div>

              {/* Transparency Notice */}
              <div className="flex items-start space-x-2 text-[11px] text-charcoal-muted">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>
                  Extractive summaries condense only the genuine publisher excerpts and headlines provided by the news feed. We never synthesize fabricated facts or claim access beyond public excerpts.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 dark:bg-surface-dark border-t border-border-light dark:border-border-dark flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-charcoal-muted hover:text-charcoal dark:hover:text-charcoal-dark transition-colors"
          >
            Close
          </button>

          <a
            href={article.canonical_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
          >
            <span>Read Full Article at Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
