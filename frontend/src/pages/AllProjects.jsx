import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FolderKanban, 
  Search, 
  ArrowRight, 
  GitBranch, 
  Users, 
  AlertCircle,
  Plus
} from 'lucide-react';
import AppLayout from '../components/AppLayout';
import * as projectsApi from '../api/projects';

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsApi.getMyProjects();
        setProjects(data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.team?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <AppLayout breadcrumb="Projects">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/80 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            All Projects &amp; Boards
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Access and manage Kanban boards across all your engineering workspaces.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/teams"
            className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Create from Teams</span>
          </Link>
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

      {/* Filter / Search Bar */}
      {projects.length > 0 && (
        <div className="my-5 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={13} className="absolute left-3 top-2.5 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, descriptions, or teams..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border text-xs bg-surface-0 text-text-primary outline-none focus:border-accent"
            />
          </div>

          <span className="text-xs text-text-tertiary font-mono">
            {filteredProjects.length} of {projects.length} projects
          </span>
        </div>
      )}

      {/* Main Grid */}
      <div className="my-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-text-tertiary">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 rounded-xl bg-surface-0 border border-dashed border-border text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center text-text-tertiary mb-3">
              <FolderKanban size={24} />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">No projects yet</h3>
            <p className="text-xs text-text-secondary mt-1 max-w-sm">
              Projects are scoped to teams. Join or create a team first, then launch a project from there.
            </p>
            <Link
              to="/teams"
              className="mt-5 px-4 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors"
            >
              Go to Teams
            </Link>
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

                    <span className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-surface-2 text-text-secondary border border-border/80 truncate max-w-[130px]">
                      {project.team?.name || 'Workspace'}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                    {project.name}
                  </h3>

                  <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed min-h-[34px]">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  {project.githubRepo ? (
                    <span className="flex items-center gap-1 font-mono text-[10.5px] text-text-secondary truncate max-w-[150px]">
                      <GitBranch size={11} className="shrink-0 text-text-tertiary" />
                      <span className="truncate">{project.githubRepo.split('/')[1] || project.githubRepo}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-text-tertiary">No repo linked</span>
                  )}

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
    </AppLayout>
  );
};

export default AllProjects;