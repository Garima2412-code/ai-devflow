import api from './axios';

export const getGithubStatus = async () => {
  const response = await api.get('/github/status');
  return response.data;
};

export const getConnectUrl = () => {
  const token = localStorage.getItem('token');
  return `http://localhost:5001/api/github/connect?token=${token}`;
};

export const listRepos = async () => {
  const response = await api.get('/github/repos');
  return response.data;
};

export const linkRepoToProject = async (projectId, repoFullName) => {
  const response = await api.patch(`/projects/${projectId}/github-repo`, { repoFullName });
  return response.data;
};

export const getProjectCommits = async (projectId) => {
  const response = await api.get(`/github/projects/${projectId}/commits`);
  return response.data;
};

export const getProjectPulls = async (projectId) => {
  const response = await api.get(`/github/projects/${projectId}/pulls`);
  return response.data;
};