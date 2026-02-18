import { ArrowLeft, TrendingUp, Users, Eye } from 'lucide-react';
import { DashboardStats } from '../types';
import RevenueOverview from '../components/dashboard/RevenueOverview';
import VideoScoreCard from '../components/dashboard/VideoScoreCard';

interface CreatorDashboardPageProps {
  stats: DashboardStats;
  onBack: () => void;
}

export default function CreatorDashboardPage({ stats, onBack }: CreatorDashboardPageProps) {
  const growthStats = [
    {
      label: 'Subscribers Growth',
      value: `+${stats.growth.subscribers}`,
      icon: Users,
      color: 'text-primary-400',
    },
    {
      label: 'Revenue Growth',
      value: `+$${stats.growth.revenue.toFixed(0)}`,
      icon: TrendingUp,
      color: 'text-accent-400',
    },
    {
      label: 'Views Growth',
      value: `+${stats.growth.views}`,
      icon: Eye,
      color: 'text-green-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="sticky top-0 bg-gray-950 bg-opacity-95 backdrop-blur border-b border-gray-800 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Creator Dashboard</h1>
            <p className="text-sm text-gray-400">Manage your content and analytics</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {growthStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-sm text-gray-400">{stat.label}</span>
                </div>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
            );
          })}
        </div>

        <RevenueOverview revenue={stats.revenue} />

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Video Performance</h2>
              <p className="text-sm text-gray-400 mt-1">
                Understand how your videos are performing with our transparent scoring system
              </p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
            <h3 className="text-lg font-semibold mb-4">How Scoring Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-primary-400 mb-2">Engagement Score (40%)</h4>
                <p className="text-sm text-gray-400">
                  Based on likes (×2), comments (×3), and average watch time relative to views.
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-accent-400 mb-2">Support Score (30%)</h4>
                <p className="text-sm text-gray-400">
                  Calculated from your supporter count. More supporters = higher score.
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-green-400 mb-2">Freshness Score (20%)</h4>
                <p className="text-sm text-gray-400">
                  Recent videos score higher. Decreases by 1 point per hour since upload.
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-purple-400 mb-2">Diversity Boost (10%)</h4>
                <p className="text-sm text-gray-400">
                  Smaller creators get a boost. +20 for &lt;10K followers, -15 for &gt;1M followers.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {stats.videos.map((video) => (
              <VideoScoreCard key={video.id} video={video} score={video.score!} />
            ))}
          </div>

          {stats.videos.length === 0 && (
            <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
              <p className="text-gray-400 mb-4">No videos yet</p>
              <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors">
                Upload Your First Video
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
