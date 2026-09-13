import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const { register, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    password: '',
    confirm: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    try {
      await register({
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        password: form.password,
      });
      showToast('Account created successfully!');
      navigate('/account', { replace: true });
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Registration failed', 'error');
    }
  };

  return (
    <section className="auth-page">
      <div className="container auth-card-wrap">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h1>Create account</h1>
          <p className="auth-sub">Required before placing an order on Daily Dry.</p>

          <div className="contact-field">
            <label htmlFor="name">Customer Name</label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="contact-field">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              id="mobile"
              type="tel"
              required
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            />
          </div>
          <div className="contact-field">
            <label htmlFor="email">Email ID</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="contact-field">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              rows={3}
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div className="contact-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="contact-field">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm"
              type="password"
              required
              minLength={6}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account…' : 'Sign up'}
          </button>

          <p className="auth-footer-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
