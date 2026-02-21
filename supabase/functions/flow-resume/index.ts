import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const requestSchema = z.object({
  flow_id: z.string().uuid('Invalid flow_id format'),
});

interface FlowResumeResponse {
  flow_id: string;
  node_id: string;
  clip_id: string;
  video_id: string;
  jump_to_seconds: number;
  clip_data: {
    title: string;
    start_time: number;
    end_time: number;
    duration: number;
  };
  video_data: {
    title: string;
    thumbnail_url: string;
    video_url: string;
  };
  is_resume: boolean;
  session_id: string | null;
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

    const { flow_id } = validation.data;

    const { data: flow, error: flowError } = await supabase
      .from('flows')
      .select('id, video_id, is_active')
      .eq('id', flow_id)
      .maybeSingle();

    if (flowError) {
      return new Response(
        JSON.stringify({
          code: 'DATABASE_ERROR',
          error: 'Failed to fetch flow',
        } as ErrorResponse),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!flow) {
      return new Response(
        JSON.stringify({
          code: 'FLOW_NOT_FOUND',
          error: 'Flow does not exist',
        } as ErrorResponse),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!flow.is_active) {
      return new Response(
        JSON.stringify({
          code: 'FLOW_INACTIVE',
          error: 'Flow is not active',
        } as ErrorResponse),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let targetNodeId: string | null = null;
    let isResume = false;
    let sessionId: string | null = null;

    const { data: progress } = await supabase
      .from('flow_progress')
      .select('last_session_id')
      .eq('user_id', user.id)
      .eq('flow_id', flow_id)
      .maybeSingle();

    if (progress?.last_session_id) {
      const { data: session } = await supabase
        .from('flow_sessions')
        .select('id, last_node_id')
        .eq('id', progress.last_session_id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (session?.last_node_id) {
        targetNodeId = session.last_node_id;
        sessionId = session.id;
        isResume = true;
      }
    }

    if (!targetNodeId) {
      const { data: entryNode } = await supabase
        .from('flow_nodes')
        .select('id')
        .eq('flow_id', flow_id)
        .eq('node_type', 'start')
        .order('sequence_hint', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (entryNode) {
        targetNodeId = entryNode.id;
      } else {
        const { data: fallbackNode } = await supabase
          .from('flow_nodes')
          .select('id')
          .eq('flow_id', flow_id)
          .order('sequence_hint', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (!fallbackNode) {
          return new Response(
            JSON.stringify({
              code: 'NO_NODES',
              error: 'Flow has no nodes',
            } as ErrorResponse),
            {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        targetNodeId = fallbackNode.id;
      }

      const { data: newSession, error: sessionError } = await supabase
        .from('flow_sessions')
        .insert({
          flow_id: flow_id,
          user_id: user.id,
          entry_node_id: targetNodeId,
          last_node_id: targetNodeId,
          session_start: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (sessionError || !newSession) {
        return new Response(
          JSON.stringify({
            code: 'SESSION_CREATE_ERROR',
            error: 'Failed to create session',
          } as ErrorResponse),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      sessionId = newSession.id;
    }

    const { data: nodeData, error: nodeError } = await supabase
      .from('flow_nodes')
      .select(
        `
        id,
        clip_id,
        video_clips!inner(
          id,
          video_id,
          title,
          start_time,
          end_time,
          duration,
          videos!inner(
            id,
            title,
            thumbnail_url,
            video_url
          )
        )
      `
      )
      .eq('id', targetNodeId)
      .maybeSingle();

    if (nodeError || !nodeData) {
      return new Response(
        JSON.stringify({
          code: 'NODE_NOT_FOUND',
          error: 'Target node not found',
        } as ErrorResponse),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const clip = Array.isArray(nodeData.video_clips)
      ? nodeData.video_clips[0]
      : nodeData.video_clips;
    const video = Array.isArray(clip.videos) ? clip.videos[0] : clip.videos;

    let jumpToSeconds = clip.start_time || 0;

    const { data: deeplink } = await supabase
      .from('clip_deeplinks')
      .select('metadata')
      .eq('node_id', targetNodeId)
      .maybeSingle();

    if (deeplink?.metadata && typeof deeplink.metadata === 'object') {
      const meta = deeplink.metadata as Record<string, unknown>;
      if (typeof meta.jump_to_seconds === 'number') {
        jumpToSeconds = meta.jump_to_seconds;
      }
    }

    const response: FlowResumeResponse = {
      flow_id: flow_id,
      node_id: nodeData.id,
      clip_id: clip.id,
      video_id: video.id,
      jump_to_seconds: jumpToSeconds,
      clip_data: {
        title: clip.title || '',
        start_time: clip.start_time || 0,
        end_time: clip.end_time || 0,
        duration: clip.duration || 0,
      },
      video_data: {
        title: video.title || '',
        thumbnail_url: video.thumbnail_url || '',
        video_url: video.video_url || '',
      },
      is_resume: isResume,
      session_id: sessionId,
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
