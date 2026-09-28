import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Search, 
  Sun, 
  Moon, 
  LogOut, 
  User, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import GithubIcon from './GithubIcon';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const TopBar = ({ breadcrumb }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const breadcrumbParts = typeof breadcrumb === 'string' 
    ? breadcrumb.split('/').map(p => p.trim())
    : ['Dashboard'];

  return (
    <header className="h-14 shrink-0 border-b border-border/80 bg-surface-0/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
        <Link 
          to="/dashboard" 
          className="text-text-tertiary hover:text-text-primary transition-colors font-medium"
        >
          DevFlow
        </Link>
        {breadcrumbParts.map((part, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <ChevronRight size={13} className="text-text-tertiary shrink-0" />
            <span
              className={`truncate max-w-[200px] ${
                index === breadcrumbParts.length - 1
                  ? 'text-text-primary font-semibold'
                  : 'text-text-secondary font-medium'
              }`}
            >
              {part}
            </span>
          </div>
        ))}
      </nav>

      {/* Center Search / Command Indicator (Linear/Raycast style) */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-1 border border-border text-xs text-text-tertiary hover:border-slate-400 dark:hover:border-slate-600 transition-colors w-72">
        <Search size={14} className="shrink-0" />
        <span className="flex-1 truncate">Search issues, repos, teams...</span>
        <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-[10px] font-mono font-medium text-text-secondary">
          ⌘K
        </kbd>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-1 transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Open user menu"
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-1 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-accent text-white text-xs font-semibold flex items-center justify-center shadow-xs ring-1 ring-white/20">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 border border-border rounded-xl bg-surface-0 shadow-xl py-1 z-30 ring-1 ring-black/5 animate-in fade-in">
              <div className="px-4 py-3 border-b border-border/80">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {user?.name || 'Developer'}
                </p>
                <p className="text-xs text-text-secondary truncate mt-0.5">
                  {user?.email}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded w-fit">
                  <ShieldCheck size={12} />
                  <span>Authenticated</span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-text-primary hover:bg-surface-1 transition-colors"
                >
                  <User size={14} className="text-text-tertiary" />
                  <span>Account &amp; Workspace</span>
                </Link>
                <Link
                  to="/projects"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-text-primary hover:bg-surface-1 transition-colors"
                >
                  <GithubIcon size={14} className="text-text-tertiary" />
                  <span>GitHub Repositories</span>
                </Link>
              </div>

              <div className="border-t border-border/80 pt-1">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-priority-high hover:bg-priority-high/10 transition-colors cursor-pointer font-medium"
                >
                  <LogOut size={14} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;