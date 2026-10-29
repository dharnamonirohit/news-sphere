import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Home, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Compass, 
  Bookmark, 
  History, 
  SlidersHorizontal, 
  BarChart3, 
  Settings, 
  LogOut,
  Newspaper
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LeftSidebarProps {
  onCloseMobile?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ onCloseMobile }) => {
  const { user, logout, switchDemoUser } = useAuth();

  const navItems = [
    { to: '/feed', label: 'Home Feed', icon: Home, end: true },
    { to: '/latest', label: 'Latest News', icon: Clock },
    { to: '/trending', label: 'Trending', icon: TrendingUp },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { to: '/history', label: 'Reading History', icon: History },
    { to: '/interests', label: 'My Interests', icon: SlidersHorizontal },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 border-r border-border-light dark:border-border-dark bg-white/70 dark:bg-[#121316]/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onCloseMobile}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all
                  ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal dark:hover:text-charcoal-dark hover:bg-stone-100 dark:hover:bg-stone-800/60'
                  }
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile card or Quick Demo Switcher at bottom */}
      {user ? (
        <div className="pt-3 border-t border-border-light dark:border-border-dark space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 dark:bg-stone-900/50">
            <div className="flex items-center space-x-2.5 min-w-0">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                alt={user.displayName}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-charcoal dark:text-charcoal-dark truncate">{user.displayName}</p>
                <p className="text-[10px] text-charcoal-muted truncate">{user.role || 'Member'}</p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 rounded-md text-charcoal-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Viva Persona Switcher */}
          <div className="flex items-center justify-between gap-1.5 pt-1">
            <button
              onClick={() => switchDemoUser('demo-user-a')}
              className={`flex-1 py-1 px-1.5 rounded text-[10px] font-bold text-center transition-all ${
                user.id === 'demo-user-a' 
                  ? 'bg-blue-600 text-white shadow-2xs' 
                  : 'bg-stone-100 dark:bg-stone-800 text-charcoal dark:text-stone-300 hover:bg-blue-50 dark:hover:bg-blue-950/40'
              }`}
              title="Switch to Aarav (AI, Tech, Science profile)"
            >
              Aarav (AI)
            </button>
            <button
              onClick={() => switchDemoUser('demo-user-b')}
              className={`flex-1 py-1 px-1.5 rounded text-[10px] font-bold text-center transition-all ${
                user.id === 'demo-user-b' 
                  ? 'bg-emerald-600 text-white shadow-2xs' 
                  : 'bg-stone-100 dark:bg-stone-800 text-charcoal dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
              title="Switch to Priya (Cricket, Sports, Business profile)"
            >
              Priya (Sports)
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-3 border-t border-border-light dark:border-border-dark space-y-2">
          <p className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
            1-Click Demo Profiles:
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => switchDemoUser('demo-user-a')}
              className="py-1.5 px-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-[11px] font-bold border border-blue-200 dark:border-blue-900/80 text-center transition-all"
            >
              Aarav (AI)
            </button>
            <button
              onClick={() => switchDemoUser('demo-user-b')}
              className="py-1.5 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-900/80 text-center transition-all"
            >
              Priya (Sports)
            </button>
          </div>
          <Link
            to="/login"
            className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-charcoal dark:text-white text-xs font-semibold transition-colors"
          >
            <span>Sign In / Register</span>
          </Link>
        </div>
      )}
    </aside>
  );
};
