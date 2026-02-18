import { useState } from 'react';
import { Search, Bot, TrendingUp, Download, Shield, Zap, Star, Crown } from 'lucide-react';
import { aiSearchService } from '../../services/aiSearchService';
import { useAuth } from '../../contexts/AuthContext';

interface PremiumFeaturesProps {
  premiumTier: 'free' | 'gold' | 'platinum';
}

export default function PremiumFeatures({ premiumTier }: PremiumFeaturesProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [assistantQuestion, setAssistantQuestion] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  // Recherche IA (Platinum uniquement)
  const handleAISearch = async () => {
    if (!searchQuery.trim() || !user || premiumTier !== 'platinum') return;

    setIsSearching(true);
    try {
      const results = await aiSearchService.searchWithAI({
        query: searchQuery,
        userId: user.id
      });
      setSearchResults(results);
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la recherche');
    } finally {
      setIsSearching(false);
    }
  };

  // Assistant créateur (Platinum uniquement)
  const handleAskAssistant = async () => {
    if (!assistantQuestion.trim() || !user || premiumTier !== 'platinum') return;

    setIsAsking(true);
    try {
      const response = await aiSearchService.getCreatorAssistance(
        user.id,
        assistantQuestion
      );
      setAssistantResponse(response);
    } catch (error: any) {
      alert(error.message || 'Erreur de l\'assistant');
    } finally {
      setIsAsking(false);
    }
  };

  const features = {
    free: [
      { icon: Search, label: 'Recherche basique', available: true },
      { icon: Download, label: 'Téléchargement hors ligne', available: false },
      { icon: Shield, label: 'Sans publicité', available: false },
      { icon: Bot, label: 'Recherche IA', available: false },
    ],
    gold: [
      { icon: Search, label: 'Recherche basique', available: true },
      { icon: Download, label: 'Téléchargement hors ligne', available: true },
      { icon: Shield, label: 'Sans publicité', available: true },
      { icon: TrendingUp, label: 'Analytics avancés', available: true },
      { icon: Bot, label: 'Recherche IA', available: false },
    ],
    platinum: [
      { icon: Search, label: 'Recherche basique', available: true },
      { icon: Download, label: 'Téléchargement hors ligne', available: true },
      { icon: Shield, label: 'Sans publicité', available: true },
      { icon: TrendingUp, label: 'Analytics avancés', available: true },
      { icon: Bot, label: 'Recherche IA ChatGPT 4.2', available: true },
      { icon: Zap, label: 'Assistant créateur IA', available: true },
      { icon: Star, label: 'Recommandations IA', available: true },
    ]
  };

  return (
    <div className="space-y-6">
      {/* Badge Premium */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          {premiumTier === 'platinum' ? (
            <Crown className="w-8 h-8 text-white" />
          ) : premiumTier === 'gold' ? (
            <Star className="w-8 h-8 text-white" />
          ) : (
            <Shield className="w-8 h-8 text-white" />
          )}
          <h2 className="text-2xl font-bold text-white capitalize">
            {premiumTier === 'free' ? 'Version Gratuite' : `${premiumTier} Premium`}
          </h2>
        </div>
        <p className="text-white/90">
          {premiumTier === 'platinum' && 'Accès complet à toutes les fonctionnalités IA avancées'}
          {premiumTier === 'gold' && 'Sans publicité avec analytics avancés'}
          {premiumTier === 'free' && 'Passez au Premium pour débloquer plus de fonctionnalités'}
        </p>
      </div>

      {/* Liste des fonctionnalités */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Vos fonctionnalités</h3>
        <div className="space-y-3">
          {features[premiumTier].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  feature.available ? 'bg-green-900/20' : 'bg-gray-900/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${feature.available ? 'text-green-400' : 'text-gray-500'}`} />
                <span className={feature.available ? 'text-white' : 'text-gray-500'}>
                  {feature.label}
                </span>
                {feature.available ? (
                  <span className="ml-auto text-green-400 text-sm font-semibold">Activé</span>
                ) : (
                  <span className="ml-auto text-gray-500 text-sm">Non disponible</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recherche IA (Platinum uniquement) */}
      {premiumTier === 'platinum' && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bot className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Recherche IA ChatGPT 4.2</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Recherche sémantique avancée avec analyse par IA
          </p>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAISearch()}
              placeholder="Rechercher avec l'IA..."
              className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleAISearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              {isSearching ? 'Recherche...' : 'Rechercher'}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <div key={index} className="p-4 bg-gray-900 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-semibold">{result.title}</h4>
                    <span className="text-purple-400 text-sm">
                      {Math.round(result.relevanceScore * 100)}% pertinent
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{result.description}</p>
                  <div className="p-3 bg-purple-900/20 rounded border border-purple-500/20">
                    <p className="text-purple-300 text-sm">
                      <strong>Analyse IA:</strong> {result.aiSummary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Assistant Créateur (Platinum uniquement) */}
      {premiumTier === 'platinum' && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Assistant Créateur IA</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Posez vos questions sur la création de contenu
          </p>

          <div className="space-y-4">
            <textarea
              value={assistantQuestion}
              onChange={(e) => setAssistantQuestion(e.target.value)}
              placeholder="Comment optimiser mes titres de vidéos ?"
              rows={3}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
            />

            <button
              onClick={handleAskAssistant}
              disabled={isAsking || !assistantQuestion.trim()}
              className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              {isAsking ? 'L\'IA réfléchit...' : 'Demander à l\'IA'}
            </button>

            {assistantResponse && (
              <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <Bot className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {assistantResponse}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upgrade CTA pour free et gold */}
      {premiumTier !== 'platinum' && (
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 border border-purple-500/20">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Passez à Platinum</h3>
          </div>
          <p className="text-gray-200 mb-4">
            Débloquez la recherche IA ChatGPT 4.2, l'assistant créateur et les recommandations personnalisées
          </p>
          <button className="w-full px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg font-bold transition-all">
            Découvrir Platinum
          </button>
        </div>
      )}
    </div>
  );
}
