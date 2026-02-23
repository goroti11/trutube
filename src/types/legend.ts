export interface LegendCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
}

export interface LegendRegistry {
  id: string;
  entity_type: 'video' | 'music' | 'gaming_achievement' | 'live_replay';
  entity_id: string;
  level: 1 | 2 | 3 | 4;
  category_id: string;
  reason: string;
  verified_metrics: Record<string, unknown>;
  granted_by: string;
  granted_at: string;
  is_revoked: boolean;
  revoked_at?: string;
  revoked_reason?: string;
  created_at: string;
  updated_at: string;
  category?: LegendCategory;
}

export interface LegendCandidate {
  id: string;
  entity_type: 'video' | 'music' | 'gaming_achievement' | 'live_replay';
  entity_id: string;
  candidate_reason: string;
  metrics_snapshot: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected' | 'revoked';
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  created_at: string;
}

export interface LegendFraudCheck {
  id: string;
  entity_type: string;
  entity_id: string;
  check_type: 'fake_views' | 'wash_trading' | 'collusion' | 'bot_activity' | 'sanction_history';
  risk_score?: number;
  is_flagged: boolean;
  details: Record<string, unknown>;
  checked_at: string;
}

export interface LegendStats {
  total_legends: number;
  by_level: Record<string, number>;
  by_category: Record<string, number>;
  recent_grants: number;
}

export const LEGEND_LEVEL_INFO = {
  1: {
    name: 'LÉGENDE I',
    badge: '⭐',
    description: 'Légende Émergente',
    color: 'from-blue-400 to-cyan-400',
  },
  2: {
    name: 'LÉGENDE II',
    badge: '🏅',
    description: 'Légende Confirmée',
    color: 'from-purple-400 to-pink-400',
  },
  3: {
    name: 'LÉGENDE III',
    badge: '💎',
    description: 'Légende Iconique',
    color: 'from-yellow-400 to-orange-400',
  },
  4: {
    name: 'LÉGENDE IV',
    badge: '👑',
    description: 'Légende Ultime',
    color: 'from-red-400 to-pink-500',
  },
};
