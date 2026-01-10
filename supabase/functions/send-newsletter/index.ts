// Supabase Edge Function: send-newsletter
// Resend API ile email gönderir
// Deploy: supabase functions deploy send-newsletter

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const FROM_EMAIL = Deno.env.get("NEWSLETTER_FROM_EMAIL") || "noreply@metegunes.com";
const FROM_NAME = Deno.env.get("NEWSLETTER_FROM_NAME") || "Mete Güneş";
const SITE_URL = Deno.env.get("SITE_URL") || "https://metegunes.com";

interface SendRequest {
    campaignId: string;
}

interface Subscriber {
    id: string;
    email: string;
    name: string | null;
}

interface Campaign {
    id: string;
    subject: string;
    content_html: string;
    content_text: string | null;
    total_recipients: number;
}

interface UnsubscribeToken {
    token: string;
}

Deno.serve(async (req: Request) => {
    // CORS headers
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };

    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // Validate environment
        if (!RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY is not configured");
        }

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Supabase credentials not configured");
        }

        const { campaignId }: SendRequest = await req.json();

        if (!campaignId) {
            throw new Error("Campaign ID is required");
        }

        // Create Supabase client with service role
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Get campaign
        const { data: campaign, error: campaignError } = await supabase
            .from("email_campaigns")
            .select("*")
            .eq("id", campaignId)
            .single();

        if (campaignError || !campaign) {
            throw new Error("Campaign not found");
        }

        if (campaign.status !== "draft" && campaign.status !== "scheduled") {
            throw new Error("Campaign is not in sendable state");
        }

        // Update campaign status to sending
        await supabase
            .from("email_campaigns")
            .update({ status: "sending" })
            .eq("id", campaignId);

        // Get active subscribers
        const { data: subscribers, error: subError } = await supabase
            .from("newsletter_subscribers")
            .select("id, email, name")
            .eq("status", "active")
            .is("deleted_at", null);

        if (subError) {
            throw new Error("Failed to fetch subscribers");
        }

        const subscriberList: Subscriber[] = subscribers || [];
        let delivered = 0;
        let failed = 0;

        // Send emails in batches
        const batchSize = 10;
        for (let i = 0; i < subscriberList.length; i += batchSize) {
            const batch = subscriberList.slice(i, i + batchSize);

            await Promise.all(
                batch.map(async (subscriber) => {
                    try {
                        // Get or create unsubscribe token
                        let { data: tokenData } = await supabase
                            .from("unsubscribe_tokens")
                            .select("token")
                            .eq("subscriber_id", subscriber.id)
                            .is("used_at", null)
                            .single();

                        if (!tokenData) {
                            // Create new token
                            const token = crypto.randomUUID().replace(/-/g, "") +
                                crypto.randomUUID().replace(/-/g, "");

                            await supabase
                                .from("unsubscribe_tokens")
                                .insert({ subscriber_id: subscriber.id, token });

                            tokenData = { token };
                        }

                        const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?token=${tokenData.token}`;

                        // Replace placeholder in HTML
                        const personalizedHtml = campaign.content_html.replace(
                            "{{unsubscribe_url}}",
                            unsubscribeUrl
                        );

                        // Send via Resend
                        const response = await fetch("https://api.resend.com/emails", {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${RESEND_API_KEY}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                from: `${FROM_NAME} <${FROM_EMAIL}>`,
                                to: subscriber.email,
                                subject: campaign.subject,
                                html: personalizedHtml,
                                text: campaign.content_text || undefined,
                            }),
                        });

                        const resendResult = await response.json();

                        // Log the send
                        await supabase.from("email_send_log").insert({
                            campaign_id: campaignId,
                            subscriber_id: subscriber.id,
                            email: subscriber.email,
                            status: response.ok ? "sent" : "failed",
                            resend_id: resendResult.id || null,
                            sent_at: new Date().toISOString(),
                            error_message: response.ok ? null : JSON.stringify(resendResult),
                        });

                        if (response.ok) {
                            delivered++;
                        } else {
                            failed++;
                            console.error(`Failed to send to ${subscriber.email}:`, resendResult);
                        }
                    } catch (error) {
                        failed++;
                        console.error(`Failed to send to ${subscriber.email}:`, error);

                        await supabase.from("email_send_log").insert({
                            campaign_id: campaignId,
                            subscriber_id: subscriber.id,
                            email: subscriber.email,
                            status: "failed",
                            error_message: String(error),
                        });
                    }
                })
            );

            // Small delay between batches to avoid rate limits
            if (i + batchSize < subscriberList.length) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }

        // Update campaign stats
        await supabase
            .from("email_campaigns")
            .update({
                status: failed === subscriberList.length ? "failed" : "sent",
                sent_at: new Date().toISOString(),
                total_recipients: subscriberList.length,
                delivered: delivered,
            })
            .eq("id", campaignId);

        return new Response(
            JSON.stringify({
                success: true,
                total: subscriberList.length,
                delivered,
                failed,
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error:", error);

        return new Response(
            JSON.stringify({ error: String(error) }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
            }
        );
    }
});
