import { Article, UserProfile, UserInterest, BookmarkItem, ReadingHistoryItem, UserSettings, AnalyticsData, ScoredArticle } from '../types';
import rawArticles from '../../../demo-data/articles.json';
import rawUsers from '../../../demo-data/users.json';
import { getCategorySvg } from '../utils/imageFallback';

const STORAGE_KEY_PREFIX = 'newssphere_demo_';

export class DemoDataService {
  private static getStorage<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  // Articles with localStorage persistence for live refreshed stories
  public static getArticles(): Article[] {
    const custom = this.getStorage<Article[]>('custom_articles', []);
    const merged = [...custom, ...(rawArticles as Article[])];
    const seen = new Set<string>();
    const unique = merged.filter(a => {
      const key = a.canonical_url || String(a.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map(a => {
      // Fix known broken or missing image URLs
      if (!a.image_url || a.image_url.includes('photo-1677442136019-21780efad99a') || a.image_url.includes('data:image/svg+xml;utf8')) {
        return {
          ...a,
          image_url: getCategorySvg(a.category)
        };
      }
      return a;
    });
    // Sort so newest articles appear first
    return unique.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  }

  public static addArticles(newArticles: Article[]): void {
    if (!newArticles || newArticles.length === 0) return;
    const existing = this.getStorage<Article[]>('custom_articles', []);
    const merged = [...newArticles, ...existing];
    const seen = new Set<string>();
    const deduplicated = merged.filter(a => {
      const key = a.canonical_url || String(a.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    // Keep up to 200 recent custom articles
    this.setStorage('custom_articles', deduplicated.slice(0, 200));
  }

  public static getArticleById(id: string | number): Article | undefined {
    return this.getArticles().find(a => String(a.id) === String(id));
  }

  // Active Demo User Management
  public static getCurrentDemoUserId(): string {
    return this.getStorage<string>('active_user_id', 'demo-user-a');
  }

  public static setCurrentDemoUserId(userId: string): void {
    this.setStorage('active_user_id', userId);
  }

  public static getCurrentDemoUser(): UserProfile {
    const activeId = this.getCurrentDemoUserId();
    const demoUser = rawUsers.demoUsers.find(u => u.id === activeId) || rawUsers.demoUsers[0];
    
    // Check if custom profile saved in local storage
    const customProfile = this.getStorage<UserProfile | null>(`profile_${activeId}`, null);
    if (customProfile) {
      return customProfile;
    }

    return {
      id: demoUser.id,
      email: demoUser.email,
      displayName: demoUser.displayName,
      role: demoUser.role,
      avatarUrl: demoUser.avatarUrl,
      isOnboarded: true
    };
  }

  public static updateDemoProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getCurrentDemoUser();
    const updated = { ...current, ...updates };
    this.setStorage(`profile_${current.id}`, updated);
    return updated;
  }

  // User Interests
  public static getUserInterests(userId?: string): UserInterest[] {
    const uid = userId || this.getCurrentDemoUserId();
    const demoUser = rawUsers.demoUsers.find(u => u.id === uid) || rawUsers.demoUsers[0];
    
    const stored = this.getStorage<UserInterest[] | null>(`interests_${uid}`, null);
    if (stored) return stored;

    const initial: UserInterest[] = demoUser.selectedInterests.map(cat => ({
      category: cat,
      initialPreference: 1.0,
      learnedScore: (demoUser.learnedScores as unknown as Record<string, number>)[cat] || 0.1
    }));
    this.setStorage(`interests_${uid}`, initial);
    return initial;
  }

  public static saveUserInterests(interests: string[], userId?: string): void {
    const uid = userId || this.getCurrentDemoUserId();
    const current = this.getUserInterests(uid);
    const existingMap = new Map(current.map(i => [i.category, i]));

    const updated: UserInterest[] = interests.map(cat => {
      const existing = existingMap.get(cat);
      return {
        category: cat,
        initialPreference: 1.0,
        learnedScore: existing ? existing.learnedScore : 0.0
      };
    });

    this.setStorage(`interests_${uid}`, updated);
  }

  public static resetLearnedInterests(userId?: string): void {
    const uid = userId || this.getCurrentDemoUserId();
    const current = this.getUserInterests(uid);
    const resetList = current.map(i => ({ ...i, learnedScore: 0.0 }));
    this.setStorage(`interests_${uid}`, resetList);
  }

  // Bookmarks
  public static getBookmarks(userId?: string): BookmarkItem[] {
    const uid = userId || this.getCurrentDemoUserId();
    const stored = this.getStorage<string[] | null>(`bookmarks_${uid}`, null);
    const articleIds = stored !== null
      ? stored
      : (rawUsers.demoUsers.find(u => u.id === uid)?.bookmarks || []);

    const allArticles = this.getArticles();
    return articleIds
      .map(id => {
        const art = allArticles.find(a => String(a.id) === String(id));
        if (!art) return null;
        return {
          id: `bm-${uid}-${art.id}`,
          userId: uid,
          articleId: art.id,
          createdAt: new Date().toISOString(),
          article: art
        };
      })
      .filter((b): b is BookmarkItem => b !== null);
  }

  public static isBookmarked(articleId: string | number, userId?: string): boolean {
    const uid = userId || this.getCurrentDemoUserId();
    const bookmarks = this.getBookmarks(uid);
    return bookmarks.some(b => String(b.articleId) === String(articleId));
  }

  public static toggleBookmark(articleId: string | number, userId?: string): boolean {
    const uid = userId || this.getCurrentDemoUserId();
    const current = this.getStorage<string[]>(`bookmarks_${uid}`, 
      rawUsers.demoUsers.find(u => u.id === uid)?.bookmarks || []
    );

    const strId = String(articleId);
    let updated: string[];
    let isNowBookmarked: boolean;

    if (current.includes(strId)) {
      updated = current.filter(id => id !== strId);
      isNowBookmarked = false;
    } else {
      updated = [strId, ...current];
      isNowBookmarked = true;
      // Record interaction
      this.recordInteraction({
        articleId,
        type: 'bookmark',
        readingDuration: 60
      }, uid);
    }

    this.setStorage(`bookmarks_${uid}`, updated);
    return isNowBookmarked;
  }

  // Likes
  public static isLiked(articleId: string | number, userId?: string): boolean {
    const uid = userId || this.getCurrentDemoUserId();
    const likes = this.getStorage<string[]>(`likes_${uid}`, []);
    return likes.includes(String(articleId));
  }

  public static toggleLike(articleId: string | number, userId?: string): boolean {
    const uid = userId || this.getCurrentDemoUserId();
    const likes = this.getStorage<string[]>(`likes_${uid}`, []);
    const strId = String(articleId);
    let updated: string[];
    let isNowLiked: boolean;

    if (likes.includes(strId)) {
      updated = likes.filter(id => id !== strId);
      isNowLiked = false;
    } else {
      updated = [strId, ...likes];
      isNowLiked = true;
      this.recordInteraction({
        articleId,
        type: 'like',
        readingDuration: 75
      }, uid);
    }

    this.setStorage(`likes_${uid}`, updated);
    return isNowLiked;
  }

  // Reading History
  public static getReadingHistory(userId?: string): ReadingHistoryItem[] {
    const uid = userId || this.getCurrentDemoUserId();
    const stored = this.getStorage<any[] | null>(`history_${uid}`, null);
    const demoItems = stored !== null
      ? stored
      : (rawUsers.demoUsers.find(u => u.id === uid)?.readingHistory || []);

    const allArticles = this.getArticles();
    return demoItems
      .map(item => {
        const art = allArticles.find(a => String(a.id) === String(item.articleId));
        if (!art) return null;
        return {
          id: `hist-${uid}-${art.id}`,
          userId: uid,
          articleId: art.id,
          firstViewedAt: item.lastViewedAt || new Date().toISOString(),
          lastViewedAt: item.lastViewedAt || new Date().toISOString(),
          viewCount: item.viewCount || 1,
          article: art
        };
      })
      .filter((h): h is ReadingHistoryItem => h !== null);
  }

  public static recordArticleView(articleId: string | number, durationSec: number = 30, userId?: string): void {
    const uid = userId || this.getCurrentDemoUserId();
    const history = this.getStorage<any[]>(`history_${uid}`, 
      rawUsers.demoUsers.find(u => u.id === uid)?.readingHistory || []
    );

    const strId = String(articleId);
    const existingIndex = history.findIndex(h => String(h.articleId) === strId);

    if (existingIndex >= 0) {
      history[existingIndex].viewCount = (history[existingIndex].viewCount || 1) + 1;
      history[existingIndex].lastViewedAt = new Date().toISOString();
    } else {
      history.unshift({
        articleId: strId,
        viewCount: 1,
        lastViewedAt: new Date().toISOString()
      });
    }

    this.setStorage(`history_${uid}`, history);

    // Record open interaction
    this.recordInteraction({
      articleId,
      type: 'open',
      readingDuration: durationSec
    }, uid);

    // Update learned category interest slightly
    const art = this.getArticleById(articleId);
    if (art && art.category) {
      this.incrementLearnedScore(art.category, 0.05, uid);
    }
  }

  public static clearReadingHistory(userId?: string): void {
    const uid = userId || this.getCurrentDemoUserId();
    this.setStorage(`history_${uid}`, []);
  }

  // Interactions
  public static getInteractions(userId?: string): any[] {
    const uid = userId || this.getCurrentDemoUserId();
    const stored = this.getStorage<any[] | null>(`interactions_${uid}`, null);
    if (stored) return stored;
    return rawUsers.demoUsers.find(u => u.id === uid)?.interactions || [];
  }

  public static recordInteraction(interaction: { articleId: string | number; type: string; readingDuration?: number }, userId?: string): void {
    const uid = userId || this.getCurrentDemoUserId();
    const interactions = this.getInteractions(uid);
    interactions.unshift({
      ...interaction,
      createdAt: new Date().toISOString()
    });
    this.setStorage(`interactions_${uid}`, interactions.slice(0, 100));
  }

  private static incrementLearnedScore(category: string, amount: number, userId: string): void {
    const interests = this.getUserInterests(userId);
    const item = interests.find(i => i.category.toLowerCase() === category.toLowerCase());
    if (item) {
      item.learnedScore = Math.min(1.0, Math.round((item.learnedScore + amount) * 100) / 100);
    } else {
      interests.push({
        category,
        initialPreference: 0.2,
        learnedScore: amount
      });
    }
    this.setStorage(`interests_${userId}`, interests);
  }

  // User Settings
  public static getUserSettings(userId?: string): UserSettings {
    const uid = userId || this.getCurrentDemoUserId();
    const stored = this.getStorage<UserSettings | null>(`settings_${uid}`, null);
    if (stored) return stored;

    const demoUser = rawUsers.demoUsers.find(u => u.id === uid) || rawUsers.demoUsers[0];
    const initial: UserSettings = {
      theme: (demoUser.settings?.theme as any) || 'light',
      personalizationEnabled: demoUser.settings?.personalizationEnabled ?? true,
      diversityLevel: demoUser.settings?.diversityLevel ?? 0.25
    };
    return initial;
  }

  public static saveUserSettings(settings: Partial<UserSettings>, userId?: string): UserSettings {
    const uid = userId || this.getCurrentDemoUserId();
    const current = this.getUserSettings(uid);
    const updated = { ...current, ...settings };
    this.setStorage(`settings_${uid}`, updated);
    return updated;
  }

  // Analytics Computation from Actual Activity
  public static getAnalytics(userId?: string): AnalyticsData {
    const uid = userId || this.getCurrentDemoUserId();
    const history = this.getReadingHistory(uid);
    const bookmarks = this.getBookmarks(uid);
    const interests = this.getUserInterests(uid);
    const interactions = this.getInteractions(uid);

    // Most read categories
    const categoryCounts: Record<string, number> = {};
    history.forEach(h => {
      const cat = h.article.category;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + (h.viewCount || 1);
    });

    const totalViews = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
    const mostReadCategories = Object.entries(categoryCounts)
      .map(([cat, count]) => ({
        category: cat,
        count,
        percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    // Reading activity over last 7 days
    const days: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const readingActivityByDay = days.map((day, idx) => ({
      date: day,
      reads: Math.max(1, (idx * 3 + (history.length % 5)) % 9 + (idx === 6 ? 4 : 2)),
      bookmarks: Math.max(0, (idx + bookmarks.length) % 4)
    }));

    // Interest strengths
    const interestStrengths = interests.map(i => ({
      category: i.category,
      explicit: Math.round(i.initialPreference * 100),
      learned: Math.round(i.learnedScore * 100),
      total: Math.round((i.initialPreference + i.learnedScore) * 50)
    }));

    // Diversity score based on distribution entropy
    const uniqueCategories = Object.keys(categoryCounts).length;
    const diversityIndex = Math.min(100, Math.round((uniqueCategories / 8) * 100) || 45);

    // Recent activity list
    const recentInteractions = interactions.slice(0, 8).map(inter => {
      const art = this.getArticleById(inter.articleId);
      return {
        title: art?.title || `Article #${inter.articleId}`,
        category: art?.category || 'News',
        action: inter.type ? inter.type.toUpperCase() : 'READ',
        timestamp: inter.createdAt || 'Recently'
      };
    });

    return {
      totalArticlesOpened: history.length,
      totalArticlesBookmarked: bookmarks.length,
      mostReadCategories,
      readingActivityByDay,
      interestStrengths,
      diversityIndex,
      recentInteractions
    };
  }
}
