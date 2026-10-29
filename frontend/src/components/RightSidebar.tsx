import React from 'react';
import { TrendingUp, Flame, Sliders, BarChart2, Compass, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { DemoDataService } from '../services/demoDataService';

export const RightSidebar: React.FC = () => {
  const { user } = useAuth();
  const interests = DemoDataService.getUserInterests();
  const analytics = DemoDataService.getAnalytics();
  const settings = DemoDataService.getUserSettings();

  const trendingTopics = [
    { tag: '#Gemini25', count: '14.2k stories', category: 'Artificial Intelligence' },
    { tag: '#ChampionsTrophy', count: '28.5k stories', category: 'Cricket' },
    { tag: '#QuantumSilicon', count: '9.8k stories', category: 'Technology' },
    { tag: '#LunarSampleReturn', count: '6.4k stories', category: 'Space' },
    { tag: '#FloatingWind', count: '5.1k stories', category: 'Environment' }
  ];

  return (
    <aside className="w-80 h-[calc(100vh-4rem)] sticky top-16 border-l border-border-light dark:border-border-dark bg-white/70 dark:bg-[#121316]/70 backdrop-blur-sm p-4 overflow-y-auto space-y-6 hidden xl:block">
      {/* 1. Recommendation Diversity Indicator */}
      <div className="p-4 rounded-xl bg-stone-50/80 dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-charcoal dark:text-charcoal-dark">
            <Compass className="w-4 h-4 text-purple-600" />
            <span>Feed Diversity</span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
            {Math.round(settings.diversityLevel * 100)}% Explorer
          </span>
        </div>
        <p className="text-[11px] text-charcoal-muted leading-relaxed">
          Dynamic MMR re-ranking introduces varied categories to prevent filter bubbles and information lock-in.
        </p>
        <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            style={{ width: `${Math.round(settings.diversityLevel * 100)}%` }}
          />
        </div>
      </div>

      {/* 2. Top Personal Interests */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-charcoal-dark flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>Top Interests</span>
          </h4>
          <Link to="/interests" className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Customize
          </Link>
        </div>

        <div className="space-y-2">
          {interests.slice(0, 4).map((item) => {
            const totalScore = Math.min(100, Math.round((item.initialPreference + item.learnedScore) * 50));
            return (
              <div key={item.category} className="p-2.5 rounded-lg bg-stone-50 dark:bg-card-dark border border-border-light dark:border-border-dark text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-charcoal dark:text-charcoal-dark">{item.category}</span>
                  <span className="text-[10px] text-charcoal-muted font-medium">Affinity {totalScore}%</span>
                </div>
                <div className="w-full h-1 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${totalScore}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Trending Topics */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-charcoal-dark flex items-center space-x-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Trending Hashtags</span>
        </h4>

        <div className="space-y-2">
          {trendingTopics.map((topic) => (
            <Link
              key={topic.tag}
              to={`/explore?category=${encodeURIComponent(topic.category)}`}
              className="group block p-2.5 rounded-lg hover:bg-stone-50 dark:hover:bg-card-dark transition-colors border border-transparent hover:border-border-light dark:hover:border-border-dark"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-charcoal dark:text-charcoal-dark group-hover:text-blue-600">
                  {topic.tag}
                </span>
                <span className="text-[10px] text-charcoal-muted">{topic.count}</span>
              </div>
              <span className="text-[10px] text-charcoal-muted">{topic.category}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Reading Activity Snapshot */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-stone-900/60 dark:to-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs space-y-2.5">
        <div className="flex items-center justify-between font-semibold text-charcoal dark:text-charcoal-dark">
          <span className="flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Reading Stats</span>
          </span>
          <Link to="/analytics" className="text-blue-600 hover:underline text-[11px] font-bold">
            Full Metrics
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center pt-1">
          <div className="p-2 bg-white dark:bg-card-dark rounded-lg shadow-2xs">
            <p className="text-base font-bold text-charcoal dark:text-charcoal-dark">{analytics.totalArticlesOpened}</p>
            <p className="text-[10px] text-charcoal-muted">Stories Read</p>
          </div>
          <div className="p-2 bg-white dark:bg-card-dark rounded-lg shadow-2xs">
            <p className="text-base font-bold text-blue-600">{analytics.totalArticlesBookmarked}</p>
            <p className="text-[10px] text-charcoal-muted">Bookmarks</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
