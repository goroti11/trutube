import { useState } from 'react';
import { Sliders, Check, X } from 'lucide-react';
import { universes } from '../data/universes';

export default function FeedPreferencesPage() {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [expandedUniverse, setExpandedUniverse] = useState<string | null>(null);

  const togglePreference = (universeId: string, sub: string) => {
    const key = `${universeId}:${sub}`;
    setSelectedPreferences((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const selectAllInUniverse = (universeId: string) => {
    const universe = universes.find((u) => u.id === universeId);
    if (!universe) return;

    const universeKeys = universe.sub.map((sub) => `${universeId}:${sub}`);
    const allSelected = universeKeys.every((key) =>
      selectedPreferences.includes(key)
    );

    if (allSelected) {
      setSelectedPreferences((prev) =>
        prev.filter((p) => !p.startsWith(`${universeId}:`))
      );
    } else {
      setSelectedPreferences((prev) => [
        ...prev.filter((p) => !p.startsWith(`${universeId}:`)),
        ...universeKeys,
      ]);
    }
  };

  const getSelectedCountForUniverse = (universeId: string): number => {
    return selectedPreferences.filter((p) => p.startsWith(`${universeId}:`))
      .length;
  };

  const handleSave = () => {
    if (selectedPreferences.length === 0) {
      alert('Please select at least one sub-universe to personalize your feed');
      return;
    }

    console.log('User preferences:', selectedPreferences);
    alert(`Feed preferences saved! ${selectedPreferences.length} sub-universes selected.`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
              <Sliders className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Personalize Your Feed</h1>
              <p className="text-gray-400">
                Choose which universes you want to see
              </p>
            </div>
          </div>

          {selectedPreferences.length > 0 && (
            <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  <span className="font-semibold text-white">
                    {selectedPreferences.length}
                  </span>{' '}
                  sub-universes selected
                </span>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-sm font-medium transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {universes.map((universe) => {
            const selectedCount = getSelectedCountForUniverse(universe.id);
            const isExpanded = expandedUniverse === universe.id;
            const allSelected = selectedCount === universe.sub.length;

            return (
              <div
                key={universe.id}
                className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedUniverse(isExpanded ? null : universe.id)
                  }
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <h2 className="text-xl font-bold">{universe.name}</h2>
                      <p className="text-sm text-gray-400">
                        {selectedCount > 0 ? (
                          <span className="text-primary-500">
                            {selectedCount} of {universe.sub.length} selected
                          </span>
                        ) : (
                          `${universe.sub.length} sub-universes available`
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {selectedCount > 0 && (
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                    <div
                      className={`transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Select Sub-Universes</h3>
                      <button
                        onClick={() => selectAllInUniverse(universe.id)}
                        className="text-sm text-primary-500 hover:text-primary-400 transition-colors"
                      >
                        {allSelected ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {universe.sub.map((sub) => {
                        const key = `${universe.id}:${sub}`;
                        const isSelected = selectedPreferences.includes(key);

                        return (
                          <button
                            key={sub}
                            onClick={() => togglePreference(universe.id, sub)}
                            className={`p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                              isSelected
                                ? 'border-primary-500 bg-primary-500/10'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <span className="text-sm font-medium capitalize text-left">
                              {sub.replace(/-/g, ' ')}
                            </span>
                            {isSelected ? (
                              <Check className="w-4 h-4 text-primary-500 flex-shrink-0 ml-2" />
                            ) : (
                              <X className="w-4 h-4 text-gray-600 flex-shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedPreferences.length > 0 && (
          <div className="mt-8 bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="font-semibold mb-4">Your Feed Will Include:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedPreferences.map((pref) => {
                const [universeId, sub] = pref.split(':');
                const universe = universes.find((u) => u.id === universeId);
                return (
                  <span
                    key={pref}
                    className="px-3 py-1.5 bg-gray-800 rounded-full text-sm flex items-center gap-2"
                  >
                    <span className="text-gray-400">{universe?.name}</span>
                    <span className="text-primary-500">•</span>
                    <span className="capitalize">{sub.replace(/-/g, ' ')}</span>
                    <button
                      onClick={() => {
                        setSelectedPreferences((prev) =>
                          prev.filter((p) => p !== pref)
                        );
                      }}
                      className="ml-1 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                );
              })}
            </div>

            <button
              onClick={handleSave}
              className="w-full mt-6 py-4 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition-colors"
            >
              Save and Update Feed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
