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
    const { businessInfo, financialData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a financial advisor AI for small businesses. Based on the provided business and financial data, generate a concise financial forecast.

Provide your response in this JSON format:
{
  "revenueProjection": { "month1": number, "month3": number, "month6": number, "month12": number },
  "expenseProjection": { "month1": number, "month3": number, "month6": number, "month12": number },
  "profitProjection": { "month1": number, "month3": number, "month6": number, "month12": number },
  "insights": ["insight1", "insight2", "insight3"],
  "recommendations": ["rec1", "rec2", "rec3"]
}

Keep insights and recommendations short (1 sentence each), practical, and actionable for small business owners.`;

    const userPrompt = `Business Information:
- Business Type: ${businessInfo?.businessType || 'General Business'}
- Industry: ${businessInfo?.industry || 'Not specified'}
- Monthly Revenue: $${financialData?.monthlyRevenue || 0}
- Monthly Expenses: $${financialData?.monthlyExpenses || 0}
- Total Customers: ${financialData?.totalCustomers || 0}
- Average Transaction: $${financialData?.averageTransaction || 0}

Generate a realistic 12-month financial forecast based on this data.`;

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
    
    // Try to parse as JSON, fallback to raw content
    let forecast;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      forecast = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: content };
    } catch {
      forecast = { raw: content };
    }

    return new Response(JSON.stringify({ forecast }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-financial-forecast:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
