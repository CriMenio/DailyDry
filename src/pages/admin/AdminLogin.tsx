import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { adminLogin } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Logo from '../../components/Logo';

import { usePageSeo } from '../../seo/syncPageSeo';

export default function AdminLogin() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

  usePageSeo({
    title: 'Admin sign in',
    pathname: '/admin/login',
    noIndex: true,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { adminToken } = await adminLogin(userName.trim(), password);
      localStorage.setItem('dailydry-admin-token', adminToken);
      showToast('Admin signed in');
      navigate('/admin');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Admin login failed', 'error');
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card">
        <Logo variant="footer" linkClassName="admin-auth-logo" />
        <div className="admin-auth-icon">
          <Shield size={28} />
        </div>
        <h1>Admin sign in</h1>
        <p>Daily Dry operations panel · Google Sheets backend</p>
        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label className="admin-field-label" htmlFor="userName">
              User name
            </label>
            <input
              id="userName"
              className="admin-field-input"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label className="admin-field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="admin-field-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lift">
            Continue to dashboard
          </button>
        </form>
        <Link to="/" className="admin-auth-back">
          ← Back to store
        </Link>
      </div>
    </div>
  );
}
