import { supabase } from '../lib/supabase';

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

export const universeService = {
  async getAllUniverses(): Promise<Universe[]> {
    const { data, error } = await supabase
      .from('universes')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching universes:', error);
      return [];
    }

    return data;
  },

  async getUniverseById(universeId: string): Promise<Universe | null> {
    const { data, error } = await supabase
      .from('universes')
      .select('*')
      .eq('id', universeId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching universe:', error);
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

    if (error) {
      console.error('Error fetching universe:', error);
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

    if (error) {
      console.error('Error fetching sub-universes:', error);
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
