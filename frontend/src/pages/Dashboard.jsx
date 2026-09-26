import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/AppLayout';
import * as githubApi from '../api/github';

const Dashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [githubStatus, setGithubStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const fetchStatus = async () => {
    try {
      const data = await githubApi.getGithubStatus();
      setGithubStatus(data);
    } catch (err) {
      // fail silently here — GitHub status is non-critical to the dashboard loading
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Check if we just got redirected back from the GitHub OAuth flow
    const githubResult = searchParams.get('github');
    if (githubResult === 'connected') {
      setNotice('GitHub account connected successfully.');
      searchParams.delete('github');
      setSearchParams(searchParams);
    } else if (githubResult === 'error') {
      setNotice('Could not connect GitHub account. Please try again.');
      searchParams.delete('github');
      setSearchParams(searchParams);
    }
  }, []);

  const handleConnect = () => {
    window.location.href = githubApi.getConnectUrl();
  };

  return (
    <AppLayout breadcrumb="Dashboard">
      <h1 className="text-page-title font-semibold text-text-primary">Dashboard</h1>
      <p className="text-text-secondary mt-2">Welcome, {user?.name}.</p>

      {notice && (
        <div className="text-small text-text-primary bg-surface-1 border border-border rounded-sm px-3 py-2 mt-4">
          {notice}
        </div>
      )}

      <div className="border border-border rounded-md p-5 mt-6 max-w-md">
        <h2 className="text-section-heading font-semibold text-text-primary mb-2">
          GitHub Integration
        </h2>

        {loading ? (
          <p className="text-small text-text-secondary">Checking status...</p>
        ) : githubStatus?.connected ? (
          <p className="text-body text-text-primary">
            Connected as{' '}
            <span className="font-medium">{githubStatus.githubUsername}</span>
          </p>
        ) : (
          <>
            <p className="text-small text-text-secondary mb-3">
              Connect your GitHub account to link repositories, commits, and pull
              requests to your tasks.
            </p>
            <button
              onClick={handleConnect}
              className="border border-border text-text-primary text-body px-4 py-2
                         rounded-sm cursor-pointer hover:bg-surface-1"
            >
              Connect GitHub
            </button>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;