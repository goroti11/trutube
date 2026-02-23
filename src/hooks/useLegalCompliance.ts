import { useEffect, useState } from 'react';
import { legalService } from '../services/legalService';
import type { LegalDocument } from '../types/database';
import { useAuth } from './useAuth';

export function useLegalCompliance(domain: string) {
  const { user } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadCompliance();
  }, [user, domain]);

  const loadCompliance = async () => {
    try {
      setLoading(true);
      const result = await legalService.checkCompliance(domain);
      setAccepted(result.accepted);
      setDocuments(result.documents);
    } catch (error) {
      console.error('Failed to check compliance:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptDocument = async (documentId: string) => {
    try {
      await legalService.acceptDocument(documentId);
      await loadCompliance();
    } catch (error) {
      throw error;
    }
  };

  return {
    accepted,
    documents,
    loading,
    acceptDocument,
    refresh: loadCompliance,
  };
}
