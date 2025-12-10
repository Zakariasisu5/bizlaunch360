import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendEmailRequest {
  to: string;
  subject: string;
  message: string;
  businessName?: string;
  businessEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message, businessName, businessEmail }: SendEmailRequest = await req.json();

    if (!to || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, message" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending email to ${to} with subject: ${subject}`);

    // Use business email if provided, otherwise use default
    const fromEmail = businessEmail || "onboarding@resend.dev";
    const fromName = businessName || "BizLaunch360";

    const emailResponse = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [to],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="white-space: pre-wrap; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</div>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
          <p style="color: #888; font-size: 12px; margin-top: 20px;">
            Sent via ${fromName}
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-customer-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
