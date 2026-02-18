import { supabase } from '../lib/supabase';

/**
 * Service de recherche IA avec ChatGPT 4.2 pour membres Premium
 * Fonctionnalités:
 * - Recherche sémantique avancée
 * - Analyse de contenu par IA
 * - Recommandations personnalisées
 * - Résumés automatiques
 */

export interface AISearchQuery {
  query: string;
  userId: string;
  filters?: {
    universes?: string[];
    dateRange?: { start: Date; end: Date };
    contentType?: ('video' | 'post' | 'community')[];
  };
  context?: string;
}

export interface AISearchResult {
  id: string;
  type: 'video' | 'post' | 'community' | 'creator';
  title: string;
  description: string;
  relevanceScore: number;
  aiSummary: string;
  thumbnail?: string;
  metadata: Record<string, any>;
}

export interface AIRecommendation {
  contentId: string;
  contentType: string;
  reason: string;
  confidence: number;
}

class AISearchService {
  /**
   * Recherche avancée avec IA (ChatGPT 4.2) - Réservé Premium
   */
  async searchWithAI(query: AISearchQuery): Promise<AISearchResult[]> {
    try {
      // Vérifier le statut Premium de l'utilisateur
      const { data: profile } = await supabase
        .from('profiles')
        .select('premium_tier')
        .eq('id', query.userId)
        .single();

      if (!profile || profile.premium_tier === 'free') {
        throw new Error('Cette fonctionnalité est réservée aux membres Gold et Platinum');
      }

      // Pour Platinum uniquement: recherche IA avancée
      if (profile.premium_tier !== 'platinum') {
        throw new Error('La recherche IA avancée est réservée aux membres Platinum');
      }

      // Log de la requête pour analytics
      await this.logSearchQuery(query);

      // Appel à l'Edge Function de recherche IA
      const { data, error } = await supabase.functions.invoke('ai-search', {
        body: {
          query: query.query,
          userId: query.userId,
          filters: query.filters,
          context: query.context,
          model: 'gpt-4.2' // Utilisation de ChatGPT 4.2
        }
      });

      if (error) throw error;

      return data.results || [];
    } catch (error) {
      console.error('Erreur recherche IA:', error);
      throw error;
    }
  }

  /**
   * Obtenir des recommandations personnalisées par IA
   */
  async getAIRecommendations(userId: string, limit: number = 10): Promise<AIRecommendation[]> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('premium_tier')
        .eq('id', userId)
        .single();

      if (!profile || profile.premium_tier === 'free') {
        // Pour les utilisateurs free, retourner des recommandations basiques
        return this.getBasicRecommendations(userId, limit);
      }

