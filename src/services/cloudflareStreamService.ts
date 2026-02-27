const CLOUDFLARE_ACCOUNT_ID = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || '';
const CLOUDFLARE_API_BASE = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream`;

interface CloudflareVideo {
  uid: string;
  status: {
    state: 'queued' | 'inprogress' | 'ready' | 'error';
    errorReasonCode?: string;
    errorReasonText?: string;
  };
  playback: {
    hls: string;
    dash: string;
  };
  duration: number;
  meta: Record<string, string>;
}

interface CloudflareAudioTrack {
  uid: string;
  label: string;
  language: string;
}

interface CloudflareCaption {
  uid: string;
  label: string;
  language: string;
  status: 'ready' | 'generating' | 'error';
}

export interface CloudflareStreamConfig {
  accountId: string;
  apiToken: string;
  customerSubdomain?: string;
}

export class CloudflareStreamService {
  private accountId: string;
  private apiToken: string;
  private customerSubdomain?: string;
  private baseUrl: string;

  constructor(config: CloudflareStreamConfig) {
    this.accountId = config.accountId;
    this.apiToken = config.apiToken;
    this.customerSubdomain = config.customerSubdomain;
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/stream`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Cloudflare API error: ${response.status} - ${JSON.stringify(error)}`
      );
    }

    const data = await response.json();
    return data.result as T;
  }

  async getVideo(uid: string): Promise<CloudflareVideo> {
    return this.request<CloudflareVideo>(`/${uid}`);
  }

  async createVideoFromUrl(sourceUrl: string, metadata: {
    name: string;
    creator?: string;
    requireSignedURLs?: boolean;
  }): Promise<CloudflareVideo> {
    return this.request<CloudflareVideo>('', {
      method: 'POST',
      body: JSON.stringify({
        url: sourceUrl,
        meta: {
          name: metadata.name,
          creator: metadata.creator || '',
        },
        requireSignedURLs: metadata.requireSignedURLs || false,
      }),
    });
  }

  async uploadVideo(file: File, metadata: {
    name: string;
    creator?: string;
  }): Promise<CloudflareVideo> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('meta', JSON.stringify({
      name: metadata.name,
      creator: metadata.creator || '',
    }));

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    return data.result as CloudflareVideo;
  }

  async deleteVideo(uid: string): Promise<void> {
    await this.request(`/${uid}`, { method: 'DELETE' });
  }

  async addAudioTrack(
    videoUid: string,
    language: string,
    label: string,
    audioUrl: string
  ): Promise<CloudflareAudioTrack> {
    return this.request<CloudflareAudioTrack>(
      `/${videoUid}/audio`,
      {
        method: 'POST',
        body: JSON.stringify({
          url: audioUrl,
          language,
          label,
        }),
      }
    );
  }

  async listAudioTracks(videoUid: string): Promise<CloudflareAudioTrack[]> {
    const result = await this.request<{ tracks: CloudflareAudioTrack[] }>(
      `/${videoUid}/audio`
    );
    return result.tracks || [];
  }

  async deleteAudioTrack(videoUid: string, trackUid: string): Promise<void> {
    await this.request(`/${videoUid}/audio/${trackUid}`, { method: 'DELETE' });
  }

  async addCaption(
    videoUid: string,
    language: string,
    label: string,
    vttUrl: string
  ): Promise<CloudflareCaption> {
    return this.request<CloudflareCaption>(
      `/${videoUid}/captions/${language}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          url: vttUrl,
          label,
        }),
      }
    );
  }

  async listCaptions(videoUid: string): Promise<CloudflareCaption[]> {
    try {
      const result = await this.request<CloudflareCaption[]>(
        `/${videoUid}/captions`
      );
      return Array.isArray(result) ? result : [];
    } catch {
      return [];
    }
  }

  async deleteCaption(videoUid: string, language: string): Promise<void> {
    await this.request(`/${videoUid}/captions/${language}`, { method: 'DELETE' });
  }

  getPlaybackUrl(uid: string, type: 'hls' | 'dash' = 'hls'): string {
    if (this.customerSubdomain) {
      return `https://${this.customerSubdomain}.cloudflarestream.com/${uid}/manifest/video.m3u8`;
    }
    return `https://customer-${this.accountId.substring(0, 8)}.cloudflarestream.com/${uid}/manifest/video.m3u8`;
  }

  getThumbnailUrl(uid: string, time?: number): string {
    const timeParam = time ? `?time=${time}s` : '';
    if (this.customerSubdomain) {
      return `https://${this.customerSubdomain}.cloudflarestream.com/${uid}/thumbnails/thumbnail.jpg${timeParam}`;
    }
    return `https://customer-${this.accountId.substring(0, 8)}.cloudflarestream.com/${uid}/thumbnails/thumbnail.jpg${timeParam}`;
  }
}

export function createCloudflareStreamService(): CloudflareStreamService | null {
  const accountId = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;
  const apiToken = import.meta.env.VITE_CLOUDFLARE_STREAM_API_TOKEN;

  if (!accountId || !apiToken) {
    console.warn('Cloudflare Stream not configured');
    return null;
  }

  return new CloudflareStreamService({
    accountId,
    apiToken,
    customerSubdomain: import.meta.env.VITE_CLOUDFLARE_CUSTOMER_SUBDOMAIN,
  });
}
