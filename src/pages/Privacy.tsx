import PolicyPage from '../components/PolicyPage';
import { privacySections } from '../content/storePolicies';

export default function Privacy() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="This policy explains how Daily Dry collects, uses, and protects your personal information."
      sections={privacySections}
    />
  );
}
