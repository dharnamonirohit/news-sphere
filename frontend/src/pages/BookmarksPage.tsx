import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, BookOpen, ExternalLink } from 'lucide-react';
import { BookmarkItem } from '../types';
import { DemoDataService } from '../services/demoDataService';
import { useAuth } from '../hooks/useAuth';
import { ArticleCard } from '../components/ArticleCard';
import { Link } from 'react-router-dom';

export const BookmarksPage: React.FC = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const loadBookmarks = () => {
    const items = DemoDataService.getBookmarks(user?.id);
    setBookmarks(items);
  };

  useEffect(() => {
    loadBookmarks();
  }, [user?.id]);

  const categories = ['All', ...Array.from(new Set(bookmarks.map(b => b.article.category)))];

  const filtered = bookmarks.filter(b => 
    selectedCategory === 'All' || b.article.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border-light dark:border-border-dark">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-white flex items-center space-x-2">
            <Bookmark className="w-6 h-6 text-blue-600 fill-blue-600" />
            <span>Saved Bookmarks</span>
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Articles saved for offline deliberation, research, and future reading.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
          {bookmarks.length} Saved
        </span>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 2 && (
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-charcoal text-white dark:bg-white dark:text-charcoal'
                  : 'bg-white dark:bg-card-dark text-charcoal-muted border border-border-light dark:border-border-dark'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Bookmarked Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-8">
          <Bookmark className="w-10 h-10 text-charcoal-muted mx-auto stroke-1" />
          <h3 className="font-serif font-bold text-lg text-charcoal dark:text-white">No bookmarked stories yet</h3>
          <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
            Click the bookmark icon on any story in your personalized feed to pin it here for easy reference.
          </p>
          <Link
            to="/feed"
            className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
          >
            Explore Stories to Bookmark
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(b => (
            <div key={b.id} className="relative group">
              <ArticleCard
                article={b.article}
                isBookmarkedInit={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
