import unittest
from models import (
    ArticleItem,
    UserInterest,
    UserInteraction,
    RecommendationRequest,
    SimilarArticlesRequest,
    SummarizationRequest
)
from recommender import get_recommender
from summarizer import summarize_extractive
from category_classifier import infer_category, CategoryInferenceRequest


class TestRecommenderEngine(unittest.TestCase):
    def setUp(self):
        self.engine = get_recommender()
        self.sample_articles = [
            ArticleItem(
                id=1,
                title="Google deepens AI integration in search with Gemini 2.5",
                description="Google announces major improvements to its Gemini models with fast reasoning and multimodal features.",
                category="Artificial Intelligence",
                publication_date="2026-10-26T10:00:00Z"
            ),
            ArticleItem(
                id=2,
                title="Anthropic introduces Claude 3.7 Sonnet AI reasoning model",
                description="Anthropic releases new AI model combining rapid reasoning with multimodal reasoning capabilities.",
                category="Artificial Intelligence",
                publication_date="2026-10-25T14:30:00Z"
            ),
            ArticleItem(
                id=3,
                title="India vs Australia Champions Trophy Final preview and pitch report",
                description="Rohit Sharma and Virat Kohli lead India against Australia at Melbourne Cricket Ground in blockbuster clash.",
                category="Cricket",
                publication_date="2026-10-26T08:00:00Z"
            ),
            ArticleItem(
                id=4,
                title="IPL auction 2027: Top franchise signings and record bids",
                description="Franchises battle for star bowlers and power hitters in a high-voltage auction.",
                category="Cricket",
                publication_date="2026-10-24T12:00:00Z"
            ),
            ArticleItem(
                id=5,
                title="NASA James Webb Telescope spots oldest galaxy cluster in deep cosmos",
                description="Astronomers detect ancient stellar formation dating back to the dawn of the universe.",
                category="Space",
                publication_date="2026-10-26T05:00:00Z"
            ),
            ArticleItem(
                id=6,
                title="RBI holds repo rate steady amid strong economic growth",
                description="Reserve Bank of India maintains benchmark interest rate with focus on sustainable GDP growth and inflation.",
                category="Business",
                publication_date="2026-10-26T09:15:00Z"
            ),
        ]

    def test_different_users_receive_different_rankings(self):
        # Demo User A: Artificial Intelligence & Space
        user_a_req = RecommendationRequest(
            user_id=101,
            articles=self.sample_articles,
            interests=[
                UserInterest(category="Artificial Intelligence", initial_preference=1.0, learned_score=0.5),
                UserInterest(category="Space", initial_preference=1.0, learned_score=0.2)
            ],
            interactions=[
                UserInteraction(article_id=1, category="Artificial Intelligence", interaction_type="LIKE")
            ]
        )
        response_a = self.engine.rank_articles(user_a_req)
        top_cats_a = [item.article.category for item in response_a.items[:2]]

        # Demo User B: Cricket & Business
        user_b_req = RecommendationRequest(
            user_id=102,
            articles=self.sample_articles,
            interests=[
                UserInterest(category="Cricket", initial_preference=1.0, learned_score=0.5),
                UserInterest(category="Business", initial_preference=1.0, learned_score=0.3)
            ],
            interactions=[
                UserInteraction(article_id=3, category="Cricket", interaction_type="BOOKMARK")
            ]
        )
        response_b = self.engine.rank_articles(user_b_req)
        top_cats_b = [item.article.category for item in response_b.items[:2]]

        # Verify distinct personalization
        self.assertIn("Artificial Intelligence", top_cats_a)
        self.assertIn("Cricket", top_cats_b)
        self.assertNotEqual(top_cats_a, top_cats_b)

    def test_content_similarity_ranking(self):
        sim_req = SimilarArticlesRequest(
            target_article=self.sample_articles[0],  # Gemini AI article
            candidate_articles=self.sample_articles,
            limit=3
        )
        similar_items = self.engine.compute_similar_articles(sim_req)
        self.assertGreater(len(similar_items), 0)
        # Claude AI article (id=2) should have highest text similarity
        self.assertEqual(similar_items[0].article.id, 2)
        self.assertGreater(similar_items[0].similarity_score, 0.20)

    def test_extractive_summarizer(self):
        req = SummarizationRequest(
            title="OpenAI launches new reasoning model",
            description="The company announced its latest breakthrough model. It excels at math and science benchmarks.",
            content_excerpt="The model provides step-by-step thinking. Researchers demonstrated its coding proficiency across multiple benchmarks. Full details were released in technical reports.",
            max_sentences=2
        )
        res = summarize_extractive(req)
        self.assertIsNotNone(res.summary)
        self.assertTrue(len(res.summary) > 20)
        self.assertEqual(res.source_type, "available_excerpt")
        self.assertIn("available excerpt", res.label.lower())

    def test_missing_article_text_fallback(self):
        req = SummarizationRequest(
            title="Single Headline With No Content",
            description="",
            content_excerpt=""
        )
        res = summarize_extractive(req)
        self.assertEqual(res.summary, "Single Headline With No Content")

    def test_diversity_behavior(self):
        # Create 10 AI articles and 2 Cricket articles
        all_articles = []
        for i in range(10):
            all_articles.append(ArticleItem(
                id=100 + i,
                title=f"AI Milestone {i}",
                description=f"Neural network update number {i}",
                category="Artificial Intelligence",
                publication_date="2026-10-26T10:00:00Z"
            ))
        all_articles.append(ArticleItem(
            id=200,
            title="Cricket Championship Victory",
            description="India secures championship trophy",
            category="Cricket",
            publication_date="2026-10-26T10:00:00Z"
        ))

        req = RecommendationRequest(
            user_id=1,
            articles=all_articles,
            interests=[UserInterest(category="Artificial Intelligence", initial_preference=1.0)],
            diversity_weight=0.5,
            limit=5
        )
        resp = self.engine.rank_articles(req)
        # The list must not be solely homogeneous when diversity weight is applied
        categories_in_feed = {item.article.category for item in resp.items}
        self.assertIn("Cricket", categories_in_feed)

    def test_recommendation_explanation_exists(self):
        req = RecommendationRequest(
            user_id=1,
            articles=self.sample_articles,
            interests=[UserInterest(category="Space", initial_preference=1.0)],
            limit=4
        )
        resp = self.engine.rank_articles(req)
        for item in resp.items:
            self.assertTrue(len(item.reason) > 5)

    def test_category_inference(self):
        req = CategoryInferenceRequest(
            title="Jasprit Bumrah takes 5 wickets in dramatic test final",
            description="Pace bowler dismantles top order in brilliant bowling spell."
        )
        res = infer_category(req)
        self.assertEqual(res.category, "Cricket")


if __name__ == "__main__":
    unittest.main()
