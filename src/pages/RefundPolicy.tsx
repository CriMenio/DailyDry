import PolicyPage from '../components/PolicyPage';
import { refundSections } from '../content/storePolicies';

export default function RefundPolicy() {
  return (
    <PolicyPage
      title="Cancellation & Refund Policy"
      intro="How to cancel an order, request a return, and when refunds apply."
      sections={refundSections}
    />
  );
}
