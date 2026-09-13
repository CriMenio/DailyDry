import { Banknote, Truck, Sparkles } from 'lucide-react';
import { ScrollReveal } from '../hooks/useScrollReveal';

const items = [
  { icon: Banknote, label: 'Cash on delivery', sub: 'Pay when your order arrives' },
  { icon: Truck, label: 'Free Shipping', sub: 'On orders above ₹999' },
  { icon: Sparkles, label: 'Fresh & Hygienic', sub: 'Packed with care' },
];

export default function TrustBar() {
  return (
    <section className="trust-bar trust-bar-ss2">
      <div className="container">
        <ScrollReveal>
          <div className="trust-items">
            {items.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="trust-item">
                <Icon size={28} strokeWidth={1.5} />
                <div className="trust-item-text">
                  <strong>{label}</strong>
                  <span>{sub}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
