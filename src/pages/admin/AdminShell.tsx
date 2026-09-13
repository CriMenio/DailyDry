import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Store,
  LogOut,
  ExternalLink,
  Sheet,
  Truck,
  Menu,
  X,
} from 'lucide-react';
import { ADMIN_SCREENS, type AdminScreen } from './adminScreens';
import Logo from '../../components/Logo';

const ICONS: Record<AdminScreen, typeof LayoutDashboard> = {
  overview: LayoutDashboard,
  stock: Package,
  onlineOrders: Truck,
  retail: Store,
  customer: ClipboardList,
};

interface AdminShellProps {
  screen: AdminScreen;
  onScreenChange: (screen: AdminScreen) => void;
  onSignOut: () => void;
  children: ReactNode;
}

export default function AdminShell({ screen, onScreenChange, onSignOut, children }: AdminShellProps) {
  const [navOpen, setNavOpen] = useState(false);
  const activeLabel = ADMIN_SCREENS.find((s) => s.id === screen)?.label ?? 'Admin';

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [navOpen]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)');
    const closeIfDesktop = () => {
      if (mq.matches) setNavOpen(false);
    };
    mq.addEventListener('change', closeIfDesktop);
    return () => mq.removeEventListener('change', closeIfDesktop);
  }, []);

  const selectScreen = (next: AdminScreen) => {
    onScreenChange(next);
    setNavOpen(false);
  };

  return (
    <div className={`admin-app${navOpen ? ' admin-nav-open' : ''}`}>
      <button
        type="button"
        className="admin-sidebar-backdrop"
        aria-label="Close menu"
        onClick={() => setNavOpen(false)}
      />

      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-sidebar-head">
          <div className="admin-sidebar-brand">
            <Logo variant="footer" linkClassName="admin-sidebar-logo" />
            <span className="admin-sidebar-tag">Operations</span>
          </div>
          <button
            type="button"
            className="admin-sidebar-close"
            onClick={() => setNavOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav id="admin-sidebar-nav" className="admin-sidebar-nav" aria-label="Admin sections">
          {ADMIN_SCREENS.map((item) => {
            const Icon = ICONS[item.id];
            return (
              <button
                key={item.id}
                type="button"
                className={`admin-sidebar-link ${screen === item.id ? 'active' : ''}`}
                onClick={() => selectScreen(item.id)}
              >
                <Icon size={20} strokeWidth={2} />
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-foot">
          <p className="admin-sidebar-sync">
            <Sheet size={16} />
            Synced with Google Sheets
          </p>
          <Link to="/" className="admin-sidebar-action" onClick={() => setNavOpen(false)}>
            <ExternalLink size={16} />
            View storefront
          </Link>
          <button type="button" className="admin-sidebar-action" onClick={onSignOut}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-mobile-bar">
          <button
            type="button"
            className="admin-menu-toggle"
            onClick={() => setNavOpen(true)}
            aria-expanded={navOpen}
            aria-controls="admin-sidebar-nav"
          >
            <Menu size={22} strokeWidth={2} />
            <span>Menu</span>
          </button>
          <span className="admin-mobile-title">{activeLabel}</span>
        </div>
        <div className="admin-main-inner">{children}</div>
      </main>
    </div>
  );
}
