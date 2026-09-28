import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FolderKanban, 
  Plus, 
  ArrowRight, 
  GitBranch, 
  User, 
  AlertCircle,
  Search,
  ChevronLeft
} from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      const data = await projectsApi.getProjectsByTeam(teamId);
      setProjects(data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load projects for this team.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [teamId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await projectsApi.createProject(name.trim(), description.trim(), teamId);
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

  const filteredProjects = projects.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout breadcrumb="Teams / Projects">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/80 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/teams"
              className="text-xs text-text-tertiary hover:text-text-primary flex items-center gap-1 font-medium transition-colors"
            >
              <ChevronLeft size={14} />
              <span>Back to Teams</span>
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Team Projects
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Sprint boards and task repositories scoped to this team.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-priority-high/10 border border-priority-high/30 text-priority-high text-xs my-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="cursor-pointer text-xs">✕</button>
        </div>
      )}

      {/* Search Bar */}
      {projects.length > 0 && (
        <div className="my-5 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search size={13} className="absolute left-3 top-2.5 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border text-xs bg-surface-0 text-text-primary outline-none focus:border-accent"
            />
          </div>
          <span className="text-xs text-text-tertiary font-mono">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>
      )}

      {/* Projects Grid */}
      <div className="my-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-text-tertiary">
            Loading team projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 rounded-xl bg-surface-0 border border-dashed border-border text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center text-text-tertiary mb-3">
              <FolderKanban size={24} />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">No projects created yet</h3>
            <p className="text-xs text-text-secondary mt-1 max-w-sm">
              Create the first project for this team to get a dedicated Kanban board and GitHub activity panel.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-5 px-4 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors cursor-pointer"
            >
              Create First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="group p-5 rounded-xl bg-surface-0 border border-border hover:border-accent hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-text-primary group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                      <FolderKanban size={18} />
                    </div>

                    {project.githubRepo ? (
                      <span className="flex items-center gap-1 font-mono text-[10.5px] px-2 py-0.5 rounded bg-surface-2 border border-border text-text-secondary max-w-[150px] truncate">
                        <GitBranch size={11} className="shrink-0" />
                        <span className="truncate">{project.githubRepo.split('/')[1] || project.githubRepo}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-text-tertiary">No repo</span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                    {project.name}
                  </h3>

                  <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed min-h-[34px]">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-tertiary">
                  <span className="flex items-center gap-1 truncate max-w-[150px]">
                    <User size={12} />
                    <span className="truncate">{project.createdBy?.name || 'Developer'}</span>
                  </span>
                  <div className="flex items-center gap-1 font-medium text-text-primary group-hover:text-accent transition-colors">
                    <span>Open Board</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Create Project */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Project"
        subtitle="Initialize a project with a Kanban board and GitHub connectivity."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. ShopKart Frontend, Billing Microservice"
            required
            autoFocus
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is the objective or scope of this project?"
              rows={3}
              className="w-full rounded-lg border border-border bg-surface-0 px-3.5 py-2.5 text-xs sm:text-sm text-text-primary transition-all outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 placeholder:text-text-tertiary/70"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="w-full bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Creating Project...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
};

export default TeamDetail;