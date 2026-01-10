// Supabase Edge Function: unsubscribe
// Handles newsletter unsubscribe requests
// Deploy: supabase functions deploy unsubscribe

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const SITE_URL = Deno.env.get("SITE_URL") || "https://metegunes.com";

Deno.serve(async (req: Request) => {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };

    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Supabase credentials not configured");
        }

        // Get token from query params
        const url = new URL(req.url);
        const token = url.searchParams.get("token");

        if (!token) {
            return new Response(getHtmlResponse("error", "Geçersiz bağlantı"), {
                headers: { "Content-Type": "text/html; charset=utf-8" },
                status: 400,
            });
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Find token
        const { data: tokenData, error: tokenError } = await supabase
            .from("unsubscribe_tokens")
            .select("*, newsletter_subscribers(*)")
            .eq("token", token)
            .is("used_at", null)
            .single();

        if (tokenError || !tokenData) {
            return new Response(getHtmlResponse("error", "Bu bağlantı geçersiz veya daha önce kullanılmış."), {
                headers: { "Content-Type": "text/html; charset=utf-8" },
                status: 400,
            });
        }

        // Update subscriber status
        await supabase
            .from("newsletter_subscribers")
            .update({
                status: "unsubscribed",
                unsubscribed_at: new Date().toISOString(),
            })
            .eq("id", tokenData.subscriber_id);

        // Mark token as used
        await supabase
            .from("unsubscribe_tokens")
            .update({ used_at: new Date().toISOString() })
            .eq("id", tokenData.id);

        return new Response(
            getHtmlResponse("success", "Bülten aboneliğiniz başarıyla iptal edildi."),
            {
                headers: { "Content-Type": "text/html; charset=utf-8" },
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error:", error);
        return new Response(getHtmlResponse("error", "Bir hata oluştu. Lütfen daha sonra tekrar deneyin."), {
            headers: { "Content-Type": "text/html; charset=utf-8" },
            status: 500,
        });
    }
});

function getHtmlResponse(type: "success" | "error", message: string): string {
    const bgColor = type === "success" ? "#10b981" : "#ef4444";
    const icon = type === "success" ? "✓" : "✕";

    return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bülten Aboneliği</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 48px;
      text-align: center;
      max-width: 400px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: ${bgColor};
      color: white;
      font-size: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }
    h1 {
      font-size: 24px;
      color: #18181b;
      margin-bottom: 12px;
    }
    p {
      color: #52525b;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    a {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
    }
    a:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1>${type === "success" ? "İşlem Tamamlandı" : "Hata Oluştu"}</h1>
    <p>${message}</p>
    <a href="${SITE_URL}">Ana Sayfaya Dön</a>
  </div>
</body>
</html>
`;
}
