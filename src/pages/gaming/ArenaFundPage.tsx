import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, History, Info } from 'lucide-react';
import { gamingService, type ArenaFund } from '../../services/gamingService';

export default function ArenaFundPage() {
  const [arenaFund, setArenaFund] = useState<ArenaFund | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const season = await gamingService.getCurrentSeason();
      if (season) {
        const [fundData, txData] = await Promise.all([
          gamingService.getArenaFund(season.id),
          season ? gamingService.getArenaTransactions(season.id) : Promise.resolve([])
        ]);
        setArenaFund(fundData);
        setTransactions(txData);
      }
    } catch (error) {
      console.error('Failed to load arena fund data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'contribution': return 'text-green-400';
      case 'distribution': return 'text-yellow-400';
      case 'adjustment': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center">
            <DollarSign className="w-10 h-10 text-yellow-400 mr-3" />
            Arena Fund
          </h1>
          <p className="text-gray-300">Transparent community prize pool funding</p>
        </div>

        <div className="mb-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 flex items-start space-x-3">
          <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300">
            <p className="font-semibold text-cyan-400 mb-1">How Arena Fund Works</p>
            <p>
              A percentage of tournament entry fees and live gaming bonuses are automatically contributed to the Arena Fund.
              This fund is used to sponsor community events, support top players, and enhance the gaming ecosystem.
            </p>
          </div>
        </div>

        {arenaFund ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-gray-400">Total Balance</span>
                </div>
                <p className="text-3xl font-bold text-yellow-400">
                  {arenaFund.total_balance.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">TruCoins</p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-gray-400">Allocated</span>
                </div>
                <p className="text-3xl font-bold text-purple-400">
                  {arenaFund.allocated_amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">TruCoins</p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-400">Available</span>
                </div>
                <p className="text-3xl font-bold text-green-400">
                  {arenaFund.remaining_balance.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">TruCoins</p>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="px-6 py-4 bg-gray-900/50 border-b border-gray-700 flex items-center">
                <History className="w-5 h-5 text-cyan-400 mr-2" />
                <h2 className="text-xl font-bold">Transaction History</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium capitalize ${getTransactionColor(tx.transaction_type)}`}>
                            {tx.transaction_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {tx.description}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-semibold ${tx.transaction_type === 'contribution' ? 'text-green-400' : 'text-yellow-400'}`}>
                            {tx.transaction_type === 'contribution' ? '+' : '-'}
                            {tx.amount.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {transactions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No transactions yet
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No arena fund data available
          </div>
        )}
      </div>
    </div>
  );
}
