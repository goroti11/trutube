export type FlowEdgeType = 'continue' | 'explore' | 'recap';
export type FlowNodeRole = 'entry' | 'standard' | 'exit';
export type FlowEventType =
  | 'view'
  | 'swipe_up'
  | 'swipe_down'
  | 'swipe_left'
  | 'swipe_right'
  | 'cta_click'
  | 'full_video_click'
  | 'like'
  | 'comment'
  | 'share'
  | 'pause'
  | 'resume'
  | 'seek'
  | 'quality_change'
  | 'exit';

export interface FlowClip {
  id: string;
  video_id: string;
  title: string;
  description: string | null;
  start_time: number;
  end_time: number;
  thumbnail_url: string | null;
  cta_text: string | null;
  cta_url: string | null;
  created_at: string;
}

export interface FlowNode {
  id: string;
  flow_id: string;
  clip_id: string;
  node_role: FlowNodeRole;
  position_hint: number;
  clip: FlowClip;
}

export interface FlowVideo {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  creator: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
}

export interface FlowResumeResponse {
  flow_id: string;
  session_id: string;
  node: FlowNode;
  video: FlowVideo;
  jump_to_seconds: number;
  has_previous_progress: boolean;
}

export interface FlowNextResponse {
  success: boolean;
  next_node: FlowNode | null;
  video: FlowVideo | null;
  jump_to_seconds: number | null;
  reason: string | null;
}

export interface FlowEvent {
  client_event_id: string;
  node_id?: string;
  event_type: FlowEventType;
  watch_seconds?: number;
  completed?: boolean;
  occurred_at?: string;
  event_data?: Record<string, unknown>;
}

export interface FlowEventsRequest {
  flow_id: string;
  session_id: string;
  events: FlowEvent[];
}

export interface FlowEventsResponse {
  success: boolean;
  processed_count: number;
  errors: string[];
}

export interface FlowResumeRequest {
  flow_id: string;
}

export interface FlowNextRequest {
  flow_id: string;
  current_node_id: string;
  mode: 'continue' | 'explore' | 'auto';
}

export interface FlowPlayerState {
  currentNode: FlowNode | null;
  currentVideo: FlowVideo | null;
  flowId: string | null;
  sessionId: string | null;
  jumpToSeconds: number;
  isLoading: boolean;
  error: string | null;
  hasNextNode: boolean;
  lastNodeId: string | null;
}

export interface FlowInfo {
  id: string;
  video_id: string;
  title: string;
  description: string | null;
  is_active: boolean;
  total_nodes: number;
  created_at: string;
}
