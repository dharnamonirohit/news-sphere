export interface Article {
  id: string | number;
  provider?: string;
  external_id?: string;
  canonical_url: string;
  title: string;
  description: string;
  content_excerpt?: string;
  image_url?: string;
  source_name: string;
  author?: string | null;
  published_at: string;
  category: string;
  language?: string;
  country?: string;
  is_demo?: boolean;
}

export interface RecommendationScores {
  category_score: number;
  behavioral_score: number;
  content_similarity_score: number;
  recency_score: number;
  combined_score: number;
}

export interface ScoredArticle {
  article: Article;
  score: number;
  scores: RecommendationScores;
  reason: string;
  is_diversity_boosted?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role?: string;
  isOnboarded?: boolean;
}

export interface UserInterest {
  category: string;
  initialPreference: number;
  learnedScore: number;
}

export type InteractionType = 'impression' | 'open' | 'like' | 'unlike' | 'bookmark' | 'read' | 'skip';

export interface UserInteraction {
  id?: string;
  articleId: string | number;
  type: InteractionType;
  readingDuration?: number;
  createdAt?: string;
}

export interface BookmarkItem {
  id: string;
  userId: string;
  articleId: string | number;
  createdAt: string;
  article: Article;
}

export interface ReadingHistoryItem {
  id: string;
  userId: string;
  articleId: string | number;
  firstViewedAt: string;
  lastViewedAt: string;
  viewCount: number;
  article: Article;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  personalizationEnabled: boolean;
  diversityLevel: number; // 0.0 to 1.0
  recommendationMode?: string;
}

export interface AnalyticsData {
  totalArticlesOpened: number;
  totalArticlesBookmarked: number;
  mostReadCategories: { category: string; count: number; percentage: number }[];
  readingActivityByDay: { date: string; reads: number; bookmarks: number }[];
  interestStrengths: { category: string; explicit: number; learned: number; total: number }[];
  diversityIndex: number; // 0 - 100%
  recentInteractions: {
    title: string;
    category: string;
    action: string;
    timestamp: string;
  }[];
}

export interface ArticleSummary {
  summary: string;
  source_type: string;
  sentence_count: number;
  is_truncated: boolean;
  label: string;
}

export interface SimilarArticleResult {
  article: Article;
  similarity_score: number;
}
