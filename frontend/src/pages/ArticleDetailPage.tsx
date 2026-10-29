import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Bookmark, 
  Heart, 
  Share2, 
  Sparkles, 
  ExternalLink, 
  AlertCircle,
  FileText,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { Article, ArticleSummary, SimilarArticleResult } from '../types';
import { NewsService } from '../services/newsService';
import { RecommendationService } from '../services/recommendationService';
import { DemoDataService } from '../services/demoDataService';
import { ArticleCard } from '../components/ArticleCard';
import { handleImageError, getCategoryFallbackImage } from '../utils/imageFallback';

export const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<ArticleSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [similarArticles, setSimilarArticles] = useState<SimilarArticleResult[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      const art = await NewsService.getArticleById(id);
      if (!art || !isMounted) return;

      setArticle(art);
      setBookmarked(DemoDataService.isBookmarked(art.id));
      setLiked(DemoDataService.isLiked(art.id));
      setLoading(false);

      // Record reading history with start timer
      DemoDataService.recordArticleView(art.id, 60);

      // Fetch AI summary
      setSummaryLoading(true);
      RecommendationService.summarizeArticle(art, 4)
        .then(res => {
          if (isMounted) {
            setSummary(res);
            setSummaryLoading(false);
          }
        });

      // Fetch Similar Articles
      const allArticles = await NewsService.getAllArticles();
      RecommendationService.getSimilarArticles(art, allArticles, 3)
        .then(sims => {
          if (isMounted) {
            setSimilarArticles(sims);
          }
        });
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-stone-200 dark:bg-stone-800 rounded" />
        <div className="h-10 w-full bg-stone-200 dark:bg-stone-800 rounded" />
        <div className="h-80 w-full bg-stone-200 dark:bg-stone-800 rounded-2xl" />
        <div className="h-32 w-full bg-stone-200 dark:bg-stone-800 rounded-xl" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold">Article Not Found</h2>
        <p className="text-xs text-charcoal-muted">This story may have expired or is unavailable.</p>
        <Link to="/feed" className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold">
          Return to Feed
        </Link>
      </div>
    );
  }

  const handleBookmarkToggle = () => {
    const state = DemoDataService.toggleBookmark(article.id);
    setBookmarked(state);
  };

  const handleLikeToggle = () => {
    const state = DemoDataService.toggleLike(article.id);
    setLiked(state);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Back button */}
      <div>
        <Link
          to="/feed"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-charcoal-muted hover:text-charcoal dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Link>
      </div>

      {/* Header Info */}
      <header className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            {article.category}
          </span>
          <span className="text-xs text-charcoal-muted">•</span>
          <span className="text-xs font-semibold text-charcoal-light dark:text-stone-300">
            {article.source_name}
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-charcoal dark:text-white leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-y border-border-light dark:border-border-dark py-3 text-xs text-charcoal-muted">
          <div className="flex items-center space-x-2">
            <span>By <strong>{article.author || article.source_name}</strong></span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date(article.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleLikeToggle}
              className={`p-2 rounded-lg border border-border-light dark:border-border-dark transition-colors ${
                liked ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/30 border-rose-200' : 'hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
              title={liked ? 'Liked' : 'Like'}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleBookmarkToggle}
              className={`p-2 rounded-lg border border-border-light dark:border-border-dark transition-colors ${
                bookmarked ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-200' : 'hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
              title={bookmarked ? 'Bookmarked' : 'Save'}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-stone-50 dark:hover:bg-stone-800 text-charcoal-muted hover:text-charcoal transition-colors relative"
              title="Copy Story Link"
            >
              <Share2 className="w-4 h-4" />
              {copied && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black text-white text-[10px] whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="rounded-2xl overflow-hidden aspect-[16/9] w-full bg-stone-100 dark:bg-stone-800 shadow-xs">
        <img
          src={article.image_url || getCategoryFallbackImage(article.category)}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => handleImageError(e, article.category)}
        />
      </div>

      {/* AI Extractive Summary Card */}
      <section className="p-6 rounded-2xl bg-gradient-to-br from-teal-50/60 to-blue-50/60 dark:from-stone-900/60 dark:to-teal-950/20 border border-teal-200/60 dark:border-teal-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-900 dark:text-teal-200">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>AI Salience Summary</span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200">
            {summary?.label || 'Extractive NLP'}
          </span>
        </div>

        {summaryLoading ? (
          <div className="py-4 flex items-center space-x-2 text-xs text-charcoal-muted">
            <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <span>Generating extractive summary...</span>
          </div>
        ) : (
          <p className="font-serif text-sm leading-relaxed text-charcoal dark:text-stone-200">
            {summary?.summary || article.description}
          </p>
        )}

        <div className="flex items-start space-x-2 text-[11px] text-charcoal-muted pt-1">
          <AlertCircle className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
          <span>
            Summarized from publicly accessible excerpt. GNews and external APIs provide licensed excerpts; complete unabridged reporting resides on the publisher's portal.
          </span>
        </div>
      </section>

      {/* Article Excerpt Body */}
      <section className="space-y-4 font-serif text-base sm:text-lg leading-relaxed text-charcoal dark:text-stone-200">
        <p className="font-medium text-lg sm:text-xl text-charcoal dark:text-white leading-normal">
          {article.description}
        </p>
        
        {article.content_excerpt && (
          <p className="text-charcoal-muted dark:text-stone-300">
            {article.content_excerpt}
          </p>
        )}
      </section>

      {/* Call to Action: Read Full Article at Source */}
      <div className="p-6 rounded-2xl bg-stone-50 dark:bg-card-dark border border-border-light dark:border-border-dark text-center space-y-3">
        <h4 className="font-serif font-bold text-base text-charcoal dark:text-white">
          Continue reading the full unabridged story
        </h4>
        <p className="text-xs text-charcoal-muted max-w-md mx-auto">
          Visit {article.source_name} to view the complete reporting, multimedia galleries, and publisher discussions.
        </p>

        <a
          href={article.canonical_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all"
        >
          <span>Read Full Article at Source</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Related / Similar Stories */}
      {similarArticles.length > 0 && (
        <section className="pt-8 border-t border-border-light dark:border-border-dark space-y-4">
          <h3 className="font-serif font-bold text-xl text-charcoal dark:text-white flex items-center space-x-2">
            <span>Related Articles</span>
            <span className="text-xs font-sans text-charcoal-muted font-normal">
              (Matched via TF-IDF cosine similarity)
            </span>
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            {similarArticles.map(sim => (
              <div key={sim.article.id} className="p-3 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark space-y-2">
                <span className="text-[10px] font-bold text-blue-600 uppercase">{sim.article.category}</span>
                <Link to={`/article/${sim.article.id}`} className="block">
                  <h4 className="font-serif font-bold text-xs text-charcoal dark:text-white hover:text-blue-600 line-clamp-2">
                    {sim.article.title}
                  </h4>
                </Link>
                <div className="flex items-center justify-between text-[10px] text-charcoal-muted">
                  <span>{sim.article.source_name}</span>
                  <span className="font-semibold text-teal-600">{Math.round(sim.similarity_score * 100)}% match</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
