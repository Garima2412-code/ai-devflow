import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const TopBar = ({ breadcrumb }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-14 shrink-0 border-b border-border flex items-center justify-between px-6 bg-surface-0">
      <span className="text-small text-text-secondary">
        {breadcrumb || 'AI DevFlow'}
      </span>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="w-8 h-8 rounded-sm bg-accent text-white text-small font-medium
                     flex items-center justify-center cursor-pointer"
        >
          {user?.name?.charAt(0).toUpperCase()}
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 border border-border rounded-md
                          bg-surface-0 shadow-sm py-1 z-10">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-body text-text-primary font-medium">{user?.name}</p>
              <p className="text-small text-text-secondary">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="w-full text-left px-3 py-2 text-body text-text-primary
                         hover:bg-surface-1 cursor-pointer"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;