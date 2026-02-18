import { useState } from 'react';
import { Clock, Trash2, Search, Filter, X, Calendar } from 'lucide-react';
import Header from '../components/Header';

interface WatchHistoryPageProps {
  onNavigate: (page: string) => void;
}

export default function WatchHistoryPage({ onNavigate }: WatchHistoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Mock history data
  const historyItems = [
    {
      id: '1',
      videoId: 'v1',
      title: 'Comment créer du contenu authentique',
      thumbnail: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300',
      creator: 'Alex Beats',
      creatorAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50',
      views: 12450,
      duration: '12:34',
      watchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      watchProgress: 75
    },
    {
      id: '2',
      videoId: 'v2',
      title: 'Les secrets d\'une bonne miniature',
      thumbnail: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=300',
      creator: 'TechTalker',
      creatorAvatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=50',
      views: 8230,
      duration: '8:45',
      watchedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      watchProgress: 100
    },
    {
      id: '3',
      videoId: 'v3',
      title: 'Tutoriel production musicale avancée',
      thumbnail: 'https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg?auto=compress&cs=tinysrgb&w=300',
      creator: 'Alex Beats',
      creatorAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50',
      views: 15670,
      duration: '24:18',
      watchedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      watchProgress: 45
    },
    {
      id: '4',
      videoId: 'v4',
      title: 'Mon setup studio 2024',
      thumbnail: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=300',
      creator: 'FilmCrew',
      creatorAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=50',
      views: 9820,
      duration: '15:22',
      watchedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      watchProgress: 90
    },
    {
      id: '5',
      videoId: 'v5',
      title: 'Session live - Questions/Réponses',
      thumbnail: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
      creator: 'Alex Beats',
      creatorAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50',
      views: 23450,
      duration: '1:42:15',
      watchedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      watchProgress: 60
    }
  ];

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} heures`;
    if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)} jours`;
    if (seconds < 2592000) return `Il y a ${Math.floor(seconds / 604800)} semaines`;
    return `Il y a ${Math.floor(seconds / 2592000)} mois`;
  };

  const groupByDate = (items: typeof historyItems) => {
    const groups: { [key: string]: typeof historyItems } = {
      "Aujourd'hui": [],
      "Cette semaine": [],
      "Ce mois-ci": [],
      "Plus ancien": []
    };

    const now = Date.now();
    const today = now - 24 * 60 * 60 * 1000;
    const week = now - 7 * 24 * 60 * 60 * 1000;
    const month = now - 30 * 24 * 60 * 60 * 1000;

    items.forEach(item => {
      const time = item.watchedAt.getTime();
      if (time > today) groups["Aujourd'hui"].push(item);
      else if (time > week) groups["Cette semaine"].push(item);
      else if (time > month) groups["Ce mois-ci"].push(item);
      else groups["Plus ancien"].push(item);
    });

    return groups;
  };

  const filteredHistory = historyItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedHistory = groupByDate(filteredHistory);

  const handleClearHistory = () => {
    setShowClearDialog(false);
    // Implement clear history logic
  };

  const handleRemoveItem = (id: string) => {
    // Implement remove item logic
    console.log('Remove item:', id);
  };

  return (
    <>
      <Header onNavigate={onNavigate} showNavigation={true} />

      <div className="min-h-screen bg-gray-950 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Historique de visionnage</h1>
              <p className="text-gray-400">{filteredHistory.length} vidéos regardées</p>
            </div>
            <button
              onClick={() => setShowClearDialog(true)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Effacer l'historique
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher dans l'historique..."
                className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {(['today', 'week', 'month', 'all'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedDate(period)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    selectedDate === period
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {period === 'today' && "Aujourd'hui"}
                  {period === 'week' && 'Cette semaine'}
                  {period === 'month' && 'Ce mois'}
                  {period === 'all' && 'Tout'}
                </button>
              ))}
            </div>
          </div>

          {/* History List */}
          <div className="space-y-8">
            {Object.entries(groupedHistory).map(([group, items]) => {
              if (items.length === 0) return null;

              return (
                <div key={group}>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-red-500" />
                    {group}
                  </h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors group"
                      >
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0">
                          <div className="w-40 md:w-48 aspect-video rounded-lg overflow-hidden bg-gray-800">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-90 px-1.5 py-0.5 rounded text-xs font-semibold">
                              {item.duration}
                            </div>
                          </div>
                          {/* Progress bar */}
                          {item.watchProgress > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                              <div
                                className="h-full bg-red-600"
                                style={{ width: `${item.watchProgress}%` }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-red-500 transition-colors">
                            {item.title}
                          </h3>

                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={item.creatorAvatar}
                              alt={item.creator}
                              className="w-6 h-6 rounded-full"
                            />
                            <p className="text-sm text-gray-400">{item.creator}</p>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>{item.views.toLocaleString()} vues</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(item.watchedAt)}
                            </span>
                            {item.watchProgress > 0 && item.watchProgress < 100 && (
                              <>
                                <span>•</span>
                                <span>{item.watchProgress}% regardé</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-16">
              <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Aucun historique</h3>
              <p className="text-gray-400">
                {searchQuery
                  ? 'Aucune vidéo ne correspond à votre recherche'
                  : 'Vous n\'avez pas encore regardé de vidéos'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Clear History Dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Effacer l'historique ?</h2>
            <p className="text-gray-400 mb-6">
              Cette action supprimera définitivement toutes les vidéos de votre historique de visionnage. Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearDialog(false)}
                className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Effacer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
