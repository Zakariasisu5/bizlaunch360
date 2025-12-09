import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessInfo, budget, targetAudience } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a creative marketing advisor for small businesses. Generate practical, low-cost marketing ideas.

Respond with a JSON array of 5 marketing ideas:
[
  {
    "title": "Short idea title",
    "description": "2-3 sentence description of the idea",
    "effort": "low" | "medium" | "high",
    "cost": "free" | "$" | "$$",
    "timeframe": "immediate" | "this week" | "this month",
    "expectedImpact": "Short description of expected results"
  }
]

Focus on actionable ideas that a solo entrepreneur or small team can implement quickly.`;

    const userPrompt = `Generate 5 marketing ideas for this business:

Business Type: ${businessInfo?.type || 'Small Business'}
Industry: ${businessInfo?.industry || 'General'}
Location: ${businessInfo?.location || 'Local'}
Target Audience: ${targetAudience || 'General consumers'}
Marketing Budget: ${budget || 'Low budget'}
Current Customers: ${businessInfo?.customerCount || 'Starting out'}

Focus on practical ideas they can start today with minimal resources.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    let ideas;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      ideas = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      ideas = [];
    }

    return new Response(JSON.stringify({ ideas }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-marketing-ideas:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
