import math
import re
from datetime import datetime, timezone
from typing import List, Dict, Tuple, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from models import (
    ArticleItem,
    UserInteraction,
    UserInterest,
    RecommendationRequest,
    RecommendationResponse,
    RecommendationComponentScores,
    ScoredArticle,
    SimilarArticlesRequest,
    SimilarArticleResult
)

from config import (
    WEIGHT_CATEGORY,
    WEIGHT_BEHAVIOR,
    WEIGHT_SIMILARITY,
    WEIGHT_RECENCY,
    INTERACTION_WEIGHTS,
    RECENCY_HALF_LIFE_HOURS
)


def clean_text(text: Optional[str]) -> str:
    if not text:
        return ""
    cleaned = re.sub(r"<[^>]+>", " ", text)
    cleaned = re.sub(r"[^a-zA-Z0-9\s]", " ", cleaned)
    return re.sub(r"\s+", " ", cleaned).strip().lower()


def parse_date(date_str: Optional[str]) -> datetime:
    if not date_str:
        return datetime.now(timezone.utc)
    # Try common ISO and standard date formats
    for fmt in (
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d",
    ):
        try:
            dt = datetime.strptime(date_str[:19], fmt[:19])
            return dt.replace(tzinfo=timezone.utc)
        except Exception:
            continue
    return datetime.now(timezone.utc)


def compute_recency_score(pub_date_str: Optional[str]) -> float:
    now = datetime.now(timezone.utc)
    dt = parse_date(pub_date_str)
    diff_hours = max(0.0, (now - dt).total_seconds() / 3600.0)
    # Exponential decay with half-life of ~48 hours
    decay_rate = 0.693 / RECENCY_HALF_LIFE_HOURS
    score = math.exp(-decay_rate * diff_hours)
    return round(float(np.clip(score, 0.05, 1.0)), 4)


