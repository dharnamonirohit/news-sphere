# NewsSphere College Project Viva & Demonstration Guide

## 1. Project Title & elevator Pitch

**Full Title**: NewsSphere — AI-Powered Personalized and Explainable News Recommendation System  
**Short Summary**: A full-stack editorial web publication that ingests external news feeds and utilizes TF-IDF vectorization, cosine similarity, behavioral signal weighting, and Explainable AI (XAI) to present a uniquely ranked news feed for each reader while solving the filter bubble problem with diversity re-ranking.

---

## 2. Live Viva Demonstration Script (Step-by-Step)

When demonstrating NewsSphere to internal/external examiners, execute the following script:

### Step 1: Landing Page & Public Feed
- Open `http://localhost:5173/`.
- Show the editorial aesthetic: warm off-white background (`#FBFBFA`), serif typography, clean card layout, absence of neon clutter.
- Point out the core value proposition: "News that matters to you. Explained with clarity."

### Step 2: Instant Feed Divergence Demonstration (User A vs User B)
- Click **Explore Demo Feed** or sign in.
- In the top banner, demonstrate **Demo User A (Aarav Sharma)**:
  - Selected interests: *Artificial Intelligence*, *Technology*, *Science*.
  - Notice the feed: The top stories are DeepMind Gemini reasoning architecture, fault-tolerant quantum silicon, and CRISPR epigenetic therapy.
  - Click **Why this?** on the Gemini article:
    - Point to the modal: Show the dominant signal (*Matches your selected interest in Artificial Intelligence*).
    - Show the multi-signal mathematical breakdown: Category Match (100%), Behavioral Engagement, TF-IDF content similarity, and Recency score.
- In the top banner, click **User B (Sports & Biz)** (Priya Patel):
  - Notice how the feed immediately alters: The top stories are India's Champions Trophy final over Australia, IPL mega auction valuations, and RBI repo rate macroeconomic guidance.
  - Click **Why this?** on the Cricket story: It explains that the recommendation matches Priya's distinct reading profile.
- **Viva Key Point**: Emphasize to faculty that *both users query the exact same article repository*, but the recommendation engine ranks articles uniquely for each user.

### Step 3: AI Extractive Summarization & Source Attribution
- Open any article card and click **Summary** or open the article detail preview page.
- Explain: External news APIs (like GNews) license only excerpts and descriptions on free tiers. Rather than hallucinating or scraping behind paywalls, NewsSphere runs extractive NLP salience scoring on available text and labels it: `"Summary of available excerpt (Extractive NLP)"`.
- Click **Read Full Article at Source**: Shows that it directs readers to the original reporting publisher.

### Step 4: Diversity & Filter Bubble Mitigation
- Go to **Settings** (`/settings`).
- Show the **Diversity Explorer Slider** (0% to 100%).
- Explain that pure content filtering locks readers into echo chambers (the filter bubble problem). NewsSphere incorporates dynamic Maximal Marginal Relevance (MMR) that penalizes repetitive adjacent categories and injects ~10% exploratory topics tagged with an "Explore" badge.

### Step 5: Behavioral Learning & Analytics
- Like or bookmark an article in a new category (e.g. Space or Cybersecurity).
- Navigate to **My Interests** (`/interests`): Show that the explicit initial preference remains constant while the learned score increments based on user interaction duration and bookmark signals.
- Navigate to **Analytics** (`/analytics`): Show the real-time Recharts visual graph showing daily reading volume, category distribution donut, and the chronological signal audit log.

---

## 3. Frequently Asked Questions (Viva Q&A)

### Q1: Why did you choose Content-Based Filtering instead of Collaborative Filtering?
> **Answer**: Collaborative filtering relies on a massive matrix of existing user ratings and suffers from the severe "Cold Start Problem" for new articles and new users. Because news is time-sensitive with hundreds of breaking stories published daily, articles have no initial ratings. Content-Based filtering using TF-IDF and metadata allows immediate, accurate personalization the moment an article is published.

### Q2: How does the system compute TF-IDF and Cosine Similarity?
> **Answer**: TF-IDF (Term Frequency - Inverse Document Frequency) measures how central a specific word is to an article relative to the overall corpus. The cosine similarity computes the normalized dot product between the user's positive reading history vector and candidate article vectors, returning a value between 0 and 1 indicating semantic overlap.

### Q3: What is Explainable AI (XAI) and why is it needed in news?
> **Answer**: Most modern recommendation algorithms act as black boxes, prioritizing engagement through rage-bait or clickbait without user comprehension. NewsSphere implements model transparency: each recommendation explicitly lists the dominating signals (selected category match, behavioral reading affinity, text similarity, or recency) and presents the exact component weights.

### Q4: How is security handled?
> **Answer**: Authentication is managed securely via Supabase Auth with bcrypt hashing and JWT sessions. All user interaction logs, bookmarks, and private settings are governed by PostgreSQL Row Level Security (RLS) policies (`auth.uid() = user_id`), ensuring no client can access or manipulate another reader's data. Sensitive keys such as `GNEWS_API_KEY` are stored strictly server-side.
