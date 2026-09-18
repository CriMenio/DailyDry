import PolicyPage from '../components/PolicyPage';
import { shippingSections } from '../content/storePolicies';

export default function ShippingPolicy() {
  return (
    <PolicyPage
      title="Shipping & Delivery Policy"
      intro="How we deliver orders, shipping fees, and timelines for Daily Dry."
      sections={shippingSections}
    />
  );
}
