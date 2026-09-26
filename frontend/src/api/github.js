import api from './axios';

export const getGithubStatus = async () => {
  const response = await api.get('/github/status');
  return response.data;
};

export const getConnectUrl = () => {
  const token = localStorage.getItem('token');
  return `http://localhost:5001/api/github/connect?token=${token}`;
};