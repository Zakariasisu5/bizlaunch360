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
    const { businessData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a smart business assistant that suggests actionable tasks for small business owners.

Respond with a JSON array of 5 task suggestions:
[
  {
    "title": "Short task title",
    "description": "One sentence description",
    "priority": "high" | "medium" | "low",
    "category": "customers" | "finance" | "marketing" | "operations" | "appointments"
  }
]

Focus on practical, immediate actions the business owner can take today. Be specific based on the data provided.`;

    const userPrompt = `Based on this business data, suggest 5 priority tasks:

- Pending Invoices: ${businessData?.pendingInvoices || 0}
- Overdue Invoices: ${businessData?.overdueInvoices || 0}
- New Leads: ${businessData?.newLeads || 0}
- Upcoming Appointments: ${businessData?.upcomingAppointments || 0}
- Inactive Customers: ${businessData?.inactiveCustomers || 0}
- Days Since Last Marketing: ${businessData?.daysSinceLastMarketing || 'Unknown'}
- Outstanding Expenses: ${businessData?.outstandingExpenses || 0}

What should this business owner focus on right now?`;

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
    
    let tasks;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      tasks = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      tasks = [];
    }

    return new Response(JSON.stringify({ tasks }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-task-suggestions:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
