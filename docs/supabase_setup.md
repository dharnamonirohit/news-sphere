# Supabase Backend Configuration & Live Setup Guide

NewsSphere is engineered to work out of the box in **Demo Mode** with bundled curated records, and can seamlessly connect to a **Live Supabase PostgreSQL project** with a single environment change.

---

## 1. Option A: Using Hosted Supabase (Recommended for Production)

### Step 1: Create a Free Supabase Project
1. Visit [supabase.com](https://supabase.com) and create an account.
2. Click **New Project** and choose a project name (e.g., `newssphere`).
3. Set your database password and choose your nearest region.

### Step 2: Apply Database Schema & Migrations
1. In the Supabase Dashboard, open the **SQL Editor** in the left sidebar.
2. Open the file `supabase/migrations/20261026000000_create_newssphere_schema.sql` from your project.
3. Paste the contents into the SQL Editor and click **Run**.
   - This creates tables: `profiles`, `categories`, `articles`, `user_interests`, `user_interactions`, `bookmarks`, `reading_history`, `user_settings`.
   - Enables Row Level Security (RLS) on all tables.
   - Sets up the `on_auth_user_created` trigger for automated profile generation.
4. Open the second migration file: `supabase/migrations/20261026000001_seed_newssphere_demo.sql`.
5. Paste and click **Run** to seed initial articles and category data.

### Step 3: Connect the React Frontend
1. In the Supabase Dashboard, go to **Project Settings** > **API**.
2. Copy your:
   - **Project URL** (`https://<project-ref>.supabase.co`)
   - **anon / public key**
3. Open `frontend/.env` and update the values:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
   VITE_APP_MODE=live
   VITE_RECOMMENDATION_SERVICE_URL=http://127.0.0.1:8000
   ```
4. Restart your frontend dev server. The app is now connected to live Supabase Auth and PostgreSQL!

---

## 2. Option B: Local Supabase CLI Setup (Docker)

If you have Docker Desktop installed on Windows:

```powershell
# 1. Install Supabase CLI
npm install -g supabase

# 2. Start local Supabase containers
cd C:\Users\vanga\.gemini\antigravity\scratch\news-sphere
supabase start

# 3. Apply migrations
supabase db reset

# 4. Serve Edge Functions
supabase functions serve --env-file .env.example
```

---

## 3. Configuring GNews API for Live Ingestion

1. Get a free API key at [https://gnews.io/](https://gnews.io/).
2. In Supabase Dashboard, navigate to **Project Settings** > **Edge Functions** > **Secrets**.
3. Add secret:
   ```
   GNEWS_API_KEY=your_actual_gnews_key
   ```
4. Deploy the Edge Functions:
   ```powershell
   supabase functions deploy fetch-news
   supabase functions deploy refresh-news
   supabase functions deploy summarize-article
   supabase functions deploy personalized-feed
   ```
