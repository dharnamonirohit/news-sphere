// supabase/functions/fetch-news/index.ts
// GNews API Integration & Normalization Edge Function

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

interface GNewsArticle {
  title: string;
  description: string;
  content?: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: {
    name: string;
    url?: string;
  };
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GNEWS_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "GNEWS_API_KEY is not configured in server environment. Switch to Demo Mode or configure your API key.",
          code: "MISSING_API_KEY",
          articles: []
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const url = new URL(req.url);
    const query = url.searchParams.get("q");
    const category = url.searchParams.get("category") || "general";
    const lang = url.searchParams.get("lang") || "en";
    const country = url.searchParams.get("country") || "in";
    const max = url.searchParams.get("max") || "10";

    let targetUrl: string;
    if (query) {
      targetUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${lang}&country=${country}&max=${max}&apikey=${apiKey}`;
    } else {
      targetUrl = `https://gnews.io/api/v4/top-headlines?category=${encodeURIComponent(category.toLowerCase())}&lang=${lang}&country=${country}&max=${max}&apikey=${apiKey}`;
    }

    const gnewsRes = await fetch(targetUrl);
    if (!gnewsRes.ok) {
      const errText = await gnewsRes.text();
      return new Response(
        JSON.stringify({
          error: `GNews API responded with status ${gnewsRes.status}`,
          details: errText,
          code: "PROVIDER_ERROR"
        }),
        {
          status: gnewsRes.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const data: GNewsResponse = await gnewsRes.json();
    const normalizedArticles = (data.articles || []).map((art, idx) => ({
      provider: "gnews",
      external_id: `gnews-${encodeURIComponent(art.url)}`,
      canonical_url: art.url,
      title: art.title,
      description: art.description,
      content_excerpt: art.content || art.description || "",
      image_url: art.image || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80",
      source_name: art.source?.name || "Live Wire",
      author: null,
      published_at: art.publishedAt || new Date().toISOString(),
      category: category.charAt(0).toUpperCase() + category.slice(1),
      language: lang,
      country: country,
      is_demo: false
    }));

    return new Response(
      JSON.stringify({
        totalArticles: data.totalArticles || normalizedArticles.length,
        articles: normalizedArticles
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal Edge Function Error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
