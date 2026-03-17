export interface MarketplaceOrderDelivery {
  id: string;
  order_id: string;
  submitted_by: string;
  delivery_note: string;
  file_urls: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'revision_requested';
  buyer_feedback: string;
  created_at: string;
  reviewed_at: string | null;
}

export interface MarketplaceDispute {
  id: string;
  order_id: string;
  opened_by: string;
  reason: string;
  description: string;
  evidence_urls: string[];
  status: 'open' | 'investigating' | 'resolved_buyer' | 'resolved_provider' | 'resolved_split';
  resolution_note: string;
  refund_amount: number | null;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MarketplaceAuditLog {
  id: string;
  order_id: string | null;
  user_id: string | null;
  action: string;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export type MarketplaceCategory = 'music_production' | 'video' | 'branding' | 'marketing' | 'legal';
export type ExpertiseLevel = 'beginner' | 'intermediate' | 'expert' | 'pro';
export type OrderStatus = 'pending' | 'in_progress' | 'delivered' | 'revision_requested' | 'completed' | 'cancelled' | 'disputed';
export type EscrowStatus = 'held' | 'released' | 'refunded' | 'disputed';
export type DeliveryStatus = 'pending' | 'in_review' | 'accepted' | 'rejected';
export type MessageType = 'text' | 'delivery' | 'revision_request' | 'system';
