import { useState } from 'react';
import { ArrowLeft, Music, Gamepad2, BookOpen, Theater, Heart, Brain, Code, Film, Trophy } from 'lucide-react';
import { Video } from '../types';
import VideoCard from '../components/VideoCard';
import { trendingVideos } from '../data/mockData';

interface UniverseViewPageProps {
  universeId: string;
  onBack: () => void;
  onVideoClick: (video: Video) => void;
}

const universeConfig: Record<string, {
  name: string;
  icon: any;
  color: string;
  gradient: string;
  subUniverses: string[];
}> = {
  music: {
    name: 'Music',
    icon: Music,
    color: 'purple',
    gradient: 'from-purple-900/20 via-transparent to-transparent',
    subUniverses: ['Clips', 'Freestyle', 'Lives', 'Concerts', 'Exclus', 'Beatmaking']
  },
  game: {
    name: 'Game',
    icon: Gamepad2,
    color: 'green',
    gradient: 'from-green-900/20 via-transparent to-transparent',
    subUniverses: ['Stream', 'Highlights', 'Tournois', 'FPS', 'Battle Royale', 'MOBA']
  },
  know: {
    name: 'Know',
    icon: BookOpen,
    color: 'blue',
    gradient: 'from-blue-900/20 via-transparent to-transparent',
    subUniverses: ['Formations', 'Finance', 'Crypto', 'IA', 'Business', 'Marketing']
  },
  culture: {
    name: 'Culture',
    icon: Theater,
    color: 'orange',
    gradient: 'from-orange-900/20 via-transparent to-transparent',
    subUniverses: ['Podcasts', 'Débats', 'Storytelling', 'Cinéma', 'Humour']
  },
  life: {
    name: 'Life',
    icon: Heart,
    color: 'rose',
    gradient: 'from-rose-900/20 via-transparent to-transparent',
    subUniverses: ['Dating', 'Vlogs', 'Fitness', 'Lifestyle', 'Voyage']
  },
  mind: {
    name: 'Mind',
    icon: Brain,
    color: 'amber',
    gradient: 'from-amber-900/20 via-transparent to-transparent',
    subUniverses: ['Dev Personnel', 'Spiritualité', 'Méditation', 'Motivation']
  },
  lean: {
    name: 'Lean',
    icon: Code,
    color: 'cyan',
    gradient: 'from-cyan-900/20 via-transparent to-transparent',
    subUniverses: ['Développeur', 'Frontend', 'Backend', 'UI/UX', 'Cybersécurité']
  },
  movie: {
    name: 'Movie',
    icon: Film,
    color: 'red',
    gradient: 'from-red-900/20 via-transparent to-transparent',
    subUniverses: ['Films', 'Séries', 'Manga', 'Anime', 'Cartoons', 'Documentaires', 'Critiques', 'Analyses', 'Reactions', 'Theories', 'Reviews']
  },
  sport: {
    name: 'Sport',
    icon: Trophy,
    color: 'orange',
    gradient: 'from-orange-900/20 via-transparent to-transparent',
    subUniverses: ['Football', 'Basketball', 'Tennis', 'MMA/Boxe', 'Fitness', 'Highlights', 'Analyses', 'Débats', 'Entraînement', 'Matchs']
  }
};

export default function UniverseViewPage({ universeId, onBack, onVideoClick }: UniverseViewPageProps) {
  const config = universeConfig[universeId];
  const [selectedSubUniverse, setSelectedSubUniverse] = useState<string | null>(null);
  const Icon = config.icon;

  const filteredVideos = trendingVideos;

  return (
    <div className="min-h-screen">
      <div className={`absolute inset-x-0 top-0 h-96 bg-gradient-to-b ${config.gradient} pointer-events-none`} />

      <div className="relative max-w-screen-2xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Retour aux univers</span>
        </button>

        <div className="flex items-center gap-4 mb-12">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-${config.color}-600 to-${config.color}-800 flex items-center justify-center`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tight">{config.name}</h1>
            <p className="text-gray-400 mt-1">Univers {config.name} · {filteredVideos.length} vidéos</p>
          </div>
        </div>

        <div className="flex gap-3 mb-12 overflow-x-auto pb-4 scrollbar-thin">
          <button
            onClick={() => setSelectedSubUniverse(null)}
            className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
              selectedSubUniverse === null
                ? `bg-${config.color}-600 text-white`
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Tout {config.name}
          </button>
          {config.subUniverses.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubUniverse(sub)}
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedSubUniverse === sub
                  ? `bg-${config.color}-600 text-white`
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={onVideoClick}
              universeColor={config.color}
            />
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4">
          <button className={`px-8 py-4 bg-${config.color}-600 hover:bg-${config.color}-700 rounded-xl font-bold text-lg transition-colors`}>
            Continuer dans {config.name}
          </button>
          <p className="text-sm text-gray-500">
            Ou retourne aux univers pour changer de contenu
          </p>
        </div>
      </div>
    </div>
  );
}
