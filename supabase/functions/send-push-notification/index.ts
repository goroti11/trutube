import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PushPayload {
  notification_id: string;
  user_id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: PushPayload = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    // Get user's device tokens
    const preferencesRes = await fetch(
      `${supabaseUrl}/rest/v1/notification_preferences?user_id=eq.${payload.user_id}&select=fcm_token,apns_token`,
      {
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!preferencesRes.ok) {
      throw new Error("Failed to fetch user preferences");
    }

    const preferences = await preferencesRes.json();

    if (!preferences || preferences.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No preferences found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const userPrefs = preferences[0];
    const results: any[] = [];

    // Send to Android (FCM)
    if (userPrefs.fcm_token) {
      const fcmKey = Deno.env.get("FCM_SERVER_KEY");

      if (fcmKey) {
        try {
          const fcmResponse = await fetch("https://fcm.googleapis.com/fcm/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `key=${fcmKey}`,
            },
            body: JSON.stringify({
              to: userPrefs.fcm_token,
              notification: {
                title: payload.title,
                body: payload.body,
                sound: "default",
                priority: "high",
              },
              data: {
                notification_id: payload.notification_id,
                ...payload.data,
              },
            }),
          });

          const fcmResult = await fcmResponse.json();
          results.push({ platform: "android", success: fcmResponse.ok, result: fcmResult });

          // Update delivery log
          await fetch(`${supabaseUrl}/rest/v1/notification_delivery_log`, {
            method: "POST",
            headers: {
              "apikey": supabaseKey,
              "Authorization": `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              notification_id: payload.notification_id,
              channel: "push",
              status: fcmResponse.ok ? "delivered" : "failed",
              error_message: fcmResponse.ok ? null : JSON.stringify(fcmResult),
              delivered_at: fcmResponse.ok ? new Date().toISOString() : null,
            }),
          });
        } catch (error) {
          results.push({ platform: "android", success: false, error: error.message });
        }
      }
    }

    // Send to iOS (APNS)
    if (userPrefs.apns_token) {
      const apnsKey = Deno.env.get("APNS_KEY_ID");
      const apnsTeamId = Deno.env.get("APNS_TEAM_ID");
      const apnsKeyPath = Deno.env.get("APNS_KEY_PATH");

      if (apnsKey && apnsTeamId && apnsKeyPath) {
        try {
          // Note: This is a simplified version. In production, you'd need to:
          // 1. Generate JWT token with your APNS private key
          // 2. Use HTTP/2 to communicate with APNS
          // 3. Handle APNS-specific error responses

          // For now, we'll log that APNS is configured but not fully implemented
          results.push({
            platform: "ios",
            success: false,
            error: "APNS integration requires JWT generation (not implemented in edge function)"
          });
        } catch (error) {
          results.push({ platform: "ios", success: false, error: error.message });
        }
      }
    }

    const allSuccessful = results.every(r => r.success);

    return new Response(
      JSON.stringify({
        success: allSuccessful,
        results: results,
        message: allSuccessful
          ? "Notification sent to all devices"
          : "Notification sent to some devices",
      }),
      {
        status: allSuccessful ? 200 : 207,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending push notification:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
