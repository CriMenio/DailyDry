import { Link } from 'react-router-dom';

const logos = {
  mark: '/logo.png',
  wordmark: '/logo%20w.png',
} as const;

interface LogoProps {
  variant?: 'header' | 'footer';
  className?: string;
  link?: boolean;
  linkClassName?: string;
}

export default function Logo({
  variant = 'header',
  className = '',
  link = true,
  linkClassName = '',
}: LogoProps) {
  const content =
    variant === 'footer' ? (
      <img
        src={logos.wordmark}
        alt="Daily Dry"
        className={`logo-img logo-img-wordmark ${className}`.trim()}
      />
    ) : (
      <img
        src={logos.mark}
        alt="Daily Dry — Premium Dry Fruits & Nuts"
        className={`logo-img logo-img-mark ${className}`.trim()}
      />
    );

  if (!link) return <div className="logo">{content}</div>;

  return (
    <Link to="/" className={`logo ${linkClassName}`.trim()}>
      {content}
    </Link>
  );
}
