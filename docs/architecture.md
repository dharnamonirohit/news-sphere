# NewsSphere System Architecture & Engineering Specifications

## 1. System Overview

**NewsSphere** is an AI-powered personalized and explainable news recommendation system. It solves the modern challenge of digital information overload by pairing external news aggregation with a multi-signal content-based recommendation engine.

```
                           +----------------------------------------+
                           |           User Web Browser             |
                           |  (React 18 + Vite + Tailwind + Router) |
                           +-------------------+--------------------+
                                               |
                     +-------------------------+-------------------------+
                     |                                                   |
                     v                                                   v
         +-----------------------+                           +-----------------------+
         |   Supabase Backend    |                           |  Python FastAPI AI    |
         | (PostgreSQL + RLS)    |                           | (TF-IDF + Cosine Sim) |
         +-----------+-----------+                           +-----------+-----------+
                     |                                                   |
                     v                                                   v
        +-------------------------+                         +-------------------------+
        | Supabase Edge Functions |                         | Extractive NLP Summaries|
        | - fetch-news            |                         | Explainable AI Rationale|
        | - refresh-news          |                         | Diversity MMR Reranker  |
        | - summarize-article     |                         +-------------------------+
        | - personalized-feed     |
        +------------+------------+
                     |
                     v
             +---------------+
             |   GNews API   |
             +---------------+
```

---

## 2. Recommendation Algorithm Mathematical Model

The ranking score of candidate article $a$ for user $u$ is computed as a weighted linear combination of four normalized components in $[0, 1]$:

$$\text{FinalScore}(u, a) = w_{\text{cat}} \cdot S_{\text{cat}}(u, a) + w_{\text{behav}} \cdot S_{\text{behav}}(u, a) + w_{\text{sim}} \cdot S_{\text{sim}}(u, a) + w_{\text{rec}} \cdot S_{\text{rec}}(a)$$

### Default Weights:
- $w_{\text{cat}} = 0.35$ (Explicit Category & Interest Match)
- $w_{\text{behav}} = 0.30$ (Behavioral Engagement Affinity)
- $w_{\text{sim}} = 0.20$ (Content TF-IDF Textual Cosine Similarity)
- $w_{\text{rec}} = 0.15$ (Publication Recency Exponential Decay)

### Component Formulations:

1. **Category Match ($S_{\text{cat}}$):**
   $$S_{\text{cat}}(u, a) = \frac{\text{InitialPref}(u, \text{cat}_a) + \text{LearnedScore}(u, \text{cat}_a)}{\max_{c} (\text{InitialPref}(u, c) + \text{LearnedScore}(u, c))}$$

2. **Behavioral Engagement ($S_{\text{behav}}$):**
   Aggregates user interaction signals:
   $$\text{RawScore}(u, c) = \sum_{i \in \text{Interactions}(u, c)} \text{weight}(i)$$
   - `LIKE`: $+3.0$
   - `BOOKMARK`: $+2.5$
   - `READ`: $+1.5$ (boosted by dwell time if $>30\text{s}$)
   - `CLICK`: $+1.0$
   - `SKIP`: $-2.0$

3. **Content Similarity ($S_{\text{sim}}$):**
   Computes the Cosine Similarity between the TF-IDF vector of candidate article $a$ and the concatenated text profile of articles positively interacted with by user $u$:
   $$\cos(\vec{v}_u, \vec{v}_a) = \frac{\vec{v}_u \cdot \vec{v}_a}{\|\vec{v}_u\|_2 \|\vec{v}_a\|_2}$$

4. **Recency Decay ($S_{\text{rec}}$):**
   $$S_{\text{rec}}(a) = \exp\left(-\frac{\ln 2}{48} \cdot \Delta t_{\text{hours}}\right)$$
   Where $\Delta t_{\text{hours}}$ is the elapsed hours since publication, modeling a 48-hour information half-life.

---

## 3. Diversity-Aware Re-ranking (MMR)

To eliminate the "filter bubble" problem where a user is only shown a single category repeatedly, NewsSphere executes dynamic Maximal Marginal Relevance (MMR):

$$\text{NextPick} = \arg\max_{a \in R} \left[ \text{Score}(u, a) - \lambda_{\text{div}} \cdot \text{Freq}(\text{cat}_a) - \text{Penalty}_{\text{adjacent}} + \text{Bonus}_{\text{novelty}} \right]$$

- Proportions: Approximately $70\%$ top personalized matches, $20\%$ related topics, and $10\%$ exploratory topics.

---

## 4. Extractive Text Summarization

NewsSphere adheres to honest AI principles:
- GNews and public news feeds supply licensed article excerpts and descriptions rather than full proprietary publisher text.
- Extractive summarization ranks sentences using word-frequency salience:
  $$\text{Salience}(S) = \frac{\sum_{w \in S} f(w)}{\text{length}(S)}$$
- The output is clearly labeled: `"Summary of available excerpt (Extractive NLP)"`. We never synthesize fabricated facts or claim access beyond public excerpts.
