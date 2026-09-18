import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { completePasswordReset, requestPasswordReset } from '../services/api';
import { useToast } from '../context/ToastContext';
import { STORE_EMAIL, STORE_WHATSAPP_URL } from '../config/commerce';

type Step = 'request' | 'reset';

export default function ForgotPassword() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('request');
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRequestCode = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { message } = await requestPasswordReset(mobile.trim(), email.trim());
      showToast(message);
      setStep('reset');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not send code', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    try {
      const { message } = await completePasswordReset({
        mobile: mobile.trim(),
        email: email.trim(),
        code: code.trim(),
        newPassword: password,
      });
      showToast(message);
      navigate('/login', { replace: true });
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Reset failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const supportWhatsApp = `${STORE_WHATSAPP_URL}?text=${encodeURIComponent(
    'Hello Daily Dry, I need help resetting my password. My mobile: '
  )}`;

  return (
    <section className="auth-page">
      <div className="container auth-card-wrap">
        {step === 'request' ? (
          <form className="auth-card auth-card-signin" onSubmit={handleRequestCode}>
            <h1>Reset password</h1>
            <p className="auth-sub">
              Enter the <strong>mobile number</strong> and <strong>email</strong> from your account. We&apos;ll email
              you a 6-digit code (valid 15 minutes).
            </p>

            <div className="auth-fields">
              <div className="contact-field">
                <label htmlFor="reset-mobile">Mobile number</label>
                <input
                  id="reset-mobile"
                  type="tel"
                  inputMode="numeric"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile"
                />
              </div>
              <div className="contact-field">
                <label htmlFor="reset-email">Email</label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Same email as registration"
                />
              </div>
            </div>

            <div className="auth-submit">
              <button type="submit" className="btn btn-primary btn-block btn-lift" disabled={loading}>
                {loading ? 'Sending…' : 'Send reset code'}
              </button>
            </div>

            <p className="auth-footer-text">
              Remember your password? <Link to="/login">Back to sign in</Link>
            </p>
          </form>
        ) : (
          <form className="auth-card auth-card-signin" onSubmit={handleResetPassword}>
            <h1>Enter code &amp; new password</h1>
            <p className="auth-sub">
              Check <strong>{email}</strong> for your 6-digit code, then choose a new password.
            </p>

            <div className="auth-fields">
              <div className="contact-field">
                <label htmlFor="reset-code">Reset code</label>
                <input
                  id="reset-code"
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit code"
                />
              </div>
              <div className="contact-field">
                <label htmlFor="reset-password">New password</label>
                <div className="auth-password-wrap">
                  <input
                    id="reset-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
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
              <div className="contact-field">
                <label htmlFor="reset-confirm">Confirm password</label>
                <input
                  id="reset-confirm"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            <div className="auth-submit">
              <button type="submit" className="btn btn-primary btn-block btn-lift" disabled={loading}>
                {loading ? 'Updating…' : 'Update password'}
              </button>
              <button
                type="button"
                className="btn btn-outline btn-block"
                style={{ marginTop: '0.5rem' }}
                disabled={loading}
                onClick={() => setStep('request')}
              >
                Resend code
              </button>
            </div>

            <p className="auth-footer-text">
              <Link to="/login">Back to sign in</Link>
            </p>
          </form>
        )}

        <p className="forgot-password-support">
          Wrong email on file?{' '}
          <a href={supportWhatsApp} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>{' '}
          or {STORE_EMAIL}
        </p>
      </div>
    </section>
  );
}
