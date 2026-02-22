import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import { z } from "npm:zod@3.22.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SendLiveGiftSchema = z.object({
  gift_id: z.string().uuid("Invalid gift_id format"),
  recipient_id: z.string().uuid("Invalid recipient_id format"),
  stream_id: z.string().uuid("Invalid stream_id format"),
  message: z.string().max(200, "Message too long").optional(),
  is_anonymous: z.boolean().optional().default(false),
});

type SendLiveGiftRequest = z.infer<typeof SendLiveGiftSchema>;

interface RpcResponse {
  success: boolean;
  error?: string;
  message?: string;
  data?: {
    transaction_id: string;
    gift_transaction_id: string;
    gift_name: string;
    amount: number;
    commission: number;
    net_amount: number;
    new_balance: number;
  };
  required?: number;
  available?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        success: false,
        error: "METHOD_NOT_ALLOWED",
        message: "Only POST requests are allowed",
      }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "UNAUTHORIZED",
          message: "Authorization header required",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "UNAUTHORIZED",
          message: "Invalid or expired token",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const body = await req.json();
    const validationResult = SendLiveGiftSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "VALIDATION_ERROR",
          message: "Invalid request data",
          details: validationResult.error.format(),
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const payload: SendLiveGiftRequest = validationResult.data;

    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      "rpc_send_live_gift",
      {
        p_gift_id: payload.gift_id,
        p_recipient_id: payload.recipient_id,
        p_stream_id: payload.stream_id,
        p_message: payload.message || null,
        p_is_anonymous: payload.is_anonymous,
      }
    );

    if (rpcError) {
      console.error("RPC Error:", rpcError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "RPC_ERROR",
          message: "Failed to execute transaction",
          details: rpcError.message,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const result = rpcResult as RpcResponse;

    if (!result.success) {
      const statusCode =
        result.error === "INSUFFICIENT_BALANCE"
          ? 402
          : result.error === "NOT_AUTHENTICATED"
          ? 401
          : result.error === "INVALID_RECIPIENT" ||
            result.error === "GIFT_NOT_FOUND" ||
            result.error === "RECIPIENT_NOT_FOUND"
          ? 400
          : 500;

      return new Response(JSON.stringify(result), {
        status: statusCode,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
