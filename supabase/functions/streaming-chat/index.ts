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
    const { messages, businessInfo } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build business context for personalized responses
    let businessContext = '';
    if (businessInfo) {
      businessContext = `

The user's business information:
- Business Name: ${businessInfo.business_name || 'Not specified'}
- Business Type: ${businessInfo.business_type || 'Not specified'}
- Description: ${businessInfo.business_description || 'Not provided'}
- Location: ${businessInfo.business_address || 'Not specified'}

Use this information to provide personalized, relevant advice.`;
    }

    const systemPrompt = `You are BizLaunch360 AI, an expert business advisor and consultant. You specialize in helping entrepreneurs and small business owners succeed.

Your expertise includes:
1. Business Planning: Creating comprehensive business plans, executive summaries, and strategic roadmaps
2. Market Analysis: Analyzing target markets, competition, industry trends, and customer segments
3. Financial Planning: Revenue projections, expense management, break-even analysis, funding strategies
4. Business Strategy: Growth tactics, competitive positioning, operational efficiency
5. Marketing: Customer acquisition, brand positioning, digital marketing, sales strategies

IMPORTANT GUIDELINES:
- Provide practical, actionable advice tailored to small and medium businesses
- Be specific and give concrete examples when possible
- When discussing financials, use realistic numbers and explain your assumptions
- If you don't have enough information, ask clarifying questions
- Always consider the user's business type and context when giving advice

FORMATTING RULES:
- Do NOT use markdown formatting (no hashtags, asterisks, bullet points with dashes)
- Write in clear, professional paragraphs
- Use numbered lists only when listing specific steps (1. 2. 3.)
- Keep responses focused and easy to read
${businessContext}`;

    console.log('Starting streaming chat with business context:', !!businessInfo);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
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
      
      return new Response(
        JSON.stringify({ error: 'AI gateway error. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Streaming chat error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
