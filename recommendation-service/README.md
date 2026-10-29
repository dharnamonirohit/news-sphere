# NewsSphere AI Recommendation & NLP Service

This microservice provides the core intelligence for NewsSphere:
- **Content-Based Recommendation Engine** using TF-IDF representation and cosine similarity.
- **Dynamic User Profiling** combining explicit category preferences with implicit interaction feedback (Likes, Bookmarks, Read Duration, Skips).
- **Diversity Reranking Mechanism** preventing category filter bubbles while preserving relevance.
- **Explainability Engine ("Why am I seeing this?")** providing human-readable explanations based on true active ranking signals.
- **Extractive Article Summarizer** selecting high-salience sentences without needing paid external LLM APIs.
- **Category Inference Fallback** classifying raw news articles into appropriate categories when metadata is missing.

## Prerequisites
- Python 3.11 or 3.12
- Required libraries listed in `requirements.txt`

## Running the Service
```powershell
python -m pip install -r requirements.txt
python main.py
```
Or with uvicorn:
```powershell
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Running Unit Tests & Offline Benchmarks
```powershell
# Run unit tests
python -m unittest discover -s . -p "test_*.py"

# Run offline benchmark evaluation
python evaluate.py
```
