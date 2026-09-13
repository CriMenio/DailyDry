import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  Menu,
  X,
  Leaf,
  Truck,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Logo from './Logo';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function Header({ searchQuery = '', onSearchChange }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/contact', label: 'Contact Us' },
  ];

  return (
    <>
      <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="container">
          <div className="header-inner">
            <Logo />

            <nav className="nav-desktop">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="search-bar">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>

            <div className="header-actions">
              <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
                <Heart size={22} />
                {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
              </Link>
              <Link to={isAuthenticated ? '/account' : '/login'} className="icon-btn" aria-label="Account">
                <User size={22} />
              </Link>
              <Link to={isAuthenticated ? '/account' : '/login'} className="header-account-link hide-mobile">
                {isAuthenticated ? 'My account' : 'Sign in'}
              </Link>
              <Link to="/cart" className="icon-btn" aria-label="Cart">
                <ShoppingBag size={22} />
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </Link>
              <button
                className="icon-btn menu-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          <nav className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
            <div className="mobile-search search-bar">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}

export function HeroBadges() {
  return (
    <div className="hero-badges">
      <div className="hero-badge">
        <Truck size={20} />
        FREE SHIPPING
      </div>
      <div className="hero-badge">
        <Shield size={20} />
        COD AT DELIVERY
      </div>
      <div className="hero-badge">
        <Sparkles size={20} />
        DELIVERED FRESH
      </div>
    </div>
  );
}

export function HeroFeatures() {
  const features = [
    { icon: Leaf, label: '100% Natural' },
    { icon: Sparkles, label: 'Rich in Nutrition' },
    { icon: Shield, label: 'Hygienically Packed' },
    { icon: Truck, label: 'Premium Quality' },
  ];

  return (
    <div className="hero-features">
      {features.map(({ icon: Icon, label }) => (
        <div key={label} className="hero-feature">
          <Icon size={18} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
