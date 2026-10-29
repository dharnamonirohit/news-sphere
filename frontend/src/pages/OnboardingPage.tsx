import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Search, Sparkles, ArrowRight, Newspaper } from 'lucide-react';
import { CATEGORIES } from '../components/CategoryPills';
import { DemoDataService } from '../services/demoDataService';
import { useAuth } from '../hooks/useAuth';

export const OnboardingPage: React.FC = () => {
  // Exclude 'All' from selection
  const selectableCategories = CATEGORIES.filter(c => c !== 'All');
  
  const [selected, setSelected] = useState<string[]>([
    'Artificial Intelligence',
    'Technology',
    'Science'
  ]);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { setOnboarded } = useAuth();

  const toggleCategory = (cat: string) => {
    setSelected(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filteredCategories = selectableCategories.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const handleContinue = () => {
    if (selected.length === 0) return;
    setSaving(true);

    DemoDataService.saveUserInterests(selected);
    setOnboarded(true);

    setTimeout(() => {
      setSaving(false);
      navigate('/feed');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#121316] text-[#191C21] dark:text-[#F1F3F7] py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 1: Feed Personalization</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-charcoal dark:text-white">
            What topics spark your curiosity?
          </h1>
          <p className="text-sm text-charcoal-muted max-w-md mx-auto">
            Select 3 or more topics to help our content-based recommendation model initialize your custom feed.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter categories (e.g., Space, Cricket, Startups)..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark focus:border-blue-500 focus:outline-none shadow-xs transition-all"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredCategories.map((cat) => {
            const isSelected = selected.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'bg-white dark:bg-card-dark border-border-light dark:border-border-dark text-charcoal dark:text-charcoal-dark hover:border-stone-400 dark:hover:border-stone-600'
                }`}
              >
                <span>{cat}</span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'border border-border-light dark:border-border-dark bg-stone-50 dark:bg-stone-800'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Action Card */}
        <div className="sticky bottom-6 p-4 rounded-xl bg-white/95 dark:bg-card-dark/95 backdrop-blur-md border border-border-light dark:border-border-dark shadow-xl flex items-center justify-between">
          <div className="text-xs">
            <span className="font-bold text-charcoal dark:text-white">{selected.length} selected</span>
            <span className="text-charcoal-muted ml-1">
              {selected.length < 3 ? `(Select at least ${3 - selected.length} more)` : '• Ready to curate!'}
            </span>
          </div>

          <button
            onClick={handleContinue}
            disabled={selected.length === 0 || saving}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-xs shadow-xs transition-all flex items-center space-x-1.5"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Launch My Feed</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
