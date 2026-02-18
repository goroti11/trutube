import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Universe, UserPreferences } from '../types';

interface UserPreferencesModalProps {
  universes: Universe[];
  currentPreferences: UserPreferences | null;
  onSave: (universeIds: string[], subUniverseIds: string[]) => void;
  onClose: () => void;
}

export default function UserPreferencesModal({
  universes,
  currentPreferences,
  onSave,
  onClose,
}: UserPreferencesModalProps) {
  const [selectedUniverseIds, setSelectedUniverseIds] = useState<string[]>(
    currentPreferences?.universeIds || []
  );
  const [selectedSubUniverseIds, setSelectedSubUniverseIds] = useState<string[]>(
    currentPreferences?.subUniverseIds || []
  );

  const toggleUniverse = (universeId: string) => {
    if (selectedUniverseIds.includes(universeId)) {
      setSelectedUniverseIds(selectedUniverseIds.filter((id) => id !== universeId));
      const universe = universes.find((u) => u.id === universeId);
      if (universe?.subUniverses) {
        const subIds = universe.subUniverses.map((s) => s.id);
        setSelectedSubUniverseIds(
          selectedSubUniverseIds.filter((id) => !subIds.includes(id))
        );
      }
    } else {
      setSelectedUniverseIds([...selectedUniverseIds, universeId]);
    }
  };

  const toggleSubUniverse = (subUniverseId: string) => {
    if (selectedSubUniverseIds.includes(subUniverseId)) {
      setSelectedSubUniverseIds(
        selectedSubUniverseIds.filter((id) => id !== subUniverseId)
      );
    } else {
      setSelectedSubUniverseIds([...selectedSubUniverseIds, subUniverseId]);
    }
  };

  const handleSave = () => {
    onSave(selectedUniverseIds, selectedSubUniverseIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Customize Your Feed</h2>
            <p className="text-sm text-gray-400 mt-1">
              Select the universes and sub-universes you want to see
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {universes.map((universe) => {
            const isUniverseSelected = selectedUniverseIds.includes(universe.id);

            return (
              <div key={universe.id} className="space-y-4">
                <button
                  onClick={() => toggleUniverse(universe.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    isUniverseSelected
                      ? 'bg-opacity-10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  style={
                    isUniverseSelected
                      ? {
                          borderColor: universe.colorPrimary,
                          backgroundColor: `${universe.colorPrimary}20`,
                        }
                      : undefined
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: universe.colorPrimary }}
                    >
                      {universe.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">{universe.name}</h3>
                      <p className="text-sm text-gray-400">{universe.description}</p>
                    </div>
                  </div>
                  {isUniverseSelected && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: universe.colorPrimary }}
                    >
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>

                {isUniverseSelected && universe.subUniverses && (
                  <div className="ml-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {universe.subUniverses.map((subUniverse) => {
                      const isSelected = selectedSubUniverseIds.includes(subUniverse.id);
                      return (
                        <button
                          key={subUniverse.id}
                          onClick={() => toggleSubUniverse(subUniverse.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                            isSelected
                              ? 'text-white border-2'
                              : 'text-gray-400 border-gray-700 hover:text-white hover:border-gray-600'
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
                          {subUniverse.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
