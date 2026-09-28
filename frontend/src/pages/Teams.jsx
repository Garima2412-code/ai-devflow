import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  KeyRound, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  FolderKanban
} from 'lucide-react';
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
  const [copiedId, setCopiedId] = useState(null);

  const navigate = useNavigate();

  const fetchTeams = async () => {
    try {
      const data = await teamsApi.getMyTeams();
      setTeams(data || []);
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
    if (!teamName.trim()) return;

    setSubmitting(true);
    try {
      await teamsApi.createTeam(teamName.trim());
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
    if (!inviteCode.trim()) return;

    setSubmitting(true);
    try {
      await teamsApi.joinTeam(inviteCode.trim());
      setInviteCode('');
      setJoinModalOpen(false);
      fetchTeams();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not join team with that code.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = (code, id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AppLayout breadcrumb="Teams">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/80 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Engineering Teams
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Manage your collaborative engineering groups, invite teammates, and scope projects.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setJoinModalOpen(true)}
            className="px-3.5 py-2 rounded-lg border border-border bg-surface-0 hover:bg-surface-2 text-xs font-medium text-text-primary transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <KeyRound size={14} className="text-text-secondary" />
            <span>Join with Code</span>
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Create Team</span>
          </button>
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

      {/* Main Grid */}
      <div className="my-6">
        {loading ? (
          <div className="p-12 text-center text-xs text-text-tertiary">
            Loading teams...
          </div>
        ) : teams.length === 0 ? (
          <div className="p-12 rounded-xl bg-surface-0 border border-dashed border-border text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center text-text-tertiary mb-3">
              <Users size={24} />
            </div>
            <h3 className="text-sm font-semibold text-text-primary">No teams joined yet</h3>
            <p className="text-xs text-text-secondary mt-1 max-w-sm">
              Create an engineering team to start organizing your boards and inviting teammates.
            </p>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors cursor-pointer"
              >
                Create Team
              </button>
              <button
                onClick={() => setJoinModalOpen(true)}
                className="px-4 py-2 rounded-lg border border-border text-text-primary text-xs font-medium hover:bg-surface-1 transition-colors cursor-pointer"
              >
                Join with Code
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <div
                key={team._id}
                onClick={() => navigate(`/teams/${team._id}`)}
                className="group p-5 rounded-xl bg-surface-0 border border-border hover:border-accent hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-accent text-white text-sm font-bold flex items-center justify-center shadow-xs">
                      {team.name ? team.name.charAt(0).toUpperCase() : 'T'}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10.5px] px-2 py-0.5 rounded bg-surface-2 border border-border text-text-secondary">
                        {team.inviteCode}
                      </span>
                      <button
                        onClick={(e) => copyCode(team.inviteCode, team._id, e)}
                        title="Copy invite code"
                        className="p-1.5 rounded hover:bg-surface-2 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                      >
                        {copiedId === team._id ? (
                          <Check size={13} className="text-emerald-500" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                    {team.name}
                  </h3>

                  <p className="text-xs text-text-secondary mt-1">
                    Owner: <span className="font-medium text-text-primary">{team.owner?.name || 'You'}</span>
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-tertiary">
                  <span className="flex items-center gap-1">
                    <FolderKanban size={13} />
                    <span>View Projects</span>
                  </span>
                  <ArrowRight size={14} className="text-text-tertiary group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Create Team */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create an Engineering Team"
        subtitle="You will be designated as the team owner and receive an invite code."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="e.g. Core Infrastructure, Frontend Ops"
            required
            autoFocus
          />

          <button
            type="submit"
            disabled={submitting || !teamName.trim()}
            className="w-full bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Creating Team...' : 'Create Team'}
          </button>
        </form>
      </Modal>

      {/* Modal: Join Team */}
      <Modal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        title="Join Existing Team"
        subtitle="Enter the 8-character invite code provided by your team lead."
      >
        <form onSubmit={handleJoin} className="space-y-4">
          <Input
            label="Invite Code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="e.g. a1b2c3d4"
            required
            autoFocus
          />

          <button
            type="submit"
            disabled={submitting || !inviteCode.trim()}
            className="w-full bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Joining Team...' : 'Join Team'}
          </button>
        </form>
      </Modal>
    </AppLayout>
  );
};

export default Teams;