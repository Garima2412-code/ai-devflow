import api from './axios';

export const getMyTeams = async () => {
  const response = await api.get('/teams');
  return response.data;
};

export const createTeam = async (name) => {
  const response = await api.post('/teams', { name });
  return response.data;
};

export const joinTeam = async (inviteCode) => {
  const response = await api.post('/teams/join', { inviteCode });
  return response.data;
};