import { TrendingUp, DollarSign, Users, Video } from 'lucide-react';
import { CreatorRevenue } from '../../types';

interface RevenueOverviewProps {
  revenue: CreatorRevenue;
}

export default function RevenueOverview({ revenue }: RevenueOverviewProps) {
  const stats = [
    {
      label: 'Total Revenue',
      value: `$${revenue.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/10',
    },
    {
      label: 'Subscriptions',
      value: `$${revenue.subscriptionRevenue.toFixed(2)}`,
      icon: Users,
      color: 'text-accent-400',
      bgColor: 'bg-accent-500/10',
    },
    {
      label: 'Tips',
      value: `$${revenue.tipsRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Premium Content',
      value: `$${revenue.premiumRevenue.toFixed(2)}`,
      icon: Video,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <h2 className="text-2xl font-bold mb-6">Revenue Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-xl">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Revenue Breakdown</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Subscriptions</span>
            <span className="font-medium">
              {((revenue.subscriptionRevenue / revenue.totalRevenue) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Tips</span>
            <span className="font-medium">
              {((revenue.tipsRevenue / revenue.totalRevenue) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Premium</span>
            <span className="font-medium">
              {((revenue.premiumRevenue / revenue.totalRevenue) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
