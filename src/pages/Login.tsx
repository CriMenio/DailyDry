import { FormEvent, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/account';

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(mobile.trim(), password);
      showToast('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Login failed', 'error');
    }
  };

  return (
    <section className="auth-page">
      <div className="container auth-card-wrap">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h1>Sign in</h1>
          <p className="auth-sub">Sign in to place orders and track deliveries.</p>

          <div className="contact-field">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              id="mobile"
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile"
            />
          </div>
          <div className="contact-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="auth-footer-text">
            New customer? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
