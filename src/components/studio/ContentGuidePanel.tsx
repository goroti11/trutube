import { useState } from 'react';
import { CheckCircle, Target, TrendingUp, DollarSign, Lightbulb, Users, ChevronRight, Globe } from 'lucide-react';
import { UniverseDetail, getUniverseDetail, getAllUniverseDetails } from '../../data/universeDetails';

export default function ContentGuidePanel() {
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseDetail | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const allUniverses = getAllUniverseDetails();

  const handleUniverseSelect = (universeId: string) => {
    const universe = getUniverseDetail(universeId);
    if (universe) {
      setSelectedUniverse(universe);
      setShowDetails(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-6 h-6 text-primary-400" />
          <h2 className="text-2xl font-bold text-white">Guide de création de contenu</h2>
        </div>

        <p className="text-gray-300 mb-6">
          Sélectionnez un univers pour découvrir les meilleures pratiques, exemples de contenu,
          sujets tendances et conseils de monétisation spécifiques.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {allUniverses.map((universe) => (
            <button
              key={universe.id}
              onClick={() => handleUniverseSelect(universe.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedUniverse?.id === universe.id
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-700 bg-gray-900 hover:border-gray-600 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{universe.icon}</span>
                <ChevronRight className={`w-5 h-5 transition-transform ${
                  selectedUniverse?.id === universe.id ? 'rotate-90' : ''
                }`} />
              </div>
              <div className="font-bold text-white mb-1">{universe.name}</div>
              <div className="text-sm text-gray-400 line-clamp-2">{universe.description}</div>
            </button>
          ))}
        </div>
      </div>

      {showDetails && selectedUniverse && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className={`text-4xl p-3 bg-gradient-to-br ${selectedUniverse.color} rounded-xl`}>
              {selectedUniverse.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{selectedUniverse.name}</h3>
              <p className="text-gray-400 text-sm">{selectedUniverse.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-gray-300 leading-relaxed">
                {selectedUniverse.longDescription}
              </p>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-blue-400" />
                <h4 className="font-semibold text-white">Audience cible</h4>
              </div>
              <p className="text-gray-400 text-sm">{selectedUniverse.targetAudience}</p>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-white">Meilleures pratiques</h4>
              </div>
              <ul className="space-y-2">
                {selectedUniverse.bestPractices.map((practice, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h4 className="font-semibold text-white">Exemples de contenu</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {selectedUniverse.contentExamples.map((example, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 px-3 py-2 rounded-lg text-xs text-gray-300 border border-gray-700"
                  >
                    {example}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-red-400" />
                <h4 className="font-semibold text-white">Sujets tendances</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedUniverse.trendingTopics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-300"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                <h4 className="font-semibold text-white">Conseils de monétisation</h4>
              </div>
              <ul className="space-y-2">
                {selectedUniverse.monetizationTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-yellow-400 mt-0.5">💰</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-primary-400">Astuce Pro:</span> Utilisez ces conseils
                lors de la création de votre contenu pour maximiser votre portée, engagement et revenus
                sur GOROTI.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
