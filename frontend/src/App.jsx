import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import ProjectDetail from './pages/ProjectDetail';
import AllProjects from './pages/AllProjects.jsx';

const Home = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <Landing />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Home />} />
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
          <Route
            path="/teams/:teamId"
            element={
          <ProtectedRoute>
            <TeamDetail />
          </ProtectedRoute>
          }
          />
          <Route
            path="/projects/:projectId"
            element={
            <ProtectedRoute>
                <ProjectDetail />
            </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
            <ProtectedRoute>
                <AllProjects />
            </ProtectedRoute>
            }
          />
      </Routes>
    </BrowserRouter>
  );
}

export default App;