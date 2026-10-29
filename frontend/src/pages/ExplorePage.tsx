import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Compass, Flame, Clock, BookOpen } from 'lucide-react';
import { Article } from '../types';
import { NewsService } from '../services/newsService';
import { ArticleCard } from '../components/ArticleCard';
import { CategoryPills } from '../components/CategoryPills';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    NewsService.searchArticles(query, category)
      .then(results => {
        if (isMounted) {
          setArticles(results);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [query, category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query, category });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal dark:text-white flex items-center space-x-2">
          <Compass className="w-6 h-6 text-blue-600" />
          <span>Explore Topics & Public Reporting</span>
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Search the entire aggregated news archive across 16 editorial categories.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by keywords, companies, players, missions (e.g., Gemini, ISRO, Bumrah, mRNA)..."
          className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark focus:border-blue-500 focus:outline-none shadow-xs transition-all"
        />
      </form>

      {/* Category Pills */}
      <CategoryPills
        selectedCategory={category}
        onSelectCategory={(cat) => {
          setCategory(cat);
          setSearchParams({ q: query, category: cat });
        }}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-charcoal-muted">
        <span>Found <strong className="text-charcoal dark:text-white">{articles.length}</strong> matching stories</span>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSearchParams({ category });
            }}
            className="text-blue-600 hover:underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-xl bg-stone-200 dark:bg-stone-800" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-8">
          <BookOpen className="w-10 h-10 text-charcoal-muted mx-auto" />
          <h3 className="font-serif font-bold text-lg text-charcoal dark:text-white">No stories match your criteria</h3>
          <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
            Try adjusting your search terms or picking another category.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      )}
    </div>
  );
};
