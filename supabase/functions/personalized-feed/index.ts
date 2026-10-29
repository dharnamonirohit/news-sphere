// supabase/functions/personalized-feed/index.ts
// Secure Personalized Feed Generation Edge Function

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const pyServiceUrl = Deno.env.get("RECOMMENDATION_SERVICE_URL") || "http://127.0.0.1:8000";

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ error: "Supabase environment not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Authenticate user with their token
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized user session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const categoryFilter = body.category_filter || null;
    const limit = body.limit || 20;

    // Use service client to retrieve user records and candidate articles
    const adminClient = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : userClient;

    // 1. Fetch user interests
    const { data: interests } = await adminClient
      .from("user_interests")
      .select("category, initial_preference_score, learned_interest_score")
      .eq("user_id", user.id);

    // 2. Fetch user settings for diversity
    const { data: settings } = await adminClient
      .from("user_settings")
      .select("diversity_level, personalization_enabled")
      .eq("user_id", user.id)
      .single();

    // 3. Fetch recent interactions
    const { data: interactions } = await adminClient
      .from("user_interactions")
      .select("article_id, interaction_type, reading_duration_seconds, articles(title, category)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    // 4. Fetch candidate articles
    let articlesQuery = adminClient
      .from("articles")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(60);

    if (categoryFilter && categoryFilter.toLowerCase() !== "all") {
      articlesQuery = articlesQuery.eq("category", categoryFilter);
    }

    const { data: candidateArticles, error: artErr } = await articlesQuery;
    if (artErr || !candidateArticles) {
      return new Response(
        JSON.stringify({ error: "Failed to retrieve articles", details: artErr }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format for Python Recommendation Engine
    const pyPayload = {
      user_id: user.id,
      articles: candidateArticles.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description || "",
        content_excerpt: a.content_excerpt || "",
        category: a.category,
        source_name: a.source_name,
        image_url: a.image_url,
        canonical_url: a.canonical_url,
        publication_date: a.published_at
      })),
      interests: (interests || []).map(i => ({
        category: i.category,
        initial_preference: i.initial_preference_score,
        learned_score: i.learned_interest_score
      })),
      interactions: (interactions || []).map(inter => ({
        article_id: inter.article_id,
        interaction_type: inter.interaction_type,
        reading_time_seconds: inter.reading_duration_seconds || 0,
        article_title: (inter as any).articles?.title || null,
        category: (inter as any).articles?.category || null
      })),
      diversity_weight: settings?.diversity_level ?? 0.25,
      category_filter: categoryFilter,
      limit: limit
    };

    // Forward to Python recommendation service
    try {
      const pyResponse = await fetch(`${pyServiceUrl}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pyPayload),
        signal: AbortSignal.timeout(4000)
      });

      if (pyResponse.ok) {
        const pyResult = await pyResponse.json();
        return new Response(JSON.stringify(pyResult), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    } catch {
      // Python service unavailable: execute deterministic fallback ranking
    }

    // Deterministic Fallback Ranking (Interest Match + Recency)
    const userCategoryScores: Record<string, number> = {};
    (interests || []).forEach(i => {
      userCategoryScores[i.category] = (i.initial_preference_score || 1.0) + (i.learned_interest_score || 0.0);
    });

    const scoredFallback = candidateArticles.map(art => {
      const pref = userCategoryScores[art.category] || 0.1;
      const hoursAgo = Math.max(0, (Date.now() - new Date(art.published_at).getTime()) / 3600000);
      const recency = Math.exp(-0.015 * hoursAgo);
      const score = Math.round((pref * 0.7 + recency * 0.3) * 1000) / 1000;

      let reason = `Top trending story in ${art.category}.`;
      if (userCategoryScores[art.category]) {
        reason = `Matches your selected interest in ${art.category}.`;
      }

      return {
        article: {
          id: art.id,
          title: art.title,
          description: art.description,
          content_excerpt: art.content_excerpt,
          category: art.category,
          source_name: art.source_name,
          image_url: art.image_url,
          canonical_url: art.canonical_url,
          publication_date: art.published_at
        },
        score: score,
        scores: {
          category_score: pref,
          behavioral_score: 0.0,
          content_similarity_score: 0.0,
          recency_score: Math.round(recency * 1000) / 1000,
          combined_score: score
        },
        reason: reason,
        is_diversity_boosted: false
      };
    });

    scoredFallback.sort((a, b) => b.score - a.score);

    return new Response(
      JSON.stringify({
        items: scoredFallback.slice(0, limit),
        total_evaluated: candidateArticles.length,
        algorithm_version: "Edge-Fallback-CategoryRecency-v1.0"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to generate personalized feed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
