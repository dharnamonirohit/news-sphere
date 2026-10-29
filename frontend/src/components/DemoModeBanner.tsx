import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, Users, RefreshCw } from 'lucide-react';

export const DemoModeBanner: React.FC = () => {
  const { user, switchDemoUser, isDemoMode } = useAuth();

  if (!isDemoMode) return null;

  const isUserA = user?.id === 'demo-user-a';

  return (
    <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200/80 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 px-4 py-2 text-xs transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-100 uppercase tracking-wider">
            Demo Mode
          </span>
          <span className="font-medium">
            Active Profile: <strong className="font-bold underline">{user?.displayName || 'Demo User'}</strong>
            {isUserA ? ' (Focus: AI, Technology, Science)' : ' (Focus: Cricket, Sports, Business)'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-amber-700 dark:text-amber-300 hidden sm:inline">Compare Feeds:</span>
          <button
            onClick={() => switchDemoUser('demo-user-a')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              isUserA
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-white/80 dark:bg-amber-900/50 hover:bg-white text-amber-900 dark:text-amber-100 border border-amber-300 dark:border-amber-800'
            }`}
          >
            User A (AI & Tech)
          </button>
          <button
            onClick={() => switchDemoUser('demo-user-b')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              !isUserA
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-white/80 dark:bg-amber-900/50 hover:bg-white text-amber-900 dark:text-amber-100 border border-amber-300 dark:border-amber-800'
            }`}
          >
            User B (Sports & Biz)
          </button>
        </div>
      </div>
    </div>
  );
};
