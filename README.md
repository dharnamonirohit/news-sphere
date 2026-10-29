# NewsSphere — AI-Powered Personalized and Explainable News Recommendation System

NewsSphere is a digital news publication platform engineered to eliminate information overload through multi-signal content-based personalization, TF-IDF cosine similarity, Explainable AI (XAI) transparency, and diversity re-ranking.

---

## 1. Key Capabilities

- **Divergent Personalized Feeds**: Every reader receives a uniquely ranked feed based on their chosen topics and interaction history from a shared pool of articles.
- **Explainable AI ("Why am I seeing this?")**: Detailed popover breaking down the mathematical signals behind every recommendation (Category Match 35%, Behavioral Engagement 30%, TF-IDF Content Similarity 20%, Recency Decay 15%).
- **Diversity-Aware Re-ranking (MMR)**: Prevents filter bubbles by penalizing consecutive duplicate categories and exploring fresh topics (~10% serendipity).
- **Extractive AI Summarization**: Salience-based sentence extraction citing the original reporting source without hallucinated facts.
- **User-Controlled Preferences**: Add or remove topics, view explicit vs. learned scores, and reset behavioral weights at any time.
- **Reading Analytics**: Real-time charts showing daily reads, bookmarks, category distribution, and diversity entropy.
- **Dual Operating Modes**:
  - **Demo Mode**: Instant zero-configuration local execution with 37+ realistic articles across 16 categories, pre-seeded with Demo User A (AI/Tech) and Demo User B (Cricket/Business).
  - **Live Mode**: Connected to Supabase PostgreSQL, Auth, Row Level Security (RLS), and GNews API integration via Edge Functions.

---

## 2. Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router, Lucide React, Recharts.
- **Main Backend**: Supabase (PostgreSQL 15, Supabase Auth, Row Level Security, Edge Functions).
- **AI/ML Recommendation Service**: Python 3.12, FastAPI, scikit-learn, NumPy, Pydantic, Uvicorn.
- **News Provider**: GNews API v4 (aggregated through server-side Supabase Edge Functions).

---

## 3. Project Directory Structure

```
news-sphere/
├── frontend/                     # React + Vite + TypeScript application
│   ├── src/
│   │   ├── components/           # ArticleCard, WhyThisModal, SummaryModal, Navbar, Sidebars...
│   │   ├── layouts/              # MainLayout (3-column responsive layout)
│   │   ├── pages/                # Landing, Feed, Details, Explore, Bookmarks, History, Analytics, Settings...
│   │   ├── hooks/                # useAuth, useTheme
│   │   ├── services/             # newsService, recommendationService, demoDataService, supabaseClient
│   │   └── types/                # TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
├── supabase/                     # Supabase database & serverless backend
│   ├── config.toml               # Supabase configuration
│   ├── migrations/               # PostgreSQL schema & RLS migrations
│   │   ├── 20261026000000_create_newssphere_schema.sql
│   │   └── 20261026000001_seed_newssphere_demo.sql
│   └── functions/                # Deno Edge Functions
│       ├── fetch-news/           # GNews API integration
│       ├── refresh-news/         # Database sync and deduplication
│       ├── summarize-article/    # AI extractive summarizer
│       └── personalized-feed/    # Secure ranking gateway
├── recommendation-service/       # Python FastAPI Microservice
│   ├── main.py                   # FastAPI application & endpoints (/recommend, /similar, /summarize)
│   ├── recommender.py            # TF-IDF, Cosine Similarity, Multi-signal ranking & MMR
│   ├── summarizer.py             # Extractive NLP sentence salience engine
│   ├── category_classifier.py    # Zero-shot keyword/TF-IDF category classifier
│   ├── config.py                 # Configurable recommendation weights
│   ├── evaluate.py               # Offline benchmark (Precision@K & Diversity Entropy)
│   ├── test_recommender.py       # Unit tests
│   └── requirements.txt
├── demo-data/                    # Bundled realistic news dataset
│   ├── articles.json             # 37 curated multi-category sample articles
│   └── users.json                # Demo User A and Demo User B profiles
├── docs/                         # Documentation for college viva
│   ├── architecture.md           # Mathematical formula and architectural diagrams
│   ├── viva_guide.md             # Viva Q&A and demonstration script
│   └── supabase_setup.md         # Guide to configure live Supabase and GNews
├── run_frontend.bat              # One-click Windows frontend launcher
├── run_recommendation_service.bat# One-click Windows Python service launcher
├── run_all.bat                   # Concurrent launcher for all services
└── README.md
```

---

## 4. Quickstart Guide (Local Windows Execution)

### Option 1: One-Click Launch (Recommended)
Double-click `run_all.bat` or run:
```powershell
.\run_all.bat
```
This opens two windows:
1. **Frontend**: [http://localhost:5173](http://localhost:5173)
2. **Python Recommendation Service**: [http://localhost:8000](http://localhost:8000) (Swagger docs at [http://localhost:8000/docs](http://localhost:8000/docs))

---

### Option 2: Manual Terminal Startup

#### 1. Start the Python Recommendation Service
```powershell
cd C:\Users\vanga\.gemini\antigravity\scratch\news-sphere\recommendation-service
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Verify health: [http://localhost:8000/health](http://localhost:8000/health)

#### 2. Start the React Frontend
```powershell
cd C:\Users\vanga\.gemini\antigravity\scratch\news-sphere\frontend
npm run dev
```
Open browser at: [http://localhost:5173](http://localhost:5173)

---

## 5. College Viva Demonstration Walkthrough

1. Open [http://localhost:5173/](http://localhost:5173/) to show the Landing Page.
2. Click **Explore Demo Feed** or **Sign In**.
3. In the top amber banner, click **User A (AI & Tech)**:
   - Notice the top headlines: Google DeepMind Gemini reasoning architecture, commercial silicon quantum chips, CRISPR epigenetic therapy.
   - Click **Why this?** to inspect the Explainable AI popover showing authentic weights.
4. In the top banner, click **User B (Sports & Biz)**:
   - Observe the immediate feed divergence: The top headlines instantly switch to India's Champions Trophy win, IPL auction records, and RBI repo rate guidance.
5. Click **AI Summary** on any card to view the extractive sentence summary.
6. Open an article preview and click **Read Full Article at Source** to demonstrate publisher attribution.
7. Open **Analytics** (`/analytics`) to inspect real-time Recharts visualizations showing reading habits, category distribution, and diversity score.

---

## 6. Verification and Test Results

All automated checks and test suites have been executed and verified:

1. **Python Recommendation Engine Tests**:
   - Command: `python -m unittest discover -s recommendation-service -p "test_*.py"`
   - Result: `Ran 7 tests in 0.058s. OK.` (TF-IDF vectorizer, similarity ranking, diversity re-ranking, and explainability signals).
2. **Offline Recommendation Evaluation Benchmark**:
   - Command: `python recommendation-service/evaluate.py`
   - Result:
     - User 1 Precision@5: **100%** (Top categories: Artificial Intelligence & Cybersecurity)
     - User 2 Precision@5: **100%** (Top categories: Cricket & Business)
     - Overlap between User 1 & User 2 top-5 picks: **0 items** (demonstrating genuine feed divergence).
3. **Frontend Production Build**:
   - Command: `npm run build`
   - Result: `✓ built in 18.17s` with zero TypeScript or bundling errors. Output: `dist/index.html`, `dist/assets/index.css`, `dist/assets/index.js`.
4. **FastAPI Health Endpoint**:
   - Endpoint: `GET /health` returns `status: UP`, version `1.0.0`, with model details.
