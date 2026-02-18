import React, { useState } from 'react';
import { Home, Play, Plus, Users, User } from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'shorts', label: 'Shorts', icon: Play },
  { id: 'upload', label: '', icon: Plus },
  { id: 'subs', label: 'Abonnements', icon: Users },
  { id: 'profile', label: 'Profil', icon: User },
];

export default function MobileLayout({ children, activeTab = 'home', onTabChange }: MobileLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-[#0B0B0D]">
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

      <nav className="bg-[#141414] border-t border-gray-800 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isUpload = tab.id === 'upload';

            if (isUpload) {
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className="flex flex-col items-center justify-center p-2 -mt-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D8A0B6] to-[#B8849C] rounded-full flex items-center justify-center shadow-lg">
                    <Icon size={24} className="text-white" />
                  </div>
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 p-2 transition-colors ${
                  isActive ? 'text-[#D8A0B6]' : 'text-gray-400'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
