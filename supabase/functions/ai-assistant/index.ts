import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { message, conversation = [] } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const systemPrompt = `You are an AI assistant for BizLaunch360, a comprehensive business success platform. You help entrepreneurs and business owners understand how to use the platform's features effectively.

BizLaunch360 offers the following key features:

1. **AI-Powered Business Plans**: Generate comprehensive business plans in minutes with intelligent AI assistance
2. **Professional Invoicing**: Create beautiful invoices and get paid faster with integrated Stripe payments
3. **Smart Appointment Booking**: 24/7 customer booking system with intuitive scheduling
4. **Customer Management (CRM)**: Track interactions and build stronger customer relationships
5. **Real-time Analytics Dashboard**: Monitor revenue, expenses, and business growth
6. **Business Setup Assistant**: Help with registration, EIN applications, and compliance for US entrepreneurs

The platform includes these main sections:
- Dashboard: Overview of business metrics and quick actions
- Business Plan: AI-powered business plan generation and management
- Finance: Invoicing, expense tracking, and financial analytics
- Appointments: Scheduling system and calendar management
- CRM: Customer relationship management and contact tracking
- Settings: Account configuration and preferences

You should:
- Be helpful and knowledgeable about business topics
- Guide users through platform features
- Provide practical business advice
- Be encouraging and supportive to entrepreneurs
- Keep responses concise but informative
- Focus on how BizLaunch360 can solve their specific business challenges

Always maintain a professional yet friendly tone, and remember you're helping entrepreneurs succeed with their business goals.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      conversation: [...messages.slice(1), { role: 'assistant', content: aiResponse }]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred processing your request'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});