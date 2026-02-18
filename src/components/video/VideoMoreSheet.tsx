import { X, Repeat, Sparkles, Volume2, Clock, HelpCircle } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';

interface VideoMoreSheetProps {
  onClose: () => void;
}

export default function VideoMoreSheet({ onClose }: VideoMoreSheetProps) {
  const {
    isLooping,
    isAmbientMode,
    isStableVolume,
    setIsLooping,
    setIsAmbientMode,
    setIsStableVolume
  } = usePlayerStore();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-gray-900 w-full max-w-md rounded-t-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold">Plus d'options</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="divide-y divide-gray-800">
          {/* Loop */}
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Repeat className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-300 font-medium">Lecture en boucle</p>
                <p className="text-sm text-gray-500">Répète la vidéo automatiquement</p>
              </div>
            </div>
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`w-12 h-6 rounded-full transition-colors ${
                isLooping ? 'bg-primary-500' : 'bg-gray-700'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                isLooping ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Ambient Mode */}
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-300 font-medium">Mode ambiant</p>
                <p className="text-sm text-gray-500">Effet de halo lumineux autour de la vidéo</p>
              </div>
            </div>
            <button
              onClick={() => setIsAmbientMode(!isAmbientMode)}
              className={`w-12 h-6 rounded-full transition-colors ${
                isAmbientMode ? 'bg-primary-500' : 'bg-gray-700'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                isAmbientMode ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Stable Volume */}
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-300 font-medium">Volume stable</p>
                <p className="text-sm text-gray-500">Réduit les variations de volume</p>
              </div>
            </div>
            <button
              onClick={() => setIsStableVolume(!isStableVolume)}
              disabled
              className={`w-12 h-6 rounded-full transition-colors ${
                isStableVolume ? 'bg-primary-500' : 'bg-gray-700'
              } opacity-50 cursor-not-allowed`}
            >
              <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                isStableVolume ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Sleep Timer */}
          <button
            onClick={() => {}}
            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-gray-800 transition-colors"
          >
            <Clock className="w-5 h-5 text-gray-400" />
            <div className="text-left">
              <p className="text-gray-300 font-medium">Délai de mise en veille</p>
              <p className="text-sm text-gray-500">Désactivé</p>
            </div>
          </button>

          {/* Help */}
          <button
            onClick={() => {}}
            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-gray-800 transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-400" />
            <div className="text-left">
              <p className="text-gray-300 font-medium">Aide et commentaires</p>
              <p className="text-sm text-gray-500">Obtenir de l'aide ou envoyer des commentaires</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
