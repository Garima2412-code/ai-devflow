import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import * as projectsApi from '../api/projects';

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsApi.getMyProjects();
        setProjects(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <AppLayout breadcrumb="Projects">
      <h1 className="text-page-title font-semibold text-text-primary mb-6">
        All Projects
      </h1>

      {error && (
        <div className="text-small text-priority-high bg-red-50 border border-priority-high/20 rounded-sm px-3 py-2 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-text-secondary">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-text-secondary">
          No projects yet. Join or create a team, then create a project from there.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/projects/${project._id}`)}
              className="border border-border rounded-sm px-4 py-3 cursor-pointer hover:bg-surface-1"
            >
              <div className="flex items-center justify-between">
                <p className="text-body text-text-primary font-medium">{project.name}</p>
                <span className="text-small text-text-tertiary">{project.team?.name}</span>
              </div>
              {project.description && (
                <p className="text-small text-text-secondary mt-1">
                  {project.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default AllProjects;