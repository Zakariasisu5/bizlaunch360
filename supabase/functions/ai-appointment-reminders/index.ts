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
    const { appointment, businessInfo, reminderType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const reminderTypes: Record<string, string> = {
      '24h': 'a reminder for tomorrow',
      '1h': 'a reminder for 1 hour from now',
      '1week': 'a reminder for next week',
      'confirmation': 'a booking confirmation'
    };

    const systemPrompt = `You are a friendly appointment reminder assistant. Write short, clear reminder messages.

Guidelines:
- Keep messages under 80 words
- Include the appointment date, time, and service
- Be warm but professional
- Include any preparation instructions if relevant
- End with a way to contact if they need to reschedule`;

    const userPrompt = `Write ${reminderTypes[reminderType] || 'an appointment reminder'} for:

Business: ${businessInfo?.name || 'Our Business'}
Customer: ${appointment?.customerName || 'Valued Customer'}
Service: ${appointment?.serviceName || 'Appointment'}
Date: ${appointment?.date || 'Scheduled date'}
Time: ${appointment?.time || 'Scheduled time'}
Duration: ${appointment?.duration || 60} minutes
${appointment?.notes ? `Notes: ${appointment.notes}` : ''}

Generate just the reminder message text.`;

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
    const reminder = data.choices?.[0]?.message?.content?.trim();

    return new Response(JSON.stringify({ reminder }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-appointment-reminders:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
