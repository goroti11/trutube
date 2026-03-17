import { supabase } from '../lib/supabase';
import { universes as localUniverses } from '../data/universes';

export interface Universe {
  id: string;
  name: string;
  slug: string;
  description: string;
  color_primary: string;
  color_secondary: string;
  created_at: string;
}

export interface SubUniverse {
  id: string;
  universe_id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

const colorMap: Record<string, { primary: string; secondary: string }> = {
  'music': { primary: '#ec4899', secondary: '#db2777' },
  'game': { primary: '#10b981', secondary: '#059669' },
  'gaming': { primary: '#10b981', secondary: '#059669' },
  'know': { primary: '#f59e0b', secondary: '#d97706' },
  'culture': { primary: '#8b5cf6', secondary: '#7c3aed' },
  'life': { primary: '#f43f5e', secondary: '#e11d48' },
  'mind': { primary: '#6366f1', secondary: '#4f46e5' },
  'lean': { primary: '#10b981', secondary: '#059669' },
  'movie': { primary: '#8b5cf6', secondary: '#7c3aed' },
  'sport': { primary: '#f97316', secondary: '#ea580c' },
  'food': { primary: '#FF6B6B', secondary: '#EE5A52' },
  'travel': { primary: '#4ECDC4', secondary: '#3DB8B0' },
  'fashion': { primary: '#E91E63', secondary: '#D81B60' },
  'science': { primary: '#9C27B0', secondary: '#8E24AA' },
  'documentary': { primary: '#795548', secondary: '#6D4C41' },
  'marketplace': { primary: '#FF9800', secondary: '#F57C00' },
  'kids': { primary: '#FFC107', secondary: '#FFB300' },
  'news': { primary: '#F44336', secondary: '#E53935' },
  'community': { primary: '#00BCD4', secondary: '#00ACC1' },
  'tech': { primary: '#2196F3', secondary: '#1E88E5' },
  'learn': { primary: '#FFD700', secondary: '#FFC700' },
};

const descriptionMap: Record<string, string> = {
  'music': 'Découvre la musique sous toutes ses formes',
  'game': 'Gaming, esports et compétitions',
  'know': 'Apprends et développe tes compétences',
  'culture': 'Art, débats et contenus culturels',
  'life': 'Lifestyle, voyages et bien-être',
  'mind': 'Développement personnel et spiritualité',
  'lean': 'Tech, code et innovation',
  'movie': 'Films, séries et critiques',
  'sport': 'Sports, fitness et compétitions',
  'food': 'Cuisine, recettes et aventures culinaires',
  'travel': 'Voyages, aventures et exploration',
  'fashion': 'Mode, beauté et tendances',
  'science': 'Découvertes scientifiques et innovation',
  'documentary': 'Documentaires et histoire',
  'marketplace': 'E-commerce et entrepreneuriat',
  'kids': 'Contenu familial et éducatif',
  'news': 'Actualités et affaires courantes',
  'community': 'Contenus communautaires',
  'tech': 'Technologie et innovation digitale',
  'learn': 'Formations et tutoriels',
};

export const universeService = {
  async getAllUniverses(): Promise<Universe[]> {
    const { data, error } = await supabase
      .from('universes')
      .select('*')
      .order('name');

    if (error || !data || data.length === 0) {
      console.log('Using local universes data as fallback');
      return localUniverses.map(u => ({
        id: u.id,
        name: u.name,
        slug: u.id,
        description: descriptionMap[u.id] || `Explore l'univers ${u.name}`,
        color_primary: colorMap[u.id]?.primary || '#6b7280',
        color_secondary: colorMap[u.id]?.secondary || '#4b5563',
        created_at: new Date().toISOString(),
      }));
    }

    return data;
  },

  async getUniverseById(universeId: string): Promise<Universe | null> {
    const { data, error } = await supabase
      .from('universes')
      .select('*')
      .eq('id', universeId)
      .maybeSingle();

    if (error || !data) {
      const local = localUniverses.find(u => u.id === universeId);
      if (local) {
        return {
          id: local.id,
          name: local.name,
          slug: local.id,
          description: descriptionMap[local.id] || `Explore l'univers ${local.name}`,
          color_primary: colorMap[local.id]?.primary || '#6b7280',
          color_secondary: colorMap[local.id]?.secondary || '#4b5563',
          created_at: new Date().toISOString(),
        };
      }
      return null;
    }

    return data;
  },

  async getUniverseBySlug(slug: string): Promise<Universe | null> {
    const { data, error } = await supabase
      .from('universes')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      const local = localUniverses.find(u => u.id === slug);
      if (local) {
        return {
          id: local.id,
          name: local.name,
          slug: local.id,
          description: descriptionMap[local.id] || `Explore l'univers ${local.name}`,
          color_primary: colorMap[local.id]?.primary || '#6b7280',
          color_secondary: colorMap[local.id]?.secondary || '#4b5563',
          created_at: new Date().toISOString(),
        };
      }
      return null;
    }

    return data;
  },

  async getSubUniverses(universeId: string): Promise<SubUniverse[]> {
    const { data, error } = await supabase
      .from('sub_universes')
      .select('*')
      .eq('universe_id', universeId)
      .order('name');

    if (error || !data || data.length === 0) {
      const local = localUniverses.find(u => u.id === universeId);
      if (local && local.sub) {
        return local.sub.map((subName, index) => ({
          id: `${universeId}-${subName}`,
          universe_id: universeId,
          name: subName,
          slug: subName,
          description: `Explore ${subName}`,
          created_at: new Date().toISOString(),
        }));
      }
      return [];
    }

    return data;
  },

  async getSubUniverseById(subUniverseId: string): Promise<SubUniverse | null> {
    const { data, error } = await supabase
      .from('sub_universes')
      .select('*')
      .eq('id', subUniverseId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching sub-universe:', error);
      return null;
    }

    return data;
  },
};
