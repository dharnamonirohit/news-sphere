// supabase/functions/summarize-article/index.ts
// AI Extractive Summarization Edge Function

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface SummarizePayload {
  title?: string;
  description?: string;
  content_excerpt?: string;
  max_sentences?: number;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: SummarizePayload = await req.json();
    const pythonServiceUrl = Deno.env.get("RECOMMENDATION_SERVICE_URL") || "http://127.0.0.1:8000";

    // Try Python FastAPI microservice first
    try {
      const pyRes = await fetch(`${pythonServiceUrl}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: payload.title || "",
          description: payload.description || "",
          content_excerpt: payload.content_excerpt || "",
          max_sentences: payload.max_sentences || 3
        }),
        signal: AbortSignal.timeout(3000)
      });

      if (pyRes.ok) {
        const data = await pyRes.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    } catch {
      // Fallback to local extractive summary logic below
    }

    // High-fidelity fallback extractive summarization
    const title = (payload.title || "").trim();
    const desc = (payload.description || "").trim();
    const excerpt = (payload.content_excerpt || "").trim();

    let combined = "";
    let label = "Summary of available excerpt (Extractive NLP)";
    let sourceType = "available_excerpt";

    if (excerpt && excerpt.length > desc.length) {
      combined = `${title}. ${desc}. ${excerpt}`;
      sourceType = "available_excerpt";
    } else if (desc) {
      combined = `${title}. ${desc}`;
      sourceType = "headline_description_only";
      label = "Summary of available description (Extractive NLP)";
    } else {
      combined = title;
      sourceType = "headline_only";
      label = "Headline only (Full publisher article text unavailable on free plan)";
    }

    // Split sentences
    const sentences = combined
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 20);

    const chosen = sentences.slice(0, payload.max_sentences || 3).join(" ");

    return new Response(
      JSON.stringify({
        summary: chosen || title || "No article text available to summarize.",
        source_type: sourceType,
        sentence_count: Math.min(sentences.length, payload.max_sentences || 3),
        is_truncated: true,
        label: label
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Summarization service failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
