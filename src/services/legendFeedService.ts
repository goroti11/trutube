import { legendCanonicalService } from './legendCanonicalService';

export interface LegendFeedItem {
  entity_type: string;
  entity_id: string;
  legend_level: number;
  legend_score: number;
  boost_factor: number;
  is_legend_promoted: boolean;
  video_title: string;
  video_thumbnail: string;
  creator_name: string;
  view_count: number;
  like_count: number;
  created_at: string;
}

export interface LegendEligibilityCheck {
  eligible: boolean;
  legend_level: number;
  legend_score: number;
  boost_factor: number;
  reasons: string[];
  scores: {
    watch_score: number;
    engagement_score: number;
    economic_score: number;
    legend_score: number;
    level: number;
  };
  conditions: {
    score_threshold_met: boolean;
    no_risk_flag: boolean;
    minimum_votes_met: boolean;
    no_sanctions: boolean;
    watch_score_ok: boolean;
    not_expired: boolean;
  };
}

export interface LegendPromotionResult {
  success: boolean;
  legend_level?: number;
  legend_score?: number;
  boost_factor?: number;
  expires_at?: string;
  error?: string;
  reasons?: string[];
}

export const legendFeedService = {
  async checkPromotionEligibility(
    entityType: string,
    entityId: string
  ): Promise<LegendEligibilityCheck | null> {
    return legendCanonicalService.checkEligibility(entityType, entityId) as Promise<any>;
  },

  async autoPromoteLegendContent(
    entityType: string,
    entityId: string
  ): Promise<LegendPromotionResult> {
    return legendCanonicalService.autoPromote(entityType, entityId);
  },

  async getActiveLegendPromotions(limit: number = 50): Promise<any[]> {
    return legendCanonicalService.getActiveLegends(undefined, limit);
  },

  async getLegendPromotionStats(entityType: string, entityId: string): Promise<{
    impressions_count: number;
    clicks_count: number;
    ctr: number;
    boost_factor: number;
  } | null> {
    const legend = await legendCanonicalService.getLegendByEntity(entityType, entityId);
    if (!legend) return null;

    return {
      impressions_count: 0,
      clicks_count: 0,
      ctr: 0,
      boost_factor: legend.boost_factor
    };
  },

  async getTrendingLegendCandidates(limit: number = 10): Promise<any[]> {
    return legendCanonicalService.getCandidates('pending', limit);
  },

  calculateBoostMultiplier(legendLevel: number, freshnessDays: number): number {
    let baseBoost = 1.0;

    switch (legendLevel) {
      case 4:
        baseBoost = 10.0;
        break;
      case 3:
        baseBoost = 7.0;
        break;
      case 2:
        baseBoost = 5.0;
        break;
      case 1:
        baseBoost = 3.0;
        break;
    }

    if (freshnessDays <= 3) {
      return baseBoost * 1.5;
    } else if (freshnessDays <= 7) {
      return baseBoost * 1.2;
    } else if (freshnessDays <= 14) {
      return baseBoost;
    } else {
      return baseBoost * 0.8;
    }
  },

  getLegendLevelColor(level: number): string {
    return legendCanonicalService.getLevelGradient(level as 1 | 2 | 3 | 4);
  },

  getLegendLevelName(level: number): string {
    return legendCanonicalService.getLevelName(level as 1 | 2 | 3 | 4);
  }
};
