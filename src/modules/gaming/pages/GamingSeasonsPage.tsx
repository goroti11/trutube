import { GamingLayout } from '../layouts/GamingLayout';
import { Clock } from 'lucide-react';

interface Props {
  onNavigate: (page: string, data?: any) => void;
}

export function GamingSeasonsPage({ onNavigate }: Props) {
  return (
    <GamingLayout activeTab="gaming-seasons" onNavigate={onNavigate}>
      <div className="text-center py-20">
        <Clock className="w-16 h-16 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Seasons</h2>
        <p className="text-gray-400">Season system coming soon</p>
      </div>
    </GamingLayout>
  );
}
