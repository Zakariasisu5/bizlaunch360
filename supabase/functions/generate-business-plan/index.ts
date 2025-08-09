import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { title, context } = await req.json();

    if (!title || typeof title !== 'string') {
      throw new Error('A valid title is required');
    }

    const systemPrompt = `You are a seasoned business consultant. Create or improve a complete small-business plan.
Return ONLY raw JSON with these exact keys: executiveSummary, businessDescription, marketAnalysis, organization, products, marketing, funding, financials.
Do not include markdown fences or extra text. Keep each section concise but practical and actionable.`;

    const userPrompt = `Business plan title: ${title}\n\nExisting content (empty strings mean missing):\n${JSON.stringify(context || {}, null, 2)}\n\nGoals:\n- Improve provided sections for clarity, realism, and impact\n- Fill any missing sections with sensible assumptions\n- Use clear headings and bullet points where appropriate\n- Be specific to the business title if no other info provided\n\nReturn strictly valid JSON.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 1200,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || '';

    let plan;
    try {
      // Ensure we only parse raw JSON
      const cleaned = content.replace(/^```json\n?|```$/g, '').trim();
      plan = JSON.parse(cleaned);
    } catch (e) {
      throw new Error('Failed to parse AI response as JSON');
    }

    // Basic shape guard
    const keys = [
      'executiveSummary',
      'businessDescription',
      'marketAnalysis',
      'organization',
      'products',
      'marketing',
      'funding',
      'financials',
    ];
    for (const k of keys) {
      if (typeof plan[k] !== 'string') plan[k] = '';
    }

    return new Response(JSON.stringify({ plan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-business-plan:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unexpected error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});