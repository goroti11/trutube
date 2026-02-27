import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, Loader, Database } from 'lucide-react';

export default function DatabaseTestPage() {
  const [tests, setTests] = useState<Array<{
    name: string;
    status: 'pending' | 'success' | 'error';
    message: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    const results: typeof tests = [];

    results.push({
      name: 'Supabase Configuration',
      status: 'success',
      message: `URL: ${import.meta.env.VITE_SUPABASE_URL}`,
    });

    try {
      const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
      if (error) throw error;
      results.push({
        name: 'Profiles Table',
        status: 'success',
        message: `Connected - ${data || 0} profiles`,
      });
    } catch (error) {
      results.push({
        name: 'Profiles Table',
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed',
      });
    }

    try {
      const { data, error } = await supabase.from('videos').select('count', { count: 'exact', head: true });
      if (error) throw error;
      results.push({
        name: 'Videos Table',
        status: 'success',
        message: `Connected - ${data || 0} videos`,
      });
    } catch (error) {
      results.push({
        name: 'Videos Table',
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed',
      });
    }

    try {
      const { data, error } = await supabase.from('live_streams').select('count', { count: 'exact', head: true });
      if (error) throw error;
      results.push({
        name: 'Live Streams Table',
        status: 'success',
        message: `Connected - ${data || 0} streams`,
      });
    } catch (error) {
      results.push({
        name: 'Live Streams Table',
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed',
      });
    }

    try {
      const { data, error } = await supabase.from('media_jobs').select('count', { count: 'exact', head: true });
      if (error) throw error;
      results.push({
        name: 'Media Jobs Table',
        status: 'success',
        message: `Connected - ${data || 0} jobs`,
      });
    } catch (error) {
      results.push({
        name: 'Media Jobs Table',
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed',
      });
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      results.push({
        name: 'Auth Session',
        status: session ? 'success' : 'error',
        message: session ? `Logged in as ${session.user.email}` : 'Not logged in',
      });
    } catch (error) {
      results.push({
        name: 'Auth Session',
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed',
      });
    }

    setTests(results);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Database className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-bold">Database Connection Test</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-start gap-3"
              >
                {test.status === 'pending' && (
                  <Loader className="w-5 h-5 animate-spin text-gray-400 mt-0.5" />
                )}
                {test.status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                )}
                {test.status === 'error' && (
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-semibold text-white">{test.name}</div>
                  <div
                    className={`text-sm mt-1 ${
                      test.status === 'success'
                        ? 'text-green-400'
                        : test.status === 'error'
                        ? 'text-red-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {test.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/auth"
              className="block w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-center transition-colors"
            >
              Go to Sign In / Sign Up
            </a>
            <button
              onClick={runTests}
              className="block w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
            >
              Re-run Tests
            </button>
          </div>
        </div>

        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
          <h3 className="font-semibold text-blue-400 mb-2">First Time Setup</h3>
          <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
            <li>Click "Go to Sign In / Sign Up" above</li>
            <li>Create a new account with email and password</li>
            <li>You'll be automatically logged in</li>
            <li>Return to this page to verify all tests pass</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
