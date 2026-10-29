import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Newspaper, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, switchDemoUser, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/feed');
    } else {
      setError(res.error || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleQuickDemoLogin = (userId: 'demo-user-a' | 'demo-user-b') => {
    switchDemoUser(userId);
    navigate('/feed');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#FBFBFA] dark:bg-[#121316] transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
            <Newspaper className="w-6 h-6" />
          </div>
          <span className="font-serif font-black text-2xl tracking-tight text-charcoal dark:text-white">
            NewsSphere
          </span>
        </Link>
        <h2 className="font-serif text-2xl font-bold tracking-tight text-charcoal dark:text-white">
          Sign in to your personalized feed
        </h2>
        <p className="mt-1 text-xs text-charcoal-muted">
          New to NewsSphere?{' '}
          <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 space-y-4">
        {/* Quick Demo Access Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/60 space-y-3 text-xs shadow-xs">
          <div className="flex items-center space-x-1.5 font-bold text-blue-900 dark:text-blue-200">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Instant Viva Demo Profiles (One Click Login)</span>
          </div>
          <p className="text-[11px] text-blue-800 dark:text-blue-300">
            Select a profile below to instantly experience NewsSphere's explainable AI recommendation engine:
          </p>
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('demo-user-a')}
              className="p-3 rounded-xl bg-white dark:bg-stone-900 hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20 border border-blue-300 dark:border-blue-800/80 text-left transition-all shadow-xs group"
            >
              <div className="flex items-center space-x-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <p className="font-bold text-xs text-charcoal dark:text-white group-hover:text-blue-600 transition-colors">Aarav Sharma</p>
              </div>
              <p className="text-[10px] text-charcoal-muted font-medium">Focus: AI, Tech, Science</p>
              <span className="inline-block mt-2 text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                Click to Sign In →
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('demo-user-b')}
              className="p-3 rounded-xl bg-white dark:bg-stone-900 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-500/20 border border-emerald-300 dark:border-emerald-800/80 text-left transition-all shadow-xs group"
            >
              <div className="flex items-center space-x-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="font-bold text-xs text-charcoal dark:text-white group-hover:text-emerald-600 transition-colors">Priya Patel</p>
              </div>
              <p className="text-[10px] text-charcoal-muted font-medium">Focus: Cricket, Sports, Biz</p>
              <span className="inline-block mt-2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                Click to Sign In →
              </span>
            </button>
          </div>
        </div>

        {/* Standard Login Form */}
        <div className="bg-white dark:bg-card-dark border border-border-light dark:border-border-dark py-8 px-6 sm:px-10 rounded-2xl shadow-xl">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start space-x-2 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal dark:text-charcoal-dark mb-1">
                Email Address or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav@example.com, priya, or your email"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border-light dark:border-border-dark bg-stone-50 dark:bg-stone-900 focus:bg-white dark:focus:bg-stone-800 focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
              <div className="flex items-center space-x-2 mt-1.5">
                <span className="text-[10px] text-charcoal-muted">Quick fill:</span>
                <button
                  type="button"
                  onClick={() => { setEmail('aarav@example.com'); setPassword('Password123!'); }}
                  className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  aarav@example.com
                </button>
                <span className="text-[10px] text-charcoal-muted">•</span>
                <button
                  type="button"
                  onClick={() => { setEmail('priya@example.com'); setPassword('Password123!'); }}
                  className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  priya@example.com
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal dark:text-charcoal-dark mb-1">
                Password <span className="text-charcoal-muted font-normal">(optional for demo)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password123! (or leave blank)"
                  className="w-full pl-9 pr-9 py-2 text-xs rounded-lg border border-border-light dark:border-border-dark bg-stone-50 dark:bg-stone-900 focus:bg-white dark:focus:bg-stone-800 focus:border-blue-500 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
