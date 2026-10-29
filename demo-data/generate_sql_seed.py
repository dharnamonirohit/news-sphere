import json

with open("C:/Users/vanga/.gemini/antigravity/scratch/news-sphere/demo-data/articles.json", "r", encoding="utf-8") as f:
    articles = json.load(f)

sql_lines = [
    "-- ==============================================================================",
    "-- NewsSphere Demo Seed Data for Supabase PostgreSQL",
    "-- ==============================================================================",
    "",
    "INSERT INTO public.articles (canonical_url, title, description, content_excerpt, image_url, source_name, author, published_at, category, is_demo)",
    "VALUES"
]

val_rows = []
for art in articles:
    url = art['canonical_url'].replace("'", "''")
    title = art['title'].replace("'", "''")
    desc = art['description'].replace("'", "''")
    excerpt = art['content_excerpt'].replace("'", "''")
    img = art['image_url'].replace("'", "''")
    source = art['source_name'].replace("'", "''")
    author = art['author'].replace("'", "''")
    pub = art['published_at']
    cat = art['category'].replace("'", "''")
    
    val_rows.append(
        f"    ('{url}', '{title}', '{desc}', '{excerpt}', '{img}', '{source}', '{author}', '{pub}'::timestamptz, '{cat}', TRUE)"
    )

sql_lines.append(",\n".join(val_rows))
sql_lines.append("ON CONFLICT (canonical_url) DO UPDATE SET")
sql_lines.append("    title = EXCLUDED.title,")
sql_lines.append("    description = EXCLUDED.description,")
sql_lines.append("    content_excerpt = EXCLUDED.content_excerpt,")
sql_lines.append("    image_url = EXCLUDED.image_url,")
sql_lines.append("    category = EXCLUDED.category,")
sql_lines.append("    updated_at = now();")

with open("C:/Users/vanga/.gemini/antigravity/scratch/news-sphere/supabase/migrations/20261026000001_seed_newssphere_demo.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines) + "\n")

print("Generated seed migration successfully.")
