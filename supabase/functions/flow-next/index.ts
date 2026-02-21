import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const requestSchema = z.object({
  flow_id: z.string().uuid('Invalid flow_id format'),
  current_node_id: z.string().uuid('Invalid current_node_id format'),
  mode: z.enum(['continue-only', 'explore-only', 'auto']).default('auto'),
});

interface FlowNextResponse {
  next_node: {
    node_id: string;
    clip_id: string;
    video_id: string;
    edge_type: string;
    weight: number;
    label: string;
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
  } | null;
  reason?: string;
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

    const { flow_id, current_node_id, mode } = validation.data;

    const { data: currentNode, error: nodeError } = await supabase
      .from('flow_nodes')
      .select('id, flow_id')
      .eq('id', current_node_id)
      .eq('flow_id', flow_id)
      .maybeSingle();

    if (nodeError || !currentNode) {
      return new Response(
        JSON.stringify({
          code: 'NODE_NOT_FOUND',
          error: 'Current node not found or does not belong to flow',
        } as ErrorResponse),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: viewedNodes } = await supabase
      .from('flow_node_progress')
      .select('node_id')
      .eq('user_id', user.id)
      .eq('flow_id', flow_id);

    const viewedNodeIds = new Set(
      (viewedNodes || []).map((n: { node_id: string }) => n.node_id)
    );

    let edgeTypeFilter: string[] = [];
    if (mode === 'continue-only') {
      edgeTypeFilter = ['continue'];
    } else if (mode === 'explore-only') {
      edgeTypeFilter = ['explore'];
    } else {
      edgeTypeFilter = ['continue', 'explore', 'recap'];
    }

    const { data: edges, error: edgesError } = await supabase
      .from('flow_edges')
      .select(
        `
        id,
        to_node_id,
        edge_type,
        weight,
        label,
        flow_nodes!flow_edges_to_node_id_fkey(
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
        )
      `
      )
      .eq('flow_id', flow_id)
      .eq('from_node_id', current_node_id)
      .in('edge_type', edgeTypeFilter)
      .order('weight', { ascending: false })
      .order('edge_type', { ascending: true });

    if (edgesError) {
      return new Response(
        JSON.stringify({
          code: 'DATABASE_ERROR',
          error: 'Failed to fetch edges',
        } as ErrorResponse),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!edges || edges.length === 0) {
      const response: FlowNextResponse = {
        next_node: null,
        reason: 'No outgoing edges from current node',
      };
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const edgeTypePriority = { continue: 1, explore: 2, recap: 3 };

    const sortedEdges = edges
      .map((edge: {
        to_node_id: string;
        edge_type: string;
        weight: number;
        label: string;
        flow_nodes: {
          id: string;
          clip_id: string;
          video_clips: {
            id: string;
            video_id: string;
            title: string;
            start_time: number;
            end_time: number;
            duration: number;
            videos: {
              id: string;
              title: string;
              thumbnail_url: string;
              video_url: string;
            };
          };
        };
      }) => {
        const node = Array.isArray(edge.flow_nodes)
          ? edge.flow_nodes[0]
          : edge.flow_nodes;
        return {
          ...edge,
          node,
          alreadyViewed: viewedNodeIds.has(edge.to_node_id),
        };
      })
      .filter((edge) => !edge.alreadyViewed)
      .sort((a, b) => {
        if (mode === 'auto') {
          const typeDiff =
            edgeTypePriority[a.edge_type as keyof typeof edgeTypePriority] -
            edgeTypePriority[b.edge_type as keyof typeof edgeTypePriority];
          if (typeDiff !== 0) return typeDiff;
        }
        return b.weight - a.weight;
      });

    if (sortedEdges.length === 0) {
      const response: FlowNextResponse = {
        next_node: null,
        reason: 'All reachable nodes have been viewed',
      };
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const bestEdge = sortedEdges[0];
    const node = bestEdge.node;
    const clip = Array.isArray(node.video_clips)
      ? node.video_clips[0]
      : node.video_clips;
    const video = Array.isArray(clip.videos) ? clip.videos[0] : clip.videos;

    let jumpToSeconds = clip.start_time || 0;

    const { data: deeplink } = await supabase
      .from('clip_deeplinks')
      .select('metadata')
      .eq('node_id', node.id)
      .maybeSingle();

    if (deeplink?.metadata && typeof deeplink.metadata === 'object') {
      const meta = deeplink.metadata as Record<string, unknown>;
      if (typeof meta.jump_to_seconds === 'number') {
        jumpToSeconds = meta.jump_to_seconds;
      }
    }

    const response: FlowNextResponse = {
      next_node: {
        node_id: node.id,
        clip_id: clip.id,
        video_id: video.id,
        edge_type: bestEdge.edge_type,
        weight: bestEdge.weight,
        label: bestEdge.label || '',
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
      },
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
