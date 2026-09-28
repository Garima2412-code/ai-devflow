import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Plus, 
  GitBranch, 
  Search, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import AppLayout from '../components/AppLayout';
import Modal from '../components/Modal';
import Input from '../components/Input';
import KanbanColumn from '../components/KanbanColumn';
import GithubPanel from '../components/GithubPanel';
import TaskDetailModal from '../components/TaskDetailModal';
import * as projectsApi from '../api/projects';
import * as tasksApi from '../api/tasks';

const columns = [
  { key: 'todo', label: 'Todo' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Done' },
];

const ProjectDetail = () => {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // "New Task" creation modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [targetStatus, setTargetStatus] = useState('todo');
  const [submitting, setSubmitting] = useState(false);

  // Task detail modal state
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchData = async () => {
    try {
      const [projectData, tasksData] = await Promise.all([
        projectsApi.getProjectById(projectId),
        tasksApi.getTasksByProject(projectId),
      ]);
      setProject(projectData);
      setTasks(tasksData || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load project.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const newTask = await tasksApi.createTask(title.trim(), description.trim(), projectId, priority);
      // If a specific status was selected from column quick-add, update it
      if (targetStatus && targetStatus !== 'todo' && newTask?._id) {
        await tasksApi.updateTaskStatus(newTask._id, targetStatus);
      }
      setTitle('');
      setDescription('');
      setPriority('medium');
      setTargetStatus('todo');
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickAdd = (status) => {
    setTargetStatus(status);
    setModalOpen(true);
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await tasksApi.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      setError('Could not update task status.');
      fetchData();
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = 
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  if (loading) {
    return (
      <AppLayout breadcrumb="Loading Project...">
        <div className="flex items-center justify-center h-64 text-xs text-text-tertiary">
          Loading board workspace...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumb={`Projects / ${project?.name || 'Board'}`}>
      {/* Project Header Banner */}
      <div className="pb-6 border-b border-border/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                {project?.name}
              </h1>
              {project?.githubRepo && (
                <a
                  href={`https://github.com/${project.githubRepo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono bg-surface-2 hover:bg-surface-3 text-text-secondary border border-border transition-colors"
                >
                  <GitBranch size={11} className="text-text-tertiary" />
                  <span>{project.githubRepo}</span>
                  <ExternalLink size={10} className="text-text-tertiary" />
                </a>
              )}
            </div>
            {project?.description && (
              <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                setTargetStatus('todo');
                setModalOpen(true);
              }}
              className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Board Search & Priority Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-border/60">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={13} className="absolute left-3 top-2.5 text-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter tasks on board..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border text-xs bg-surface-0 text-text-primary outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-1 border border-border text-xs">
              <button
                onClick={() => setPriorityFilter('all')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
                  priorityFilter === 'all' ? 'bg-surface-0 text-text-primary font-semibold shadow-xs' : 'text-text-secondary'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setPriorityFilter('high')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
                  priorityFilter === 'high' ? 'bg-surface-0 text-priority-high font-semibold shadow-xs' : 'text-text-secondary'
                }`}
              >
                High
              </button>
              <button
                onClick={() => setPriorityFilter('medium')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
                  priorityFilter === 'medium' ? 'bg-surface-0 text-priority-medium font-semibold shadow-xs' : 'text-text-secondary'
                }`}
              >
                Med
              </button>
              <button
                onClick={() => setPriorityFilter('low')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
                  priorityFilter === 'low' ? 'bg-surface-0 text-priority-low font-semibold shadow-xs' : 'text-text-secondary'
                }`}
              >
                Low
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <span className="font-mono">{filteredTasks.length}</span>
            <span>of</span>
            <span className="font-mono">{tasks.length}</span>
            <span>tasks shown</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-priority-high/10 border border-priority-high/30 text-priority-high text-xs my-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="cursor-pointer text-xs">✕</button>
        </div>
      )}

      {/* Main Board + GitHub Activity Split Layout */}
      <div className="flex flex-col xl:flex-row gap-6 mt-6 items-start">
        {/* Kanban Columns Zone */}
        <div className="flex-1 w-full overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[900px]">
            {columns.map((col) => (
              <KanbanColumn
                key={col.key}
                title={col.label}
                status={col.key}
                tasks={filteredTasks.filter((t) => t.status === col.key)}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onTaskClick={handleTaskClick}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        </div>

        {/* Right GitHub Panel */}
        <div className="w-full xl:w-80 shrink-0">
          <GithubPanel
            project={project}
            onRepoLinked={(updatedProject) => setProject(updatedProject)}
          />
        </div>
      </div>

      {/* "New Task" creation modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Task"
        subtitle={`Adding to ${project?.name} • ${targetStatus.replace('_', ' ').toUpperCase()}`}
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Fix race condition in authentication token refresh"
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
              placeholder="Provide context, reproduction steps, or error traces for Gemini AI..."
              rows={3}
              className="w-full rounded-lg border border-border bg-surface-0 px-3.5 py-2.5 text-xs sm:text-sm text-text-primary transition-all outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 placeholder:text-text-tertiary/70"
            />
          </div>

          {/* Priority Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'low', label: 'Low', color: 'border-slate-300 dark:border-slate-700 text-text-secondary' },
                { key: 'medium', label: 'Medium', color: 'border-amber-400 text-amber-600 dark:text-amber-400' },
                { key: 'high', label: 'High', color: 'border-rose-400 text-rose-600 dark:text-rose-400' },
              ].map((p) => (
                <button
                  type="button"
                  key={p.key}
                  onClick={() => setPriority(p.key)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                    priority === p.key
                      ? `bg-surface-2 border-accent font-semibold ring-1 ring-accent`
                      : 'border-border bg-surface-0 hover:bg-surface-1'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="w-full bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Creating Task...' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Task detail + AI analysis modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </AppLayout>
  );
};

export default ProjectDetail;