import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface LiveEndRequest {
  live_id: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { live_id }: LiveEndRequest = await req.json();

    if (!live_id) {
      return new Response(JSON.stringify({ error: 'live_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: liveStream, error: fetchError } = await supabase
      .from('live_streams')
      .select('*')
      .eq('id', live_id)
      .single();

    if (fetchError || !liveStream) {
      return new Response(JSON.stringify({ error: 'Live stream not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (liveStream.creator_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (liveStream.stream_status === 'ended' && liveStream.replay_video_id) {
      return new Response(JSON.stringify({
        success: true,
        video_id: liveStream.replay_video_id,
        message: 'Live already ended',
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: updateResult, error: updateError } = await supabase
      .from('live_streams')
      .update({
        stream_status: 'ended',
        ended_at: new Date().toISOString(),
      })
      .eq('id', live_id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    const { data: video, error: videoError } = await supabase
      .from('videos')
      .insert({
        creator_id: liveStream.creator_id,
        title: `${liveStream.title} (Replay)`,
        description: liveStream.description,
        thumbnail_url: liveStream.thumbnail_url,
        universe_id: '00000000-0000-0000-0000-000000000001',
        is_replay: true,
        source_live_id: live_id,
        dub_status: 'none',
        duration: 0,
        processing_status: 'processing',
      })
      .select()
      .single();

    if (videoError) {
      throw videoError;
    }

    await supabase
      .from('live_streams')
      .update({
        replay_video_id: video.id,
        replay_ready: false,
      })
      .eq('id', live_id);

    await supabase.rpc('enqueue_media_job', {
      p_job_type: 'replay_finalize',
      p_video_id: video.id,
      p_live_id: live_id,
      p_payload: {
        stream_url: liveStream.playback_url,
        rtmp_url: liveStream.rtmp_url,
      },
    });

    return new Response(JSON.stringify({
      success: true,
      video_id: video.id,
      message: 'Live ended, replay processing started',
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('live-end error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Internal server error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
