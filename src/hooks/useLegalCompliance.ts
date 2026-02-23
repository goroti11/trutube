import { useEffect, useState } from 'react';
import { legalService } from '../services/legalService';
import type { LegalDocument } from '../types/database';

export function useLegalCompliance(domain: string) {
  const [accepted, setAccepted] = useState<boolean>(false);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    checkCompliance();
  }, [domain]);

  const checkCompliance = async () => {
    try {
      setLoading(true);
      const result = await legalService.checkAcceptance(domain);
      setAccepted(result.accepted);
      setDocuments(result.documents);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const acceptDocument = async (documentId: string, deviceFingerprint?: string) => {
    try {
      await legalService.acceptDocument(documentId, deviceFingerprint);
      await checkCompliance();
    } catch (err) {
      throw err;
    }
  };

  return {
    accepted,
    documents,
    loading,
    error,
    acceptDocument,
    refresh: checkCompliance,
  };
}
