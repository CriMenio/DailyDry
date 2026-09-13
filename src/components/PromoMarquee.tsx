import { Truck, Shield, Leaf, Gift } from 'lucide-react';
import { FREE_SHIPPING_MIN } from '../config/commerce';

const promoItems = [
  { icon: Leaf, text: '🎁 Join WhatsApp Community — Get exclusive dry fruit deals' },
  { icon: Truck, text: `Free Shipping on Orders Above ₹${FREE_SHIPPING_MIN}` },
  { icon: Shield, text: 'FSSAI Certified · 100% Natural · Hygienically Packed' },
  { icon: Gift, text: 'Bulk Orders & Corporate Gifting Available' },
];

export default function PromoMarquee() {
  const items = [...promoItems, ...promoItems];

  return (
    <div className="promo-marquee">
      <div className="promo-marquee-track">
        {items.map((item, i) => (
          <span key={i} className="promo-marquee-item">
            <item.icon size={14} />
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
