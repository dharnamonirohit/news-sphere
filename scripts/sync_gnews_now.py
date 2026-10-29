import urllib.request
import json
import time

GNEWS_KEY = "ad57292982127b651c0dbdc9facd714b"
SUPABASE_URL = "https://ntnrcwvfasisznjpnmoj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bnJjd3ZmYXNpc3puanBubW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNzU2OTEsImV4cCI6MjEwODg1MTY5MX0.KQnOTC9LowxZh_qYAcq0YehPdw8gc6yxiEewKAgiQjs"

CATEGORIES = ["technology", "business", "sports", "general", "science"]
CAT_MAP = {
    "technology": "Technology",
    "business": "Business",
    "sports": "Sports",
    "science": "Science",
    "general": "World News"
}

def sync_now():
    print("==================================================")
    print("NewsSphere: Live GNews to Supabase Direct Ingestion")
    print("==================================================")
    
    all_articles = []
    
    for cat in CATEGORIES:
        url = f"https://gnews.io/api/v4/top-headlines?category={cat}&lang=en&max=3&apikey={GNEWS_KEY}"
        req = urllib.request.Request(url, headers={"User-Agent": "NewsSphere/1.0"})
        try:
            print(f"Fetching '{cat}' headlines from GNews...")
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode())
                raw_articles = data.get("articles", [])
                print(f"  -> Got {len(raw_articles)} articles.")
                for a in raw_articles:
                    if not a.get("url") or not a.get("title"):
                        continue
                    all_articles.append({
                        "canonical_url": a["url"],
                        "provider": "gnews",
                        "title": a["title"],
                        "description": a.get("description") or "",
                        "content_excerpt": a.get("content") or a.get("description") or "",
                        "image_url": a.get("image") or "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80",
                        "source_name": (a.get("source") or {}).get("name") or "Live Wire",
                        "published_at": a.get("publishedAt"),
                        "category": CAT_MAP.get(cat, "World News"),
                        "language": "en",
                        "country": "in",
                        "is_demo": False
                    })
        except Exception as e:
            print(f"  -> Notice for {cat}: {e}")
        time.sleep(1.2)
        
    print(f"\nTotal live articles collected: {len(all_articles)}")
    
    # Send to Supabase
    post_url = f"{SUPABASE_URL}/rest/v1/articles"
    post_headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    post_req = urllib.request.Request(post_url, data=json.dumps(all_articles).encode(), headers=post_headers, method="POST")
    try:
        with urllib.request.urlopen(post_req, timeout=10) as r:
            print(f"SUCCESS: Supabase accepted and persisted {len(all_articles)} live articles! (HTTP {r.status})")
    except urllib.error.HTTPError as he:
        print(f"\nSUPABASE ERROR (HTTP {he.code}):")
        print(he.read().decode())
        print("\nFix: Please run the SQL snippet in your Supabase SQL editor to enable INSERT permissions on the 'articles' table.")
    except Exception as e:
        print(f"Error posting to Supabase: {e}")

if __name__ == "__main__":
    sync_now()
