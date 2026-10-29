import os

# Server Configuration
HOST = os.getenv("RECOMMENDATION_HOST", "0.0.0.0")
PORT = int(os.getenv("RECOMMENDATION_PORT", "8000"))
SERVICE_SECRET = os.getenv("RECOMMENDATION_SERVICE_SECRET", "")

# GNews API Integration
GNEWS_API_KEY = os.getenv("GNEWS_API_KEY", "ad57292982127b651c0dbdc9facd714b")
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://ntnrcwvfasisznjpnmoj.supabase.co")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bnJjd3ZmYXNpc3puanBubW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNzU2OTEsImV4cCI6MjEwODg1MTY5MX0.KQnOTC9LowxZh_qYAcq0YehPdw8gc6yxiEewKAgiQjs")

# Recommendation Weights (Transparent & Configurable)
WEIGHT_CATEGORY = float(os.getenv("WEIGHT_CATEGORY", "0.35"))
WEIGHT_BEHAVIOR = float(os.getenv("WEIGHT_BEHAVIOR", "0.30"))
WEIGHT_SIMILARITY = float(os.getenv("WEIGHT_SIMILARITY", "0.20"))
WEIGHT_RECENCY = float(os.getenv("WEIGHT_RECENCY", "0.15"))

# Behavioral Signal Weights
INTERACTION_WEIGHTS = {
    "LIKE": float(os.getenv("WEIGHT_LIKE", "3.0")),
    "BOOKMARK": float(os.getenv("WEIGHT_BOOKMARK", "2.5")),
    "READ": float(os.getenv("WEIGHT_READ", "1.5")),
    "CLICK": float(os.getenv("WEIGHT_CLICK", "1.0")),
    "SKIP": float(os.getenv("WEIGHT_SKIP", "-2.0"))
}

# Diversity Parameters
DEFAULT_DIVERSITY_WEIGHT = float(os.getenv("DEFAULT_DIVERSITY_WEIGHT", "0.25"))
RECENCY_HALF_LIFE_HOURS = float(os.getenv("RECENCY_HALF_LIFE_HOURS", "48.0"))
