import api from './axios';

export const getProjectsByTeam = async (teamId) => {
  const response = await api.get(`/projects/team/${teamId}`);
  return response.data;
};

export const createProject = async (name, description, teamId) => {
  const response = await api.post('/projects', { name, description, teamId });
  return response.data;
};

export const getProjectById = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};