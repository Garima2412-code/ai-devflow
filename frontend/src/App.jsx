import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Teams from './pages/Teams';

const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-text-secondary">Loading...</div>;
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          />
          <Route
             path="/teams"
             element={
              <ProtectedRoute>
                <Teams />
             </ProtectedRoute>
            }
          />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;