import api from './axios';

export const getTasksByProject = async (projectId) => {
  const response = await api.get(`/tasks/project/${projectId}`);
  return response.data;
};

export const createTask = async (title, description, projectId, priority) => {
  const response = await api.post('/tasks', { title, description, projectId, priority });
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await api.patch(`/tasks/${taskId}/status`, { status });
  return response.data;
};