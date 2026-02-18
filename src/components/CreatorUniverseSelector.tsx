import { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { Universe } from '../types';

interface CreatorUniverseSelectorProps {
  universes: Universe[];
  onComplete: (mainUniverseId: string, subUniverseIds: string[]) => void;
}

export default function CreatorUniverseSelector({
  universes,
  onComplete,
}: CreatorUniverseSelectorProps) {
  const [selectedMainUniverse, setSelectedMainUniverse] = useState<Universe | null>(null);
  const [selectedSubUniverseIds, setSelectedSubUniverseIds] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const toggleSubUniverse = (subUniverseId: string) => {
    if (selectedSubUniverseIds.includes(subUniverseId)) {
      setSelectedSubUniverseIds(
        selectedSubUniverseIds.filter((id) => id !== subUniverseId)
      );
    } else {
      setSelectedSubUniverseIds([...selectedSubUniverseIds, subUniverseId]);
    }
    setError('');
  };

  const handleContinue = () => {
    if (!selectedMainUniverse) {
      setError('Please select your main universe');
      return;
    }
    if (selectedSubUniverseIds.length === 0) {
      setError('Please select at least one sub-universe');
      return;
    }
    onComplete(selectedMainUniverse.id, selectedSubUniverseIds);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Choose Your Universe</h1>
          <p className="text-gray-400 text-lg">
            Select your main content universe and the sub-universes where you'll create
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <div className="space-y-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Main Universe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {universes.map((universe) => {
                const isSelected = selectedMainUniverse?.id === universe.id;
                return (
                  <button
                    key={universe.id}
                    onClick={() => {
                      setSelectedMainUniverse(universe);
                      setSelectedSubUniverseIds([]);
                      setError('');
                    }}
                    className={`p-5 rounded-xl border-2 transition-all text-left ${
                      isSelected ? 'bg-opacity-10' : 'border-gray-700 hover:border-gray-600'
                    }`}
                    style={
                      isSelected
                        ? {
                            borderColor: universe.colorPrimary,
                            backgroundColor: `${universe.colorPrimary}20`,
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                        style={{ backgroundColor: universe.colorPrimary }}
                      >
                        {universe.name.charAt(0)}
                      </div>
                      {isSelected && (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: universe.colorPrimary }}
                        >
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg">{universe.name}</h3>
                    <p className="text-sm text-gray-400">{universe.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedMainUniverse && selectedMainUniverse.subUniverses && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Sub-Universes in {selectedMainUniverse.name}
              </h2>
              <p className="text-gray-400 mb-4">
                Select one or more sub-universes where you'll create content
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {selectedMainUniverse.subUniverses.map((subUniverse) => {
                  const isSelected = selectedSubUniverseIds.includes(subUniverse.id);
                  return (
                    <button
                      key={subUniverse.id}
                      onClick={() => toggleSubUniverse(subUniverse.id)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                        isSelected
                          ? 'text-white border-2'
                          : 'text-gray-400 border-gray-700 hover:text-white hover:border-gray-600'
                      }`}
                      style={
                        isSelected
                          ? {
                              borderColor: selectedMainUniverse.colorPrimary,
                              backgroundColor: `${selectedMainUniverse.colorPrimary}20`,
                            }
                          : undefined
                      }
                    >
                      {subUniverse.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedMainUniverse || selectedSubUniverseIds.length === 0}
          className="w-full py-4 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium text-lg transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
