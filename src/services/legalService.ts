import { supabase } from '../lib/supabase';
import type { LegalDocument } from '../types/database';

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export const legalService = {
  async checkAcceptance(domain: string): Promise<{ accepted: boolean; documents: LegalDocument[] }> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`${FUNCTIONS_URL}/legal-check?domain=${domain}`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to check legal acceptance');
    }

    const result = await response.json();
    return { accepted: result.accepted, documents: result.documents };
  },

  async acceptDocument(documentId: string, deviceFingerprint?: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`${FUNCTIONS_URL}/legal-accept`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document_id: documentId,
        device_fingerprint: deviceFingerprint,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to accept document');
    }
  },

  async getActiveDocuments(domain: string): Promise<LegalDocument[]> {
    const { data, error } = await supabase
      .from('legal_documents')
      .select('*')
      .eq('domain', domain)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
