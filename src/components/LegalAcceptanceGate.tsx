import { useState } from 'react';
import { useLegalCompliance } from '../hooks/useLegalCompliance';

interface LegalAcceptanceGateProps {
  domain: 'global' | 'live' | 'gaming' | 'wallet' | 'premium' | 'community';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LegalAcceptanceGate({ domain, children, fallback }: LegalAcceptanceGateProps) {
  const { accepted, documents, loading, acceptDocument } = useLegalCompliance(domain);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking compliance status...</p>
        </div>
      </div>
    );
  }

  if (accepted) {
    return <>{children}</>;
  }

  const handleAccept = async (documentId: string) => {
    try {
      setAccepting(true);
      setError(null);
      await acceptDocument(documentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept document');
    } finally {
      setAccepting(false);
    }
  };

  const domainTitles: Record<string, string> = {
    global: 'GOROTI Platform',
    live: 'Live Streaming',
    gaming: 'Gaming Division',
    wallet: 'Wallet & TruCoins',
    premium: 'Premium Features',
    community: 'Community Features',
  };

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {domainTitles[domain]} Terms & Conditions
          </h1>
          <p className="text-gray-600">
            Please review and accept the following documents to continue
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {documents.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{doc.title}</h2>
                  <p className="text-sm text-gray-500">Version {doc.version}</p>
                </div>
              </div>

              {selectedDoc === doc.id ? (
                <div className="mb-4">
                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded p-4 bg-gray-50">
                    {doc.content_md ? (
                      <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                        {doc.content_md}
                      </div>
                    ) : doc.content_url ? (
                      <a
                        href={doc.content_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View document (opens in new tab)
                      </a>
                    ) : (
                      <p className="text-gray-500">No content available</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                  >
                    Hide content
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedDoc(doc.id)}
                  className="text-blue-600 hover:underline text-sm mb-4"
                >
                  Read full document
                </button>
              )}

              <button
                onClick={() => handleAccept(doc.id)}
                disabled={accepting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {accepting ? 'Accepting...' : 'I Accept'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            By accepting, you acknowledge that you have read and agree to the terms outlined in
            these documents.
          </p>
        </div>
      </div>
    </div>
  );
}
