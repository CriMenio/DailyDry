import PolicyPage from '../components/PolicyPage';
import { termsSections } from '../content/storePolicies';

export default function Terms() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      intro="Please read these terms before using dailydry.in or placing an order with Daily Dry."
      sections={termsSections}
    />
  );
}
