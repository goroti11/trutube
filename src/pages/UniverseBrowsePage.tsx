import { useState } from 'react';
import { ArrowLeft, Grid3x3 } from 'lucide-react';
import { universes } from '../data/universes';

export default function UniverseBrowsePage() {
  const [selectedUniverse, setSelectedUniverse] = useState<string | null>(null);

  const currentUniverse = universes.find((u) => u.id === selectedUniverse);

  if (currentUniverse) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => setSelectedUniverse(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Universes
          </button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{currentUniverse.name}</h1>
            <p className="text-gray-400">
              {currentUniverse.sub.length} sub-universes
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentUniverse.sub.map((sub) => (
              <div
                key={sub}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-primary-500 transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-500/30 transition-colors">
                  <Grid3x3 className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-semibold capitalize">{sub.replace(/-/g, ' ')}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Explore Universes</h1>
          <p className="text-gray-400">
            Choose a universe to discover its sub-categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universes.map((universe) => (
            <button
              key={universe.id}
              onClick={() => setSelectedUniverse(universe.id)}
              className="bg-gray-900 rounded-2xl p-8 border-2 border-gray-800 hover:border-primary-500 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold group-hover:text-primary-500 transition-colors">
                  {universe.name}
                </h2>
                <div className="text-sm text-gray-400">
                  {universe.sub.length} sub
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Click to explore sub-universes
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
