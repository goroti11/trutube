import { supabase } from '../lib/supabase';
import type {
  FlowResumeRequest,
  FlowResumeResponse,
  FlowNextRequest,
  FlowNextResponse,
  FlowEventsRequest,
  FlowEventsResponse,
  FlowEvent,
  FlowInfo,
} from '../types/flow';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

class FlowService {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }

    return {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      Apikey: SUPABASE_ANON_KEY,
    };
  }

  async checkFlowForVideo(videoId: string): Promise<FlowInfo | null> {
    try {
      const { data, error } = await supabase
        .from('flows')
        .select(
          `
          id,
          video_id,
          title,
          description,
          is_active,
          created_at,
          flow_nodes!inner(id)
        `
        )
        .eq('video_id', videoId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error checking flow:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        video_id: data.video_id,
        title: data.title,
        description: data.description,
        is_active: data.is_active,
        total_nodes: Array.isArray(data.flow_nodes) ? data.flow_nodes.length : 0,
        created_at: data.created_at,
      };
    } catch (error) {
      console.error('Error checking flow for video:', error);
      return null;
    }
  }

  async resumeFlow(request: FlowResumeRequest): Promise<FlowResumeResponse> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/flow-resume`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to resume flow: ${response.statusText}`
        );
      }

      const data: FlowResumeResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error resuming flow:', error);
      throw error;
    }
  }

  async getNextNode(request: FlowNextRequest): Promise<FlowNextResponse> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${SUPABASE_URL}/functions/v1/flow-next`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to get next node: ${response.statusText}`
        );
      }

      const data: FlowNextResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting next node:', error);
      throw error;
    }
  }

  async sendEvents(request: FlowEventsRequest): Promise<FlowEventsResponse> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${SUPABASE_URL}/functions/v1/flow-events`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to send events: ${response.statusText}`
        );
      }

      const data: FlowEventsResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending flow events:', error);
      throw error;
    }
  }

  generateEventId(): string {
    return crypto.randomUUID();
  }

  createEvent(
    eventType: FlowEvent['event_type'],
    nodeId?: string,
    additionalData?: Partial<FlowEvent>
  ): FlowEvent {
    return {
      client_event_id: this.generateEventId(),
      node_id: nodeId,
      event_type: eventType,
      watch_seconds: additionalData?.watch_seconds || 0,
      completed: additionalData?.completed || false,
      occurred_at: new Date().toISOString(),
      event_data: additionalData?.event_data || {},
    };
  }
}

export const flowService = new FlowService();
