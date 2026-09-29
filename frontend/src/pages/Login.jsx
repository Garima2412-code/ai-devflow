import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface-0 bg-grid-pattern relative overflow-hidden">
      {/* Subtle Ambient Radial Highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent/10 dark:bg-white/5 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="w-full max-w-md border border-border rounded-2xl bg-surface-0/95 backdrop-blur-md shadow-2xl p-8 ring-1 ring-black/5">
        <div className="flex flex-col items-center text-center mb-6">
          <Link to="/" className="inline-block hover:opacity-90 mb-3">
            <Logo size={30} badge="v2.0" />
          </Link>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">
            Sign in to AI DevFlow
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Access your developer workspaces, Kanban sprints &amp; AI triage
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-priority-high/10 border border-priority-high/30 text-priority-high text-xs mb-4">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="developer@company.com"
            icon={Mail}
            required
            autoFocus
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-8 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-lg shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-border/80 text-center">
          <p className="text-xs text-text-secondary">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-accent font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;