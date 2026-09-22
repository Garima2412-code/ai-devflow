import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-0">
      <div className="w-full max-w-sm border border-border rounded-md p-8">
        <h1 className="text-page-title font-semibold text-text-primary mb-1">
          AI DevFlow
        </h1>
        <p className="text-small text-text-secondary mb-6">
          Create your account
        </p>

        {error && (
          <div className="text-small text-priority-high bg-red-50 border border-priority-high/20 rounded-sm px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Garima"
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent hover:bg-accent-hover text-white text-body
                       px-4 py-2 rounded-sm mt-2 disabled:opacity-60 cursor-pointer"
          >
            {submitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-small text-text-secondary mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-accent">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;