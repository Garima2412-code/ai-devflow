import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Sparkles, 
  GitBranch, 
  LogOut, 
  Sun, 
  Moon,
  Plus
} from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Projects', path: '/projects', icon: FolderKanban },
  { label: 'Teams', path: '/teams', icon: Users },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-[260px] shrink-0 h-screen border-r border-border bg-surface-1/70 backdrop-blur-md flex flex-col justify-between select-none">
      {/* Top Brand Header */}
      <div>
        <div className="px-5 py-4 border-b border-border/80 flex items-center justify-between">
          <Logo size={24} badge="v2.0" />
        </div>

        {/* Workspace Switcher / Badge */}
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-2/60 border border-border/60 text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-medium text-text-primary truncate">
                {user?.name ? `${user.name}'s Workspace` : 'Main Workspace'}
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary px-1 rounded bg-surface-0 border border-border/80">
              DEV
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col p-3 gap-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-accent/10 text-accent font-semibold shadow-xs'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-2/70'
                  }`
                }
              >
                <Icon size={17} className="transition-transform group-hover:scale-105" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Developer Intelligence callout */}
        <div className="px-3 pt-2">
          <div className="p-3 rounded-lg border border-border/70 bg-surface-0/60 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <Sparkles size={14} className="text-amber-500" />
              <span>Gemini AI Engine</span>
            </div>
            <p className="text-[11.5px] text-text-secondary leading-relaxed">
              Automated root cause analysis &amp; issue breakdown enabled for tasks.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Profile & Utilities */}
      <div className="p-3 border-t border-border/80 flex flex-col gap-2 bg-surface-1/40">
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-hover text-white text-xs font-semibold flex items-center justify-center shrink-0 shadow-xs ring-1 ring-white/10">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 truncate">
              <p className="text-xs font-semibold text-text-primary truncate leading-tight">
                {user?.name || 'Developer'}
              </p>
              <p className="text-[11px] text-text-tertiary truncate leading-tight">
                {user?.email || 'Logged in'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="w-7 h-7 rounded-md flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={logout}
              aria-label="Log out"
              title="Log out"
              className="w-7 h-7 rounded-md flex items-center justify-center text-text-tertiary hover:text-priority-high hover:bg-priority-high/10 transition-colors cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;