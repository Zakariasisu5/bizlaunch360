import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { prompt, type = 'general' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompts: Record<string, string> = {
      general: `You are a professional business content generator for BizLaunch360. Generate clear, practical business content that is actionable and professional.

CRITICAL FORMATTING RULES:
- Do NOT use any markdown formatting (no hashtags, asterisks, bullet points with dashes, or special characters)
- Write in clear, professional paragraphs
- Use numbered lists only when listing specific steps or items (1. 2. 3.)
- Keep content practical, specific, and actionable`,

      business: `You are a business plan expert for BizLaunch360. Generate professional, investor-ready business plan content.

Your expertise includes:
- Executive summaries and business descriptions
- Market analysis and competitive positioning
- Financial projections and funding strategies
- Organizational structure and team planning
- Marketing and sales strategies

CRITICAL FORMATTING RULES:
- Do NOT use any markdown formatting (no hashtags, asterisks, bullet points with dashes, or special characters)
- Write in clear, professional paragraphs
- Use numbered lists only when listing specific steps or items (1. 2. 3.)
- Be specific and include realistic numbers where applicable
- Focus on actionable, practical content`,

      marketing: `You are a marketing strategist for BizLaunch360. Generate compelling marketing strategies and content tailored for small and medium businesses.

Your expertise includes:
- Brand positioning and messaging
- Customer acquisition strategies
- Digital marketing (SEO, PPC, social media)
- Sales funnel optimization
- Customer retention programs

CRITICAL FORMATTING RULES:
- Do NOT use any markdown formatting (no hashtags, asterisks, bullet points with dashes, or special characters)
- Write in clear, professional paragraphs
- Use numbered lists only when listing specific steps or items (1. 2. 3.)
- Include specific tactics and realistic budget estimates
- Focus on ROI and measurable outcomes`,
    };

    console.log('Generating content with type:', type);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompts[type] || systemPrompts.general },
          { role: 'user', content: prompt }
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment and try again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage limit reached. Please add credits to your account.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Generate content error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
