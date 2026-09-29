import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  GitBranch, 
  GitPullRequest, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Terminal, 
  Layers, 
  Users, 
  Sun, 
  Moon, 
  Zap, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Logo from '../components/Logo';
import { useTheme } from '../context/ThemeContext';

const previewTasks = [
  {
    id: 'TK-101',
    title: 'Fix JWT token refresh race condition on concurrent requests',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Alex R.',
    repo: 'ShopKart-backend',
    aiAnalyzed: true,
  },
  {
    id: 'TK-104',
    title: 'Add rate limiting to OAuth callback & webhook endpoints',
    status: 'todo',
    priority: 'medium',
    assignee: 'Sarah M.',
    repo: 'ShopKart-backend',
    aiAnalyzed: false,
  },
  {
    id: 'TK-108',
    title: 'Migrate MongoDB aggregation pipeline for sprint analytics',
    status: 'review',
    priority: 'high',
    assignee: 'David K.',
    repo: 'ShopKart-backend',
    aiAnalyzed: true,
  },
  {
    id: 'TK-112',
    title: 'Automate GitHub Action PR branch preview deployments',
    status: 'done',
    priority: 'low',
    assignee: 'DevOps Bot',
    repo: 'ShopKart-infra',
    aiAnalyzed: true,
  },
];

const priorityConfig = {
  high: { label: 'High', color: 'text-priority-high bg-priority-high/10 border-priority-high/20' },
  medium: { label: 'Medium', color: 'text-priority-medium bg-priority-medium/10 border-priority-medium/20' },
  low: { label: 'Low', color: 'text-priority-low bg-priority-low/10 border-priority-low/20' },
};

const statusColumns = [
  { key: 'todo', label: 'Todo', color: 'bg-slate-400' },
  { key: 'in_progress', label: 'In Progress', color: 'bg-accent' },
  { key: 'review', label: 'In Review', color: 'bg-violet-500' },
  { key: 'done', label: 'Done', color: 'bg-emerald-500' },
];

const mockCommits = [
  { sha: '7f9a2bc', message: 'fix(auth): synchronize token refresh locks with mutex', author: 'alexr', time: '14m ago' },
  { sha: '4b3d11a', message: 'feat(api): add Redis sliding window rate limiter', author: 'sarahm', time: '2h ago' },
  { sha: 'e280f90', message: 'refactor(db): optimize indexes on tasks.project_id', author: 'davidk', time: '4h ago' },
];