      // Récupérer l'historique de l'utilisateur
      const { data: history } = await supabase
        .from('watch_sessions')
        .select('video_id, watch_time_seconds, completed')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      // Appel à l'Edge Function de recommandation IA
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          userId,
          watchHistory: history,
          limit,
          premiumTier: profile.premium_tier
        }
      });

      if (error) throw error;

      return data.recommendations || [];
    } catch (error) {
      console.error('Erreur recommandations IA:', error);
      return [];
    }
  }

  /**
   * Générer un résumé IA d'une vidéo (Premium)
   */
  async generateVideoSummary(videoId: string, userId: string): Promise<string> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('premium_tier')
        .eq('id', userId)
        .single();

      if (!profile || profile.premium_tier === 'free') {
        throw new Error('Les résumés IA sont réservés aux membres Premium');
      }

      // Vérifier si un résumé existe déjà
      const { data: existingSummary } = await supabase
        .from('video_ai_summaries')
        .select('summary')
        .eq('video_id', videoId)
        .single();

      if (existingSummary) {
        return existingSummary.summary;
      }

      // Générer un nouveau résumé avec l'IA
      const { data, error } = await supabase.functions.invoke('generate-summary', {
        body: {
          videoId,
          model: profile.premium_tier === 'platinum' ? 'gpt-4.2' : 'gpt-4'
        }
      });

      if (error) throw error;

      // Sauvegarder le résumé
      await supabase
        .from('video_ai_summaries')
        .insert({
          video_id: videoId,
          summary: data.summary,
          generated_at: new Date().toISOString()
        });

      return data.summary;
    } catch (error) {
      console.error('Erreur génération résumé:', error);
      throw error;
    }
  }

  /**
   * Analyse de tendances par IA (Platinum uniquement)
   */
  async analyzeTrends(userId: string, universeId?: string): Promise<any> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('premium_tier')
        .eq('id', userId)
        .single();

      if (profile?.premium_tier !== 'platinum') {
        throw new Error('L\'analyse de tendances IA est réservée aux membres Platinum');
      }

      const { data, error } = await supabase.functions.invoke('analyze-trends', {
        body: {
          userId,
          universeId,
          model: 'gpt-4.2'
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erreur analyse tendances:', error);
      throw error;
    }
  }

  /**
   * Assistant créateur IA (Platinum uniquement)
   */
  async getCreatorAssistance(
    userId: string,
    question: string,
    context?: Record<string, any>
  ): Promise<string> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('premium_tier')
        .eq('id', userId)
        .single();

      if (profile?.premium_tier !== 'platinum') {
        throw new Error('L\'assistant créateur IA est réservé aux membres Platinum');
      }

      const { data, error } = await supabase.functions.invoke('creator-assistant', {
        body: {
          userId,
          question,
          context,
          model: 'gpt-4.2'
        }
      });

      if (error) throw error;

      return data.response;
    } catch (error) {
      console.error('Erreur assistant créateur:', error);
      throw error;
    }
  }

  /**
   * Optimisation de titre/description par IA
   */
  async optimizeContentMetadata(
    userId: string,
    title: string,
    description: string,
    tags: string[]
  ): Promise<{ optimizedTitle: string; optimizedDescription: string; suggestedTags: string[] }> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('premium_tier')
        .eq('id', userId)
        .single();

      if (!profile || profile.premium_tier === 'free') {
        throw new Error('L\'optimisation IA est réservée aux membres Premium');
      }

      const { data, error } = await supabase.functions.invoke('optimize-metadata', {
        body: {
          title,
          description,
          tags,
          model: profile.premium_tier === 'platinum' ? 'gpt-4.2' : 'gpt-4'
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erreur optimisation métadonnées:', error);
      throw error;
    }
  }

  /**
   * Recommandations basiques pour utilisateurs free
   */
  private async getBasicRecommendations(userId: string, limit: number): Promise<AIRecommendation[]> {
    try {
      // Recommandations basées uniquement sur l'historique et les univers préférés
      const { data: history } = await supabase
        .from('watch_sessions')
        .select(`
          video_id,
          videos (
            universe_id,
            tags
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      // Logique simple de recommandation
      const universeCount: Record<string, number> = {};
      history?.forEach((session: any) => {
        const universeId = session.videos?.universe_id;
        if (universeId) {
          universeCount[universeId] = (universeCount[universeId] || 0) + 1;
        }
      });

      const topUniverses = Object.entries(universeCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([id]) => id);

      // Trouver des vidéos dans ces univers
      const { data: recommended } = await supabase
        .from('videos')
        .select('id, title')
        .in('universe_id', topUniverses)
        .eq('is_public', true)
        .limit(limit);

      return (recommended || []).map(video => ({
        contentId: video.id,
        contentType: 'video',
        reason: 'Basé sur votre historique de visionnage',
        confidence: 0.7
      }));
    } catch (error) {
      console.error('Erreur recommandations basiques:', error);
      return [];
    }
  }

  /**
   * Logger les requêtes de recherche pour analytics
   */
  private async logSearchQuery(query: AISearchQuery): Promise<void> {
    try {
      await supabase
        .from('search_logs')
        .insert({
          user_id: query.userId,
          query: query.query,
          filters: query.filters,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Erreur log recherche:', error);
    }
  }
}

export const aiSearchService = new AISearchService();
