import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { legendService } from '../services/legendService';
import { LegendCard } from '../components/legend/LegendCard';
import { LegendBadge } from '../components/legend/LegendBadge';
import type { LegendRegistry, LegendCategory, LegendStats } from '../types/legend';

export function LegendPage() {
  const [legends, setLegends] = useState<LegendRegistry[]>([]);
  const [categories, setCategories] = useState<LegendCategory[]>([]);
  const [stats, setStats] = useState<LegendStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedLevel]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [legendsData, categoriesData, statsData] = await Promise.all([
        legendService.getLegends({
          category: selectedCategory || undefined,
          level: selectedLevel || undefined,
          limit: 50,
        }),
        legendService.getCategories(),
        legendService.getStats(),
      ]);
      setLegends(legendsData);
      setCategories(categoriesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load legend data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold text-white mb-4">
            🏛️ GOROTI LÉGENDE
          </h1>
          <p className="text-2xl text-yellow-100 mb-4">
            Le Panthéon du contenu exceptionnel
          </p>
          <Link
            to="/hall-of-fame"
            className="inline-block px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white font-semibold transition-colors"
          >
            🏆 Voir le Hall of Fame
          </Link>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold text-white mb-2">
                  {stats.total_legends}
                </div>
                <div className="text-yellow-100">Total Légendes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold text-white mb-2">
                  {stats.by_level?.[4] || 0}
                </div>
                <div className="text-yellow-100">Légendes Ultimes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold text-white mb-2">
                  {stats.by_level?.[3] || 0}
                </div>
                <div className="text-yellow-100">Légendes Iconiques</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold text-white mb-2">
                  {stats.recent_grants}
                </div>
                <div className="text-yellow-100">Ce mois-ci</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Filtres</h2>

          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Niveau</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedLevel(null)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedLevel === null
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Tous
                </button>
                {[1, 2, 3, 4].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`transition-colors ${
                      selectedLevel === level ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <LegendBadge level={level as 1 | 2 | 3 | 4} showLabel />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Catégorie</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === null
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Toutes
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {category.icon} {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        ) : legends.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-lg">Aucune légende trouvée</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legends.map((legend) => (
              <LegendCard key={legend.id} legend={legend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
