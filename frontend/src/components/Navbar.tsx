import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Newspaper, Bell, Menu, X, User as UserIcon, LogOut, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { user, logout, isDemoMode, switchDemoUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-light dark:border-border-dark bg-white/95 dark:bg-[#121316]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu + Logo */}
        <div className="flex items-center space-x-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
              <Newspaper className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-xl tracking-tight text-charcoal dark:text-white leading-none">
                NewsSphere
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 dark:text-blue-400 leading-tight">
                AI Recommendation
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across topics, publishers, headlines..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-stone-100 dark:bg-stone-800/80 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-stone-900 focus:outline-none transition-all placeholder:text-charcoal-muted"
            />
          </form>
        </div>

        {/* Right: Actions & User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-charcoal-muted hover:text-charcoal dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* User Profile / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-border-light dark:border-border-dark"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                  alt={user.displayName}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="hidden sm:inline text-xs font-semibold text-charcoal dark:text-charcoal-dark max-w-[100px] truncate">
                  {user.displayName.split(' ')[0]}
                </span>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-xl py-1 text-xs z-50 animate-fadeIn"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
                    <p className="font-semibold text-charcoal dark:text-charcoal-dark truncate">{user.displayName}</p>
                    <p className="text-charcoal-muted truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/interests"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-charcoal dark:text-charcoal-dark hover:bg-stone-50 dark:hover:bg-stone-800/60"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 mr-2 text-blue-500" />
                    <span>My Interests</span>
                  </Link>

                  <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                    Switch Viva Persona:
                  </div>
                  <div className="px-3 pb-1.5 flex space-x-1.5">
                    <button
                      onClick={() => {
                        switchDemoUser('demo-user-a');
                        setUserDropdownOpen(false);
                      }}
                      className={`flex-1 py-1 px-2 rounded text-[10px] font-bold ${
                        user.id === 'demo-user-a' ? 'bg-blue-600 text-white' : 'bg-stone-100 dark:bg-stone-800 hover:bg-blue-50 text-charcoal dark:text-stone-300'
                      }`}
                    >
                      Aarav (AI)
                    </button>
                    <button
                      onClick={() => {
                        switchDemoUser('demo-user-b');
                        setUserDropdownOpen(false);
                      }}
                      className={`flex-1 py-1 px-2 rounded text-[10px] font-bold ${
                        user.id === 'demo-user-b' ? 'bg-emerald-600 text-white' : 'bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 text-charcoal dark:text-stone-300'
                      }`}
                    >
                      Priya (Sports)
                    </button>
                  </div>

                  <Link
                    to="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-charcoal dark:text-charcoal-dark hover:bg-stone-50 dark:hover:bg-stone-800/60"
                  >
                    <UserIcon className="w-3.5 h-3.5 mr-2 text-charcoal-muted" />
                    <span>Account Settings</span>
                  </Link>

                  <div className="border-t border-border-light dark:border-border-dark my-1" />

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-2" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => switchDemoUser('demo-user-a')}
                className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100 transition-colors shadow-2xs"
                title="Instant Viva Demo: Aarav (AI, Tech, Science profile)"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>Demo: Aarav (AI)</span>
              </button>
              <button
                onClick={() => switchDemoUser('demo-user-b')}
                className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100 transition-colors shadow-2xs"
                title="Instant Viva Demo: Priya (Cricket, Sports, Business profile)"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Demo: Priya (Sports)</span>
              </button>
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold text-charcoal dark:text-charcoal-dark hover:text-blue-600 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
