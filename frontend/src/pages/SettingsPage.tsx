import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Moon, 
  Sun, 
  Sliders, 
  Compass, 
  ShieldAlert, 
  LogOut, 
  Check, 
  Trash2,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { DemoDataService } from '../services/demoDataService';
import { UserSettings } from '../types';
import { Link, useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [settings, setLocalSettings] = useState<UserSettings>(() => DemoDataService.getUserSettings(user?.id));
  const [savedNotice, setSavedNotice] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setLocalSettings(DemoDataService.getUserSettings(user.id));
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ displayName });
    triggerNotice();
  };

  const handleTogglePersonalization = () => {
    const updated = DemoDataService.saveUserSettings({
      personalizationEnabled: !settings.personalizationEnabled
    }, user?.id);
    setLocalSettings(updated);
    triggerNotice();
  };

  const handleDiversityChange = (val: number) => {
    const updated = DemoDataService.saveUserSettings({
      diversityLevel: val
    }, user?.id);
    setLocalSettings(updated);
    triggerNotice();
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    DemoDataService.saveUserSettings({ theme: newTheme }, user?.id);
    triggerNotice();
  };

  const handleDeleteAccount = async () => {
    DemoDataService.clearReadingHistory(user?.id);
    await logout();
    navigate('/');
  };

  const triggerNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="pb-2 border-b border-border-light dark:border-border-dark">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-white flex items-center space-x-2">
          <Settings className="w-6 h-6 text-blue-600" />
          <span>Account & System Settings</span>
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Manage your reader identity, visual theme, and recommendation diversity parameters.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 text-xs animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Profile Details Form */}
      <section className="p-6 rounded-2xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-charcoal dark:text-white flex items-center space-x-2">
          <User className="w-4 h-4 text-blue-600" />
          <span>Reader Profile</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-charcoal dark:text-charcoal-dark mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full sm:w-80 px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-stone-50 dark:bg-stone-900 focus:bg-white dark:focus:bg-stone-800 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-charcoal dark:text-charcoal-dark mb-1">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={user?.email || 'demo@newssphere.io'}
              className="w-full sm:w-80 px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-stone-100 dark:bg-stone-800 text-charcoal-muted cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-2xs transition-colors"
          >
            Save Profile
          </button>
        </form>
      </section>

      {/* Appearance / Theme */}
      <section className="p-6 rounded-2xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-charcoal dark:text-white flex items-center space-x-2">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Editorial Theme</span>
        </h3>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => handleThemeChange('light')}
            className={`px-4 py-2 rounded-lg border flex items-center space-x-2 font-medium transition-all ${
              theme === 'light'
                ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-2xs'
                : 'bg-stone-50 dark:bg-stone-800 border-border-light dark:border-border-dark text-charcoal-muted'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Light Editorial (Classic)</span>
          </button>

          <button
            onClick={() => handleThemeChange('dark')}
            className={`px-4 py-2 rounded-lg border flex items-center space-x-2 font-medium transition-all ${
              theme === 'dark'
                ? 'bg-blue-950/60 border-blue-500 text-blue-300 shadow-2xs'
                : 'bg-stone-50 dark:bg-stone-800 border-border-light dark:border-border-dark text-charcoal-muted'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Dark Night (OLED)</span>
          </button>
        </div>
      </section>

      {/* Recommendation Engine Parameters */}
      <section className="p-6 rounded-2xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xs space-y-5">
        <h3 className="font-serif font-bold text-base text-charcoal dark:text-white flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-purple-600" />
          <span>AI Engine Tuning</span>
        </h3>

        {/* Toggle Personalization */}
        <div className="flex items-center justify-between py-2 border-b border-border-light dark:border-border-dark">
          <div>
            <p className="text-xs font-semibold text-charcoal dark:text-white">Enable AI Personalization</p>
            <p className="text-[11px] text-charcoal-muted">
              When disabled, articles are sorted chronologically without behavioral weighting.
            </p>
          </div>
          <button
            onClick={handleTogglePersonalization}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              settings.personalizationEnabled ? 'bg-blue-600' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.personalizationEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Diversity Explorer Slider */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold text-charcoal dark:text-white">
            <span className="flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-purple-600" />
              <span>Exploration Diversity Weight (MMR)</span>
            </span>
            <span className="font-mono text-purple-600">{Math.round(settings.diversityLevel * 100)}%</span>
          </div>
          <p className="text-[11px] text-charcoal-muted">
            Higher values inject novel topics beyond your main reading cluster, preventing echo chambers.
          </p>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.diversityLevel}
            onChange={(e) => handleDiversityChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-[10px] text-charcoal-muted">
            <span>0% (Strict Focus)</span>
            <span>25% (Balanced)</span>
            <span>100% (High Serendipity)</span>
          </div>
        </div>

        {/* Quick link to Interests */}
        <div className="pt-2">
          <Link
            to="/interests"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Edit Categories & Learned Preferences</span>
          </Link>
        </div>
      </section>

      {/* Account Deletion / Reset */}
      <section className="p-6 rounded-2xl bg-rose-50/40 dark:bg-rose-950/10 border border-rose-200/80 dark:border-rose-900/40 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-rose-800 dark:text-rose-300 flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Danger Zone</span>
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <p className="font-semibold text-charcoal dark:text-white">Clear Reader Data & Logout</p>
            <p className="text-charcoal-muted text-[11px]">
              Purges reading history, bookmarks, and behavioral affinity models.
            </p>
          </div>

          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-2xs transition-colors self-start sm:self-auto flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Account</span>
          </button>
        </div>

        {deleteConfirmOpen && (
          <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-rose-300 dark:border-rose-800 space-y-3 text-xs">
            <p className="font-bold text-rose-900 dark:text-rose-200">
              Are you sure? This will remove all local bookmarks, history, and inferred weights.
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-charcoal dark:text-white font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
