import api from './axios';

export const analyzeTask = async (taskId) => {
  const response = await api.post(`/ai/tasks/${taskId}/analyze`);
  return response.data;
};