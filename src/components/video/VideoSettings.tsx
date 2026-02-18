import { Check } from 'lucide-react';

interface VideoSettingsProps {
  playbackRate: number;
  quality: string;
  loop: boolean;
  ambientMode: boolean;
  onChange: (setting: string, value: any) => void;
  onClose: () => void;
}

export default function VideoSettings({
  playbackRate,
  quality,
  loop,
  ambientMode,
  onChange,
  onClose
}: VideoSettingsProps) {
  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const qualities = ['auto', '2160p', '1440p', '1080p', '720p', '480p', '360p', '240p', '144p'];

  return (
    <div className="absolute bottom-20 right-4 bg-gray-900 rounded-lg shadow-2xl border border-gray-800 w-80 overflow-hidden z-50">
      <div className="p-4 border-b border-gray-800">
        <h3 className="font-semibold text-white">Paramètres vidéo</h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <div className="p-4 border-b border-gray-800">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Vitesse de lecture</h4>
          <div className="space-y-1">
            {playbackRates.map((rate) => (
              <button
                key={rate}
                onClick={() => onChange('playbackRate', rate)}
                className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                <span className={rate === playbackRate ? 'text-blue-500 font-medium' : 'text-gray-300'}>
                  {rate === 1 ? 'Normal' : `${rate}x`}
                </span>
                {rate === playbackRate && <Check className="w-4 h-4 text-blue-500" />}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-b border-gray-800">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Qualité</h4>
          <div className="space-y-1">
            {qualities.map((q) => (
              <button
                key={q}
                onClick={() => onChange('quality', q)}
                className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                <span className={q === quality ? 'text-blue-500 font-medium' : 'text-gray-300'}>
                  {q === 'auto' ? 'Auto' : q}
                </span>
                {q === quality && <Check className="w-4 h-4 text-blue-500" />}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-b border-gray-800">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Options</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-300">Lecture en boucle</span>
              <input
                type="checkbox"
                checked={loop}
                onChange={(e) => onChange('loop', e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-300">Mode ambiant</span>
              <input
                type="checkbox"
                checked={ambientMode}
                onChange={(e) => onChange('ambientMode', e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-gray-800">
        <button
          onClick={onClose}
          className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
