import re
import math
from typing import List, Tuple
from collections import Counter
from models import SummarizationRequest, SummarizationResponse


STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
    "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both",
    "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't",
    "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't",
    "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
    "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll",
    "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's",
    "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on",
    "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own",
    "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some",
    "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then",
    "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this",
    "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we",
    "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's",
    "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with",
    "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
    "yourself", "yourselves", "also", "said", "mr", "mrs", "inc", "co", "reuters", "ap"
}


def tokenize_words(text: str) -> List[str]:
    words = re.findall(r"\b[A-Za-z0-9_-]{2,}\b", text.lower())
    return [w for w in words if w not in STOPWORDS]


def split_sentences(text: str) -> List[str]:
    cleaned = re.sub(r"\s+", " ", text).strip()
    if not cleaned:
        return []
    # Match sentence boundaries ending in '.', '!', '?'
    sentences = re.split(r"(?<=[.!?])\s+(?=[A-Z0-9\"'‘“])", cleaned)
    valid_sentences = []
    for s in sentences:
        s = s.strip()
        # Filter out trivial fragments (less than 15 chars or 3 words)
        if len(s) >= 15 and len(s.split()) >= 3:
            valid_sentences.append(s)
    return valid_sentences


def summarize_extractive(request: SummarizationRequest) -> SummarizationResponse:
    title = (request.title or "").strip()
    description = (request.description or "").strip()
    excerpt = (request.content_excerpt or "").strip()

    source_text = ""
    source_type = "available_excerpt"
    is_truncated = True

    if excerpt and len(excerpt) > len(description):
        source_text = f"{title}. {description}. {excerpt}"
        source_type = "available_excerpt"
        label = "Summary of available excerpt (Extractive NLP)"
    elif description:
        source_text = f"{title}. {description}"
        source_type = "headline_description_only"
        label = "Summary of article headline and description (Extractive NLP)"
    elif title:
        source_text = title
        source_type = "headline_only"
        label = "Headline only (Full article text unavailable on free API plan)"
    else:
        return SummarizationResponse(
            summary="No article text available to summarize.",
            source_type="empty",
            sentence_count=0,
            is_truncated=False,
            label="Summary unavailable"
        )

    sentences = split_sentences(source_text)

    # If 1 or 2 sentences total, return as is
    if len(sentences) <= request.max_sentences:
        joined_summary = " ".join(sentences)
        return SummarizationResponse(
            summary=joined_summary if joined_summary else title,
            source_type=source_type,
            sentence_count=len(sentences),
            is_truncated=is_truncated,
            label=label
        )

    # Calculate Word Frequencies across all sentences
    all_words = []
    sentence_tokens = []
    for s in sentences:
        tokens = tokenize_words(s)
        sentence_tokens.append(tokens)
        all_words.extend(tokens)

    word_freq = Counter(all_words)
    max_freq = max(word_freq.values()) if word_freq else 1
    # Normalized term weights
    word_weights = {w: count / max_freq for w, count in word_freq.items()}

    title_words = set(tokenize_words(title))

    # Sentence scoring
    sentence_scores: List[Tuple[int, float, str]] = []
    for idx, (sentence, tokens) in enumerate(zip(sentences, sentence_tokens)):
        if not tokens:
            continue
        # Base salience score
        raw_score = sum(word_weights.get(w, 0.0) for w in tokens)
        length_penalty = math.sqrt(len(tokens))
        salience = raw_score / (length_penalty + 1e-5)

        # Title keyword boost (sentences that echo the headline are salient)
        title_overlap = sum(1 for w in tokens if w in title_words)
        title_boost = 1.0 + (0.35 * title_overlap)

        # Position weight (journalistic inverted pyramid: lead sentences carry high importance)
        position_weight = 1.0 / math.sqrt(idx + 1)

        final_score = salience * title_boost * (0.7 + 0.3 * position_weight)
        sentence_scores.append((idx, final_score, sentence))

    if not sentence_scores:
        return SummarizationResponse(
            summary=description if description else title,
            source_type=source_type,
            sentence_count=1,
            is_truncated=is_truncated,
            label=label
        )

    # Pick top N sentences by score
    sorted_by_score = sorted(sentence_scores, key=lambda x: x[1], reverse=True)
    top_n = sorted_by_score[:request.max_sentences]

    # Reorder top sentences chronologically to preserve discourse cohesion
    top_chronological = sorted(top_n, key=lambda x: x[0])
    summary_text = " ".join(item[2] for item in top_chronological)

    return SummarizationResponse(
        summary=summary_text,
        source_type=source_type,
        sentence_count=len(top_chronological),
        is_truncated=is_truncated,
        label=label
    )
