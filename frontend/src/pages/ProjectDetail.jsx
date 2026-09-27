import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

  // "New Task" creation modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitting, setSubmitting] = useState(false);

  // Task detail modal state — separate from the creation modal above
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchData = async () => {
    try {
      const [projectData, tasksData] = await Promise.all([
        projectsApi.getProjectById(projectId),
        tasksApi.getTasksByProject(projectId),
      ]);
      setProject(projectData);
      setTasks(tasksData);
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
    setSubmitting(true);
    try {
      await tasksApi.createTask(title, description, projectId, priority);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (taskId, newStatus) => {
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

  if (loading) {
    return (
      <AppLayout breadcrumb="Loading...">
        <p className="text-text-secondary">Loading project...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumb={project?.name}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-page-title font-semibold text-text-primary">
          {project?.name}
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-accent hover:bg-accent-hover text-white text-body
                     px-4 py-2 rounded-sm cursor-pointer"
        >
          New Task
        </button>
      </div>

      {error && (
        <div className="text-small text-priority-high bg-red-50 border border-priority-high/20 rounded-sm px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-6">
        <div className="flex-1 overflow-x-auto -mx-3">
          {columns.map((col) => (
            <KanbanColumn
              key={col.key}
              title={col.label}
              status={col.key}
              tasks={tasks.filter((t) => t.status === col.key)}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>

        <div className="w-80 shrink-0">
          <GithubPanel
            project={project}
            onRepoLinked={(updatedProject) => setProject(updatedProject)}
          />
        </div>
      </div>

      {/* "New Task" creation modal — controlled by modalOpen */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Task">
        <form onSubmit={handleCreateTask}>
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Fix random logout bug"
            required
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Users get logged out unexpectedly"
          />
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-small text-text-secondary font-medium">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border border-border rounded-sm px-3 py-2 text-body text-text-primary bg-surface-0"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent hover:bg-accent-hover text-white text-body
                       px-4 py-2 rounded-sm mt-2 disabled:opacity-60 cursor-pointer"
          >
            {submitting ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </Modal>

      {/* Task detail + AI analysis modal — controlled by selectedTask, NOT modalOpen */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </AppLayout>
  );
};

export default ProjectDetail;