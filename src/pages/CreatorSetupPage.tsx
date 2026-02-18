import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { universes } from '../data/universes';

export default function CreatorSetupPage() {
  const [mainUniverse, setMainUniverse] = useState<string>('');
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);

  const currentUniverse = universes.find((u) => u.id === mainUniverse);

  const toggleSub = (sub: string) => {
    setSelectedSubs((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleSave = () => {
    if (!mainUniverse || selectedSubs.length === 0) {
      alert('Please select a main universe and at least one sub-universe');
      return;
    }

    console.log('Creator setup:', { mainUniverse, selectedSubs });
    alert('Creator universe settings saved!');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Creator Setup</h1>
              <p className="text-gray-400">Define your content universe</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-4">
              Step 1: Choose Your Main Universe
            </h2>
            <p className="text-gray-400 mb-6">
              This defines the primary category for your content
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {universes.map((universe) => (
                <button
                  key={universe.id}
                  onClick={() => {
                    setMainUniverse(universe.id);
                    setSelectedSubs([]);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    mainUniverse === universe.id
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="font-semibold">{universe.name}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {universe.sub.length} sub
                  </div>
                </button>
              ))}
            </div>
          </div>

          {currentUniverse && (
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-4">
                Step 2: Select Sub-Universes
              </h2>
              <p className="text-gray-400 mb-6">
                Choose one or more specific categories within{' '}
                <span className="text-primary-500 font-semibold">
                  {currentUniverse.name}
                </span>
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {currentUniverse.sub.map((sub) => {
                  const isSelected = selectedSubs.includes(sub);
                  return (
                    <button
                      key={sub}
                      onClick={() => toggleSub(sub)}
                      className={`p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <span className="font-medium capitalize">
                        {sub.replace(/-/g, ' ')}
                      </span>
                      {isSelected && (
                        <Check className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedSubs.length > 0 && (
                <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Selected:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSubs.map((sub) => (
                      <span
                        key={sub}
                        className="px-3 py-1 bg-primary-500/20 text-primary-500 rounded-full text-sm"
                      >
                        {sub.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {mainUniverse && selectedSubs.length > 0 && (
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Step 3: Confirm</h2>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <span className="text-gray-400">Main Universe</span>
                  <span className="font-semibold text-primary-500">
                    {currentUniverse?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <span className="text-gray-400">Sub-Universes</span>
                  <span className="font-semibold">{selectedSubs.length}</span>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-300">
                  All your videos must be published within{' '}
                  <span className="font-semibold text-white">
                    {currentUniverse?.name}
                  </span>{' '}
                  and the selected sub-universes. This ensures your content
                  reaches the right audience.
                </p>
              </div>

              <button
                onClick={handleSave}
                className="w-full py-4 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition-colors"
              >
                Save Creator Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
