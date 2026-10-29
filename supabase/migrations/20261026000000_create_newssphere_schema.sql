-- ==============================================================================
-- NewsSphere Database Schema (PostgreSQL for Supabase)
-- AI-Powered Personalized and Explainable News Recommendation System
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Profiles Table (extends auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 2. Categories Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed predefined categories
INSERT INTO public.categories (name, slug, description) VALUES
    ('Technology', 'technology', 'Computing, hardware, software, semiconductors, and consumer tech'),
    ('Artificial Intelligence', 'artificial-intelligence', 'Machine learning, deep learning, LLMs, neural networks, and AI ethics'),
    ('Science', 'science', 'Physics, biotechnology, genetics, astronomy, and academic research'),
    ('Business', 'business', 'Macroeconomics, markets, enterprise, financial policy, and corporate strategy'),
    ('World News', 'world-news', 'Geopolitics, global diplomacy, multilateral treaties, and international events'),
    ('India News', 'india-news', 'National developments, state initiatives, infrastructure, and public policy'),
    ('Politics', 'politics', 'Governance, legislative affairs, elections, and civic institutions'),
    ('Sports', 'sports', 'Football, athletics, tennis, racing, and international championships'),
    ('Cricket', 'cricket', 'IPL, Test cricket, ICC tournaments, domestic leagues, and player analysis'),
    ('Entertainment', 'entertainment', 'Cinema, streaming, cultural arts, music, and creative media'),
    ('Health', 'health', 'Medicine, immunology, oncology, mental health, and public wellness'),
    ('Education', 'education', 'Higher education, research grants, skill development, and pedagogy'),
    ('Environment', 'environment', 'Climate policy, renewable energy, ocean conservation, and biodiversity'),
    ('Space', 'space', 'Spaceflight missions, ISRO, NASA, cosmology, and planetary science'),
    ('Startups', 'startups', 'Venture capital, early-stage founders, tech disruption, and product launches'),
    ('Cybersecurity', 'cybersecurity', 'Vulnerability disclosures, threat telemetry, zero-days, and cryptosystems')
ON CONFLICT (name) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 3. Articles Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL DEFAULT 'gnews',
    external_id TEXT,
    canonical_url TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    content_excerpt TEXT,
    image_url TEXT,
    source_name TEXT,
    author TEXT,
    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    category TEXT NOT NULL DEFAULT 'World News',
    language TEXT DEFAULT 'en',
    country TEXT DEFAULT 'in',
    is_demo BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_is_demo ON public.articles(is_demo);
CREATE INDEX IF NOT EXISTS idx_articles_provider ON public.articles(provider);

-- ------------------------------------------------------------------------------
-- 4. User Interests Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    initial_preference_score DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    learned_interest_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_user_category UNIQUE (user_id, category)
);

CREATE INDEX IF NOT EXISTS idx_user_interests_user_id ON public.user_interests(user_id);

-- ------------------------------------------------------------------------------
-- 5. User Interactions Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('impression', 'open', 'like', 'unlike', 'bookmark', 'read', 'skip')),
    reading_duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_interactions_user_art ON public.user_interactions(user_id, article_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_type ON public.user_interactions(user_id, interaction_type);
CREATE INDEX IF NOT EXISTS idx_user_interactions_created_at ON public.user_interactions(created_at DESC);

-- ------------------------------------------------------------------------------
-- 6. Bookmarks Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_user_article_bookmark UNIQUE (user_id, article_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);

-- ------------------------------------------------------------------------------
-- 7. Reading History Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reading_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    first_viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    view_count INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT uq_user_article_history UNIQUE (user_id, article_id)
);

CREATE INDEX IF NOT EXISTS idx_reading_history_user_id ON public.reading_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_history_last_viewed ON public.reading_history(last_viewed_at DESC);

-- ------------------------------------------------------------------------------
-- 8. User Settings Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme TEXT NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    personalization_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    diversity_level DOUBLE PRECISION NOT NULL DEFAULT 0.25 CHECK (diversity_level >= 0.0 AND diversity_level <= 1.0),
    recommendation_mode TEXT NOT NULL DEFAULT 'HYBRID',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- Row Level Security (RLS) Configuration
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- 1. Categories: Readable by everyone (authenticated and anonymous)
DROP POLICY IF EXISTS "Categories are readable by everyone" ON public.categories;
CREATE POLICY "Categories are readable by everyone"
    ON public.categories FOR SELECT
    USING (true);

-- 2. Articles: Readable by everyone, insertable/updatable for news ingestion
DROP POLICY IF EXISTS "Articles are readable by everyone" ON public.articles;
CREATE POLICY "Articles are readable by everyone"
    ON public.articles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Articles can be inserted by everyone" ON public.articles;
CREATE POLICY "Articles can be inserted by everyone"
    ON public.articles FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Articles can be updated by everyone" ON public.articles;
CREATE POLICY "Articles can be updated by everyone"
    ON public.articles FOR UPDATE
    USING (true);

-- 3. Profiles: Read own or public profile; Update only own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 4. User Interests: Full CRUD for own records
DROP POLICY IF EXISTS "Users can view own interests" ON public.user_interests;
CREATE POLICY "Users can view own interests"
    ON public.user_interests FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own interests" ON public.user_interests;
CREATE POLICY "Users can insert own interests"
    ON public.user_interests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own interests" ON public.user_interests;
CREATE POLICY "Users can update own interests"
    ON public.user_interests FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own interests" ON public.user_interests;
CREATE POLICY "Users can delete own interests"
    ON public.user_interests FOR DELETE
    USING (auth.uid() = user_id);

-- 5. User Interactions: Read and Insert own interactions
DROP POLICY IF EXISTS "Users can view own interactions" ON public.user_interactions;
CREATE POLICY "Users can view own interactions"
    ON public.user_interactions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can record own interactions" ON public.user_interactions;
CREATE POLICY "Users can record own interactions"
    ON public.user_interactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 6. Bookmarks: Full CRUD for own bookmarks
DROP POLICY IF EXISTS "Users can view own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view own bookmarks"
    ON public.bookmarks FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can insert own bookmarks"
    ON public.bookmarks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can delete own bookmarks"
    ON public.bookmarks FOR DELETE
    USING (auth.uid() = user_id);

-- 7. Reading History: Full CRUD for own history
DROP POLICY IF EXISTS "Users can view own reading history" ON public.reading_history;
CREATE POLICY "Users can view own reading history"
    ON public.reading_history FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own reading history" ON public.reading_history;
CREATE POLICY "Users can insert own reading history"
    ON public.reading_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reading history" ON public.reading_history;
CREATE POLICY "Users can update own reading history"
    ON public.reading_history FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own reading history" ON public.reading_history;
CREATE POLICY "Users can delete own reading history"
    ON public.reading_history FOR DELETE
    USING (auth.uid() = user_id);

-- 8. User Settings: Read and Update own settings
DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
CREATE POLICY "Users can view own settings"
    ON public.user_settings FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
CREATE POLICY "Users can insert own settings"
    ON public.user_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
CREATE POLICY "Users can update own settings"
    ON public.user_settings FOR UPDATE
    USING (auth.uid() = user_id);

-- ==============================================================================
-- Auth Trigger: Automatically create profile and settings on new user signup
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_settings (user_id, theme, personalization_enabled, diversity_level)
    VALUES (NEW.id, 'light', TRUE, 0.25)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
