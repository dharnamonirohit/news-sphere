import React, { useState } from 'react';
import { Bookmark, Heart, Sparkles, Clock, ExternalLink, Compass, BookOpen } from 'lucide-react';
import { Article, ScoredArticle } from '../types';
import { Link } from 'react-router-dom';
import { DemoDataService } from '../services/demoDataService';
import { handleImageError, getCategoryFallbackImage } from '../utils/imageFallback';

interface ArticleCardProps {
  scoredArticle?: ScoredArticle;
  article?: Article;
  onWhyClick?: (scoredArticle: ScoredArticle) => void;
  onSummaryClick?: (article: Article) => void;
  isBookmarkedInit?: boolean;
  isLikedInit?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  scoredArticle,
  article: rawArticle,
  onWhyClick,
  onSummaryClick,
  isBookmarkedInit,
  isLikedInit
}) => {
  const article = scoredArticle ? scoredArticle.article : rawArticle!;
  if (!article) return null;

  const [bookmarked, setBookmarked] = useState<boolean>(() => {
    if (isBookmarkedInit !== undefined) return isBookmarkedInit;
    return DemoDataService.isBookmarked(article.id);
  });

  const [liked, setLiked] = useState<boolean>(() => {
    if (isLikedInit !== undefined) return isLikedInit;
    return DemoDataService.isLiked(article.id);
  });

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = DemoDataService.toggleBookmark(article.id);
    setBookmarked(newState);
  };

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = DemoDataService.toggleLike(article.id);
    setLiked(newState);
  };

  const handleArticleClick = () => {
    DemoDataService.recordArticleView(article.id, 45);
  };

  // Estimate reading time: ~200 wpm
  const textWords = `${article.title} ${article.description || ''} ${article.content_excerpt || ''}`.split(/\s+/).length;
  const readingTimeMin = Math.max(1, Math.ceil(textWords / 60));

  // Time ago
  const formatTimeAgo = (dateStr: string) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const isExploratory = scoredArticle?.is_diversity_boosted;
  const isRecent = (Date.now() - new Date(article.published_at).getTime()) < 3600 * 1000 * 2;

  return (
    <article 
      onClick={handleArticleClick}
      className="group relative bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-200 hover:shadow-sm flex flex-col justify-between"
    >
      <div>
        {/* Thumbnail Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
          <img
            src={article.image_url || getCategoryFallbackImage(article.category)}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => handleImageError(e, article.category)}
          />
          
          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/95 dark:bg-stone-900/90 text-charcoal dark:text-stone-100 backdrop-blur-sm shadow-xs border border-stone-200/50 dark:border-stone-700/50">
              {article.category}
            </span>

            {isRecent && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white backdrop-blur-sm flex items-center space-x-1 animate-pulse">
                <span>Breaking</span>
              </span>
            )}

            {isExploratory && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-600/90 text-white backdrop-blur-sm flex items-center space-x-1">
                <Compass className="w-3 h-3" />
                <span>Explore</span>
              </span>
            )}
          </div>

          {/* Quick AI Summary Button on image */}
          {onSummaryClick && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSummaryClick(article);
              }}
              className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md text-[10px] font-semibold bg-stone-900/80 hover:bg-stone-900 text-white backdrop-blur-sm flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Quick AI Extractive Summary"
            >
              <Sparkles className="w-3 h-3 text-teal-300" />
              <span>Summary</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-charcoal-muted mb-2">
            <span className="font-medium text-charcoal-light dark:text-stone-400 truncate max-w-[60%]">
              {article.source_name}
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(article.published_at)} • {readingTimeMin} min read</span>
            </span>
          </div>

          {/* Headline */}
          <Link to={`/article/${article.id}`}>
            <h3 className="font-serif font-bold text-base sm:text-lg leading-snug text-charcoal dark:text-charcoal-dark group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>

          {/* Description Excerpt */}
          <p className="mt-2 text-xs sm:text-sm text-charcoal-muted line-clamp-2 leading-relaxed">
            {article.description}
          </p>

          {/* Recommendation Reason Pill (if scored) */}
          {scoredArticle && (
            <div className="mt-3.5 pt-3 border-t border-border-light/80 dark:border-border-dark/80 flex items-center justify-between">
              <span className="text-[11px] text-charcoal-muted italic truncate max-w-[70%]" title={scoredArticle.reason}>
                {scoredArticle.reason}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onWhyClick?.(scoredArticle);
                }}
                className="inline-flex items-center space-x-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0"
              >
                <Sparkles className="w-3 h-3" />
                <span>Why this?</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-2.5 sm:px-5 border-t border-border-light dark:border-border-dark bg-stone-50/50 dark:bg-surface-dark/50 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {/* Like */}
          <button
            onClick={handleLikeToggle}
            className={`p-1.5 rounded-lg transition-colors ${
              liked
                ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/30'
                : 'text-charcoal-muted hover:text-rose-600 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
            title={liked ? 'Liked' : 'Like story'}
            aria-label="Like story"
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>

          {/* Bookmark */}
          <button
            onClick={handleBookmarkToggle}
            className={`p-1.5 rounded-lg transition-colors ${
              bookmarked
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/30'
                : 'text-charcoal-muted hover:text-blue-600 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
            title={bookmarked ? 'Saved to Bookmarks' : 'Bookmark story'}
            aria-label="Bookmark story"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Read Article Details Link */}
        <Link
          to={`/article/${article.id}`}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-charcoal dark:text-charcoal-dark hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <span>Read Preview</span>
          <BookOpen className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};
