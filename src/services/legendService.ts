import { supabase } from '../lib/supabase';
import type {
  LegendCategory,
  LegendRegistry,
  LegendCandidate,
  LegendStats,
} from '../types/legend';

export const legendService = {
  async getCategories(): Promise<LegendCategory[]> {
    const { data, error } = await supabase
      .from('legend_categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getLegends(filters?: {
    category?: string;
    level?: number;
    limit?: number;
    offset?: number;
  }): Promise<LegendRegistry[]> {
    let query = supabase
      .from('legend_registry')
      .select('*, category:legend_categories(*)')
      .eq('is_revoked', false);

    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters?.level) {
      query = query.eq('level', filters.level);
    }

    query = query
      .order('granted_at', { ascending: false })
      .range(filters?.offset || 0, (filters?.offset || 0) + (filters?.limit || 50) - 1);

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getLegendByEntity(
    entityType: string,
    entityId: string
  ): Promise<LegendRegistry | null> {
    const { data, error } = await supabase
      .from('legend_registry')
      .select('*, category:legend_categories(*)')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .eq('is_revoked', false)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async evaluateCandidate(
    entityType: string,
    entityId: string
  ): Promise<{
    eligible: boolean;
    level?: number;
    reason?: string;
    metrics?: Record<string, unknown>;
    fraud_check?: Record<string, unknown>;
  }> {
    const { data, error } = await supabase.rpc('rpc_evaluate_legend_candidate', {
      p_entity_type: entityType,
      p_entity_id: entityId,
    });

    if (error) throw error;
    return data;
  },

  async grantLegendStatus(
    entityType: string,
    entityId: string,
    level: number,
    categorySlug: string,
    reason: string,
    metrics?: Record<string, unknown>
  ): Promise<{ success: boolean; legend_id: string }> {
    const { data, error } = await supabase.rpc('rpc_grant_legend_status', {
      p_entity_type: entityType,
      p_entity_id: entityId,
      p_level: level,
      p_category_slug: categorySlug,
      p_reason: reason,
      p_metrics: metrics || {},
    });

    if (error) throw error;
    return data;
  },

  async revokeLegendStatus(legendId: string, reason: string): Promise<void> {
    const { error } = await supabase.rpc('rpc_revoke_legend_status', {
      p_legend_id: legendId,
      p_reason: reason,
    });

    if (error) throw error;
  },

  async getCandidates(status?: string): Promise<LegendCandidate[]> {
    let query = supabase
      .from('legend_candidates')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getStats(): Promise<LegendStats> {
    const { data, error } = await supabase.rpc('rpc_get_legend_stats');

    if (error) throw error;
    return data;
  },

  async getHallOfFame(limit = 100): Promise<LegendRegistry[]> {
    const { data, error } = await supabase
      .from('legend_registry')
      .select('*, category:legend_categories(*)')
      .eq('is_revoked', false)
      .order('level', { ascending: false })
      .order('granted_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },
};
