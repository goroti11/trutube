import { GamingLayout } from '../layouts/GamingLayout';
import { TrendingUp } from 'lucide-react';

interface Props {
  onNavigate: (page: string, data?: any) => void;
}

export function GamingLeaderboardsPage({ onNavigate }: Props) {
  return (
    <GamingLayout activeTab="gaming-leaderboards" onNavigate={onNavigate}>
      <div className="text-center py-20">
        <TrendingUp className="w-16 h-16 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Leaderboards</h2>
        <p className="text-gray-400">Leaderboard system coming soon</p>
      </div>
    </GamingLayout>
  );
}
