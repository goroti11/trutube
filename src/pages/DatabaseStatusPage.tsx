import { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, Activity, Clock, Server, Shield, Zap } from 'lucide-react';
import { databaseHealthService, DatabaseHealth, DatabaseStats } from '../services/databaseHealthService';

export default function DatabaseStatusPage() {
  const [health, setHealth] = useState<DatabaseHealth[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [connectionInfo, setConnectionInfo] = useState<any>(null);
  const [operationTests, setOperationTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDatabaseStatus();
  }, []);

  const loadDatabaseStatus = async () => {
    try {
      setLoading(true);

      const [healthData, statsData, connInfo, opTests] = await Promise.all([
        databaseHealthService.getServiceHealth(),
        databaseHealthService.getDatabaseStats(),
        databaseHealthService.getConnectionInfo(),
        databaseHealthService.testCriticalOperations()
      ]);

      setHealth(healthData);
      setStats(statsData);
      setConnectionInfo(connInfo);
      setOperationTests(opTests);
    } catch (error) {
      console.error('Error loading database status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'checking':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'checking':
        return <Clock className="w-5 h-5 animate-spin" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-cyan-500" />
          <p className="text-gray-400">Checking database status...</p>
        </div>
      </div>
    );
  }

  const connectedServices = health.filter(h => h.status === 'connected').length;
  const totalServices = health.length;
  const healthPercentage = Math.round((connectedServices / totalServices) * 100);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-10 h-10 text-cyan-500" />
            <h1 className="text-4xl font-black">Database Connection Status</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Real-time monitoring of Supabase database connections and services
          </p>
        </div>

        {connectionInfo && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Server className="w-5 h-5 text-cyan-500" />
                <h3 className="font-bold text-sm text-gray-400">Connection</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${connectionInfo.connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                <p className="text-2xl font-black">
                  {connectionInfo.connected ? 'Active' : 'Failed'}
                </p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <h3 className="font-bold text-sm text-gray-400">Latency</h3>
              </div>
              <p className="text-2xl font-black">{connectionInfo.latency}ms</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-green-500" />
                <h3 className="font-bold text-sm text-gray-400">Health</h3>
              </div>
              <p className="text-2xl font-black">{healthPercentage}%</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-sm text-gray-400">Services</h3>
              </div>
              <p className="text-2xl font-black">{connectedServices}/{totalServices}</p>
            </div>
          </div>
        )}

        {stats && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-black mb-6">Database Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Tables</p>
                <p className="text-3xl font-black text-cyan-500">{stats.totalTables}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Videos</p>
                <p className="text-3xl font-black text-purple-500">{stats.totalVideos.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Users</p>
                <p className="text-3xl font-black text-green-500">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Channels</p>
                <p className="text-3xl font-black text-orange-500">{stats.totalChannels.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Communities</p>
                <p className="text-3xl font-black text-blue-500">{stats.totalCommunities.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Transactions</p>
                <p className="text-3xl font-black text-yellow-500">{stats.totalTransactions.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-black mb-6">Service Health</h2>
          <div className="space-y-4">
            {health.map((service) => (
              <div
                key={service.service}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={getStatusColor(service.status)}>
                      {getStatusIcon(service.status)}
                    </div>
                    <h3 className="font-bold text-lg">{service.service}</h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      service.status === 'connected'
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-red-500/20 text-red-500'
                    }`}
                  >
                    {service.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {service.tables.map((table) => (
                    <span
                      key={table}
                      className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
                    >
                      {table}
                    </span>
                  ))}
                </div>
                {service.error && (
                  <p className="mt-3 text-sm text-red-400">{service.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {operationTests.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-black mb-6">Operation Tests</h2>
            <div className="space-y-3">
              {operationTests.map((test, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {test.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-semibold">{test.operation}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{test.duration}ms</span>
                    {test.error && (
                      <span className="text-xs text-red-400">{test.error}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={loadDatabaseStatus}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-bold transition-colors"
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
}
