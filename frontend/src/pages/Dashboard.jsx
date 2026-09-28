import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Plus,
  GitBranch,
  Layers,
  Clock
} from 'lucide-react';
import GithubIcon from '../components/GithubIcon';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/AppLayout';
import * as githubApi from '../api/github';
import * as projectsApi from '../api/projects';
import * as teamsApi from '../api/teams';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [githubStatus, setGithubStatus] = useState(null);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [noticeType, setNoticeType] = useState('success');

  const fetchDashboardData = async () => {
    try {
      const [ghStatus, myProjects, myTeams] = await Promise.allSettled([
        githubApi.getGithubStatus(),
        projectsApi.getMyProjects(),
        teamsApi.getMyTeams(),
      ]);

      if (ghStatus.status === 'fulfilled') setGithubStatus(ghStatus.value);
      if (myProjects.status === 'fulfilled') setProjects(myProjects.value || []);
      if (myTeams.status === 'fulfilled') setTeams(myTeams.value || []);
    } catch (err) {
      // dashboard loads gracefully even if one service is slow
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Check if redirected from GitHub OAuth
    const githubResult = searchParams.get('github');
    if (githubResult === 'connected') {
      setNotice('GitHub account connected successfully. Repositories are now accessible.');
      setNoticeType('success');
      searchParams.delete('github');
      setSearchParams(searchParams);
    } else if (githubResult === 'error') {
      setNotice('Could not connect GitHub account. Please try again.');
      setNoticeType('error');
      searchParams.delete('github');
      setSearchParams(searchParams);
    }
  }, []);

  const handleConnectGitHub = () => {
    window.location.href = githubApi.getConnectUrl();
  };

  return (
    <AppLayout breadcrumb="Dashboard">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Welcome back, {user?.name || 'Developer'}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-accent/10 text-accent font-medium">
              Sprint Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Track your tasks, inspect live GitHub commits, and triage issues with Gemini.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/teams"
            className="px-3.5 py-2 rounded-lg border border-border bg-surface-0 hover:bg-surface-2 text-xs font-medium text-text-primary transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Users size={14} className="text-text-secondary" />
            <span>Manage Teams</span>
          </Link>
          <Link
            to="/projects"
            className="px-3.5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
          >
            <FolderKanban size={14} />
            <span>View All Projects</span>
          </Link>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-lg border my-4 text-xs font-medium ${
            noticeType === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-priority-high/10 border-priority-high/30 text-priority-high'
          }`}
        >
          <div className="flex items-center gap-2">
            {noticeType === 'success' ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{notice}</span>
          </div>
          <button
            onClick={() => setNotice('')}
            className="text-text-tertiary hover:text-text-primary cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="p-4 rounded-xl bg-surface-0 border border-border shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">Active Projects</span>
            <div className="w-7 h-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
              <FolderKanban size={15} />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-text-primary mt-2">
            {projects.length}
          </p>
          <p className="text-[11px] text-text-tertiary mt-1">
            Across {teams.length} {teams.length === 1 ? 'team' : 'teams'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-surface-0 border border-border shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">GitHub Sync</span>
            <div className="w-7 h-7 rounded-lg bg-surface-2 text-text-primary flex items-center justify-center">
              <GithubIcon size={15} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`w-2 h-2 rounded-full ${
                githubStatus?.connected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <p className="text-base font-semibold text-text-primary truncate">
              {githubStatus?.connected ? `@${githubStatus.githubUsername}` : 'Disconnected'}
            </p>
          </div>
          <p className="text-[11px] text-text-tertiary mt-1">
            {githubStatus?.connected ? 'OAuth token active' : 'Connect for git streams'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-surface-0 border border-border shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">Gemini Copilot</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Sparkles size={15} />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-text-primary mt-2">
            Active
          </p>
          <p className="text-[11px] text-text-tertiary mt-1">
            Gemini 2.5 Flash Triage Ready
          </p>
        </div>

        <div className="p-4 rounded-xl bg-surface-0 border border-border shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">Engineering Teams</span>
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center">
              <Users size={15} />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-text-primary mt-2">
            {teams.length}
          </p>
          <p className="text-[11px] text-text-tertiary mt-1">
            Multi-tenant workspaces
          </p>
        </div>
      </div>

      {/* Main Grid: Projects + GitHub Integration Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects List (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-accent" />
              <h2 className="text-sm font-semibold text-text-primary">
                Your Projects &amp; Boards
              </h2>
            </div>
            <Link
              to="/projects"
              className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 rounded-xl bg-surface-0 border border-border text-center text-xs text-text-tertiary">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="p-8 rounded-xl bg-surface-0 border border-dashed border-border text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-text-tertiary mb-3">
                <FolderKanban size={20} />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">No projects found</h3>
              <p className="text-xs text-text-secondary mt-1 max-w-sm">
                Join or create a team to start your first project and Kanban board.
              </p>
              <Link
                to="/teams"
                className="mt-4 px-4 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors"
              >
                Go to Teams
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {projects.slice(0, 4).map((project) => (
                <div
                  key={project._id}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="group p-4 rounded-xl bg-surface-0 border border-border hover:border-accent hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                        {project.name}
                      </h3>
                      <ArrowRight size={14} className="text-text-tertiary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>

                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed min-h-[32px]">
                      {project.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-text-tertiary truncate">
                      {project.team?.name || 'Workspace'}
                    </span>

                    {project.githubRepo ? (
                      <span className="flex items-center gap-1 font-mono text-text-secondary bg-surface-2 px-1.5 py-0.5 rounded truncate max-w-[140px]">
                        <GitBranch size={11} className="shrink-0" />
                        <span className="truncate">{project.githubRepo.split('/')[1] || project.githubRepo}</span>
                      </span>
                    ) : (
                      <span className="text-text-tertiary">No repo linked</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar: GitHub Integration Card */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <GithubIcon size={16} className="text-text-primary" />
            <h2 className="text-sm font-semibold text-text-primary">
              GitHub Integration
            </h2>
          </div>

          <div className="p-5 rounded-xl bg-surface-0 border border-border shadow-xs">
            {loading ? (
              <p className="text-xs text-text-secondary">Checking GitHub status...</p>
            ) : githubStatus?.connected ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-1 border border-border">
                  <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-text-primary">
                    <GithubIcon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-primary truncate">
                      Connected to GitHub
                    </p>
                    <p className="text-[11px] font-mono text-accent truncate">
                      @{githubStatus.githubUsername}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span>Live commit feed active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span>Pull requests synchronized</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span>Repository linking enabled</span>
                  </div>
                </div>

                <button
                  onClick={handleConnectGitHub}
                  className="w-full py-2 px-3 rounded-lg border border-border hover:bg-surface-1 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  Reconnect or Change Account
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-text-secondary leading-relaxed">
                  Connect your GitHub account with OAuth to attach repositories, stream commit shas, and view pull requests directly on your sprint board.
                </p>

                <div className="p-3 rounded-lg bg-surface-1/70 border border-border/80 text-[11px] text-text-tertiary space-y-1">
                  <p className="font-semibold text-text-primary">Permissions requested:</p>
                  <p>• Read repository activity &amp; commits</p>
                  <p>• Read pull request status &amp; metadata</p>
                </div>

                <button
                  onClick={handleConnectGitHub}
                  className="w-full py-2.5 px-4 rounded-lg bg-text-primary hover:bg-text-secondary text-surface-0 text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <GithubIcon size={14} />
                  <span>Connect GitHub Account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;