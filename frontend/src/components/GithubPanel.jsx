import { useState, useEffect } from 'react';
import * as githubApi from '../api/github';

const prStateStyles = {
  open: 'text-status-progress',
  merged: 'text-priority-low',
  closed: 'text-text-tertiary',
};

const GithubPanel = ({ project, onRepoLinked }) => {
  const [repos, setRepos] = useState([]);
  const [commits, setCommits] = useState([]);
  const [pulls, setPulls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState('');

  const fetchActivity = async () => {
    if (!project?.githubRepo) return;

    setLoading(true);
    setError('');

    try {
      const [commitsData, pullsData] = await Promise.all([
        githubApi.getProjectCommits(project._id),
        githubApi.getProjectPulls(project._id),
      ]);

      setCommits(commitsData);
      setPulls(pullsData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not load GitHub activity.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [project?.githubRepo]);

  const handleOpenLinker = async () => {
    setLinking(true);
    setError('');

    try {
      const data = await githubApi.listRepos();
      setRepos(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not load your repositories.'
      );
      setLinking(false);
    }
  };

  const handleSelectRepo = async (repoFullName) => {
    try {
      setError('');

      const updatedProject = await githubApi.linkRepoToProject(
        project._id,
        repoFullName
      );

      onRepoLinked(updatedProject);
      setLinking(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not link repository.'
      );
    }
  };

  if (!project?.githubRepo) {
    return (
      <div className="border border-border rounded-md p-5">
        <h2 className="text-section-heading font-semibold text-text-primary mb-2">
          GitHub Repository
        </h2>

        {error && (
          <p className="text-small text-priority-high mb-2">
            {error}
          </p>
        )}

        {!linking ? (
          <>
            <p className="text-small text-text-secondary mb-3">
              No repository linked to this project yet.
            </p>

            <button
              onClick={handleOpenLinker}
              className="border border-border text-text-primary text-body px-4 py-2
                         rounded-sm cursor-pointer hover:bg-surface-1"
            >
              Link Repository
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
            {repos.length === 0 ? (
              <p className="text-small text-text-secondary">
                Loading repositories...
              </p>
            ) : (
              repos.map((repo) => (
                <button
                  key={repo.fullName}
                  onClick={() => handleSelectRepo(repo.fullName)}
                  className="text-left text-body text-text-primary px-3 py-2 rounded-sm
                             hover:bg-surface-1 cursor-pointer"
                >
                  {repo.fullName}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border border-border rounded-md p-5">
      <h2 className="text-section-heading font-semibold text-text-primary mb-3">
        {project.githubRepo}
      </h2>

      {error && (
        <p className="text-small text-priority-high mb-2">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-small text-text-secondary">
          Loading activity...
        </p>
      ) : (
        <>
          {/* Commits */}
          <div className="mb-4">
            <p className="text-small font-medium text-text-secondary mb-2">
              Recent Commits
            </p>

            {commits.length === 0 ? (
              <p className="text-small text-text-tertiary">
                No commits found.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {commits.map((commit) => (
                  <a
                    key={commit.sha}
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-small block hover:bg-surface-1 rounded-sm px-2 py-1 -mx-2"
                  >
                    <span className="font-mono text-text-tertiary">
                      {commit.sha}
                    </span>{' '}
                    <span className="text-text-primary">
                      {commit.message.split('\n')[0]}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Pull Requests */}
          <div>
            <p className="text-small font-medium text-text-secondary mb-2">
              Pull Requests
            </p>

            {pulls.length === 0 ? (
              <p className="text-small text-text-tertiary">
                No pull requests found.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {pulls.map((pr) => (
                  <a
                    key={pr.number}
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-small block hover:bg-surface-1 rounded-sm px-2 py-1 -mx-2"
                  >
                    <span className={prStateStyles[pr.state]}>
                      #{pr.number}
                    </span>{' '}
                    <span className="text-text-primary">
                      {pr.title}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GithubPanel;