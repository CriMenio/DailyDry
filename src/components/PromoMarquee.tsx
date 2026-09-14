import { Truck, Shield, Leaf, Gift } from 'lucide-react';
import { freeShippingThresholdLabel } from '../config/commerce';
import { useInventory } from '../context/InventoryContext';

export default function PromoMarquee() {
  const { storeSettings } = useInventory();
  const freeMin = freeShippingThresholdLabel(storeSettings);

  const promoItems = [
    { icon: Leaf, text: '🎁 Join WhatsApp Community — Get exclusive dry fruit deals' },
    { icon: Truck, text: `Free Shipping on Orders Above ₹${freeMin}` },
    { icon: Shield, text: 'FSSAI Certified · 100% Natural · Hygienically Packed' },
    { icon: Gift, text: 'Bulk Orders & Corporate Gifting Available' },
  ];

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
