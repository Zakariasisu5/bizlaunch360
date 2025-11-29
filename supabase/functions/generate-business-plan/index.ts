import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not set');
    }

    const { title, context, businessInfo } = await req.json();

    if (!title || typeof title !== 'string') {
      throw new Error('A valid title is required');
    }

    // Build business context string if business info is provided
    let businessContext = '';
    if (businessInfo) {
      businessContext = `
Business Information:
- Business Name: ${businessInfo.business_name || 'Not specified'}
- Business Type: ${businessInfo.business_type || 'Not specified'}
- Description: ${businessInfo.business_description || 'Not specified'}
- Location: ${businessInfo.business_address || 'Not specified'}
- Email: ${businessInfo.business_email || 'Not specified'}
- Phone: ${businessInfo.business_phone || 'Not specified'}
- Website: ${businessInfo.business_website || 'Not specified'}
`;
    }

    const systemPrompt = `You are an expert business consultant and strategist for BizLaunch360. Your role is to create comprehensive, investor-ready business plans that help entrepreneurs succeed.

CRITICAL FORMATTING RULES:
- Do NOT use any markdown formatting (no hashtags, asterisks, bullet points with dashes, or special characters)
- Write in clear, professional paragraphs
- Use numbered lists only when listing specific steps or items (1. 2. 3.)
- Keep content practical, specific, and actionable
- Focus on realistic projections and achievable goals

Your expertise covers:
- Market analysis and competitive positioning
- Financial planning and projections
- Business strategy and growth tactics
- Operations and organizational structure
- Funding and investor relations

Return ONLY raw JSON with these exact keys: executiveSummary, businessDescription, marketAnalysis, organization, products, marketing, funding, financials.
Do not include markdown fences or extra text.`;

    const userPrompt = `Create a comprehensive business plan for: ${title}
${businessContext}

Existing content to improve (empty strings mean generate new content):
${JSON.stringify(context || {}, null, 2)}

Requirements for each section:

1. executiveSummary: Write a compelling 2-3 paragraph executive summary including:
   - Mission statement and vision
   - Unique value proposition
   - Key success factors
   - Brief financial highlights
   - Growth potential

2. businessDescription: Provide detailed business description covering:
   - Business model and revenue streams
   - Products or services offered
   - Target customer personas
   - Competitive advantages
   - Industry positioning

3. marketAnalysis: Conduct thorough market analysis including:
   - Total Addressable Market (TAM), Serviceable Addressable Market (SAM), and Serviceable Obtainable Market (SOM)
   - Target market demographics and psychographics
   - Competitor analysis (at least 3 competitors with strengths/weaknesses)
   - Market trends and opportunities
   - SWOT analysis

4. organization: Detail the organizational structure:
   - Leadership team and key roles
   - Organizational hierarchy
   - Advisory board recommendations
   - Hiring plan for first year
   - Company culture and values

5. products: Describe products/services comprehensively:
   - Detailed product/service descriptions
   - Pricing strategy with justification
   - Product lifecycle and roadmap
   - Differentiation from competitors
   - Future product development plans

6. marketing: Create actionable marketing strategy:
   - Brand positioning statement
   - Marketing channels (digital, traditional, partnerships)
   - Customer acquisition strategy with costs
   - Sales funnel and conversion strategy
   - Customer retention and loyalty programs
   - First-year marketing budget allocation

7. funding: Detail funding requirements:
   - Total capital requirements with breakdown
   - Funding stages and milestones
   - Use of funds (specific allocations)
   - Potential funding sources
   - Investor value proposition and expected returns

8. financials: Provide realistic financial projections:
   - 3-year revenue projections by quarter
   - Expense forecasts and categorization
   - Break-even analysis with timeline
   - Key financial metrics (gross margin, net margin, CAC, LTV)
   - Cash flow summary
   - Key assumptions clearly stated

Make all content specific to the business type and title provided. Be realistic and practical.
Return strictly valid JSON.`;

    console.log('Generating business plan for:', title);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI Gateway error:', response.status, errText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a few moments.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage limit reached. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || '';

    let plan;
    try {
      // Clean up any markdown fences the AI might have added
      const cleaned = content.replace(/^```json\n?|```$/g, '').trim();
      plan = JSON.parse(cleaned);
    } catch (e) {
      console.error('JSON parse error:', e, 'Content:', content);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Ensure all required keys exist with proper types
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

    console.log('Business plan generated successfully');

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
