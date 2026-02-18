import { Universe, SubUniverse } from '../types';

interface UniverseNavigationProps {
  universes: Universe[];
  selectedUniverse: Universe | null;
  selectedSubUniverse: SubUniverse | null;
  onUniverseSelect: (universe: Universe) => void;
  onSubUniverseSelect: (subUniverse: SubUniverse) => void;
}

export default function UniverseNavigation({
  universes,
  selectedUniverse,
  selectedSubUniverse,
  onUniverseSelect,
  onSubUniverseSelect,
}: UniverseNavigationProps) {
  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
          {universes.map((universe) => (
            <button
              key={universe.id}
              onClick={() => onUniverseSelect(universe)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedUniverse?.id === universe.id
                  ? 'text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              style={
                selectedUniverse?.id === universe.id
                  ? {
                      backgroundColor: universe.colorPrimary,
                      boxShadow: `0 4px 14px ${universe.colorPrimary}40`,
                    }
                  : undefined
              }
            >
              {universe.name}
            </button>
          ))}
        </div>

        {selectedUniverse && selectedUniverse.subUniverses && (
          <div className="flex items-center gap-2 pb-3 overflow-x-auto scrollbar-hide">
            {selectedUniverse.subUniverses.map((subUniverse) => (
              <button
                key={subUniverse.id}
                onClick={() => onSubUniverseSelect(subUniverse)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedSubUniverse?.id === subUniverse.id
                    ? 'bg-gray-700 text-white border-2'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                style={
                  selectedSubUniverse?.id === subUniverse.id
                    ? { borderColor: selectedUniverse.colorPrimary }
                    : undefined
                }
              >
                {subUniverse.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