class RecommenderEngine:
    def __init__(self):
        pass

    def compute_similar_articles(self, request: SimilarArticlesRequest) -> List[SimilarArticleResult]:
        target = request.target_article
        candidates = [a for a in request.candidate_articles if a.id != target.id]

        if not candidates:
            return []

        target_text = clean_text(f"{target.title} {target.description} {target.content_excerpt}")
        candidate_texts = [
            clean_text(f"{a.title} {a.description} {a.content_excerpt}")
            for a in candidates
        ]

        vectorizer = TfidfVectorizer(stop_words='english', max_features=5000, ngram_range=(1, 2))
        try:
            corpus = [target_text] + candidate_texts
            tfidf_matrix = vectorizer.fit_transform(corpus)
            target_vec = tfidf_matrix[0:1]
            candidate_vecs = tfidf_matrix[1:]
            sims = cosine_similarity(target_vec, candidate_vecs)[0]
        except Exception:
            # Fallback if vocabulary empty
            sims = np.zeros(len(candidates))

        results = []
        for idx, sim in enumerate(sims):
            # Category boost if same category
            cat_bonus = 0.15 if candidates[idx].category == target.category else 0.0
            total_sim = float(np.clip(sim + cat_bonus, 0.0, 1.0))
            results.append(SimilarArticleResult(
                article=candidates[idx],
                similarity_score=round(total_sim, 4)
            ))

        results.sort(key=lambda r: r.similarity_score, reverse=True)
        return results[:request.limit]

    def rank_articles(self, request: RecommendationRequest) -> RecommendationResponse:
        candidates = request.articles
        if not candidates:
            return RecommendationResponse(items=[], total_evaluated=0)

        # 1. Filter by category if requested
        if request.category_filter and request.category_filter.lower() != "all":
            candidates = [a for a in candidates if a.category and a.category.lower() == request.category_filter.lower()]

        if not candidates:
            return RecommendationResponse(items=[], total_evaluated=0)

        # 2. Build Category Preference Profile
        user_category_interests: Dict[str, float] = {}
        for interest in request.interests:
            cat_name = interest.category.strip()
            # Initial selection weight: 1.0, plus learned interest score
            total_pref = max(0.0, float(interest.initial_preference) + float(interest.learned_score))
            user_category_interests[cat_name] = total_pref

        # 3. Behavioral Interaction Scoring & Positive History Profile
        user_cat_interactions: Dict[str, float] = {}
        positive_articles_text: List[str] = []
        positive_article_map: Dict[int, str] = {}

        for inter in request.interactions:
            cat = inter.category
            weight = INTERACTION_WEIGHTS.get(inter.interaction_type.upper(), 1.0)
            
            # Boost if reading time was significant (> 30s)
            if inter.reading_time_seconds and inter.reading_time_seconds > 30:
                weight += min(1.5, inter.reading_time_seconds / 60.0)

            if cat:
                user_cat_interactions[cat] = user_cat_interactions.get(cat, 0.0) + weight

            if weight > 0:
                text_repr = inter.article_title or ""
                if text_repr:
                    positive_articles_text.append(clean_text(text_repr))
                    positive_article_map[inter.article_id] = inter.article_title

        # Normalize behavioral scores per category to [0, 1]
        max_inter_val = max(user_cat_interactions.values()) if user_cat_interactions else 1.0
        norm_behavior_cat = {
            cat: float(np.clip(val / max(max_inter_val, 1.0), 0.0, 1.0))
            for cat, val in user_cat_interactions.items()
        }

        # Normalize category interest scores to [0, 1]
        max_pref_val = max(user_category_interests.values()) if user_category_interests else 1.0
        norm_category_interests = {
            cat: float(np.clip(val / max(max_pref_val, 1.0), 0.0, 1.0))
            for cat, val in user_category_interests.items()
        }

        # 4. Textual Content Similarity (TF-IDF between candidate articles and user positive interaction history)
        candidate_texts = [
            clean_text(f"{a.title} {a.description}") for a in candidates
        ]

        content_sims = np.zeros(len(candidates))
        if positive_articles_text:
            try:
                user_history_doc = " ".join(positive_articles_text)
                vectorizer = TfidfVectorizer(stop_words='english', max_features=4000, ngram_range=(1, 2))
                corpus = [user_history_doc] + candidate_texts
                tfidf_matrix = vectorizer.fit_transform(corpus)
                user_vec = tfidf_matrix[0:1]
                cand_vecs = tfidf_matrix[1:]
                content_sims = cosine_similarity(user_vec, cand_vecs)[0]
            except Exception:
                content_sims = np.zeros(len(candidates))

        # 5. Score Candidates
        scored_items: List[ScoredArticle] = []
        for idx, art in enumerate(candidates):
            cat = art.category or "General"

            # Category score
            cat_score = norm_category_interests.get(cat, 0.15)

            # Behavioral score
            behav_score = norm_behavior_cat.get(cat, 0.10)

            # Content similarity score
            sim_score = float(np.clip(content_sims[idx], 0.0, 1.0))

            # Recency score
            rec_score = compute_recency_score(art.publication_date)

            # Freshness exploration boost for breaking articles (rec_score >= 0.85)
            freshness_boost = 0.35 if rec_score >= 0.85 else (0.15 if rec_score >= 0.60 else 0.0)

            # Weighted combination
            combined = min(1.0, (
                WEIGHT_CATEGORY * cat_score +
                WEIGHT_BEHAVIOR * behav_score +
                WEIGHT_SIMILARITY * sim_score +
                WEIGHT_RECENCY * rec_score +
                freshness_boost
            ))

            # Generate Explainability Reason based on dominating true signals
            if freshness_boost >= 0.35:
                reason = f"Fresh breaking dispatch in {cat} prioritized for real-time discovery."
            else:
                reason = self._generate_explanation(
                    art=art,
                    cat_score=cat_score,
                    behav_score=behav_score,
                    sim_score=sim_score,
                    rec_score=rec_score,
                    user_has_interests=bool(user_category_interests),
                    user_has_history=bool(positive_articles_text)
                )

            scores_dto = RecommendationComponentScores(
                category_score=round(cat_score, 4),
                behavioral_score=round(behav_score, 4),
                content_similarity_score=round(sim_score, 4),
                recency_score=round(rec_score, 4),
                combined_score=round(combined, 4)
            )

            scored_items.append(ScoredArticle(
                article=art,
                score=round(combined, 4),
                scores=scores_dto,
                reason=reason,
                is_diversity_boosted=False
            ))

        # Sort primarily by raw combined score
        scored_items.sort(key=lambda x: x.score, reverse=True)

        # 6. Apply Diversity Re-ranking Mechanism
        # Target: ~70% top preferences, 20% related/secondary, 10% exploratory
        # We penalize adjacent duplicate categories and elevate fresh topics
        reranked = self._apply_diversity_rerank(scored_items, diversity_weight=request.diversity_weight)

        return RecommendationResponse(
            items=reranked[:request.limit],
            total_evaluated=len(candidates),
            algorithm_version="TFIDF-Cosine-Hybrid-v1.0"
        )

    def _generate_explanation(
        self,
        art: ArticleItem,
        cat_score: float,
        behav_score: float,
        sim_score: float,
        rec_score: float,
        user_has_interests: bool,
        user_has_history: bool
    ) -> str:
        cat = art.category or "General"

        # Signal 1: High Content Similarity to read/bookmarked articles
        if sim_score >= 0.28:
            return f"Similar topics to news you previously read in {cat}."

        # Signal 2: Strong Behavioral Engagement in this Category
        if behav_score >= 0.40:
            return f"Recommended because you frequently engage with {cat} stories."

        # Signal 3: Explicit Selected Interest
        if cat_score >= 0.50:
            return f"Matches your chosen interest in {cat}."

        # Signal 4: Very Recent / Breaking News
        if rec_score >= 0.85:
            return f"Breaking / Recent dispatch in {cat}."

        # Signal 5: General / Exploratory
        if not user_has_interests and not user_has_history:
            return f"Popular and trending headline in {cat}."

        return f"Curated for you based on current events in {cat}."

    def _apply_diversity_rerank(
        self,
        ranked_list: List[ScoredArticle],
        diversity_weight: float = 0.2
    ) -> List[ScoredArticle]:
        if len(ranked_list) <= 3 or diversity_weight <= 0.0:
            return ranked_list

        result: List[ScoredArticle] = []
        remaining = list(ranked_list)
        category_counts: Dict[str, int] = {}

        while remaining:
            best_idx = 0
            best_diversity_score = -999.0

            for i, cand in enumerate(remaining):
                cat = cand.article.category or "General"
                current_cat_freq = category_counts.get(cat, 0)

                # Diversity penalty: heavily reduce score if this category has already appeared multiple times
                penalty = current_cat_freq * diversity_weight * 0.18

                # Consecutive duplicate penalty: don't put 2 identical categories back to back if alternatives exist
                if result and (result[-1].article.category == cat) and len(remaining) > 2:
                    penalty += 0.12

                # Exploratory boost for novel category that hasn't appeared yet
                bonus = 0.05 if current_cat_freq == 0 else 0.0

                div_score = cand.score - penalty + bonus

                if div_score > best_diversity_score:
                    best_diversity_score = div_score
                    best_idx = i

            chosen = remaining.pop(best_idx)
            chosen_cat = chosen.article.category or "General"
            category_counts[chosen_cat] = category_counts.get(chosen_cat, 0) + 1

            # Mark if this was an exploratory boost
            if category_counts[chosen_cat] == 1 and chosen.score < 0.45:
                chosen.is_diversity_boosted = True
                if "Matches" not in chosen.reason:
                    chosen.reason = f"Exploratory recommendation from {chosen_cat} to diversify your feed."

            result.append(chosen)

        return result


_engine_instance = None

def get_recommender() -> RecommenderEngine:
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = RecommenderEngine()
    return _engine_instance
