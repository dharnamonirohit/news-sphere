import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Set MPLCONFIGDIR to avoid permission warnings
os.environ['MPLCONFIGDIR'] = os.path.join(os.environ.get('TEMP', '.'), 'matplotlib_newssphere')

def generate_block_diagram():
    # Canvas setup (Wide 16:9 ratio, ultra high resolution)
    fig, ax = plt.subplots(figsize=(19, 11), dpi=300)
    fig.patch.set_facecolor('#F8F9FA')
    ax.set_facecolor('#F8F9FA')

    # Title & Subtitle Banner
    fig.text(0.5, 0.95, "NewsSphere — System Architecture & Block Diagram", 
             ha='center', va='center', fontsize=22, fontweight='bold', color='#1A1F2C', fontfamily='sans-serif')
    fig.text(0.5, 0.92, "AI-Powered Personalized and Explainable News Recommendation System | End-to-End Architectural Pipeline", 
             ha='center', va='center', fontsize=11, color='#5A6275', fontfamily='sans-serif')

    # Color Palette
    TIER_COLORS = {
        'frontend': {'bg': '#EEF2FF', 'border': '#4F46E5', 'header': '#3730A3', 'box': '#FFFFFF', 'box_b': '#C7D2FE'},
        'gnews':    {'bg': '#FEF3C7', 'border': '#D97706', 'header': '#92400E', 'box': '#FFFFFF', 'box_b': '#FDE68A'},
        'supabase': {'bg': '#ECFDF5', 'border': '#059669', 'header': '#065F46', 'box': '#FFFFFF', 'box_b': '#A7F3D0'},
        'aiml':     {'bg': '#FDF2F8', 'border': '#DB2777', 'header': '#9D174D', 'box': '#FFFFFF', 'box_b': '#FBCFE8'},
    }

    # Helper: draw rounded container card
    def draw_container(x, y, w, h, title, subtitle, tier_style):
        # Outer card
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.015,rounding_size=0.02",
                                      facecolor=tier_style['bg'], edgecolor=tier_style['border'], linewidth=1.5, zorder=1)
        ax.add_patch(rect)
        # Header banner text
        ax.text(x + 0.02, y + h - 0.035, title, fontsize=13, fontweight='bold', color=tier_style['header'], zorder=3)
        ax.text(x + 0.02, y + h - 0.065, subtitle, fontsize=8.5, color='#4B5563', style='italic', zorder=3)

    # Helper: draw inner component box
    def draw_box(x, y, w, h, title, items, tier_style):
        box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.008,rounding_size=0.012",
                                     facecolor=tier_style['box'], edgecolor=tier_style['box_b'], linewidth=1.0, zorder=2)
        ax.add_patch(box)
        # Box title
        ax.text(x + 0.015, y + h - 0.03, title, fontsize=10, fontweight='bold', color='#1F2937', zorder=3)
        # Bullet items
        for idx, item in enumerate(items):
            ax.text(x + 0.015, y + h - 0.06 - (idx * 0.028), f"• {item}", fontsize=8, color='#4B5563', zorder=3)

    # -------------------------------------------------------------
    # 1. PRESENTATION TIER (TOP ROW)
    # -------------------------------------------------------------
    draw_container(0.04, 0.58, 0.58, 0.31, 
                   "1. PRESENTATION & CLIENT TIER", 
                   "React 18 • TypeScript • Vite • Tailwind CSS • React Router • Recharts", 
                   TIER_COLORS['frontend'])

    # Frontend Inner Boxes
    draw_box(0.06, 0.60, 0.165, 0.22, 
             "3-Column Editorial UI", 
             ["Left Navigation Bar", "Center Adaptive Feed", "Right Reading Digest", "Dark / Light Themes", "Responsive Layout"], 
             TIER_COLORS['frontend'])

    draw_box(0.24, 0.60, 0.17, 0.22, 
             "Interactive Features", 
             ["Personalized 'For You'", "'Why This Article?' Modal", "Extractive AI Summaries", "Category & Search Filters", "Bookmarks & History"], 
             TIER_COLORS['frontend'])

    draw_box(0.425, 0.60, 0.175, 0.22, 
             "Client State & Sync", 
             ["Supabase Auth Session", "Instant Demo Profiles (A/B)", "Client-Side Fallback Engine", "Local Interaction Buffers", "Theme & Preference State"], 
             TIER_COLORS['frontend'])

    # -------------------------------------------------------------
    # 2. EXTERNAL NEWS INGESTION (TOP RIGHT)
    # -------------------------------------------------------------
    draw_container(0.66, 0.58, 0.30, 0.31, 
                   "2. LIVE DATA INGESTION TIER", 
                   "GNews API v4 • Intelligent Caching • Rate Throttling", 
                   TIER_COLORS['gnews'])

    draw_box(0.68, 0.60, 0.26, 0.22, 
             "GNews API Integration", 
             ["GET /top-headlines & /search", "Multi-Category Poll (Tech, Biz...)", "15-Min TTL In-Memory Cache", "1.2s Request Rate Limiter", "Article Normalizer to Schema"], 
             TIER_COLORS['gnews'])

    # -------------------------------------------------------------
    # 3. DATABASE & CLOUD BACKEND (BOTTOM LEFT)
    # -------------------------------------------------------------
    draw_container(0.04, 0.08, 0.44, 0.44, 
                   "3. CLOUD BACKEND & DATABASE TIER", 
                   "Supabase PostgreSQL • Row Level Security • Auth & Edge Functions", 
                   TIER_COLORS['supabase'])

    draw_box(0.06, 0.11, 0.19, 0.34, 
             "PostgreSQL Tables", 
             ["public.profiles (User details)", 
              "public.categories (16 domains)", 
              "public.articles (GNews catalog)", 
              "public.user_interests (Priors)", 
              "public.user_interactions (Signals)", 
              "public.bookmarks (Saved items)", 
              "public.reading_history (Logs)", 
              "public.user_settings (Weights)"], 
             TIER_COLORS['supabase'])

    draw_box(0.265, 0.11, 0.195, 0.34, 
             "Security & Serverless", 
             ["Row Level Security (RLS)", 
              "Automated Profile Triggers", 
              "PostgREST REST API Layer", 
              "JWT Bearer Authentication", 
              "Edge Functions Ingestion", 
              "Real-time Data Streaming", 
              "Deduplicated URL Indexing"], 
             TIER_COLORS['supabase'])

    # -------------------------------------------------------------
    # 4. AI/ML RECOMMENDATION ENGINE (BOTTOM RIGHT)
    # -------------------------------------------------------------
    draw_container(0.52, 0.08, 0.44, 0.44, 
                   "4. AI / ML RECOMMENDATION MICROSERVICE", 
                   "Python 3.12 • FastAPI • scikit-learn • NumPy • Multi-Signal Ranking", 
                   TIER_COLORS['aiml'])

    draw_box(0.54, 0.28, 0.19, 0.17, 
             "TF-IDF & Text Similarity", 
             ["Term Frequency Matrix", "Inverse Document Freq.", "Cosine Similarity Vector", "Article Pair Matching", "Category Inference"], 
             TIER_COLORS['aiml'])

    draw_box(0.745, 0.28, 0.195, 0.17, 
             "Multi-Signal Scoring", 
             ["Category Preference (35%)", "Behavioral History (30%)", "Content Similarity (20%)", "Recency Time Decay (15%)", "Transparent Score Output"], 
             TIER_COLORS['aiml'])

    draw_box(0.54, 0.11, 0.19, 0.15, 
             "MMR Diversity Engine", 
             ["Maximal Marginal Relevance", "Combats Filter Bubbles", "Configurable Diversity λ", "Cross-Domain Discovery"], 
             TIER_COLORS['aiml'])

    draw_box(0.745, 0.11, 0.195, 0.15, 
             "NLP Extractive Summarizer", 
             ["Sentence Salience Scoring", "Lead-3 Prioritization", "Key Term Frequency Match", "Honest Excerpt Summaries"], 
             TIER_COLORS['aiml'])

    # -------------------------------------------------------------
    # CONNECTING ARROWS & DATA FLOWS
    # -------------------------------------------------------------
    arrow_props = dict(arrowstyle="<->", color="#3B82F6", lw=2.0, mutation_scale=15)
    down_arrow = dict(arrowstyle="->", color="#10B981", lw=2.0, mutation_scale=15)
    purple_arrow = dict(arrowstyle="<->", color="#8B5CF6", lw=2.0, mutation_scale=15)
    amber_arrow = dict(arrowstyle="->", color="#D97706", lw=2.0, mutation_scale=15)

    # Arrow 1: Frontend <--> Supabase (Auth, Read/Write)
    ax.annotate("", xy=(0.20, 0.58), xytext=(0.20, 0.52),
                arrowprops=purple_arrow, zorder=5)
    ax.text(0.205, 0.545, "JWT Auth / RLS Queries / Interactions", fontsize=8, fontweight='bold', color='#6D28D9', zorder=6)

    # Arrow 2: Frontend <--> Python AI Engine (Recommendations, Summaries)
    ax.annotate("", xy=(0.52, 0.60), xytext=(0.60, 0.52),
                arrowprops=arrow_props, zorder=5)
    ax.text(0.575, 0.55, "POST /recommend & /summarize", fontsize=8, fontweight='bold', color='#1D4ED8', zorder=6)

    # Arrow 3: GNews Ingestion --> Supabase (Articles Upsert)
    ax.annotate("", xy=(0.70, 0.58), xytext=(0.40, 0.52),
                arrowprops=amber_arrow, zorder=5)
    ax.text(0.44, 0.56, "Live Headlines Upsert (PostgREST)", fontsize=8, fontweight='bold', color='#B45309', zorder=6)

    # Arrow 4: Python AI Engine <--> GNews & Supabase
    ax.annotate("", xy=(0.78, 0.58), xytext=(0.78, 0.52),
                arrowprops=down_arrow, zorder=5)
    ax.text(0.785, 0.545, "Scheduled / Manual Ingestion Trigger", fontsize=8, fontweight='bold', color='#047857', zorder=6)

    # -------------------------------------------------------------
    # BOTTOM FORMULA BANNER
    # -------------------------------------------------------------
    formula_rect = patches.FancyBboxPatch((0.04, 0.015), 0.92, 0.05, boxstyle="round,pad=0.005,rounding_size=0.01",
                                         facecolor='#1E293B', edgecolor='#334155', linewidth=1.0, zorder=3)
    ax.add_patch(formula_rect)
    formula_text = (
        "CORE RECOMMENDATION FORMULA:   "
        "FinalScore(u, a) = [0.35 × CategoryScore(u, a)] + [0.30 × InteractionScore(u, a)] + "
        "[0.20 × CosineSimilarity(u, a)] + [0.15 × RecencyScore(a)]   |   MMR Diversity Re-Rank: λ=0.25"
    )
    ax.text(0.50, 0.04, formula_text, ha='center', va='center', fontsize=9.2, fontweight='bold', color='#38BDF8', zorder=4)

    # Remove axes
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')

    # Output directory
    output_dir = r"C:\Users\vanga\.gemini\antigravity\scratch\news-sphere\docs"
    os.makedirs(output_dir, exist_ok=True)
    
    png_path = os.path.join(output_dir, "newssphere_block_diagram.png")
    svg_path = os.path.join(output_dir, "newssphere_block_diagram.svg")

    plt.savefig(png_path, bbox_inches='tight', dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.savefig(svg_path, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()

    print(f"Diagram successfully generated:")
    print(f"PNG: {png_path}")
    print(f"SVG: {svg_path}")

if __name__ == "__main__":
    generate_block_diagram()
