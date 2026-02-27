import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface DubControlRequest {
  video_id?: string;
  enabled?: boolean;
  languages?: string[];
  voice_type?: 'standard' | 'premium' | 'clone';
  action?: 'retry_job';
  job_id?: string;
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

    const body: DubControlRequest = await req.json();

    if (body.action === 'retry_job' && body.job_id) {
      const { data: job, error: jobError } = await supabase
        .from('media_jobs')
        .select('*, videos!inner(creator_id)')
        .eq('id', body.job_id)
        .single();

      if (jobError || !job) {
        return new Response(JSON.stringify({ error: 'Job not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (job.videos.creator_id !== user.id) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      await supabase
        .from('media_jobs')
        .update({
          job_status: 'queued',
          attempts: 0,
          locked_at: null,
          locked_by: null,
          last_error: null,
        })
        .eq('id', body.job_id);

      return new Response(JSON.stringify({
        success: true,
        message: 'Job requeued',
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!body.video_id) {
      return new Response(JSON.stringify({ error: 'video_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', body.video_id)
      .single();

    if (videoError || !video) {
      return new Response(JSON.stringify({ error: 'Video not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (video.creator_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (body.enabled === false) {
      await supabase
        .from('videos')
        .update({ dub_status: 'none' })
        .eq('id', body.video_id);

      return new Response(JSON.stringify({
        success: true,
        message: 'Dubbing disabled',
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (body.enabled === true && body.languages && body.languages.length > 0) {
      await supabase
        .from('videos')
        .update({ dub_status: 'queued' })
        .eq('id', body.video_id);

      const { data: transcript } = await supabase
        .from('video_transcripts')
        .select('id')
        .eq('video_id', body.video_id)
        .maybeSingle();

      if (!transcript) {
        await supabase.rpc('enqueue_media_job', {
          p_job_type: 'stt',
          p_video_id: body.video_id,
          p_payload: { original_language: 'auto' },
        });
      }

      for (const lang of body.languages) {
        await supabase.rpc('enqueue_media_job', {
          p_job_type: 'translate',
          p_video_id: body.video_id,
          p_payload: { target_language: lang },
        });

        await supabase.rpc('enqueue_media_job', {
          p_job_type: 'tts',
          p_video_id: body.video_id,
          p_payload: {
            language: lang,
            voice_type: body.voice_type || 'standard',
          },
        });
      }

      return new Response(JSON.stringify({
        success: true,
        message: `Dubbing enabled for ${body.languages.length} languages`,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('dub-control error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Internal server error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
