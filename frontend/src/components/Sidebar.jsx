import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Teams', path: '/teams' },
  { label: 'Projects', path: '/projects' },
];

const Sidebar = () => {
  return (
    <aside className="w-sidebar shrink-0 h-screen border-r border-border bg-surface-1 flex flex-col">
      <div className="px-4 py-4 border-b border-border">
        <span className="text-body font-semibold text-text-primary">
          AI DevFlow
        </span>
      </div>

      <nav className="flex flex-col p-2 gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `text-body px-3 py-2 rounded-sm transition-colors ${
                isActive
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-text-secondary hover:bg-surface-2'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;