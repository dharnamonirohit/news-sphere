from typing import List, Optional, Dict
from pydantic import BaseModel, Field


class ArticleItem(BaseModel):
    id: int
    title: str
    description: Optional[str] = ""
    content_excerpt: Optional[str] = ""
    category: Optional[str] = "General"
    publication_date: Optional[str] = None
    source_name: Optional[str] = ""
    url: Optional[str] = ""
    image_url: Optional[str] = ""


class UserInteraction(BaseModel):
    article_id: int
    category: Optional[str] = None
    interaction_type: str  # LIKE, BOOKMARK, READ, CLICK, SKIP
    reading_time_seconds: Optional[int] = 0
    article_title: Optional[str] = ""
    timestamp: Optional[str] = None


class UserInterest(BaseModel):
    category: str
    initial_preference: float = 1.0  # e.g., 1.0 if selected, 0.0 otherwise
    learned_score: float = 0.0       # updated dynamically based on interactions


class RecommendationRequest(BaseModel):
    user_id: Optional[int] = None
    articles: List[ArticleItem]
    interests: List[UserInterest] = Field(default_factory=list)
    interactions: List[UserInteraction] = Field(default_factory=list)
    diversity_weight: float = 0.2  # 0.0 (strictly top-scored) to 1.0 (maximal diversity)
    limit: int = 20
    category_filter: Optional[str] = None


class RecommendationComponentScores(BaseModel):
    category_score: float
    behavioral_score: float
    content_similarity_score: float
    recency_score: float
    combined_score: float


class ScoredArticle(BaseModel):
    article: ArticleItem
    score: float
    scores: RecommendationComponentScores
    reason: str
    is_diversity_boosted: bool = False


class RecommendationResponse(BaseModel):
    items: List[ScoredArticle]
    total_evaluated: int
    algorithm_version: str = "TFIDF-Cosine-Hybrid-v1.0"


class SimilarArticlesRequest(BaseModel):
    target_article: ArticleItem
    candidate_articles: List[ArticleItem]
    limit: int = 5


class SimilarArticleResult(BaseModel):
    article: ArticleItem
    similarity_score: float


class SummarizationRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    content_excerpt: Optional[str] = ""
    max_sentences: int = 3


class SummarizationResponse(BaseModel):
    summary: str
    source_type: str
    sentence_count: int
    is_truncated: bool
    label: str


class CategoryInferenceRequest(BaseModel):
    title: str
    description: Optional[str] = ""


class CategoryInferenceResponse(BaseModel):
    category: str
    confidence: float
