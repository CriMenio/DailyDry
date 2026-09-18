import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { submitContactForm } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ScrollReveal } from '../hooks/useScrollReveal';
import { STORE_PHONE_DISPLAY, STORE_PHONE_TEL, STORE_ADDRESS, STORE_EMAIL, STORE_EMAIL_MAILTO, STORE_SOCIAL_LINKS } from '../config/commerce';

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
} as const;

const contactInfo = [
  {
    title: 'Visit us',
    desc: 'Come say hello at our office HQ.',
    detail: STORE_ADDRESS,
  },
  {
    title: 'Chat to us',
    desc: 'Our friendly team is here to help.',
    detail: STORE_EMAIL,
    href: STORE_EMAIL_MAILTO,
  },
  {
    title: 'Call us',
    desc: 'Mon–Sat from 9am to 7pm',
    detail: STORE_PHONE_DISPLAY,
    href: STORE_PHONE_TEL,
  },
];

const socialLinks = STORE_SOCIAL_LINKS.map(({ id, label, href }) => ({
  icon: socialIcons[id],
  label,
  href,
}));

export default function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    consent: false,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      showToast('Please agree to the Privacy Policy to continue.');
      return;
    }
    setSubmitting(true);
    try {
      await submitContactForm({
        customerName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        mobile: form.phone.trim(),
        address: '',
        email: form.email || undefined,
        remarks: form.message.trim(),
      });
      showToast('Message sent! We will get back to you soon.');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        consent: false,
      });
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not send message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact-page">
      <div className="container">
        <div className="contact-page-grid">
          <ScrollReveal direction="left">
            <aside className="contact-info-card">
            <h2 className="contact-info-title">Get in touch</h2>

            {contactInfo.map((item) => (
              <div key={item.title} className="contact-info-block">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                {item.href ? (
                  <a href={item.href}>{item.detail}</a>
                ) : (
                  <p>{item.detail}</p>
                )}
              </div>
            ))}

            <div className="contact-info-block">
              <h3>Social media</h3>
              <div className="contact-social">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
            </aside>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={120}>
            <form className="contact-form-panel" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="contact-field">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div className="contact-field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="email">Email <span className="field-optional">(optional)</span></label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="contact-field">
              <label htmlFor="phone">Phone Number</label>
              <div className="contact-phone-wrap">
                <span className="contact-phone-prefix">+91</span>
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="86559 33503"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={5}
                required
                placeholder="Tell us what we can help you with"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <label className="contact-consent">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
              />
              <span>
                I&apos;d like to receive more information about Daily Dry. I understand and agree to the{' '}
                <Link to="/privacy">Privacy Policy</Link>.
              </span>
            </label>

            <button type="submit" className="btn btn-primary btn-block contact-submit-btn btn-lift" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send Message'}
            </button>
          </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
