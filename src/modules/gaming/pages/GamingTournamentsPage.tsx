import { GamingLayout } from '../layouts/GamingLayout';
import { Trophy } from 'lucide-react';

interface Props {
  onNavigate: (page: string, data?: any) => void;
}

export function GamingTournamentsPage({ onNavigate }: Props) {
  return (
    <GamingLayout activeTab="gaming-tournaments" onNavigate={onNavigate}>
      <div className="text-center py-20">
        <Trophy className="w-16 h-16 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Tournaments</h2>
        <p className="text-gray-400">Tournament system coming soon</p>
      </div>
    </GamingLayout>
  );
}
