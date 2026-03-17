import { useState, useEffect } from 'react';
import { universeService, Universe } from '../services/universeService';

export default function UniversesDebugPage() {
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUniverses();
  }, []);

  const loadUniverses = async () => {
    try {
      setLoading(true);
      const data = await universeService.getAllUniverses();
      console.log('Loaded universes:', data);
      setUniverses(data);
    } catch (err) {
      console.error('Error loading universes:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading universes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl font-bold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-4">Universes Debug Page</h1>
          <p className="text-xl text-gray-400">Total universes loaded: <span className="text-white font-bold">{universes.length}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universes.map((universe, index) => (
            <div
              key={universe.id}
              className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">#{index + 1}</p>
                  <h2 className="text-2xl font-black mb-2">{universe.name}</h2>
                  <p className="text-sm text-gray-400 mb-2">{universe.description}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">ID:</span>
                  <code className="bg-gray-900 px-2 py-1 rounded text-gray-300">{universe.id}</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Slug:</span>
                  <code className="bg-gray-900 px-2 py-1 rounded text-gray-300">{universe.slug}</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Primary Color:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-gray-600"
                      style={{ backgroundColor: universe.color_primary }}
                    />
                    <code className="bg-gray-900 px-2 py-1 rounded text-gray-300">{universe.color_primary}</code>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Secondary Color:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-gray-600"
                      style={{ backgroundColor: universe.color_secondary }}
                    />
                    <code className="bg-gray-900 px-2 py-1 rounded text-gray-300">{universe.color_secondary}</code>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {universes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">No universes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
