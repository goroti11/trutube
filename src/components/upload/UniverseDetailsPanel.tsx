import { CheckCircle, TrendingUp, DollarSign, Lightbulb, Users } from 'lucide-react';
import { UniverseDetail } from '../../data/universeDetails';

interface UniverseDetailsPanelProps {
  universe: UniverseDetail;
}

export default function UniverseDetailsPanel({ universe }: UniverseDetailsPanelProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className={`text-4xl p-3 bg-gradient-to-br ${universe.color} rounded-xl`}>
          {universe.icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold">{universe.name}</h3>
          <p className="text-gray-400 text-sm">{universe.description}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-gray-300 leading-relaxed">
            {universe.longDescription}
          </p>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-blue-400" />
            <h4 className="font-semibold text-white">Audience cible</h4>
          </div>
          <p className="text-gray-400 text-sm">{universe.targetAudience}</p>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h4 className="font-semibold text-white">Meilleures pratiques</h4>
          </div>
          <ul className="space-y-2">
            {universe.bestPractices.map((practice, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-green-400 mt-0.5">•</span>
                <span>{practice}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h4 className="font-semibold text-white">Exemples de contenu</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {universe.contentExamples.map((example, index) => (
              <div
                key={index}
                className="bg-gray-800 px-3 py-2 rounded-lg text-xs text-gray-300"
              >
                {example}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-white">Sujets tendances</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {universe.trendingTopics.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-xs text-cyan-300"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            <h4 className="font-semibold text-white">Conseils monétisation</h4>
          </div>
          <ul className="space-y-2">
            {universe.monetizationTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-yellow-400 mt-0.5">💰</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-lg p-4">
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-primary-400">Astuce Pro:</span> Plus votre contenu est spécifique et de qualité dans cet univers, plus vous aurez de chances d'être recommandé à une audience engagée et de monétiser efficacement votre chaîne.
          </p>
        </div>
      </div>
    </div>
  );
}
