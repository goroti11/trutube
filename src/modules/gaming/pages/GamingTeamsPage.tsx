import { GamingLayout } from '../layouts/GamingLayout';
import { Users } from 'lucide-react';

interface Props {
  onNavigate: (page: string, data?: any) => void;
}

export function GamingTeamsPage({ onNavigate }: Props) {
  return (
    <GamingLayout activeTab="gaming-teams" onNavigate={onNavigate}>
      <div className="text-center py-20">
        <Users className="w-16 h-16 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Teams</h2>
        <p className="text-gray-400">Team system coming soon</p>
      </div>
    </GamingLayout>
  );
}
