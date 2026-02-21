import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const eventSchema = z.object({
  client_event_id: z.string().uuid('Invalid client_event_id format'),
  node_id: z.string().uuid('Invalid node_id format').optional(),
  event_type: z.enum([
    'view',
    'swipe_up',
    'swipe_down',
    'swipe_left',
    'swipe_right',
    'cta_click',
    'full_video_click',
    'like',
    'comment',
    'share',
    'pause',
    'resume',
    'seek',
    'quality_change',
    'exit',
  ]),
  watch_seconds: z.number().int().min(0).optional().default(0),
  completed: z.boolean().optional().default(false),
  occurred_at: z.string().datetime().optional(),
  event_data: z.record(z.unknown()).optional().default({}),
});

const requestSchema = z.object({
  flow_id: z.string().uuid('Invalid flow_id format'),
  session_id: z.string().uuid('Invalid session_id format'),
  events: z
    .array(eventSchema)
    .min(1, 'At least one event is required')
    .max(50, 'Maximum 50 events allowed per batch'),
});

interface FlowEventsResponse {
  success: boolean;
  processed_count: number;
  errors: string[];
}

interface ErrorResponse {
  code: string;
  error: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        code: 'METHOD_NOT_ALLOWED',
        error: 'Only POST method is allowed',
      } as ErrorResponse),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({
          code: 'UNAUTHORIZED',
          error: 'Missing Authorization header',
        } as ErrorResponse),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({
          code: 'UNAUTHORIZED',
          error: 'Invalid or expired token',
        } as ErrorResponse),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await req.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return new Response(
        JSON.stringify({
          code: 'VALIDATION_ERROR',
          error: validation.error.errors[0].message,
        } as ErrorResponse),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { flow_id, session_id, events } = validation.data;

    const { data: session, error: sessionError } = await supabase
      .from('flow_sessions')
      .select('id, user_id, flow_id')
      .eq('id', session_id)
      .eq('flow_id', flow_id)
      .maybeSingle();

    if (sessionError) {
      return new Response(
        JSON.stringify({
          code: 'DATABASE_ERROR',
          error: 'Failed to verify session',
        } as ErrorResponse),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!session) {
      return new Response(
        JSON.stringify({
          code: 'SESSION_NOT_FOUND',
          error: 'Session does not exist or does not belong to flow',
        } as ErrorResponse),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (session.user_id !== user.id) {
      return new Response(
        JSON.stringify({
          code: 'UNAUTHORIZED',
          error: 'Session does not belong to current user',
        } as ErrorResponse),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const eventsJsonb = events.map((event) => ({
      client_event_id: event.client_event_id,
      node_id: event.node_id || null,
      event_type: event.event_type,
      watch_seconds: event.watch_seconds,
      completed: event.completed,
      occurred_at: event.occurred_at || new Date().toISOString(),
      event_data: event.event_data,
    }));

    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      'rpc_apply_flow_events',
      {
        p_flow_id: flow_id,
        p_session_id: session_id,
        p_events: eventsJsonb,
      }
    );

    if (rpcError) {
      console.error('RPC Error:', rpcError);
      return new Response(
        JSON.stringify({
          code: 'RPC_ERROR',
          error: 'Failed to process events',
        } as ErrorResponse),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const result = rpcResult as {
      success: boolean;
      processed_count: number;
      errors: string[];
    };

    if (!result.success && result.processed_count === 0) {
      return new Response(
        JSON.stringify({
          code: 'EVENT_PROCESSING_FAILED',
          error: result.errors.join(', ') || 'Failed to process any events',
        } as ErrorResponse),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const response: FlowEventsResponse = {
      success: result.success,
      processed_count: result.processed_count,
      errors: result.errors,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        code: 'INTERNAL_ERROR',
        error: 'An unexpected error occurred',
      } as ErrorResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
