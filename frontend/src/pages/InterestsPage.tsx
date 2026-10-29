import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Plus, Trash2, RotateCcw, Sparkles, Check, BrainCircuit } from 'lucide-react';
import { CATEGORIES } from '../components/CategoryPills';
import { DemoDataService } from '../services/demoDataService';
import { useAuth } from '../hooks/useAuth';
import { UserInterest } from '../types';

export const InterestsPage: React.FC = () => {
  const { user } = useAuth();
  const [interests, setInterests] = useState<UserInterest[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [savedNotice, setSavedNotice] = useState(false);

  const loadInterests = () => {
    const list = DemoDataService.getUserInterests(user?.id);
    setInterests(list);

    const existingSet = new Set(list.map(i => i.category.toLowerCase()));
    setAvailableCategories(
      CATEGORIES.filter(c => c !== 'All' && !existingSet.has(c.toLowerCase()))
    );
  };

  useEffect(() => {
    loadInterests();
  }, [user?.id]);

  const handleRemoveCategory = (cat: string) => {
    const updated = interests.filter(i => i.category !== cat);
    DemoDataService.saveUserInterests(updated.map(i => i.category), user?.id);
    loadInterests();
    triggerNotice();
  };

  const handleAddCategory = (cat: string) => {
    const updated = [...interests.map(i => i.category), cat];
    DemoDataService.saveUserInterests(updated, user?.id);
    loadInterests();
    triggerNotice();
  };

  const handleResetLearned = () => {
    DemoDataService.resetLearnedInterests(user?.id);
    loadInterests();
    triggerNotice();
  };

  const triggerNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-light dark:border-border-dark">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-white flex items-center space-x-2">
            <SlidersHorizontal className="w-6 h-6 text-blue-600" />
            <span>My Personalization Profile</span>
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Explicitly chosen categories combined with weights dynamically inferred from your reading habits.
          </p>
        </div>

        <button
          onClick={handleResetLearned}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark hover:bg-stone-50 text-xs font-semibold text-charcoal dark:text-white shadow-2xs transition-colors self-start sm:self-auto"
          title="Reset learned behavioral affinity"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
          <span>Reset Learned Weights</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 text-xs animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Preferences updated! Recommendation rankings will automatically reflect this on next load.</span>
        </div>
      )}

      {/* Explicit vs Learned Transparency Section */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 space-y-2 text-xs">
          <div className="flex items-center space-x-2 font-bold text-blue-900 dark:text-blue-300">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Explicit Preferences (Your Choice)</span>
          </div>
          <p className="text-charcoal-muted leading-relaxed">
            Categories you picked during onboarding or added here. These maintain a strong foundation (35% weight) across all recommendation computations.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 space-y-2 text-xs">
          <div className="flex items-center space-x-2 font-bold text-purple-900 dark:text-purple-300">
            <BrainCircuit className="w-4 h-4 text-purple-600" />
            <span>Learned Behavioral Scores</span>
          </div>
          <p className="text-charcoal-muted leading-relaxed">
            Inferred from articles you liked, bookmarked, and read for extended durations. You can reset these weights anytime without losing your chosen categories.
          </p>
        </div>
      </div>

      {/* Current Active Interests Table / List */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-charcoal dark:text-white">
          Active Feed Topics ({interests.length})
        </h3>

        <div className="space-y-3">
          {interests.map((item) => {
            const explicitPct = Math.round(item.initialPreference * 100);
            const learnedPct = Math.round(item.learnedScore * 100);
            const totalScore = Math.min(100, Math.round((item.initialPreference + item.learnedScore) * 50));

            return (
              <div
                key={item.category}
                className="p-4 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-serif font-bold text-base text-charcoal dark:text-white">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-charcoal-muted">
                      Total Strength: {totalScore}%
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveCategory(item.category)}
                    className="p-1.5 rounded-lg text-charcoal-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    title={`Remove ${item.category}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Score breakdown bars */}
                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between text-charcoal-muted text-[11px] mb-1">
                      <span>Explicit Selection Strength</span>
                      <span className="font-semibold">{explicitPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${explicitPct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-charcoal-muted text-[11px] mb-1">
                      <span>Inferred Behavioral Engagement</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">+{learnedPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${learnedPct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Topics */}
      {availableCategories.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border-light dark:border-border-dark">
          <h3 className="font-serif font-bold text-lg text-charcoal dark:text-white">
            Add Additional Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map(cat => (
              <button
                key={cat}
                onClick={() => handleAddCategory(cat)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-dashed border-stone-300 dark:border-stone-700 bg-white dark:bg-card-dark hover:border-blue-500 hover:text-blue-600 text-xs font-medium transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
