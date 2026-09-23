import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/AppLayout';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <AppLayout breadcrumb="Dashboard">
      <h1 className="text-page-title font-semibold text-text-primary">
        Dashboard
      </h1>
      <p className="text-text-secondary mt-2">
        Welcome, {user?.name}. Project and task data will appear here soon.
      </p>
    </AppLayout>
  );
};

export default Dashboard;