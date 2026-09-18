import { FormEvent, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

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
        <form className="auth-card auth-card-signin" onSubmit={handleSubmit}>
          <h1>Sign in</h1>
          <p className="auth-sub">Sign in to place orders and track deliveries.</p>

          <div className="auth-fields">
            <div className="contact-field">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                id="mobile"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                required
                maxLength={10}
                pattern="[0-9]{10}"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile"
              />
            </div>

            <div className="contact-field">
              <label htmlFor="password">Password</label>
              <div className="auth-password-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="auth-submit">
            <button type="submit" className="btn btn-primary btn-block btn-lift" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>

          <p className="auth-footer-text">
            New customer? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
