import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function BulkOrders() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Quote request submitted! We will contact you soon.');
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Bulk Orders & Corporate Gifting</h1>
          <p>Special pricing for events, festivals, and corporate needs</p>
        </div>
      </div>
      <div className="page-content">
        <div className="container" style={{ maxWidth: '600px' }}>
          <form
            onSubmit={handleSubmit}
            style={{ background: 'var(--white)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Phone</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Requirements</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us about your bulk order requirements..."
                style={{ width: '100%', padding: '0.65rem 1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', resize: 'vertical' }}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Request a Quote
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
