import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-page-title font-semibold text-text-primary">
        Dashboard
      </h1>
      <p className="text-text-secondary mt-2">
        Welcome, {user?.name}. This page is coming soon.
      </p>
      <button
        onClick={logout}
        className="mt-4 border border-border text-text-primary text-body
                   px-4 py-2 rounded-sm cursor-pointer hover:bg-surface-1"
      >
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;