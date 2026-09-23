import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Modal from '../components/Modal';
import Input from '../components/Input';
import * as teamsApi from '../api/teams';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const fetchTeams = async () => {
    try {
      const data = await teamsApi.getMyTeams();
      setTeams(data);
    } catch (err) {
      setError('Could not load teams. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await teamsApi.createTeam(teamName);
      setTeamName('');
      setCreateModalOpen(false);
      fetchTeams();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create team.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await teamsApi.joinTeam(inviteCode);
      setInviteCode('');
      setJoinModalOpen(false);
      fetchTeams();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not join team.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout breadcrumb="Teams">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-page-title font-semibold text-text-primary">Teams</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setJoinModalOpen(true)}
            className="border border-border text-text-primary text-body px-4 py-2
                       rounded-sm cursor-pointer hover:bg-surface-1"
          >
            Join Team
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-accent hover:bg-accent-hover text-white text-body
                       px-4 py-2 rounded-sm cursor-pointer"
          >
            Create Team
          </button>
        </div>
      </div>

      {error && (
        <div className="text-small text-priority-high bg-red-50 border border-priority-high/20 rounded-sm px-3 py-2 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-text-secondary">Loading teams...</p>
      ) : teams.length === 0 ? (
        <p className="text-text-secondary">
          No teams yet. Create one or join one using an invite code.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {teams.map((team) => (
            <div
              key={team._id}
              onClick={() => navigate(`/teams/${team._id}`)}
              className="border border-border rounded-sm px-4 py-3 cursor-pointer hover:bg-surface-1"
            >
              <p className="text-body text-text-primary font-medium">{team.name}</p>
              <p className="text-small text-text-secondary mt-1">
                Owner: {team.owner?.name} · Invite code: {team.inviteCode}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create a Team"
      >
        <form onSubmit={handleCreate}>
          <Input
            label="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="ShopKart Team"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent hover:bg-accent-hover text-white text-body
                       px-4 py-2 rounded-sm mt-2 disabled:opacity-60 cursor-pointer"
          >
            {submitting ? 'Creating...' : 'Create Team'}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        title="Join a Team"
      >
        <form onSubmit={handleJoin}>
          <Input
            label="Invite Code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="a1b2c3d4"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent hover:bg-accent-hover text-white text-body
                       px-4 py-2 rounded-sm mt-2 disabled:opacity-60 cursor-pointer"
          >
            {submitting ? 'Joining...' : 'Join Team'}
          </button>
        </form>
      </Modal>
    </AppLayout>
  );
};

export default Teams;