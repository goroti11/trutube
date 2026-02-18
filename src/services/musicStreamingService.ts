import { supabase } from '../lib/supabase';

export interface MusicAlbum {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  cover_art_url: string | null;
  release_date: string | null;
  genre: string | null;
  label: string | null;
  total_tracks: number;
  total_streams: number;
  total_revenue: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface MusicTrack {
  id: string;
  album_id: string | null;
  creator_id: string;
  title: string;
  description: string | null;
  audio_url: string;
  cover_art_url: string | null;
  duration: number;
  track_number: number | null;
  genre: string | null;
  lyrics: string | null;
  isrc: string | null;
  primary_artist_id: string | null;
  featured_artists: any;
  total_streams: number;
  total_revenue: number;
  is_published: boolean;
  is_explicit: boolean;
  created_at: string;
  released_at: string | null;
}

export interface MusicStream {
  id: string;
  track_id: string;
  listener_id: string | null;
  stream_duration: number;
  is_complete: boolean;
  platform: string;
  device_type: string | null;
  streamed_at: string;
}

export interface MusicRoyalty {
  id: string;
  track_id: string;
  recipient_id: string;
  period_start: string;
  period_end: string;
  total_streams: number;
  rate_per_stream: number;
  gross_amount: number;
  platform_fee: number;
  net_amount: number;
  currency: string;
  status: string;
  created_at: string;
  paid_at: string | null;
}

export const musicStreamingService = {
  async getCreatorAlbums(creatorId: string): Promise<MusicAlbum[]> {
    const { data, error } = await supabase
      .from('music_albums')
      .select('*')
      .eq('creator_id', creatorId)
      .order('release_date', { ascending: false });

    if (error) {
      console.error('Error fetching albums:', error);
      return [];
    }

    return data as MusicAlbum[];
  },

  async getPublishedAlbums(creatorId: string): Promise<MusicAlbum[]> {
    const { data, error } = await supabase
      .from('music_albums')
      .select('*')
      .eq('creator_id', creatorId)
      .eq('is_published', true)
      .order('release_date', { ascending: false });

    if (error) {
      console.error('Error fetching published albums:', error);
      return [];
    }

    return data as MusicAlbum[];
  },

  async createAlbum(albumData: Partial<MusicAlbum>): Promise<MusicAlbum | null> {
    const { data, error } = await supabase
      .from('music_albums')
      .insert([albumData])
      .select()
      .single();

    if (error) {
      console.error('Error creating album:', error);
      return null;
    }

    return data as MusicAlbum;
  },

  async updateAlbum(
    albumId: string,
    updates: Partial<MusicAlbum>
  ): Promise<MusicAlbum | null> {
    const { data, error } = await supabase
      .from('music_albums')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', albumId)
      .select()
      .single();

    if (error) {
      console.error('Error updating album:', error);
      return null;
    }

    return data as MusicAlbum;
  },

  async deleteAlbum(albumId: string): Promise<boolean> {
    const { error } = await supabase
      .from('music_albums')
      .delete()
      .eq('id', albumId);

    if (error) {
      console.error('Error deleting album:', error);
      return false;
    }

    return true;
  },

  async getAlbumTracks(albumId: string): Promise<MusicTrack[]> {
    const { data, error } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('album_id', albumId)
      .order('track_number', { ascending: true });

    if (error) {
      console.error('Error fetching album tracks:', error);
      return [];
    }

    return data as MusicTrack[];
  },

  async getCreatorTracks(creatorId: string): Promise<MusicTrack[]> {
    const { data, error } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tracks:', error);
      return [];
    }

    return data as MusicTrack[];
  },

  async createTrack(trackData: Partial<MusicTrack>): Promise<MusicTrack | null> {
    const { data, error } = await supabase
      .from('music_tracks')
      .insert([trackData])
      .select()
      .single();

    if (error) {
      console.error('Error creating track:', error);
      return null;
    }

    if (trackData.album_id) {
      await supabase
        .from('music_albums')
        .update({ total_tracks: (await this.getAlbumTracks(trackData.album_id)).length })
        .eq('id', trackData.album_id);
    }

    return data as MusicTrack;
  },

