import { supabase } from '../lib/supabase';
import type { LegalDocument, LegalAcceptance } from '../types/database';

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export const legalService = {
  async getDocuments(domain: string): Promise<LegalDocument[]> {
    const { data, error } = await supabase
      .from('legal_documents')
      .select('*')
      .eq('domain', domain)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async checkCompliance(domain: string): Promise<{ accepted: boolean; documents: LegalDocument[] }> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`${FUNCTIONS_URL}/legal-check?domain=${domain}`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to check compliance');
    }

    return response.json();
  },

  async acceptDocument(documentId: string, ipAddress?: string, deviceFingerprint?: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase.rpc('rpc_accept_legal_document', {
      p_document_id: documentId,
      p_ip_address: ipAddress || null,
      p_device_fingerprint: deviceFingerprint || null,
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);
  },

  async getUserAcceptances(userId: string): Promise<LegalAcceptance[]> {
    const { data, error } = await supabase
      .from('legal_acceptances')
      .select('*')
      .eq('user_id', userId)
      .order('accepted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