const Landing = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('board'); // 'board' or 'ai'
  const [selectedDemoTask, setSelectedDemoTask] = useState(previewTasks[0]);

  return (
    <div className="min-h-screen bg-surface-0 text-text-primary selection:bg-accent selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-surface-0/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90">
            <Logo size={26} badge="DEV" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-text-secondary">
            <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
            <a href="#interactive-demo" className="hover:text-text-primary transition-colors">Interactive Demo</a>
            <a href="#architecture" className="hover:text-text-primary transition-colors">Architecture</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-1 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <Link
              to="/login"
              className="text-xs font-medium text-text-primary px-3.5 py-2 rounded-lg hover:bg-surface-1 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="text-xs font-semibold bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg shadow-xs hover:shadow transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 px-6 overflow-hidden bg-grid-pattern">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent/10 dark:bg-white/5 rounded-full blur-[100px] pointer-events-none -z-10" />

          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-mono font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>AI DevFlow 2.0 • Issue Tracker &amp; Gemini Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
              Issue tracking designed for developers who live in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-primary to-neutral-500 dark:from-white dark:to-neutral-400">
                GitHub
              </span>
              .
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
              Stop dealing with Jira spreadsheet fatigue. AI DevFlow gives engineering teams a clean Kanban board tied directly to live GitHub commits, pull requests, and automated Gemini issue diagnosis.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
              <Link
                to="/signup"
                className="px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>Start Free Workspace</span>
                <ArrowRight size={15} />
              </Link>
              <a
                href="#interactive-demo"
                className="px-5 py-3 rounded-lg border border-border bg-surface-0 hover:bg-surface-1 text-text-primary text-sm font-medium transition-all flex items-center gap-2"
              >
                <span>Live Interactive Demo</span>
                <ChevronRight size={14} className="text-text-tertiary" />
              </a>
            </div>

            {/* Trust / Spec Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-14 pt-10 border-t border-border/80 w-full max-w-3xl text-left">
              <div>
                <p className="text-xl font-bold text-text-primary font-mono">0 Config</p>
                <p className="text-xs text-text-tertiary mt-0.5">GitHub OAuth &amp; Sync</p>
              </div>
              <div>
                <p className="text-xl font-bold text-text-primary font-mono">&lt; 100ms</p>
                <p className="text-xs text-text-tertiary mt-0.5">Kanban State Latency</p>
              </div>
              <div>
                <p className="text-xl font-bold text-text-primary font-mono">Gemini 2.5</p>
                <p className="text-xs text-text-tertiary mt-0.5">Task Breakdown AI</p>
              </div>
              <div>
                <p className="text-xl font-bold text-text-primary font-mono">100%</p>
                <p className="text-xs text-text-tertiary mt-0.5">Team Data Isolation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Live Product Preview */}
        <section id="interactive-demo" className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
                <Sparkles size={14} />
                <span>Live Interactive Experience</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mt-1">
                Kanban with GitHub Context &amp; AI Intelligence
              </h2>
            </div>

            {/* Tab switchers */}
            <div className="flex items-center p-1 rounded-lg bg-surface-1 border border-border text-xs font-medium">
              <button
                onClick={() => setActiveTab('board')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'board'
                    ? 'bg-surface-0 text-text-primary shadow-xs font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Sprint Board
              </button>
              <button
                onClick={() => setActiveTab('git')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'git'
                    ? 'bg-surface-0 text-text-primary shadow-xs font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                GitHub Stream
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'ai'
                    ? 'bg-surface-0 text-text-primary shadow-xs font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Sparkles size={12} className="text-amber-500" />
                <span>Gemini Analysis</span>
              </button>
            </div>
          </div>

          {/* Interactive Window Chrome */}
          <div className="border border-border rounded-xl bg-surface-0 shadow-xl overflow-hidden ring-1 ring-black/5">
            {/* Window Header */}
            <div className="h-10 bg-surface-1 border-b border-border px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                <span className="text-[11px] font-mono text-text-tertiary ml-2">
                  ShopKart / Sprint-42 / board
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-text-secondary">
                <GitBranch size={12} className="text-text-tertiary" />
                <span>main (linked to github.com/ShopKart/backend)</span>
              </div>
            </div>

            {/* Window Body */}
            <div className="p-6">
              {activeTab === 'board' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statusColumns.map((col) => {
                    const columnTasks = previewTasks.filter((t) => t.status === col.key);
                    return (
                      <div
                        key={col.key}
                        className="rounded-lg bg-surface-1/60 border border-border/70 p-3.5 flex flex-col gap-3 min-h-[300px]"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-border/60">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${col.color}`} />
                            <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                              {col.label}
                            </h3>
                          </div>
                          <span className="text-[11px] font-mono font-medium text-text-tertiary px-1.5 py-0.5 rounded bg-surface-2">
                            {columnTasks.length}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2.5">
                          {columnTasks.map((task) => (
                            <div
                              key={task.id}
                              onClick={() => {
                                setSelectedDemoTask(task);
                                setActiveTab('ai');
                              }}
                              className="group p-3 rounded-lg bg-surface-0 border border-border hover:border-accent hover:shadow-md transition-all cursor-pointer"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-mono text-text-tertiary font-medium">
                                  {task.id}
                                </span>
                                <span
                                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                                    priorityConfig[task.priority].color
                                  }`}
                                >
                                  {priorityConfig[task.priority].label}
                                </span>
                              </div>
                              <p className="text-xs font-medium text-text-primary leading-snug group-hover:text-accent transition-colors">
                                {task.title}
                              </p>
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50 text-[11px] text-text-tertiary">
                                <span>{task.assignee}</span>
                                {task.aiAnalyzed && (
                                  <span className="flex items-center gap-1 text-accent font-medium">
                                    <Sparkles size={11} />
                                    <span>AI Ready</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'git' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface-1 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-text-primary">
                        <GitBranch size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-primary">Connected Repository</p>
                        <p className="text-[11px] font-mono text-text-tertiary">ShopKart/backend • Synchronized 2m ago</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium">
                      Webhooks Active
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Recent Commits Attached to Active Tasks
                    </p>
                    {mockCommits.map((c) => (
                      <div
                        key={c.sha}
                        className="flex items-center justify-between p-3 rounded-lg bg-surface-1/40 border border-border/80 hover:bg-surface-1 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <code className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                            {c.sha}
                          </code>
                          <span className="text-xs text-text-primary font-medium">{c.message}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-text-tertiary">
                          <span>@{c.author}</span>
                          <span>•</span>
                          <span>{c.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="rounded-lg bg-surface-1/60 border border-border p-5">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-accent text-white flex items-center justify-center">
                        <Sparkles size={15} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-text-primary">
                          Gemini 2.5 Issue Triage &amp; Root Cause Breakdown
                        </h4>
                        <p className="text-[11px] text-text-secondary">
                          Context grounded in task: {selectedDemoTask.id} - {selectedDemoTask.title}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                      Automated Analysis
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    {/* Left: Investigation Areas */}
                    <div className="p-4 rounded-lg bg-surface-0 border border-border">
                      <p className="text-xs font-semibold text-text-primary flex items-center gap-1.5 mb-2.5">
                        <AlertCircle size={14} className="text-priority-high" />
                        <span>High-Probability Investigation Paths</span>
                      </p>
                      <ul className="space-y-2 text-xs text-text-secondary">
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">1.</span>
                          <span>Race window between Redis token invalidation and refresh token rotation lock.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">2.</span>
                          <span>Axios interceptor retry loop triggering exponential concurrent refreshes.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">3.</span>
                          <span>Check expiration drift on distributed cluster nodes during UTC transitions.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Right: Suggested Subtasks */}
                    <div className="p-4 rounded-lg bg-surface-0 border border-border">
                      <p className="text-xs font-semibold text-text-primary flex items-center gap-1.5 mb-2.5">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>Suggested Subtasks &amp; Action Plan</span>
                      </p>
                      <ul className="space-y-2 text-xs text-text-secondary">
                        <li className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded text-accent cursor-pointer" />
                          <span className="line-through text-text-tertiary">Wrap auth refresh endpoint in Redis Redlock mutex</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded text-accent cursor-pointer" />
                          <span>Add debouncing queue to frontend Axios response interceptors</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <input type="checkbox" className="rounded text-accent cursor-pointer" />
                          <span>Deploy integration test with 50 parallel authenticated requests</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-16 border-t border-border/80">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-accent uppercase tracking-widest">
              Engineered For Modern Sprints
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mt-2">
              Everything your team needs. Nothing you don't.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-surface-1/50 border border-border hover:border-slate-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-2 dark:bg-white/10 text-text-primary dark:text-white flex items-center justify-center mb-4">
                  <Layers size={20} />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">
                  Frictionless Kanban
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Fast drag-and-drop state updates with zero lag. Clear priority indicators, assignees, and real-time status transitions.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/70 flex items-center gap-2 text-[11px] font-mono text-text-tertiary">
                <CheckCircle2 size={13} className="text-text-primary dark:text-white" />
                <span>Drag &amp; drop state machine</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-surface-1/50 border border-border hover:border-slate-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-2 dark:bg-white/10 text-text-primary dark:text-white flex items-center justify-center mb-4">
                  <GitPullRequest size={20} />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">
                  Direct GitHub Repository Link
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Link any GitHub repo to your project with 1 click. View commits and pull requests right next to the board tickets.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/70 flex items-center gap-2 text-[11px] font-mono text-text-tertiary">
                <CheckCircle2 size={13} className="text-text-primary dark:text-white" />
                <span>OAuth 2.0 &amp; live commit stream</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-surface-1/50 border border-border hover:border-slate-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-2 dark:bg-white/10 text-text-primary dark:text-white flex items-center justify-center mb-4">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">
                  Gemini-Powered Triage
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Stuck on a tricky issue? Run AI analysis to instantly receive actionable root-cause hypotheses and an atomic task checklist.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/70 flex items-center gap-2 text-[11px] font-mono text-text-tertiary">
                <CheckCircle2 size={13} className="text-text-primary dark:text-white" />
                <span>Root causes &amp; actionable subtasks</span>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-surface-1 to-surface-2 border border-border shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                Ready to organize your team's code?
              </h2>
              <p className="text-sm text-text-secondary mt-1 max-w-lg">
                Create a team, invite your developers with a code, and connect GitHub in under two minutes.
              </p>
            </div>
            <Link
              to="/signup"
              className="px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-semibold shadow-md whitespace-nowrap flex items-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-0">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size={20} />
          <p className="text-xs text-text-tertiary">
            Crafted for engineers with React 19, Tailwind v4, Node.js, MongoDB &amp; Gemini AI.
          </p>
          <div className="flex items-center gap-4 text-xs text-text-secondary">
            <Link to="/login" className="hover:text-text-primary">Sign in</Link>
            <Link to="/signup" className="hover:text-text-primary">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;