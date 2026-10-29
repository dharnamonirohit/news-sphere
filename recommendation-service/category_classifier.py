import re
from typing import Dict, List, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from models import CategoryInferenceRequest, CategoryInferenceResponse

# Category seed knowledge profiles for news classification
CATEGORY_SEEDS: Dict[str, str] = {
    "Artificial Intelligence": (
        "artificial intelligence machine learning deep learning neural network llm gpt openai anthropic "
        "claude gemini chatbot agent reasoning computer vision natural language processing nlp generative ai "
        "autonomous robot algorithm model training weights gpu nvidia transformer"
    ),
    "Technology": (
        "technology tech software hardware device smartphone apple google microsoft amazon app platform "
        "operating system gadget cloud computing chip semiconductor gadget coding developer engineer silicon"
    ),
    "Cybersecurity": (
        "cybersecurity security hacker malware ransomware breach phishing vulnerability exploit zero-day "
        "firewall encryption cyber attack ddos authentication password privacy data leak cisa cve threat"
    ),
    "Startups": (
        "startup venture capital funding round seed series a series b investor valuation founder unicorn "
        "pitch deck incubator accelerator angel investor y combinator entrepreneurial ipo exit"
    ),
    "Cricket": (
        "cricket batsman bowler wicket ipl bcci test match t20 odi century six four over world cup trophy "
        "rohit sharma virat kohli bumrah pitch innings captain stadium wicketkeeper"
    ),
    "Sports": (
        "sports football soccer tournament championship olympics league club athlete fifa nba tennis race "
        "badminton goal medal referee coach grand slam premier league player victory defeat stadium"
    ),
    "Business": (
        "business economy stock market trading shares revenue profit quarter earnings investor wall street "
        "inflation central bank federal reserve interest rates banking corporate gdp finance acquisition merger"
    ),
    "Science": (
        "science research discovery laboratory physics chemistry biology experiment quantum genome scientist "
        "fossil evolution telescope particles microscopy DNA element study published journal nature cell"
    ),
    "Space": (
        "space nasa isro esa rocket launch satellite orbit mars moon lunar mission astronaut cosmos galaxy "
        "artemis starship telescope astronomy astrophysics james webb solar eclipse rover spacecraft"
    ),
    "Health": (
        "health medicine disease hospital doctor patient clinical medical treatment vaccine virus doctor "
        "surgery drug wellness pharmaceutical therapy symptoms diagnosis cancer mental health outbreak diet"
    ),
    "Environment": (
        "environment climate change global warming emissions solar wind renewable energy pollution wildlife "
        "conservation biodiversity deforestation carbon footprint ocean drought storm green sustainable ecology"
    ),
    "Education": (
        "education school university college student teacher exam degree curriculum learning study campus "
        "scholarship academic literacy classroom admissions professor syllabus education policy neet jee"
    ),
    "Politics": (
        "politics government parliament minister election voting democracy party president prime minister law "
        "legislation policy politician campaign diplomacy opposition candidate congress parliament supreme court"
    ),
    "India": (
        "india indian delhi mumbai bangalore supreme court parliament modi state bjp union budget lok sabha "
        "rajya sabha rupee aadhaar bharat isro up bihar tamil nadu maharashtra karnataka kerala"
    ),
    "World": (
        "world global international united nations un treaty diplomacy foreign affairs war conflict peace "
        "europe asia americas middle east ukraine gaza bilateral summit embassy president prime minister border"
    ),
    "Entertainment": (
        "entertainment movie film actor actress hollywood bollywood cinema theatre box office streaming "
        "netflix song album oscar director celebrity concert festival drama awards series soundtrack"
    )
}

class CategoryClassifier:
    def __init__(self):
        self.categories = list(CATEGORY_SEEDS.keys())
        self.documents = [CATEGORY_SEEDS[cat] for cat in self.categories]
        self.vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
        self.category_vectors = self.vectorizer.fit_transform(self.documents)

    def classify(self, title: str, description: str = "") -> Tuple[str, float]:
        text = f"{title} {description}".strip()
        if not text:
            return "World", 0.1

        # Text cleaning
        cleaned = re.sub(r"[^a-zA-Z0-9\s]", " ", text.lower())
        query_vector = self.vectorizer.transform([cleaned])
        similarities = cosine_similarity(query_vector, self.category_vectors)[0]

        best_idx = similarities.argmax()
        best_score = float(similarities[best_idx])

        # If similarity is noticeable, return matched category
        if best_score >= 0.08:
            return self.categories[best_idx], round(best_score, 4)
        
        # Rule fallback checks
        cleaned_words = set(cleaned.split())
        if {"ai", "gpt", "llm", "openai", "claude"} & cleaned_words:
            return "Artificial Intelligence", 0.85
        if {"cricket", "ipl", "bcci", "wicket"} & cleaned_words:
            return "Cricket", 0.90
        if {"space", "nasa", "isro", "orbit", "mars", "moon"} & cleaned_words:
            return "Space", 0.85
        if {"startup", "startups", "funding", "investor"} & cleaned_words:
            return "Startups", 0.80

        return "World", round(max(best_score, 0.15), 4)


_classifier_instance = None

def get_category_classifier() -> CategoryClassifier:
    global _classifier_instance
    if _classifier_instance is None:
        _classifier_instance = CategoryClassifier()
    return _classifier_instance

def infer_category(request: CategoryInferenceRequest) -> CategoryInferenceResponse:
    classifier = get_category_classifier()
    cat, conf = classifier.classify(request.title, request.description or "")
    return CategoryInferenceResponse(category=cat, confidence=conf)