  async updateTrack(
    trackId: string,
    updates: Partial<MusicTrack>
  ): Promise<MusicTrack | null> {
    const { data, error } = await supabase
      .from('music_tracks')
      .update(updates)
      .eq('id', trackId)
      .select()
      .single();

    if (error) {
      console.error('Error updating track:', error);
      return null;
    }

    return data as MusicTrack;
  },

  async deleteTrack(trackId: string): Promise<boolean> {
    const { error } = await supabase
      .from('music_tracks')
      .delete()
      .eq('id', trackId);

    if (error) {
      console.error('Error deleting track:', error);
      return false;
    }

    return true;
  },

  async recordStream(streamData: {
    track_id: string;
    listener_id?: string;
    stream_duration: number;
    device_type?: string;
  }): Promise<MusicStream | null> {
    const isComplete = streamData.stream_duration >= 30;

    const { data, error } = await supabase
      .from('music_streams')
      .insert([
        {
          ...streamData,
          is_complete: isComplete,
          listener_id: streamData.listener_id || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error recording stream:', error);
      return null;
    }

    return data as MusicStream;
  },

  async getTrackStreams(trackId: string, limit = 100): Promise<MusicStream[]> {
    const { data, error } = await supabase
      .from('music_streams')
      .select('*')
      .eq('track_id', trackId)
      .eq('is_complete', true)
      .order('streamed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching streams:', error);
      return [];
    }

    return data as MusicStream[];
  },

  async getCreatorRoyalties(creatorId: string): Promise<MusicRoyalty[]> {
    const { data, error } = await supabase
      .from('music_royalties')
      .select('*')
      .eq('recipient_id', creatorId)
      .order('period_start', { ascending: false });

    if (error) {
      console.error('Error fetching royalties:', error);
      return [];
    }

    return data as MusicRoyalty[];
  },

  async calculateRoyalties(
    creatorId: string,
    periodStart: string,
    periodEnd: string
  ): Promise<MusicRoyalty[]> {
    const tracks = await this.getCreatorTracks(creatorId);
    const royalties: MusicRoyalty[] = [];
    const ratePerStream = 0.004;
    const platformFeeRate = 0.1;

    for (const track of tracks) {
      const { data: streams } = await supabase
        .from('music_streams')
        .select('*')
        .eq('track_id', track.id)
        .eq('is_complete', true)
        .gte('streamed_at', periodStart)
        .lte('streamed_at', periodEnd);

      if (streams && streams.length > 0) {
        const totalStreams = streams.length;
        const grossAmount = totalStreams * ratePerStream;
        const platformFee = grossAmount * platformFeeRate;
        const netAmount = grossAmount - platformFee;

        const { data: royalty } = await supabase
          .from('music_royalties')
          .insert([
            {
              track_id: track.id,
              recipient_id: creatorId,
              period_start: periodStart,
              period_end: periodEnd,
              total_streams: totalStreams,
              rate_per_stream: ratePerStream,
              gross_amount: grossAmount,
              platform_fee: platformFee,
              net_amount: netAmount,
            },
          ])
          .select()
          .single();

        if (royalty) {
          royalties.push(royalty as MusicRoyalty);
        }
      }
    }

    return royalties;
  },

  async getMusicStats(creatorId: string) {
    const { data: albums } = await supabase
      .from('music_albums')
      .select('*')
      .eq('creator_id', creatorId);

    const { data: tracks } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('creator_id', creatorId);

    const { data: royalties } = await supabase
      .from('music_royalties')
      .select('*')
      .eq('recipient_id', creatorId)
      .eq('status', 'paid');

    if (!albums || !tracks) {
      return {
        totalAlbums: 0,
        totalTracks: 0,
        totalStreams: 0,
        totalRevenue: 0,
        averageStreamsPerTrack: 0,
        topTracks: [],
      };
    }

    const totalAlbums = albums.length;
    const totalTracks = tracks.length;
    const totalStreams = tracks.reduce((sum, track) => sum + track.total_streams, 0);
    const totalRevenue = royalties?.reduce((sum, r) => sum + r.net_amount, 0) || 0;
    const averageStreamsPerTrack = totalTracks > 0 ? totalStreams / totalTracks : 0;
    const topTracks = [...tracks]
      .sort((a, b) => b.total_streams - a.total_streams)
      .slice(0, 10);

    return {
      totalAlbums,
      totalTracks,
      totalStreams,
      totalRevenue,
      averageStreamsPerTrack,
      topTracks,
    };
  },
};
