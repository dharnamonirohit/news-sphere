// supabase/functions/refresh-news/index.ts
// Controlled News Ingestion and In-Database Synchronization

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const apiKey = Deno.env.get("GNEWS_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase configuration in environment" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GNEWS_API_KEY is not configured", code: "MISSING_API_KEY" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const categoriesToRefresh = ["technology", "business", "sports", "science", "general"];
    let totalInserted = 0;
    const errors: string[] = [];

    for (const cat of categoriesToRefresh) {
      try {
        const url = `https://gnews.io/api/v4/top-headlines?category=${cat}&lang=en&country=in&max=10&apikey=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
          errors.push(`Failed category ${cat}: status ${response.status}`);
          continue;
        }

        const data = await response.json();
        const articles = data.articles || [];

        for (const art of articles) {
          if (!art.url || !art.title) continue;

          const categoryDisplay = cat === "general" ? "World News" : cat.charAt(0).toUpperCase() + cat.slice(1);
          const { error: upsertErr } = await supabase.from("articles").upsert(
            {
              canonical_url: art.url,
              provider: "gnews",
              title: art.title,
              description: art.description || "",
              content_excerpt: art.content || art.description || "",
              image_url: art.image || null,
              source_name: art.source?.name || "Live Publisher",
              published_at: art.publishedAt || new Date().toISOString(),
              category: categoryDisplay,
              language: "en",
              country: "in",
              is_demo: false,
              updated_at: new Date().toISOString()
            },
            { onConflict: "canonical_url" }
          );

          if (!upsertErr) {
            totalInserted++;
          }
        }
      } catch (catErr: any) {
        errors.push(`Error in category ${cat}: ${catErr.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        articlesSynced: totalInserted,
        errors: errors.length > 0 ? errors : undefined
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to execute refresh-news" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
