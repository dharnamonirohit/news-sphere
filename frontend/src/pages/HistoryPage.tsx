import React, { useState, useEffect } from 'react';
import { History, Trash2, Clock, BookOpen, ArrowRight, AlertTriangle } from 'lucide-react';
import { ReadingHistoryItem } from '../types';
import { DemoDataService } from '../services/demoDataService';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const loadHistory = () => {
    const items = DemoDataService.getReadingHistory(user?.id);
    setHistory(items);
  };

  useEffect(() => {
    loadHistory();
  }, [user?.id]);

  const handleClearHistory = () => {
    DemoDataService.clearReadingHistory(user?.id);
    setHistory([]);
    setConfirmClearOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-2 border-b border-border-light dark:border-border-dark">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-white flex items-center space-x-2">
            <History className="w-6 h-6 text-blue-600" />
            <span>Reading History</span>
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Chronological audit of articles opened and inspected. Fuels your behavioral learning model.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setConfirmClearOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirmClearOpen && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-900 dark:text-rose-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>Are you sure you want to clear your reading history? This will also reset your recent interaction log.</span>
          </div>
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              onClick={() => setConfirmClearOpen(false)}
              className="px-3 py-1 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-charcoal dark:text-white font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleClearHistory}
              className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              Confirm Clear
            </button>
          </div>
        </div>
      )}

      {/* History List */}
      {history.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-8">
          <BookOpen className="w-10 h-10 text-charcoal-muted mx-auto stroke-1" />
          <h3 className="font-serif font-bold text-lg text-charcoal dark:text-white">No reading history yet</h3>
          <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
            As you open and read article previews, your chronological history will appear here.
          </p>
          <Link
            to="/feed"
            className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
          >
            Browse Today's Headlines
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-stone-400 dark:hover:border-stone-600 transition-colors shadow-2xs"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center space-x-2 text-[11px]">
                  <span className="font-bold text-blue-600 uppercase tracking-wide">
                    {item.article.category}
                  </span>
                  <span className="text-charcoal-muted">•</span>
                  <span className="text-charcoal-muted">{item.article.source_name}</span>
                  <span className="text-charcoal-muted">•</span>
                  <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-charcoal-muted font-medium">
                    Viewed {item.viewCount} {item.viewCount === 1 ? 'time' : 'times'}
                  </span>
                </div>

                <Link to={`/article/${item.article.id}`}>
                  <h3 className="font-serif font-bold text-base text-charcoal dark:text-white hover:text-blue-600 transition-colors line-clamp-1">
                    {item.article.title}
                  </h3>
                </Link>

                <p className="text-xs text-charcoal-muted line-clamp-1">
                  {item.article.description}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-4 flex-shrink-0 text-xs">
                <span className="text-[11px] text-charcoal-muted flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(item.lastViewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </span>

                <Link
                  to={`/article/${item.article.id}`}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-charcoal dark:text-white font-semibold flex items-center space-x-1"
                >
                  <span>Reopen</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
