import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  SlidersHorizontal, 
  ArrowRight, 
  RefreshCw, 
  ExternalLink,
  BookOpen,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Article, ScoredArticle } from '../types';
import { NewsService } from '../services/newsService';
import { RecommendationService } from '../services/recommendationService';
import { DemoDataService } from '../services/demoDataService';
import { useAuth } from '../hooks/useAuth';
import { ArticleCard } from '../components/ArticleCard';
import { CategoryPills } from '../components/CategoryPills';
import { WhyThisModal } from '../components/WhyThisModal';
import { SummaryModal } from '../components/SummaryModal';
import { Link } from 'react-router-dom';
import { handleImageError, getCategoryFallbackImage } from '../utils/imageFallback';

interface HomePageProps {
  initialTab?: 'forYou' | 'latest' | 'trending';
}

export const HomePage: React.FC<HomePageProps> = ({ initialTab = 'forYou' }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'forYou' | 'latest' | 'trending'>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'latest' | 'relevance'>('recommended');
  
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [scoredFeed, setScoredFeed] = useState<ScoredArticle[]>([]);
  const [pageLimit, setPageLimit] = useState<number>(9);

  // Modals
  const [activeWhyArticle, setActiveWhyArticle] = useState<ScoredArticle | null>(null);
  const [activeSummaryArticle, setActiveSummaryArticle] = useState<Article | null>(null);

  const loadFeed = async () => {
    setLoading(true);
    try {
      let articles = await NewsService.getAllArticles();
      if (!articles || articles.length === 0) {
        articles = DemoDataService.getArticles();
      }
      setAllArticles(articles);

      const interests = DemoDataService.getUserInterests();
      const interactions = DemoDataService.getInteractions();
      const settings = DemoDataService.getUserSettings();

      const scored = await RecommendationService.getRecommendations({
        articles,
        interests,
        interactions,
        diversityWeight: settings.diversityLevel,
        categoryFilter: selectedCategory === 'All' ? null : selectedCategory,
        limit: 30
      });

      setScoredFeed(scored);
    } catch (err) {
      console.error('Failed to load feed, falling back to local dataset:', err);
      const fallbackArticles = DemoDataService.getArticles();
      setAllArticles(fallbackArticles);
      const fallbackScored = RecommendationService.computeClientSideRecommendations(
        fallbackArticles,
        DemoDataService.getUserInterests(),
        DemoDataService.getInteractions(),
        0.25,
        30
      );
      setScoredFeed(fallbackScored);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem('newssphere_initial_refreshed');
    if (!hasRefreshed) {
      sessionStorage.setItem('newssphere_initial_refreshed', 'true');
      NewsService.refreshNews().finally(() => loadFeed());
    } else {
      loadFeed();
    }
  }, [user?.id, selectedCategory]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await NewsService.refreshNews();
      await loadFeed();
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(null), 5000);
    } catch {
      setToastMessage('News feed updated with latest available dispatches.');
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setRefreshing(false);
    }
  };

  // Filter and sort the feed based on active tab and sort controls
  let displayFeed = [...scoredFeed];

  if (activeTab === 'latest') {
    displayFeed.sort((a, b) => new Date(b.article.published_at).getTime() - new Date(a.article.published_at).getTime());
  } else if (activeTab === 'trending') {
    // Trending: Recency + Behavioral affinity
    displayFeed.sort((a, b) => (b.scores.recency_score + b.scores.behavioral_score) - (a.scores.recency_score + a.scores.behavioral_score));
  } else {
    // For You tab: sort by user selection
    if (sortBy === 'latest') {
      displayFeed.sort((a, b) => new Date(b.article.published_at).getTime() - new Date(a.article.published_at).getTime());
    } else if (sortBy === 'relevance') {
      displayFeed.sort((a, b) => (b.scores.category_score + b.scores.content_similarity_score) - (a.scores.category_score + a.scores.content_similarity_score));
    } else {
      displayFeed.sort((a, b) => b.score - a.score);
    }
  }

  const featuredStory = displayFeed[0];
  const gridStories = displayFeed.slice(1, pageLimit);
  const hasMore = displayFeed.length > pageLimit;

  // Real-time breaking stories published within last 4 hours
  const breakingStories = displayFeed.filter(
    s => (Date.now() - new Date(s.article.published_at).getTime()) < 3600 * 1000 * 4
  );

  return (
    <div className="space-y-6">
      {/* Header Greeting & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-light dark:border-border-dark">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-white">
            {user ? `Welcome back, ${user.displayName.split(' ')[0]}` : 'Good day'}
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Your personalized editorial edition, updated continuously with explainable AI.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Tab buttons */}
          <div className="flex items-center p-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('forYou')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1 ${
                activeTab === 'forYou'
                  ? 'bg-white dark:bg-card-dark text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>For You</span>
            </button>
            <button
              onClick={() => setActiveTab('latest')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1 ${
                activeTab === 'latest'
                  ? 'bg-white dark:bg-card-dark text-charcoal dark:text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Latest</span>
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1 ${
                activeTab === 'trending'
                  ? 'bg-white dark:bg-card-dark text-charcoal dark:text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending</span>
            </button>
          </div>

          {/* Refresh news button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark text-charcoal-muted hover:text-charcoal transition-colors"
            title="Refresh News Feed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Live Refresh Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 shadow-sm transition-all animate-fadeIn">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-white font-bold px-1.5 py-0.5 rounded"
          >
            ×
          </button>
        </div>
      )}

      {/* Category Pills Filter */}
      <CategoryPills
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setPageLimit(9);
        }}
      />

      {/* Sort options bar */}
      {activeTab === 'forYou' && (
        <div className="flex items-center justify-between text-xs text-charcoal-muted pt-1">
          <span>
            Curated from <strong className="text-charcoal dark:text-white">{displayFeed.length}</strong> evaluated stories
          </span>

          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Sort by:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-100 dark:bg-stone-800 border-none rounded-lg text-xs font-semibold text-charcoal dark:text-charcoal-dark px-2.5 py-1 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="recommended">Personalized Match</option>
              <option value="latest">Most Recent</option>
              <option value="relevance">Interest Relevance</option>
            </select>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-72 rounded-2xl bg-stone-200 dark:bg-stone-800" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 rounded-xl bg-stone-200 dark:bg-stone-800" />
            ))}
          </div>
        </div>
      ) : displayFeed.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-8">
          <BookOpen className="w-10 h-10 text-charcoal-muted mx-auto" />
          <h3 className="font-serif font-bold text-lg text-charcoal dark:text-white">No articles found in this category</h3>
          <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
            Try choosing a different topic filter or refreshing your feed.
          </p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
          >
            Show All Categories
          </button>
        </div>
      ) : (
        <>
          {/* Live Wire Breaking Ticker */}
          {breakingStories.length > 0 && (
            <div className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200">
              <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
              </span>
              <span className="font-bold uppercase tracking-wider text-[10px] text-rose-600 dark:text-rose-400 flex-shrink-0">
                Live Dispatch:
              </span>
              <span className="truncate font-medium flex-1">
                {breakingStories[0].article.title}
              </span>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/40 flex-shrink-0">
                Just in
              </span>
            </div>
          )}

          {/* Featured Top Story */}
          {featuredStory && (
            <div className="relative rounded-2xl overflow-hidden border border-border-light dark:border-border-dark bg-white dark:bg-card-dark shadow-xs group">
              <div className="grid lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 aspect-[16/9] lg:aspect-auto overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={featuredStory.article.image_url || getCategoryFallbackImage(featuredStory.article.category)}
                    alt={featuredStory.article.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    onError={(e) => handleImageError(e, featuredStory.article.category)}
                  />
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        Featured • {featuredStory.article.category}
                      </span>
                      <span className="text-xs text-charcoal-muted">
                        {featuredStory.article.source_name}
                      </span>
                    </div>

                    <Link to={`/article/${featuredStory.article.id}`}>
                      <h2 className="font-serif font-bold text-xl sm:text-2xl leading-tight text-charcoal dark:text-white group-hover:text-blue-600 transition-colors">
                        {featuredStory.article.title}
                      </h2>
                    </Link>

                    <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed line-clamp-3">
                      {featuredStory.article.description}
                    </p>
                  </div>

                  {/* Explainable AI rationale pill */}
                  <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-border-light dark:border-border-dark flex items-center justify-between text-xs">
                    <span className="text-[11px] text-charcoal-muted italic truncate mr-2">
                      {featuredStory.reason}
                    </span>
                    <button
                      onClick={() => setActiveWhyArticle(featuredStory)}
                      className="inline-flex items-center space-x-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Why this?</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border-light dark:border-border-dark">
                    <button
                      onClick={() => setActiveSummaryArticle(featuredStory.article)}
                      className="px-3.5 py-1.5 rounded-lg border border-border-light dark:border-border-dark hover:bg-stone-50 text-xs font-semibold text-charcoal dark:text-white flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                      <span>AI Summary</span>
                    </button>

                    <Link
                      to={`/article/${featuredStory.article.id}`}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Recommended Articles */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-charcoal dark:text-white flex items-center space-x-2">
              <span>Personalized Recommendations</span>
              <span className="text-xs font-sans text-charcoal-muted font-normal">
                (Ranked by multi-signal model)
              </span>
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridStories.map((scored) => (
                <ArticleCard
                  key={scored.article.id}
                  scoredArticle={scored}
                  onWhyClick={(art) => setActiveWhyArticle(art)}
                  onSummaryClick={(art) => setActiveSummaryArticle(art)}
                />
              ))}
            </div>
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="pt-6 text-center">
              <button
                onClick={() => setPageLimit(prev => prev + 6)}
                className="px-6 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-semibold text-charcoal dark:text-white shadow-xs transition-colors"
              >
                Load More Articles
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <WhyThisModal
        scoredArticle={activeWhyArticle}
        onClose={() => setActiveWhyArticle(null)}
      />

      <SummaryModal
        article={activeSummaryArticle}
        onClose={() => setActiveSummaryArticle(null)}
      />
    </div>
  );
};
