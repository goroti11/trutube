import { useState } from 'react';
import { Music, Gamepad2, BookOpen, Theater, Heart, Brain, Code, Film, Trophy } from 'lucide-react';
import AdUnit from '../components/AdUnit';
import FreeTrialBanner from '../components/FreeTrialBanner';

interface HomePageProps {
  onUniverseClick: (universeId: string) => void;
}

const universes = [
  {
    id: 'music',
    name: 'Music',
    icon: Music,
    color: 'from-purple-600 to-purple-800',
    description: 'Clips, Freestyle, Lives, Concerts',
  },
  {
    id: 'game',
    name: 'Game',
    icon: Gamepad2,
    color: 'from-green-600 to-green-800',
    description: 'Streams, Highlights, Tournois',
  },
  {
    id: 'know',
    name: 'Know',
    icon: BookOpen,
    color: 'from-blue-600 to-blue-800',
    description: 'Formations, Finance, Crypto, IA',
  },
  {
    id: 'culture',
    name: 'Culture',
    icon: Theater,
    color: 'from-orange-600 to-orange-800',
    description: 'Podcasts, Débats, Storytelling',
  },
  {
    id: 'life',
    name: 'Life',
    icon: Heart,
    color: 'from-rose-600 to-rose-800',
    description: 'Dating, Fitness, Lifestyle',
  },
  {
    id: 'mind',
    name: 'Mind',
    icon: Brain,
    color: 'from-amber-600 to-amber-800',
    description: 'Dev Personnel, Spiritualité',
  },
  {
    id: 'lean',
    name: 'Lean',
    icon: Code,
    color: 'from-red-600 to-red-800',
    description: 'Dev, Frontend, Backend, UI/UX',
  },
  {
    id: 'movie',
    name: 'Movie',
    icon: Film,
    color: 'from-red-600 to-red-800',
    description: 'Films, Séries, Anime, Analyses',
  },
  {
    id: 'sport',
    name: 'Sport',
    icon: Trophy,
    color: 'from-orange-600 to-orange-800',
    description: 'Football, Fitness, MMA, Analyses',
  },
];

export default function HomePage({ onUniverseClick }: HomePageProps) {
  const [showBanner, setShowBanner] = useState(() => {
    return !sessionStorage.getItem('trialBannerDismissed');
  });

  const handleCloseBanner = () => {
    sessionStorage.setItem('trialBannerDismissed', 'true');
    setShowBanner(false);
  };

  return (
    <div className="min-h-screen">
      {showBanner && (
        <div className="sticky top-0 z-50">
          <FreeTrialBanner
            onClose={handleCloseBanner}
            onStartTrial={() => {
              console.log('Starting trial...');
            }}
          />
        </div>
      )}

      <div className="flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-6xl w-full">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-4 tracking-tight">
            Choisis ton univers
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Pas de chaos. Pas de scroll infini. Juste le contenu que tu veux, dans l'univers que tu choisis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {universes.map((universe) => {
            const Icon = universe.icon;
            return (
              <button
                key={universe.id}
                onClick={() => onUniverseClick(universe.id)}
                className="group relative overflow-hidden rounded-2xl border-2 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${universe.color} opacity-10 group-hover:opacity-20 transition-opacity`} />

                <div className="relative p-8 flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${universe.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  <h2 className="text-3xl font-black mb-2">
                    {universe.name}
                  </h2>

                  <p className="text-sm text-gray-400">
                    {universe.description}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <AdUnit
            slot="1234567890"
            format="horizontal"
            className="max-w-4xl w-full"
          />
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Entre dans un univers. Découvre. Reviens quand tu veux.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
