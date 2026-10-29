import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  Compass, 
  ArrowRight, 
  BookOpen, 
  BrainCircuit, 
  Eye, 
  CheckCircle,
  ExternalLink,
  Newspaper
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#121316] text-[#191C21] dark:text-[#F1F3F7] transition-colors">
      {/* Top Header */}
      <header className="border-b border-border-light dark:border-border-dark bg-white/80 dark:bg-[#121316]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Newspaper className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-xl tracking-tight leading-none">NewsSphere</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 dark:text-blue-400">
                Explainable AI News
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="px-3.5 py-1.5 text-xs font-semibold text-charcoal dark:text-charcoal-dark hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Content-Based Personalization & Transparency</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-charcoal dark:text-white max-w-3xl mx-auto leading-tight">
          News that matters to you. Explained with clarity.
        </h1>

        <p className="text-base sm:text-lg text-charcoal-muted max-w-2xl mx-auto leading-relaxed">
          Break free from information overload and black-box algorithms. NewsSphere aggregates reporting across domains and personalizes your daily briefing using transparent TF-IDF text similarity and explainable AI.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to="/register"
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all flex items-center space-x-2"
          >
            <span>Start Reading For Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/feed"
            className="px-6 py-3 rounded-lg bg-white dark:bg-card-dark hover:bg-stone-50 dark:hover:bg-stone-800 text-charcoal dark:text-charcoal-dark font-semibold text-sm border border-border-light dark:border-border-dark transition-all flex items-center space-x-2"
          >
            <Eye className="w-4 h-4 text-charcoal-muted" />
            <span>Explore Demo Feed</span>
          </Link>
        </div>
      </section>

      {/* Interactive Feed Preview Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Live Demonstration</span>
              <h3 className="font-serif font-bold text-lg text-charcoal dark:text-white">
                How NewsSphere Solves Feed Divergence
              </h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 text-charcoal-muted font-medium">
              Common Database • Unique Experience
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* User A Card */}
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="font-semibold text-xs text-blue-900 dark:text-blue-300">
                  User A (Aarav): AI, Technology & Science Focus
                </span>
              </div>
              <p className="text-xs text-charcoal-muted">
                Feed ranks DeepMind Gemini architecture, commercial silicon quantum chips, and CRISPR epigenetic editing at the top with explainable tags.
              </p>
              <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-blue-100 dark:border-blue-900/30 text-xs">
                <p className="font-serif font-bold text-charcoal dark:text-white">Google DeepMind Unveils Gemini Reasoning</p>
                <p className="text-[11px] text-blue-600 mt-1 italic">Why: Matches your selected interest in Artificial Intelligence.</p>
              </div>
            </div>

            {/* User B Card */}
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="font-semibold text-xs text-emerald-900 dark:text-emerald-300">
                  User B (Priya): Cricket, Sports & Business Focus
                </span>
              </div>
              <p className="text-xs text-charcoal-muted">
                Feed ranks Champions Trophy final analysis, IPL auction valuation trends, and RBI repo rate macroeconomic guidance with tailored rationales.
              </p>
              <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-emerald-100 dark:border-emerald-900/30 text-xs">
                <p className="font-serif font-bold text-charcoal dark:text-white">Rohit & Kohli Anchor India to Champions Trophy Win</p>
                <p className="text-[11px] text-emerald-600 mt-1 italic">Why: Matches your chosen interest in Cricket.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 bg-stone-50 dark:bg-[#16181D] border-y border-border-light dark:border-border-dark px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-3xl font-bold text-charcoal dark:text-white">
              Engineered for Editorial Trust & Transparency
            </h2>
            <p className="text-sm text-charcoal-muted">
              Built using Supabase, FastAPI, Scikit-learn, and high-precision natural language heuristics.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base">Content-Based Filtering</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                TF-IDF text vectorization models your authentic reading taste using vocabulary salience, avoiding noisy collaborative crowd bias.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base">Explainable AI (XAI)</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Click "Why this article?" to inspect real component scores across selected interests, reading duration, and content similarity.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base">Diversity-Aware MMR</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Maximal Marginal Relevance (MMR) re-ranking intelligently introduces exploratory topics so you discover fresh horizons.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base">Extractive Summaries</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Rapid NLP sentence ranking condenses reporting without hallucinations or fabricated facts, always citing the primary publisher.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base">User-Controlled Preferences</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Easily modify your explicit interests, reset learned behavioral weights at any time, or toggle personalization off completely.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base">Supabase PostgreSQL RLS</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Row Level Security strictly isolates user bookmarks, reading history, and interactions directly at the database engine level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border-light dark:border-border-dark bg-white dark:bg-[#121316] text-xs text-charcoal-muted">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Newspaper className="w-4 h-4 text-blue-600" />
            <span className="font-serif font-bold text-charcoal dark:text-white">NewsSphere</span>
            <span>• Final Year College Engineering Project & Viva Demonstration</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/feed" className="hover:text-charcoal dark:hover:text-white">Demo Feed</Link>
            <Link to="/explore" className="hover:text-charcoal dark:hover:text-white">Explore Topics</Link>
            <Link to="/login" className="hover:text-charcoal dark:hover:text-white">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
