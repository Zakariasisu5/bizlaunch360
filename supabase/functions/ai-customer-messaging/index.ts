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
    const { messageType, customerInfo, businessInfo, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const messageTypes: Record<string, string> = {
      'follow-up': 'a friendly follow-up message to check in with the customer',
      'reminder': 'a polite reminder about an upcoming appointment or payment',
      'confirmation': 'a confirmation message for a booking or order',
      'thank-you': 'a genuine thank you message for their business',
      'promotion': 'a personalized promotional message about a special offer',
      'reply': 'a professional and helpful reply to their inquiry'
    };

    const systemPrompt = `You are a friendly business communication assistant. Write short, professional messages that sound natural and personal - not robotic.

Guidelines:
- Keep messages under 100 words
- Use a warm, professional tone
- Include the customer's name when provided
- Be specific to the business type
- End with a clear call-to-action when appropriate
- Don't use excessive exclamation marks or emojis`;

    const userPrompt = `Write ${messageTypes[messageType] || 'a professional message'} for:

Business: ${businessInfo?.name || 'Our Business'} (${businessInfo?.type || 'Service Business'})
Customer: ${customerInfo?.name || 'Valued Customer'}
${customerInfo?.email ? `Email: ${customerInfo.email}` : ''}
${context ? `Context: ${context}` : ''}

Generate just the message text, ready to send.`;

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
    const message = data.choices?.[0]?.message?.content?.trim();

    return new Response(JSON.stringify({ message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-customer-messaging:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
