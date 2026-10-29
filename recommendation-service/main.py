import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import (
    RecommendationRequest,
    RecommendationResponse,
    SimilarArticlesRequest,
    SimilarArticleResult,
    SummarizationRequest,
    SummarizationResponse,
    CategoryInferenceRequest,
    CategoryInferenceResponse
)
from recommender import get_recommender
from summarizer import summarize_extractive
from category_classifier import infer_category
from gnews_client import fetch_live_headlines

app = FastAPI(
    title="NewsSphere AI Recommendation & NLP Service",
    description="Content-Based Recommendation, TF-IDF Textual Similarity, Extractive Summarization, and Explainability Engine",
    version="1.0.0"
)

# Enable CORS for local services
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "newssphere-recommendation-engine",
        "version": "1.0.0",
        "models": {
            "recommender": "TF-IDF + Cosine Similarity + Hybrid MMR",
            "summarizer": "Extractive Salience NLP",
            "classifier": "TF-IDF Category Inference"
        }
    }


@app.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(request: RecommendationRequest):
    try:
        engine = get_recommender()
        return engine.rank_articles(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation computation error: {str(e)}")


@app.post("/similar", response_model=list[SimilarArticleResult])
def get_similar_articles(request: SimilarArticlesRequest):
    try:
        engine = get_recommender()
        return engine.compute_similar_articles(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Similarity computation error: {str(e)}")


@app.post("/summarize", response_model=SummarizationResponse)
def generate_summary(request: SummarizationRequest):
    try:
        return summarize_extractive(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization error: {str(e)}")


@app.post("/infer-category", response_model=CategoryInferenceResponse)
def get_category_inference(request: CategoryInferenceRequest):
    try:
        return infer_category(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Category inference error: {str(e)}")


@app.get("/api/news/live")
def get_live_news(q: str = None, limit: int = 20):
    try:
        return fetch_live_headlines(max_per_category=limit, query=q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Live news fetch failed: {str(e)}")


@app.post("/api/news/refresh")
def refresh_live_news():
    try:
        articles = fetch_live_headlines(max_per_category=5, force_refresh=True)
        return {
            "success": True,
            "articles_fetched": len(articles),
            "articles": articles
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Live news refresh failed: {str(e)}")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
