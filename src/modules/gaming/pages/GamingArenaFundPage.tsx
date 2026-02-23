import { GamingLayout } from '../layouts/GamingLayout';
import { Wallet } from 'lucide-react';

interface Props {
  onNavigate: (page: string, data?: any) => void;
}

export function GamingArenaFundPage({ onNavigate }: Props) {
  return (
    <GamingLayout activeTab="gaming-arena-fund" onNavigate={onNavigate}>
      <div className="text-center py-20">
        <Wallet className="w-16 h-16 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Arena Fund</h2>
        <p className="text-gray-400">Arena Fund system coming soon</p>
      </div>
    </GamingLayout>
  );
}
