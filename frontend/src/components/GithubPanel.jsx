import { useState, useEffect } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  AlertCircle,
  Link as LinkIcon,
  Check
} from 'lucide-react';
import GithubIcon from './GithubIcon';
import * as githubApi from '../api/github';

const prStateBadges = {
  open: { label: 'Open', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  merged: { label: 'Merged', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20' },
  closed: { label: 'Closed', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
};

const GithubPanel = ({ project, onRepoLinked }) => {
  const [repos, setRepos] = useState([]);
  const [commits, setCommits] = useState([]);
  const [pulls, setPulls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState(false);
  const [repoSearch, setRepoSearch] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('commits'); // 'commits' or 'pulls'

  const fetchActivity = async () => {
    if (!project?.githubRepo) return;

    setLoading(true);
    setError('');

    try {
      const [commitsData, pullsData] = await Promise.all([
        githubApi.getProjectCommits(project._id),
        githubApi.getProjectPulls(project._id),
      ]);

      setCommits(commitsData || []);
      setPulls(pullsData || []);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not load GitHub activity.'
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
      setRepos(data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not load your GitHub repositories. Ensure account is connected.'
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
        err.response?.data?.message || 'Could not link repository.'
      );
    }
  };

  const filteredRepos = repos.filter((r) =>
    r.fullName?.toLowerCase().includes(repoSearch.toLowerCase())
  );

  // If no repository is linked yet:
  if (!project?.githubRepo) {
    return (
      <div className="rounded-xl border border-border bg-surface-0 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-surface-2 flex items-center justify-center text-text-primary">
            <GithubIcon size={16} />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            GitHub Repository
          </h3>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-priority-high/10 border border-priority-high/20 text-priority-high text-xs mb-3 flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!linking ? (
          <div className="space-y-3">
            <p className="text-xs text-text-secondary leading-relaxed">
              Link a GitHub repository to stream commits and pull requests directly alongside your Kanban board.
            </p>

            <button
              onClick={handleOpenLinker}
              className="w-full py-2.5 px-3.5 rounded-lg border border-border hover:bg-surface-1 text-xs font-semibold text-text-primary transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <LinkIcon size={13} />
              <span>Link GitHub Repository</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-2.5 text-text-tertiary" />
              <input
                type="text"
                value={repoSearch}
                onChange={(e) => setRepoSearch(e.target.value)}
                placeholder="Filter repositories..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border text-xs bg-surface-1 text-text-primary outline-none focus:border-accent"
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1">
              {repos.length === 0 ? (
                <p className="text-xs text-text-tertiary py-4 text-center">
                  Loading repositories...
                </p>
              ) : filteredRepos.length === 0 ? (
                <p className="text-xs text-text-tertiary py-3 text-center">
                  No repositories match "{repoSearch}"
                </p>
              ) : (
                filteredRepos.map((repo) => (
                  <button
                    key={repo.fullName}
                    onClick={() => handleSelectRepo(repo.fullName)}
                    className="flex items-center justify-between text-left p-2 rounded-lg hover:bg-surface-2 transition-colors cursor-pointer group text-xs"
                  >
                    <span className="font-mono text-text-primary truncate">
                      {repo.fullName}
                    </span>
                    <span className="text-[10px] text-accent opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      Select
                    </span>
                  </button>
                ))
              )}
            </div>

            <button
              onClick={() => setLinking(false)}
              className="w-full py-1.5 text-xs text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }

  // Linked repository view:
  return (
    <div className="rounded-xl border border-border bg-surface-0 p-5 shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-surface-2 flex items-center justify-center text-text-primary shrink-0">
            <GithubIcon size={16} />
          </div>
          <div className="min-w-0">
            <a
              href={`https://github.com/${project.githubRepo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-text-primary hover:text-accent flex items-center gap-1 truncate"
            >
              <span className="truncate">{project.githubRepo}</span>
              <ExternalLink size={11} className="shrink-0 text-text-tertiary" />
            </a>
            <p className="text-[10.5px] font-mono text-text-tertiary">Live Git Stream</p>
          </div>
        </div>

        <button
          onClick={fetchActivity}
          disabled={loading}
          aria-label="Refresh git activity"
          title="Refresh activity"
          className="p-1.5 rounded-lg border border-border hover:bg-surface-1 text-text-secondary hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="p-2.5 rounded-lg bg-priority-high/10 border border-priority-high/20 text-priority-high text-xs flex items-center gap-2">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center p-1 rounded-lg bg-surface-1 border border-border text-xs font-medium">
        <button
          onClick={() => setActiveTab('commits')}
          className={`flex-1 py-1 text-center rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'commits'
              ? 'bg-surface-0 text-text-primary shadow-xs font-semibold'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <GitCommit size={13} />
          <span>Commits ({commits.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('pulls')}
          className={`flex-1 py-1 text-center rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'pulls'
              ? 'bg-surface-0 text-text-primary shadow-xs font-semibold'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <GitPullRequest size={13} />
          <span>PRs ({pulls.length})</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-8 text-center text-xs text-text-tertiary">
          Loading git activity...
        </div>
      ) : activeTab === 'commits' ? (
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {commits.length === 0 ? (
            <p className="text-xs text-text-tertiary text-center py-6">
              No recent commits found.
            </p>
          ) : (
            commits.map((commit) => (
              <a
                key={commit.sha}
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-2.5 rounded-lg bg-surface-1/40 border border-border/70 hover:border-slate-400 dark:hover:border-slate-600 transition-all text-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-[10.5px] text-accent font-semibold bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20">
                    {commit.sha ? commit.sha.slice(0, 7) : ''}
                  </span>
                  <ExternalLink size={10} className="text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-text-primary font-medium line-clamp-2 leading-relaxed">
                  {commit.message?.split('\n')[0]}
                </p>
              </a>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {pulls.length === 0 ? (
            <p className="text-xs text-text-tertiary text-center py-6">
              No pull requests found.
            </p>
          ) : (
            pulls.map((pr) => {
              const badge = prStateBadges[pr.state] || prStateBadges.open;
              return (
                <a
                  key={pr.number}
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-2.5 rounded-lg bg-surface-1/40 border border-border/70 hover:border-slate-400 dark:hover:border-slate-600 transition-all text-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[11px] font-semibold text-text-primary">
                      #{pr.number}
                    </span>
                    <span
                      className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded border ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-text-primary font-medium line-clamp-2 leading-relaxed group-hover:text-accent transition-colors">
                    {pr.title}
                  </p>
                </a>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default GithubPanel;