import React, { useState } from 'react';
import { Lock, Repeat, Palette, MessageCircle, Flag } from 'lucide-react';
import BottomSheet from './BottomSheet';

interface VideoOptionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoOptionsSheet({ isOpen, onClose }: VideoOptionsSheetProps) {
  const [screenLocked, setScreenLocked] = useState(false);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [ambientMode, setAmbientMode] = useState(false);

  const options = [
    {
      icon: Lock,
      label: 'Verrouillage écran',
      description: 'Désactive les contrôles tactiles',
      value: screenLocked,
      onChange: () => setScreenLocked(!screenLocked),
    },
    {
      icon: Repeat,
      label: 'Lecture en boucle',
      description: 'Rejoue automatiquement',
      value: loopEnabled,
      onChange: () => setLoopEnabled(!loopEnabled),
    },
    {
      icon: Palette,
      label: 'Mode ambiant',
      description: 'Affiche les couleurs autour',
      value: ambientMode,
      onChange: () => setAmbientMode(!ambientMode),
    },
  ];

  const actions = [
    {
      icon: MessageCircle,
      label: 'Voir les commentaires',
      onClick: () => {
        onClose();
      },
    },
    {
      icon: Flag,
      label: 'Signaler',
      onClick: () => {
        onClose();
      },
    },
  ];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Options">
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3">PARAMÈTRES</h4>
          <div className="space-y-1">
            {options.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.label}
                  onClick={option.onChange}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-gray-400" />
                    <div className="text-left">
                      <div className="text-white font-medium">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.description}</div>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      option.value ? 'bg-[#D8A0B6]' : 'bg-gray-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                        option.value ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3">ACTIONS</h4>
          <div className="space-y-1">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Icon size={20} className="text-gray-400" />
                  <span className="text-white font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
