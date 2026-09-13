import { useToast } from '../context/ToastContext';

export default function NewsletterBand() {
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showToast('Thanks for subscribing! Check your email for 10% off.');
    e.currentTarget.reset();
  };

  return (
    <section className="newsletter-band">
      <div className="container newsletter-band-inner">
        <div>
          <h2>Join Our Nutty Family</h2>
          <p>Subscribe &amp; avail 10% off your first order</p>
        </div>
        <form className="newsletter-band-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="Enter your email" required />
          <button type="submit" className="btn btn-gold">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
