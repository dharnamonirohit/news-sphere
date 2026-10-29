import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  Bookmark, 
  Compass, 
  TrendingUp, 
  Activity, 
  PieChart as PieIcon,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';
import { AnalyticsData } from '../types';
import { DemoDataService } from '../services/demoDataService';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const CATEGORY_COLORS = [
  '#2563EB', '#7C3AED', '#0D9488', '#EA580C', '#D97706',
  '#E11D48', '#059669', '#4F46E5', '#0284C7', '#65A30D'
];

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const analytics = DemoDataService.getAnalytics(user?.id);
    setData(analytics);
  }, [user?.id]);

  if (!data) return null;

  const hasActivity = data.totalArticlesOpened > 0 || data.totalArticlesBookmarked > 0;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="pb-2 border-b border-border-light dark:border-border-dark">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-white flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <span>Reading Analytics & Behavioral Intelligence</span>
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Real-time metrics calculated from your authentic reading interactions, dwell time, and category diversity.
        </p>
      </div>

      {!hasActivity ? (
        <div className="py-20 text-center space-y-4 bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-8">
          <Activity className="w-10 h-10 text-charcoal-muted mx-auto stroke-1" />
          <h3 className="font-serif font-bold text-lg text-charcoal dark:text-white">Insufficient activity data yet</h3>
          <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
            Read a few article previews and bookmark topics in your personalized feed to populate live reading graphs.
          </p>
          <Link
            to="/feed"
            className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
          >
            Start Reading
          </Link>
        </div>
      ) : (
        <>
          {/* Top Quick Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-charcoal-muted">
                <span className="text-xs font-medium">Total Stories Opened</span>
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-charcoal dark:text-white">
                {data.totalArticlesOpened}
              </p>
              <p className="text-[10px] text-charcoal-muted">Recorded view sessions</p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-charcoal-muted">
                <span className="text-xs font-medium">Articles Bookmarked</span>
                <Bookmark className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                {data.totalArticlesBookmarked}
              </p>
              <p className="text-[10px] text-charcoal-muted">High positive affinity weight</p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-charcoal-muted">
                <span className="text-xs font-medium">Topic Diversity Index</span>
                <Compass className="w-4 h-4 text-teal-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-teal-600">
                {data.diversityIndex}%
              </p>
              <p className="text-[10px] text-charcoal-muted">Breadth of domains explored</p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-charcoal-muted">
                <span className="text-xs font-medium">Top Category</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-lg sm:text-xl font-bold text-charcoal dark:text-white truncate">
                {data.mostReadCategories[0]?.category || 'General'}
              </p>
              <p className="text-[10px] text-charcoal-muted">
                {data.mostReadCategories[0]?.percentage || 0}% of all interactions
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Reading Activity Over Time (7-Day Trend) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal dark:text-white">
                    Reading Activity Over Time
                  </h3>
                  <p className="text-xs text-charcoal-muted">Daily opens and bookmark actions</p>
                </div>
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.readingActivityByDay}>
                    <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E2025',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="reads" fill="#2563EB" radius={[4, 4, 0, 0]} name="Reads" />
                    <Bar dataKey="bookmarks" fill="#7C3AED" radius={[4, 4, 0, 0]} name="Bookmarks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown Donut */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal dark:text-white">
                    Category Distribution
                  </h3>
                  <p className="text-xs text-charcoal-muted">Relative reading volume</p>
                </div>
                <PieIcon className="w-4 h-4 text-teal-600" />
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.mostReadCategories}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {data.mostReadCategories.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E2025',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-2 justify-center text-[10px]">
                {data.mostReadCategories.slice(0, 4).map((c, idx) => (
                  <span key={c.category} className="flex items-center space-x-1 text-charcoal-muted">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }} />
                    <span>{c.category} ({c.percentage}%)</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Interaction Audit Log */}
          <div className="p-6 rounded-2xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-base text-charcoal dark:text-white">
              Recent Recommendation Signals Log
            </h3>
            <p className="text-xs text-charcoal-muted">
              Live feedback inputs ingested by the model to tune your personalized rankings.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border-light dark:border-border-dark text-charcoal-muted uppercase text-[10px]">
                    <th className="pb-2 font-semibold">Story Title</th>
                    <th className="pb-2 font-semibold">Category</th>
                    <th className="pb-2 font-semibold">Signal Action</th>
                    <th className="pb-2 font-semibold text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  {data.recentInteractions.map((act, i) => (
                    <tr key={i} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                      <td className="py-2.5 font-medium text-charcoal dark:text-white max-w-xs truncate">
                        {act.title}
                      </td>
                      <td className="py-2.5 text-charcoal-muted">
                        <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-semibold">
                          {act.category}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          act.action === 'LIKE' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' :
                          act.action === 'BOOKMARK' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' :
                          'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                        }`}>
                          {act.action}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-charcoal-muted text-[11px]">
                        {act.timestamp.includes('T') ? new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : act.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
