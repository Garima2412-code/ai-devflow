import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Modal from '../components/Modal';
import Input from '../components/Input';
import * as projectsApi from '../api/projects';

const TeamDetail = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      const data = await projectsApi.getProjectsByTeam(teamId);
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [teamId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await projectsApi.createProject(name, description, teamId);
      setName('');
      setDescription('');
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout breadcrumb="Teams / Projects">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-page-title font-semibold text-text-primary">Projects</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-accent hover:bg-accent-hover text-white text-body
                     px-4 py-2 rounded-sm cursor-pointer"
        >
          Create Project
        </button>
      </div>

      {error && (
        <div className="text-small text-priority-high bg-red-50 border border-priority-high/20 rounded-sm px-3 py-2 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-text-secondary">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-text-secondary">
          No projects yet. Create the first one to get started.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/projects/${project._id}`)}
              className="border border-border rounded-sm px-4 py-3 cursor-pointer hover:bg-surface-1"
            >
              <p className="text-body text-text-primary font-medium">{project.name}</p>
              {project.description && (
                <p className="text-small text-text-secondary mt-1">
                  {project.description}
                </p>
              )}
              <p className="text-small text-text-tertiary mt-1">
                Created by {project.createdBy?.name}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create a Project">
        <form onSubmit={handleCreate}>
          <Input
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ShopKart Web"
            required
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Main e-commerce site"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent hover:bg-accent-hover text-white text-body
                       px-4 py-2 rounded-sm mt-2 disabled:opacity-60 cursor-pointer"
          >
            {submitting ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </Modal>
    </AppLayout>
  );
};

export default TeamDetail;