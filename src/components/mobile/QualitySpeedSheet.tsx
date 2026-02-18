import React, { useState } from 'react';
import { Check } from 'lucide-react';
import BottomSheet from './BottomSheet';

interface QualitySpeedSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const qualities = [
  { id: 'auto', label: 'Auto', description: 'Ajuste automatiquement' },
  { id: '2160p', label: '2160p (4K)', description: 'Ultra HD' },
  { id: '1440p', label: '1440p (2K)', description: 'Quad HD' },
  { id: '1080p', label: '1080p', description: 'Full HD' },
  { id: '720p', label: '720p', description: 'HD' },
  { id: '480p', label: '480p', description: 'SD' },
  { id: '360p', label: '360p', description: 'Économie de données' },
];

const speeds = [
  { value: 0.25, label: '0.25x' },
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: 'Normal' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 1.75, label: '1.75x' },
  { value: 2, label: '2x' },
];

export default function QualitySpeedSheet({ isOpen, onClose }: QualitySpeedSheetProps) {
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState<'quality' | 'speed'>('quality');

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex border-b border-gray-700 mb-4">
        <button
          onClick={() => setActiveTab('quality')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'quality'
              ? 'text-[#D8A0B6] border-b-2 border-[#D8A0B6]'
              : 'text-gray-400'
          }`}
        >
          Qualité
        </button>
        <button
          onClick={() => setActiveTab('speed')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'speed'
              ? 'text-[#D8A0B6] border-b-2 border-[#D8A0B6]'
              : 'text-gray-400'
          }`}
        >
          Vitesse
        </button>
      </div>

      {activeTab === 'quality' ? (
        <div className="space-y-1">
          {qualities.map((quality) => (
            <button
              key={quality.id}
              onClick={() => {
                setSelectedQuality(quality.id);
                setTimeout(onClose, 200);
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="flex-1 text-left">
                <div className="text-white font-medium">{quality.label}</div>
                <div className="text-sm text-gray-400">{quality.description}</div>
              </div>
              {selectedQuality === quality.id && (
                <Check size={20} className="text-[#D8A0B6] ml-3" />
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {speeds.map((speed) => (
            <button
              key={speed.value}
              onClick={() => {
                setSelectedSpeed(speed.value);
                setTimeout(onClose, 200);
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="text-white font-medium">{speed.label}</div>
              {selectedSpeed === speed.value && (
                <Check size={20} className="text-[#D8A0B6] ml-3" />
              )}
            </button>
          ))}
        </div>
      )}
    </BottomSheet>
  );
}
