"""
Recommendation Evaluation Script for NewsSphere
Measures:
1. Precision@K on synthetic interest profiles
2. Category Diversity (Entropy / Simpson Index)
3. Inter-user Rank Distance (showing different user tastes receive different feeds)
"""

import math
from collections import Counter
from models import ArticleItem, UserInterest, UserInteraction, RecommendationRequest
from recommender import get_recommender


def run_evaluation():
    print("=" * 60)
    print("NEWSSPHERE RECOMMENDATION ENGINE - OFFLINE BENCHMARK")
    print("=" * 60)

    # 1. Synthetic dataset with diverse categories
    categories = [
        "Artificial Intelligence", "Cricket", "Business", "Space",
        "Cybersecurity", "Health", "Environment", "Technology"
    ]
    articles = []
    art_id = 1
    for cat in categories:
        for i in range(5):
            articles.append(ArticleItem(
                id=art_id,
                title=f"{cat} Milestone Headline #{i+1}: Advances and latest breakthroughs",
                description=f"Detailed reporting on {cat} developments, market trends, and critical updates.",
                category=cat,
                publication_date="2026-10-26T08:00:00Z"
            ))
            art_id += 1

    engine = get_recommender()

    # User 1 Profile: Deeply prefers AI & Cybersecurity
    user1_req = RecommendationRequest(
        user_id=1,
        articles=articles,
        interests=[
            UserInterest(category="Artificial Intelligence", initial_preference=1.0, learned_score=0.8),
            UserInterest(category="Cybersecurity", initial_preference=1.0, learned_score=0.4),
        ],
        interactions=[
            UserInteraction(article_id=1, category="Artificial Intelligence", interaction_type="LIKE"),
            UserInteraction(article_id=2, category="Artificial Intelligence", interaction_type="BOOKMARK")
        ],
        diversity_weight=0.25,
        limit=10
    )

    # User 2 Profile: Deeply prefers Cricket & Business
    user2_req = RecommendationRequest(
        user_id=2,
        articles=articles,
        interests=[
            UserInterest(category="Cricket", initial_preference=1.0, learned_score=0.9),
            UserInterest(category="Business", initial_preference=1.0, learned_score=0.5),
        ],
        interactions=[
            UserInteraction(article_id=6, category="Cricket", interaction_type="LIKE"),
            UserInteraction(article_id=11, category="Business", interaction_type="BOOKMARK")
        ],
        diversity_weight=0.25,
        limit=10
    )

    resp1 = engine.rank_articles(user1_req)
    resp2 = engine.rank_articles(user2_req)

    # Metric 1: Precision@5 for User 1 (relevant = AI or Cybersecurity)
    k = 5
    top_k_cats_u1 = [item.article.category for item in resp1.items[:k]]
    relevant_u1 = sum(1 for c in top_k_cats_u1 if c in ["Artificial Intelligence", "Cybersecurity"])
    precision_at_5_u1 = relevant_u1 / k

    # Metric 1: Precision@5 for User 2 (relevant = Cricket or Business)
    top_k_cats_u2 = [item.article.category for item in resp2.items[:k]]
    relevant_u2 = sum(1 for c in top_k_cats_u2 if c in ["Cricket", "Business"])
    precision_at_5_u2 = relevant_u2 / k

    # Metric 2: Category Diversity (Shannon Entropy of top 10 articles)
    def shannon_entropy(cat_list):
        total = len(cat_list)
        counts = Counter(cat_list)
        ent = 0.0
        for cnt in counts.values():
            p = cnt / total
            ent -= p * math.log2(p)
        return ent

    entropy_u1 = shannon_entropy([item.article.category for item in resp1.items])
    unique_cats_u1 = len(set(item.article.category for item in resp1.items))

    # Metric 3: Ranking Dissimilarity between User 1 and User 2
    u1_ids = [item.article.id for item in resp1.items]
    u2_ids = [item.article.id for item in resp2.items]
    overlap_count = len(set(u1_ids[:5]).intersection(set(u2_ids[:5])))

    print(f"\n--- Benchmark Results ---")
    print(f"User 1 Precision@{k}: {precision_at_5_u1 * 100:.1f}% (Top categories: {top_k_cats_u1})")
    print(f"User 2 Precision@{k}: {precision_at_5_u2 * 100:.1f}% (Top categories: {top_k_cats_u2})")
    print(f"User 1 Top-10 Category Diversity Entropy: {entropy_u1:.2f} (Unique categories: {unique_cats_u1}/10)")
    print(f"Top-5 Article Overlap between User 1 & User 2: {overlap_count} items (Lower is better for personalization)")
    print(f"\nSample Explanation for User 1 Top Pick:")
    print(f"  Title: {resp1.items[0].article.title}")
    print(f"  Reason: {resp1.items[0].reason}")
    print(f"  Component Scores: {resp1.items[0].scores.model_dump()}")
    print("=" * 60)
    print("BENCHMARK COMPLETED SUCCESSFULLY.")
    print("=" * 60)


if __name__ == "__main__":
    run_evaluation()
